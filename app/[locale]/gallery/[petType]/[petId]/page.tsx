"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetPetByIdQuery,
  useGetUsuarioLogadoQuery,
} from "@/app/store/api/petsApi";
import { useAppSelector } from "@/app/hooks/hooks";
import Image from "next/image";
import PrivateChatWindow from "@/app/components/chat/PrivateChatWindow";

export default function PetDetailPage() {
  const params = useParams();
  const petId = params.petId as string;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: currentUser } = useGetUsuarioLogadoQuery(undefined, {
    skip: !isAuthenticated,
  });

  const {
    data: pet,
    error,
    isLoading,
  } = useGetPetByIdQuery(petId, { skip: !petId });

  if (isLoading) {
    return (
      <main className="flex-1 bg-purple-50 py-8 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-700"></div>
      </main>
    );
  }

  if (error || !pet) {
    return (
      <main className="flex-1 bg-purple-50 py-8 px-4 md:px-6">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto text-center"
          role="alert"
        >
          Falha ao buscar detalhes do pet ou pet não encontrado. ID: {petId}
        </div>
      </main>
    );
  }

  const imageUrl = `http://localhost:8080${pet.urlFoto}`;

  // *** MUDANÇA PRINCIPAL AQUI ***
  // Monta o ID da conversa apenas se o usuário estiver logado
  const conversationId = currentUser
    ? `${currentUser.idUsuario}-${pet.id}`
    : "";

  return (
    <main className="flex-1 bg-purple-50 py-8 px-4 md:px-6">
      <div className="bg-white max-w-4xl mx-auto overflow-hidden rounded-lg shadow-xl">
        <div className="relative w-full h-72 md:h-96">
          <Image
            src={imageUrl}
            alt={pet.nome}
            layout="fill"
            className="object-cover"
            priority
          />
        </div>
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-950 mb-4">
            {pet.nome}
          </h1>

          {/* ... (resto dos detalhes do pet, como temperamento, descrição, etc.) ... */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-2">
              Temperamento:
            </h2>
            <div className="flex flex-wrap gap-2">
              {pet.temperamento.split(" e ").map((temp) => (
                <span
                  key={temp}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {temp}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-1">
              Descrição:
            </h2>
            <p className="text-gray-700 leading-relaxed">{pet.descricao}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-1">
              Idade:
            </h2>
            <p className="text-gray-700">{pet.idade} anos</p>
          </div>

          <button
            onClick={() => setIsChatOpen(true)}
            disabled={!isAuthenticated}
            className="w-full mt-6 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAuthenticated
              ? "Iniciar Chat com Responsável"
              : "Faça login para iniciar o chat"}
          </button>
        </div>
      </div>

      {/* Container para posicionar o chat como um modal pop-up */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <PrivateChatWindow
            conversationId={conversationId}
            petId={petId}
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      )}
    </main>
  );
}
