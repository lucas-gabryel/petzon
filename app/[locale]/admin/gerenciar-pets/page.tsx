/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useRouter } from "@/i18n/navigation";
import {
  useGetUsuarioLogadoQuery,
  useGetPetsQuery,
  useDeletePetMutation,
} from "@/app/store/api/petsApi";
import { useAppSelector } from "@/app/hooks/hooks";
import { FiEdit, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { Pet } from "@/app/store/api/petsApi";

// Componente principal da página
export default function GerenciarPetsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: usuarioLogado, isLoading: isLoadingUser } =
    useGetUsuarioLogadoQuery(undefined, { skip: !isAuthenticated });

  const {
    data: petsData,
    error: petsError,
    isLoading: isLoadingPets,
  } = useGetPetsQuery({ page: 0, size: 100 }); // Buscando todos por enquanto
  const [deletePet] = useDeletePetMutation();

  // Efeito para proteger a rota
  React.useEffect(() => {
    if (
      !isLoadingUser &&
      (!isAuthenticated || !usuarioLogado?.cargos.includes("ROLE_ADMIN"))
    ) {
      router.replace("/"); // Redireciona para a home se não for admin
    }
  }, [isAuthenticated, usuarioLogado, isLoadingUser, router]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este pet?")) {
      try {
        await deletePet(id).unwrap();
        alert("Pet excluído com sucesso!");
      } catch (err) {
        alert("Falha ao excluir o pet.");
      }
    }
  };

  if (isLoadingUser || isLoadingPets) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-700"></div>
      </div>
    );
  }

  // Renderiza a página apenas se for admin
  if (usuarioLogado?.cargos.includes("ROLE_ADMIN")) {
    return (
      <main className="flex-1 bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-800">
              Gerenciamento de Pets
            </h1>
            <button className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 flex items-center gap-2">
              <FiPlusCircle />
              Adicionar Pet
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Idade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {petsData?.content.map((pet: Pet) => (
                  <tr key={pet.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pet.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pet.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pet.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pet.idade} anos
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(pet.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    );
  }

  // Retorna nulo enquanto verifica as permissões para evitar piscar a tela
  return null;
}
