"use client";

import React, { useState, useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAppSelector } from "@/app/hooks/hooks"; // Importe o hook para acessar o estado do Redux

export default function ChatTestPage() {
  const [sentMessage, setSentMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  const clientRef = useRef<Client | null>(null);

  // Pega o token do estado de autenticação do Redux
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Só tenta conectar se o usuário estiver autenticado (tiver um token)
    if (!isAuthenticated) {
      console.log("Usuário não autenticado, não conectando ao WebSocket.");
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),

      // *** MUDANÇA PRINCIPAL AQUI ***
      // Adicionamos os headers de conexão para enviar o token
      connectHeaders: {
        Authorization: `${token}`, // Envia o token JWT
      },

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log("Conectado ao WebSocket de forma SEGURA!");
        setIsConnected(true);

        client.subscribe("/topic/pong", (message: IMessage) => {
          const pongMessage = JSON.parse(message.body);
          setReceivedMessage(pongMessage.content);
        });
      },
      onStompError: (frame) => {
        console.error("Erro no STOMP: " + frame.headers["message"]);
        console.error("Detalhes adicionais: " + frame.body);
        setIsConnected(false);
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [isAuthenticated, token]); // O efeito agora depende do estado de autenticação

  const handleSendMessage = () => {
    if (inputMessage && clientRef.current && clientRef.current.active) {
      clientRef.current.publish({
        destination: "/app/ping",
        body: JSON.stringify({ content: inputMessage }),
      });
      setSentMessage(inputMessage);
      setInputMessage("");
    }
  };

  // O JSX da página pode ser melhorado para mostrar o estado de autenticação
  return (
    <main className="flex-1 bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-purple-800 mb-4">
          Teste de WebSocket Seguro
        </h1>

        {!isAuthenticated && (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
            Você precisa estar logado para usar o chat.
          </div>
        )}

        {isAuthenticated && (
          <>
            <div className="mb-4">
              <strong>Status da Conexão:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold text-white ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {isConnected ? "Conectado" : "Desconectado"}
              </span>
            </div>

            <div className="space-y-4">
              {/* ... (resto do JSX do formulário, sem alterações) ... */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mensagem para enviar (Ping):
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    id="message"
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Digite algo..."
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!isConnected}
                    className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 disabled:bg-gray-400"
                  >
                    Enviar Ping
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <p>
                  <strong>Última mensagem enviada:</strong>{" "}
                  {sentMessage || "Nenhuma"}
                </p>
                <p>
                  <strong>Última mensagem recebida (Pong):</strong>{" "}
                  <span className="font-bold text-purple-600">
                    {receivedMessage || "Aguardando..."}
                  </span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
