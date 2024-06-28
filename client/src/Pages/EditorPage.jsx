import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '../Components/Editor';
import Navbar from '../Components/Navbar';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { initSocket } from '../Socket';
import ACTIONS from '../Actions';

import cpp from "../assets/c.svg";
import java from "../assets/java.svg";
import javascript from "../assets/javascript.svg";
import python from "../assets/python.svg";
import runcode from "../assets/runcode.svg";
import logout from "../assets/log-out.svg";
import copy from "../assets/copy.svg";

function EditorPage() {
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const codeRef = useRef('');
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [language, setLanguage] = useState('c++');
    const [code, setCode] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleCodeChange = useCallback((code) => {
        console.log('Code:', code);
        codeRef.current = code;
    }, []);

    const copyRoomId = async () => {
        try {
            console.log("room : ", roomId);
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    };

    const changeLanguage = useCallback((lang) => {
        setLanguage(lang);
        toast.success(`Language changed to ${lang}`);
    }, []);

    const leaveRoom = () => {
        navigate('/');
    };

    const compileCode = async () => {
        console.log('Current code:', codeRef.current);
        try {
            const response = await axios.post('http://localhost:5000/api/compile', {
                code: codeRef.current,
                language,
                input,
            });
            console.log(response)

            if (response.data.statusCode == 200) {
                setOutput(response.data.output);
            } else {
                toast.error('Compilation error');
                setOutput(response.data.error);
            }
        } catch (error) {
            toast.error('Failed to compile code');
            console.error(error);
        }
    };

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            const handleErrors = (e) => {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            };

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                    console.log(`${username} joined`);
                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId,
                });
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => prev.filter(client => client.socketId !== socketId));
            });
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, [location.state?.username, reactNavigator, roomId]);

    return (
        <div>
            {/* Navbar */}
            <div className="navbar">
                <Navbar clients={clients} />
            </div>

            <div className="h-[calc(100vh-60px)] w-full flex justify-start items-center bg-[#e3e9f0]">
                {/* language bar */}
                <div className="h-[600px] side-baar flex flex-col items-center justify-between">
                    <div className="w-[80px] bg-[#e3e9f0] flex pt-[40px] items-center flex-col gap-10">
                        <img
                            src={cpp}
                            alt="cpp"
                            className="w-[40px] h-[40px] cursor-pointer"
                            onClick={() => changeLanguage("C++")}
                        />
                        <img
                            src={java}
                            alt="java"
                            className="w-[40px] h-[40px] cursor-pointer"
                            onClick={() => changeLanguage("Java")}
                        />
                        <img
                            src={javascript}
                            alt="javascript"
                            className="w-[40px] h-[40px] cursor-pointer"
                            onClick={() => changeLanguage("Javascript")}
                        />
                        <img
                            src={python}
                            alt="python"
                            className="w-[40px] h-[40px] cursor-pointer"
                            onClick={() => changeLanguage("Python")}
                        />
                    </div>

                    <div className="options">
                        <img
                            src={runcode}
                            alt="runcode"
                            className="w-[40px] h-[40px] py-2 cursor-pointer transition-transform duration-300 hover:scale-110"
                            onClick={compileCode}
                        />
                        <img
                            src={copy}
                            alt="copy"
                            className="w-[40px] h-[40px] py-2 cursor-pointer"
                            onClick={copyRoomId}
                        />
                        <img
                            src={logout}
                            alt="logout"
                            className="w-[40px] h-[40px] py-2 cursor-pointer"
                            onClick={leaveRoom}
                        />
                    </div>
                </div>

                <div className="h-[600px] w-full flex justify-center items-center">
                    <div className="editor-container h-full w-full">
                        <Editor
                            socketRef={socketRef}
                            roomId={roomId}
                            onCodeChange={handleCodeChange}
                            language={language}
                        />
                    </div>

                    <div className="input-output-section h-[600px] w-[600px] p-2 bg-[#e3e9f0]">
                        <div className="input-section">
                            <p className="bg-white font-bold p-2">Input</p>
                            <textarea
                                className="w-full h-[250px] p-2"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="output-section bg-white">
                            <p className="bg-white font-bold p-2">Output</p>
                            <p className="w-full h-[250px] p-2">{output}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditorPage;