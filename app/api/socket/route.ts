import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/next";

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server as any, {
            cors: {
                origin:["http://localhost:3000", "https://parent-kiddygoo.vercel.app/"], 
                methods: ["GET", "POST"],
            },
        });

        res.socket.server.io = io;

        io.on("connection", (socket) => {
            console.log("a user connected", socket.id);

            socket.on("call-user", (data) => {
                io.to(data.to).emit("call-made", {
                    offer: data.offer,
                    from: socket.id,
                });
            });

            socket.on("make-answer", (data) => {
                io.to(data.to).emit("answer-made", {
                    answer: data.answer,
                });
            });

            socket.on("disconnect", () => {
                console.log("user disconnected", socket.id);
            });
        });
    }
    res.end();
}
