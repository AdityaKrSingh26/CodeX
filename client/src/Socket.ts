import { io } from "socket.io-client";

export const initSocket = () => {
    try {
        const options = {
            'force-new-connection': true,
            reconnectionAttempts: Infinity,
            timeout: 10000,
            transports: ['websocket'],
        }

        // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
        // console.log(BACKEND_URL)
        // return io(BACKEND_URL, options);

        return io("http://localhost:3001", options);

    } catch (error) {
        console.log(error)
    }
}