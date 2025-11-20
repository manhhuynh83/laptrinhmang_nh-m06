class RoomManager {
    constructor() {
        this.rooms = new Map();
    }

    generateRoomId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    createRoom(playerId, name) {
        const id = this.generateRoomId();

        const room = {
            id,
            players: [
                { id: playerId, name, choice: null }
            ],
            status: "waiting"
        };

        this.rooms.set(id, room);
        return room;
    }

    joinRoom(id, playerId, name) {
        const room = this.rooms.get(id);
        if (!room) return null;
        if (room.players.length >= 2) return null;

        room.players.push({ id: playerId, name, choice: null });
        room.status = room.players.length === 2 ? "playing" : "waiting";

        return room;
    }

    makeChoice(roomId, playerId, choice) {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        const player = room.players.find((p) => p.id === playerId);
        if (!player) return null;

        player.choice = choice;
        return room;
    }

    resetChoices(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        room.players.forEach((p) => (p.choice = null));
    }

    handleDisconnect(id) {
        for (const [roomId, room] of this.rooms.entries()) {
            room.players = room.players.filter((p) => p.id !== id);

            if (room.players.length === 0) this.rooms.delete(roomId);
            else room.status = "waiting";
        }
    }
}

module.exports = RoomManager;
