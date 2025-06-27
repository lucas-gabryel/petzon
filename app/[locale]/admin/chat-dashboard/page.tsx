"use client";

import React, { useState } from "react";
import { useGetAdminConversationsQuery } from "@/app/store/api/petsApi";
import PrivateChatWindow from "@/app/components/chat/PrivateChatWindow";
import { ConversationSummary } from "@/app/store/api/petsApi";

export default function AdminChatDashboard() {
  const { data: conversations, isLoading } = useGetAdminConversationsQuery();
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationSummary | null>(null);

  if (isLoading) return <div>Carregando conversas...</div>;

  return (
    <div className="flex h-[calc(100vh-68px)]">
      {/* Lista de Conversas */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 font-bold text-lg border-b">Conversas Ativas</div>
        {conversations?.map((convo) => (
          <div
            key={convo.conversationId}
            onClick={() => setSelectedConversation(convo)}
            className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
              selectedConversation?.conversationId === convo.conversationId
                ? "bg-purple-100"
                : ""
            }`}
          >
            <div className="font-bold">
              {convo.usuarioNome} sobre {convo.petNome}
            </div>
            <p className="text-sm text-gray-600 truncate">
              {convo.ultimaMensagem}
            </p>
          </div>
        ))}
      </div>

      {/* Janela de Chat */}
      <div className="w-2/3 flex items-center justify-center bg-gray-100">
        {selectedConversation ? (
          // O chat agora precisa de um container, pois não é mais 'fixed'
          <div className="w-full h-full">
            <PrivateChatWindow
              petId={selectedConversation.conversationId.split("-")[1]} // Extrai o petId
              conversationId={selectedConversation.conversationId} // Passa o ID completo
              onClose={() => setSelectedConversation(null)} // Botão de fechar
            />
          </div>
        ) : (
          <div className="text-gray-500">
            Selecione uma conversa para começar.
          </div>
        )}
      </div>
    </div>
  );
}
