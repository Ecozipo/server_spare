import { Server } from "socket.io";

const io = new Server(
    {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT"]
        }
    }
)

export default io;