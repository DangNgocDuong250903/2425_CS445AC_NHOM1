package com.LinkVerse.MessageRealtime.websocket;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocket endpoint for real-time chat.
 */
@ServerEndpoint("/ws/chat")
public class WebSocketChatEndpoint {

    // Quản lý các phiên WebSocket dựa trên userId
    private static final ConcurrentHashMap<String, Session> sessions = new ConcurrentHashMap<>();

    /**
     * Thêm session mới khi user kết nối tới WebSocket.
     */
    @OnOpen
    public void onOpen(Session session) {
        System.out.println("New session opened: " + session.getId());
        // Giả sử mỗi client gửi userId qua query param khi kết nối
        String userId = session.getQueryString(); // e.g. "/ws/chat?userId=123"
        if (userId != null) {
            sessions.put(userId, session);
            System.out.println("User " + userId + " connected with session: " + session.getId());
        }
    }

    /**
     * Nhận tin nhắn từ client và xử lý.
     */
    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        System.out.println("Message received: " + message);

        // Logic: Phát tin nhắn tới tất cả User đang kết nối
        for (Session s : sessions.values()) {
            if (s.isOpen()) {
                s.getBasicRemote().sendText(message);
            }
        }
    }

    /**
     * Xử lý khi client đóng kết nối.
     */
    @OnClose
    public void onClose(Session session) {
        sessions.values().remove(session);
        System.out.println("Session closed: " + session.getId());
    }

    /**
     * Tìm session theo userId.
     */
    public static Session getSessionByUserId(String userId) {
        return sessions.get(userId);
    }
}