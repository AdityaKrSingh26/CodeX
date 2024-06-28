import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange, language }) => {
    const editorRef = useRef(null);
    const codemirrorInstanceRef = useRef(null);

    useEffect(() => {
        if (editorRef.current) {
            codemirrorInstanceRef.current = Codemirror.fromTextArea(editorRef.current, {
                mode: getLanguageMode(language),
                theme: 'solarized',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            });

            codemirrorInstanceRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                if (origin !== 'setValue') {
                    onCodeChange(code);
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
                }
            });

            // Set initial code for the selected language
            codemirrorInstanceRef.current.setValue(getInitialCode(language));
        }
    }, [language, roomId, onCodeChange, socketRef]);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null && codemirrorInstanceRef.current) {
                    codemirrorInstanceRef.current.setValue(code);
                }
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.CODE_CHANGE);
            }
        };
    }, [socketRef.current]);

    useEffect(() => {
        if (codemirrorInstanceRef.current) {
            codemirrorInstanceRef.current.setOption('mode', getLanguageMode(language));
            codemirrorInstanceRef.current.setValue(getInitialCode(language));
        }
    }, [language]);

    const getLanguageMode = (lang) => {
        switch (lang) {
            case 'C++':
                return 'text/x-c++src';
            case 'Java':
                return 'text/x-java';
            case 'Javascript':
                return 'javascript';
            case 'Python':
                return 'python';
            default:
                return 'text/plain';
        }
    };

    const getInitialCode = (lang) => {
        switch (lang) {
            case 'C++':
                return '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}';
            case 'Java':
                return 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}';
            case 'Javascript':
                return 'console.log("Hello, World!");';
            case 'Python':
                return 'print("Hello, World!")';
            default:
                return '';
        }
    };

    return <textarea ref={editorRef} id="realtimeEditor"></textarea>;
};

export default Editor;