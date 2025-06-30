"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  useGetUsuarioLogadoQuery,
  useGetAdminConversationsQuery,
} from "@/app/store/api/petsApi";
import { useAppSelector } from "@/app/hooks/hooks";
import type { ConversationSummary } from "@/app/store/api/petsApi";
import PrivateChatWindow from "@/app/components/chat/PrivateChatWindow"; // Importe o componente

export default function AdminChatDashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: usuarioLogado, isLoading: isLoadingUser } =
    useGetUsuarioLogadoQuery(undefined, {
      skip: !isAuthenticated,
    });

  const { data: conversations, isLoading: isLoadingConversations } =
    useGetAdminConversationsQuery(undefined, {
      // Adicionando polling para atualizar a lista de conversas a cada 30 segundos
      pollingInterval: 30000,
    });

  const [selectedConversation, setSelectedConversation] =
    useState<ConversationSummary | null>(null);

  useEffect(() => {
    if (
      !isLoadingUser &&
      (!isAuthenticated || !usuarioLogado?.cargos.includes("ROLE_ADMIN"))
    ) {
      router.replace("/");
    }
  }, [isAuthenticated, usuarioLogado, isLoadingUser, router]);

  const isLoading = isLoadingUser || isLoadingConversations;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-700"></div>
      </div>
    );
  }

  if (isAuthenticated && usuarioLogado?.cargos.includes("ROLE_ADMIN")) {
    return (
      <main className="flex h-[calc(100vh-68px)]">
        {/* Coluna da Lista de Conversas (Esquerda) */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-white">
          <div className="p-4 font-bold text-lg border-b bg-gray-50 sticky top-0">
            Conversas Ativas
          </div>

          {conversations?.map((convo) => (
            <div
              key={convo.conversationId}
              onClick={() => setSelectedConversation(convo)}
              className={`p-4 border-b cursor-pointer hover:bg-purple-50 ${
                selectedConversation?.conversationId === convo.conversationId
                  ? "bg-purple-100 border-l-4 border-l-purple-600"
                  : ""
              }`}
            >
              <div className="font-bold text-purple-800">
                {convo.usuarioNome}
              </div>
              <div className="text-sm text-gray-700">
                Sobre o pet:{" "}
                <span className="font-semibold">{convo.petNome}</span>
              </div>
              <p className="text-sm text-gray-500 truncate mt-1">
                {convo.ultimaMensagem}
              </p>
            </div>
          ))}
        </div>

        {/* Área da Janela de Chat (Direita) */}
        <div className="w-2/3 flex items-center justify-center bg-gray-100">
          {selectedConversation ? (
            // *** JANELA DE CHAT INTEGRADA AQUI ***
            <PrivateChatWindow
              conversationId={selectedConversation.conversationId}
              petId={selectedConversation.conversationId.split("-")[1]} // Extrai o petId
              chatPartnerName={selectedConversation.usuarioNome}
              onClose={() => setSelectedConversation(null)}
            />
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-lg">Bem-vindo ao seu Dashboard de Chat.</p>
              <p>Selecione uma conversa na lista à esquerda para começar.</p>
            </div>
          )}
        </div>
      </main>
    );
  }

  return null;
}
