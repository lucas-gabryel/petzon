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
  petId: string;
  chatPartnerName: string;
  onClose: () => void;
}

export default function PrivateChatWindow({
  conversationId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  petId,
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
  // isFetching nos diz se a query está buscando dados no momento
  const { data: history = [], isFetching: isHistoryFetching } =
    useGetChatHistoryQuery(conversationId);

  // Efeito 1: Para carregar o histórico e definir o parceiro de chat.
  // Roda apenas quando o histórico (do cache ou da rede) muda.
  useEffect(() => {
    // Só atualiza o estado se a busca não estiver em andamento
    if (!isHistoryFetching) {
      setMessages(history);

      if (history.length > 0 && currentUser) {
        const firstMessage = history[0];
        const partner =
          firstMessage.sender.idUsuario === currentUser.idUsuario
            ? firstMessage.recipient.idUsuario
            : firstMessage.sender.idUsuario;
        setChatPartnerId(partner);
      } else if (currentUser) {
        // Fallback se não houver histórico: tenta deduzir o parceiro pelo ID da conversa
        const ids = conversationId.split("-").map(Number);
        const partner = ids.find((id) => id !== currentUser.idUsuario);
        setChatPartnerId(partner || null);
      }
    }
  }, [history, currentUser, conversationId, isHistoryFetching]);

  // Efeito 2: Para conectar ao WebSocket e escutar por novas mensagens.
  // Roda apenas quando a autenticação ou a conversa mudam.
  useEffect(() => {
    if (!token || !currentUser) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: { Authorization: `${token}` },
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      // Se inscreve na fila privada para RECEBER novas mensagens
      client.subscribe(
        `/user/${currentUser.email}/queue/messages`,
        (message: IMessage) => {
          const receivedMessage: ChatMessage = JSON.parse(message.body);
          // Adiciona a nova mensagem apenas se pertencer a esta conversa
          if (receivedMessage.conversationId === conversationId) {
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          }
        }
      );
    };

    client.activate();
    stompClient.current = client;

    // Função de limpeza para desconectar ao sair do componente
    return () => {
      client.deactivate();
    };
  }, [token, currentUser, conversationId]);

  // Efeito 3: Para rolar a tela para a última mensagem.
  // Roda sempre que a lista de mensagens é atualizada.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && stompClient.current?.active && currentUser) {
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
    <div className="w-full h-full bg-white flex flex-col shadow-lg rounded-lg">
      <div className="bg-purple-800 text-white p-4 flex justify-between items-center rounded-t-lg">
        <h3 className="font-bold text-lg">Conversa com {chatPartnerName}</h3>
        <button onClick={onClose} className="hover:text-yellow-300">
          <FiX size={24} />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
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
