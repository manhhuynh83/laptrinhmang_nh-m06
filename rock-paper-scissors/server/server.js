const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const RoomManager = require("./rooms");
const { determineWinner, getChoiceEmoji } = require("./gameLogic");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const roomManager = new RoomManager();

app.use(express.static(path.join(__dirname, "../client")));

io.on("connection", (socket) => {
    console.log("🔌 Người chơi kết nối:", socket.id);

    socket.on("createRoom", ({ name }) => {
        const room = roomManager.createRoom(socket.id, name);
        socket.join(room.id);

        socket.emit("roomCreated", room);
        console.log(`📦 ${name} tạo phòng ${room.id}`);
    });

    socket.on("joinRoom", ({ name, roomId }) => {
        const room = roomManager.joinRoom(roomId, socket.id, name);

        if (!room) {
            socket.emit("errorMessage", "❌ Không thể vào phòng (đầy hoặc sai mã)!");
            return;
        }

        socket.join(roomId);

        io.to(roomId).emit("roomUpdated", room);

        if (room.players.length === 2) {
            io.to(roomId).emit("startGame", room);
        }
    });

    socket.on("playerChoice", ({ roomId, choice }) => {
        const room = roomManager.makeChoice(roomId, socket.id, choice);

        if (!room) return;

        const players = room.players;

        if (players[0].choice && players[1].choice) {
            const result = determineWinner(players[0], players[1]);

            io.to(roomId).emit("roundResult", {
                p1: {
                    name: players[0].name,
                    choice: getChoiceEmoji(players[0].choice)
                },
                p2: {
                    name: players[1].name,
                    choice: getChoiceEmoji(players[1].choice)
                },
                message: result.message
            });

            roomManager.resetChoices(roomId);
        }
    });

    socket.on("disconnect", () => {
        console.log("❌ Người chơi rời:", socket.id);
        roomManager.handleDisconnect(socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
