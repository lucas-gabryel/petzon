"use client";

import React, { useEffect, useState } from "react"; // Adicionado useState
import { useRouter } from "@/i18n/navigation";
import {
  useGetUsuarioLogadoQuery,
  useGetAdminConversationsQuery,
} from "@/app/store/api/petsApi"; // Importar o novo hook
import { useAppSelector } from "@/app/hooks/hooks";
import type { ConversationSummary } from "@/app/store/api/petsApi"; // Importar a nova interface

export default function AdminChatDashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: usuarioLogado, isLoading: isLoadingUser } =
    useGetUsuarioLogadoQuery(undefined, {
      skip: !isAuthenticated,
    });

  // *** INÍCIO DAS NOVAS ALTERAÇÕES ***

  // 1. Hook para buscar as conversas
  const { data: conversations, isLoading: isLoadingConversations } =
    useGetAdminConversationsQuery();

  // 2. Estado para guardar qual conversa está selecionada
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationSummary | null>(null);

  // *** FIM DAS NOVAS ALTERAÇÕES ***

  useEffect(() => {
    if (
      !isLoadingUser &&
      (!isAuthenticated || !usuarioLogado?.cargos.includes("ROLE_ADMIN"))
    ) {
      router.replace("/");
    }
  }, [isAuthenticated, usuarioLogado, isLoadingUser, router]);

  // Agora o loading depende de ambos os hooks
  if (isLoadingUser || isLoadingConversations) {
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
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 font-bold text-lg border-b bg-gray-50 sticky top-0">
            Conversas Ativas
          </div>

          {/* 3. Mapeando e renderizando a lista de conversas */}
          {conversations?.map((convo) => (
            <div
              key={convo.conversationId}
              onClick={() => setSelectedConversation(convo)}
              className={`p-4 border-b cursor-pointer hover:bg-purple-50 ${
                selectedConversation?.conversationId === convo.conversationId
                  ? "bg-purple-100"
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
        <div className="w-2/3 flex items-center justify-center bg-gray-100 p-4">
          {/* 4. Mostra os detalhes da conversa selecionada (temporário) */}
          {selectedConversation ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold">Conversa Selecionada</h2>
              <p>
                <strong>Com:</strong> {selectedConversation.usuarioNome}
              </p>
              <p>
                <strong>Sobre:</strong> {selectedConversation.petNome}
              </p>
              <p>
                <strong>ID da Conversa:</strong>{" "}
                {selectedConversation.conversationId}
              </p>
              <div className="mt-8 p-4 bg-white rounded-lg">
                A janela de chat aparecerá aqui no próximo passo.
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              Selecione uma conversa para começar.
            </div>
          )}
        </div>
      </main>
    );
  }

  return null;
}
