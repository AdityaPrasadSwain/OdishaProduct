
import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'ws://localhost:8085/ws/websocket'; // Correct raw endpoint for SockJS

export const useAgentSocket = (agentId, onOrderUpdate) => {
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);

    useEffect(() => {
        if (!agentId) return;

        const token = localStorage.getItem('token');

        clientRef.current = new Client({
            brokerURL: SOCKET_URL,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                console.log('Connected to WebSocket');
                setConnected(true);

                // Subscribe to Agent Specific Updates
                clientRef.current.subscribe(`/topic/agent/${agentId}/orders`, (message) => {
                    if (message.body) {
                        try {
                            const updatedOrder = JSON.parse(message.body);
                            onOrderUpdate(updatedOrder);
                        } catch (e) {
                            console.error("Failed to parse socket message", e);
                        }
                    }
                });
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setConnected(false);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        clientRef.current.activate();

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [agentId, onOrderUpdate]);

    return { connected };
};
