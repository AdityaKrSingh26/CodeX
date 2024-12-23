import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';

function LoginPage() {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');


    const createNewRoom = (e: any) => {
        e.preventDefault();
        const newRoomId = uuid();
        setRoomId(newRoomId)
        toast.success('Created a new room')
    };

    const joinRoom = (e: any) => {
        e?.preventDefault();
        if (roomId === '' || username === '' || roomId === undefined || username === undefined) {
            toast.error('Please fill all the fields')
            return
        }

        navigate(`/editor/${roomId}`, {
            state: { username }
        });
    };


    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            joinRoom(e);
        }
    };

    return (
        <div className="min-h-screen bg-slate-800 flex items-center justify-center">
            <div className="max-w-screen-xl m-4 sm:m-10 bg-white shadow sm:rounded-lg flex flex-1 overflow-hidden">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className="mt-12 flex flex-col items-center">
                        <h1 className="text-2xl xl:text-3xl font-extrabold text-gray-900">
                            Welcome to CodeX
                        </h1>

                        <form onSubmit={joinRoom} className="w-full flex-1 mt-8">
                            <div className="mx-auto max-w-xs">

                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="text"
                                    name="roomId"
                                    placeholder="Enter Room ID"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    onKeyUp={handleKeyPress}
                                />

                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type="text"
                                    name="username"
                                    placeholder="Enter Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyUp={handleKeyPress}
                                />

                                <button
                                    type="button"
                                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                    onClick={createNewRoom}
                                >
                                    <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg>
                                    <span className="ml-3">Create new room</span>
                                </button>

                                <button
                                    type="submit"
                                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                >
                                    <span className="ml-3">Join Room</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div
                        className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}
                    />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;