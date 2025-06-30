"use client";

import React, { useState, useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAppSelector } from "@/app/hooks/hooks";
import {
  useGetUsuarioLogadoQuery,
  useGetChatHistoryQuery,
} from "@/app/store/api/petsApi";
import type { ChatMessage } from "@/app/store/api/petsApi";
import { FiX } from "react-icons/fi";

interface PrivateChatWindowProps {
  conversationId: string;
  petId: string; // <-- ADICIONE ESTA LINHA
  chatPartnerName: string;
  onClose: () => void;
}

export default function PrivateChatWindow({
  conversationId,
  chatPartnerName,
  onClose,
}: PrivateChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatPartnerId, setChatPartnerId] = useState<number | null>(null);

  const stompClient = useRef<Client | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const token = useAppSelector((state) => state.auth.token);
  const { data: currentUser } = useGetUsuarioLogadoQuery();
  const { data: history = [], refetch: refetchHistory } =
    useGetChatHistoryQuery(conversationId);

  // Efeito para carregar o histórico e definir o parceiro de chat
  useEffect(() => {
    // Força a busca do histórico mais recente para esta conversa
    refetchHistory();
    setMessages(history);

    if (history.length > 0 && currentUser) {
      const firstMessage = history[0];
      const partnerId =
        firstMessage.sender.idUsuario === currentUser.idUsuario
          ? firstMessage.recipient.idUsuario
          : firstMessage.sender.idUsuario;
      setChatPartnerId(partnerId);
    } else {
      // Se não tem histórico, o parceiro é o outro ID na conversationId
      const ids = conversationId.split("-").map(Number);
      const partner = ids.find((id) => id !== currentUser?.idUsuario);
      setChatPartnerId(partner || null);
    }
  }, [conversationId, history, currentUser, refetchHistory]);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Efeito de conexão WebSocket
  useEffect(() => {
    if (!token || !currentUser) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: { Authorization: `${token}` },
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(
        `/user/${currentUser.email}/queue/messages`,
        (message: IMessage) => {
          const receivedMessage: ChatMessage = JSON.parse(message.body);
          if (receivedMessage.conversationId === conversationId) {
            setMessages((prev) => [...prev, receivedMessage]);
          }
        }
      );
    };

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [token, currentUser, conversationId]);

  const sendMessage = () => {
    if (input.trim() && stompClient.current?.active && currentUser) {
      // O ID do destinatário é sempre o do parceiro de chat
      if (!chatPartnerId) {
        alert("Não foi possível identificar o destinatário da conversa.");
        return;
      }

      const chatMessagePayload = {
        recipientId: chatPartnerId,
        content: input,
      };

      stompClient.current.publish({
        destination: `/app/chat/${conversationId}/sendMessage`,
        body: JSON.stringify(chatMessagePayload),
      });
      setInput("");
    }
  };

  return (
    // O container agora é flexível para preencher o espaço que receber
    <div className="w-full h-full bg-white flex flex-col shadow-lg">
      <div className="bg-purple-800 text-white p-4 flex justify-between items-center">
        <h3 className="font-bold text-lg">Conversa com {chatPartnerName}</h3>
        <button onClick={onClose} className="hover:text-yellow-300">
          <FiX size={24} />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-3 ${
              msg.sender.idUsuario === currentUser?.idUsuario
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs shadow ${
                msg.sender.idUsuario === currentUser?.idUsuario
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t bg-white flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Digite sua mensagem..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-700 text-white px-5 py-2 rounded-r-md hover:bg-purple-800 font-semibold"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
