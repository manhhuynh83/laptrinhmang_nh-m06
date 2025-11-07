package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var (
	clients   = make(map[*websocket.Conn]bool)
	clientsMu sync.Mutex
	upgrader  = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
)

type Message struct {
	Username string `json:"username"`
	Content  string `json:"content"`
	Type     string `json:"type,omitempty"`
}

func main() {
	http.HandleFunc("/", serveHome)
	http.HandleFunc("/ws", handleWebSocket)
	http.HandleFunc("/health", healthCheck)

	log.Println("🚀 Server starting on :8080")
	log.Println("📱 Open: http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func serveHome(w http.ResponseWriter, r *http.Request) {
	log.Printf("📄 Serving HTML to %s", r.RemoteAddr)
	http.ServeFile(w, r, "client.html")
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("❌ WebSocket upgrade failed: %v", err)
		return
	}
	defer conn.Close()

	registerClient(conn)
	defer unregisterClient(conn)

	// Send welcome message
	welcomeMsg := Message{
		Username: "System",
		Content:  "Welcome to chat!",
		Type:     "system",
	}
	conn.WriteJSON(welcomeMsg)

	for {
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("📤 Read error: %v", err)
			break
		}

		log.Printf("📨 Received from %s: %s", msg.Username, msg.Content)
		broadcastMessage(msg)
	}
}

func registerClient(conn *websocket.Conn) {
	clientsMu.Lock()
	clients[conn] = true
	clientCount := len(clients)
	clientsMu.Unlock()
	log.Printf("✅ New client connected. Total: %d", clientCount)
}

func unregisterClient(conn *websocket.Conn) {
	clientsMu.Lock()
	delete(clients, conn)
	clientCount := len(clients)
	clientsMu.Unlock()
	log.Printf("❌ Client disconnected. Total: %d", clientCount)
}

func broadcastMessage(msg Message) {
	clientsMu.Lock()
	defer clientsMu.Unlock()

	for client := range clients {
		err := client.WriteJSON(msg)
		if err != nil {
			log.Printf("❌ Write error: %v", err)
			client.Close()
			delete(clients, client)
		}
	}
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	clientsMu.Lock()
	count := len(clients)
	clientsMu.Unlock()

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "healthy",
		"clients": count,
	})
}