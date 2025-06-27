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
  petId: string;
  conversationId: string; // Nova prop
  onClose: () => void;
}

export default function PrivateChatWindow({
  petId,
  onClose,
}: PrivateChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  // Estado para saber com quem estamos falando (o outro usuário na conversa)
  const [chatPartnerId, setChatPartnerId] = useState<number | null>(null);
  const stompClient = useRef<Client | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const token = useAppSelector((state) => state.auth.token);
  const { data: currentUser } = useGetUsuarioLogadoQuery();
  const { data: history = [] } = useGetChatHistoryQuery(petId);

  // Popula o chat com o histórico e define o parceiro de chat
  useEffect(() => {
    setMessages(history);
    if (history.length > 0 && currentUser) {
      // Encontra a primeira mensagem que não foi enviada pelo usuário atual
      const otherUserMessage = history.find(
        (msg) => msg.sender.idUsuario !== currentUser.idUsuario
      );
      if (otherUserMessage) {
        setChatPartnerId(otherUserMessage.sender.idUsuario);
      }
    }
  }, [history, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          if (receivedMessage.conversationId === petId) {
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
  }, [token, currentUser, petId]);

  const sendMessage = () => {
    if (input.trim() && stompClient.current?.active && currentUser) {
      // *** LÓGICA DO DESTINATÁRIO CORRIGIDA AQUI ***
      let recipientId;
      const isAdmin = currentUser.cargos.includes("ROLE_ADMIN");

      if (isAdmin) {
        // Se eu sou admin, envio para o parceiro de chat. Se não houver, envio para o criador do chat (fallback).
        recipientId =
          chatPartnerId ||
          (history.length > 0 ? history[0].sender.idUsuario : null);
      } else {
        // Se eu sou um usuário normal, envio sempre para o admin (ID 1).
        recipientId = 1;
      }

      if (!recipientId) {
        alert("Não foi possível determinar o destinatário.");
        return;
      }

      const chatMessage = {
        recipientId: recipientId,
        content: input,
      };

      stompClient.current.publish({
        destination: `/app/chat/${petId}/sendMessage`,
        body: JSON.stringify(chatMessage),
      });
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 z-50">
      <div className="bg-purple-700 text-white p-3 flex justify-between items-center rounded-t-lg">
        <h3 className="font-bold">Chat de Adoção</h3>
        <button onClick={onClose} className="hover:text-yellow-300">
          <FiX size={20} />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-3 ${
              msg.sender.idUsuario === currentUser?.idUsuario
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender.idUsuario === currentUser?.idUsuario
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Digite sua mensagem..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-700 text-white px-4 py-2 rounded-r-md hover:bg-purple-800"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
