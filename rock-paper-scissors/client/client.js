const socket = io();

// DOM Elements
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const nameInput = document.getElementById("nameInput");
const roomInput = document.getElementById("roomInput");
const message = document.getElementById("message");
const roomTitle = document.getElementById("roomTitle");
const playersCount = document.getElementById("playersCount");
const joinSection = document.getElementById("joinSection");

// Player elements
const p1Name = document.getElementById("p1Name");
const p2Name = document.getElementById("p2Name");
const p1Choice = document.getElementById("p1Choice");
const p2Choice = document.getElementById("p2Choice");
const p1Status = document.getElementById("p1Status");
const p2Status = document.getElementById("p2Status");
const resultText = document.getElementById("resultText");
const choicesText = document.getElementById("choicesText");

let currentRoom = null;
let isPlayer1 = false;
let hasChosen = false;

// Event Listeners
document.getElementById("createRoomBtn").onclick = createRoom;
document.getElementById("showJoinBtn").onclick = showJoinSection;
document.getElementById("joinRoomBtn").onclick = joinRoom;
document.getElementById("backToMenu").onclick = backToMenu;

// Choice buttons
document.querySelectorAll("#choices button").forEach(btn => {
    btn.onclick = () => {
        if (hasChosen) return;
        
        const choice = btn.dataset.choice;
        makeChoice(choice);
        
        // Add animation
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 500);
    };
});

// Enter key support
nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") createRoom();
});

roomInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") joinRoom();
});

// Functions
function createRoom() {
    const name = nameInput.value.trim();
    if (!name) {
        showMessage("Vui lòng nhập tên!", "error");
        nameInput.focus();
        return;
    }

    socket.emit("createRoom", { name });
    showMessage("Đang tạo phòng...", "success");
}

function showJoinSection() {
    const name = nameInput.value.trim();
    if (!name) {
        showMessage("Vui lòng nhập tên!", "error");
        nameInput.focus();
        return;
    }

    joinSection.classList.add('active');
    roomInput.focus();
}

function joinRoom() {
    const name = nameInput.value.trim();
    const roomId = roomInput.value.trim().toUpperCase();

    if (!name) {
        showMessage("Vui lòng nhập tên!", "error");
        return;
    }

    if (!roomId) {
        showMessage("Vui lòng nhập mã phòng!", "error");
        roomInput.focus();
        return;
    }

    socket.emit("joinRoom", { name, roomId });
    showMessage("Đang tham gia phòng...", "success");
}

function makeChoice(choice) {
    if (!currentRoom) return;
    
    socket.emit("playerChoice", {
        roomId: currentRoom.id,
        choice: choice
    });
    
    hasChosen = true;
    updatePlayerStatus(true);
    disableChoiceButtons();
}

function backToMenu() {
    menuScreen.classList.add('active');
    gameScreen.classList.remove('active');
    resetGame();
    showMessage("Đã trở về menu chính", "success");
}

function updatePlayerStatus(chosen) {
    const statusElement = isPlayer1 ? p1Status : p2Status;
    const choiceElement = isPlayer1 ? p1Choice : p2Choice;
    
    if (chosen) {
        statusElement.textContent = "Đã chọn!";
        statusElement.style.color = "#4CAF50";
        statusElement.classList.add('pulse');
    } else {
        statusElement.textContent = "Đang chọn...";
        statusElement.style.color = "";
        statusElement.classList.remove('pulse');
    }
}

function disableChoiceButtons() {
    document.querySelectorAll("#choices button").forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = "0.6";
    });
}

function enableChoiceButtons() {
    document.querySelectorAll("#choices button").forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = "1";
    });
}

function resetGame() {
    hasChosen = false;
    p1Choice.textContent = "❓";
    p2Choice.textContent = "❓";
    p1Status.textContent = "Chưa chọn";
    p2Status.textContent = "Chưa chọn";
    p1Status.style.color = "";
    p2Status.style.color = "";
    enableChoiceButtons();
}

function showMessage(text, type = "success") {
    message.textContent = text;
    message.className = "message " + type;
    
    if (type === "error") {
        message.classList.add('shake');
        setTimeout(() => message.classList.remove('shake'), 500);
    }
}

// Socket Events
socket.on("roomCreated", (room) => {
    currentRoom = room;
    isPlayer1 = true;
    
    menuScreen.classList.remove("active");
    gameScreen.classList.add("active");
    
    updateRoomDisplay(room);
    showMessage("Phòng đã được tạo! Chia sẻ mã phòng cho bạn bè", "success");
});

socket.on("roomUpdated", (room) => {
    updateRoomDisplay(room);
});

socket.on("startGame", (room) => {
    currentRoom = room;
    isPlayer1 = room.players[0].id === socket.id;
    
    menuScreen.classList.remove("active");
    gameScreen.classList.add("active");
    
    updateRoomDisplay(room);
    showMessage("Trận đấu bắt đầu! Hãy chọn lựa chọn của bạn", "success");
});

socket.on("roundResult", (data) => {
    resultText.textContent = data.message;
    choicesText.textContent = `${data.p1.name} ${data.p1.choice}  vs  ${data.p2.name} ${data.p2.choice}`;
    
    // Add result animation
    resultText.classList.add('pulse');
    setTimeout(() => resultText.classList.remove('pulse'), 1000);
    
    // Reset for next round after delay
    setTimeout(() => {
        resetGame();
        showMessage("Vòng mới bắt đầu! Hãy chọn lựa chọn", "success");
    }, 3000);
});

socket.on("errorMessage", (msg) => {
    showMessage(msg, "error");
});

// Helper function
function updateRoomDisplay(room) {
    roomTitle.textContent = `Phòng: ${room.id}`;
    roomTitle.dataset.id = room.id;
    playersCount.textContent = `${room.players.length}/2`;
    
    // Update player names
    if (room.players[0]) {
        p1Name.textContent = room.players[0].name;
    }
    if (room.players[1]) {
        p2Name.textContent = room.players[1].name;
    }
    
    // Highlight current player
    document.getElementById('player1').classList.toggle('active', isPlayer1);
    document.getElementById('player2').classList.toggle('active', !isPlayer1);
}

// Initialize
window.addEventListener('load', () => {
    nameInput.focus();
    showMessage("Chào mừng đến với Kéo Búa Bao! Hãy nhập tên để bắt đầu", "success");
});