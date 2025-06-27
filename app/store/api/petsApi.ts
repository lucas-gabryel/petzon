import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store"; // Importar RootState

// Interface para a resposta paginada
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

// Interface do Pet (pode manter a mesma)
export interface Pet {
  id: number;
  tipo: "CACHORRO" | "GATO";
  nome: string;
  temperamento: string;
  descricao: string;
  idade: number;
  urlFoto: string;
}

export interface PetCadastroDto {
  tipo: "CACHORRO" | "GATO";
  nome: string;
  temperamento: string;
  descricao: string;
  idade: number;
  urlFoto: string;
}

export interface ChatMessage {
  id: number;
  content: string;
  sender: { idUsuario: number; nome: string };
  recipient: { idUsuario: number; nome: string };
  timestamp: string;
  conversationId: string;
}

// Interfaces para os DTOs de login e cadastro
interface LoginRequest {
  email: string;
  senha: string;
}

interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

interface TokenResponse {
  token: string;
}

export interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  cargos: string[];
}

export interface ConversationSummary {
  conversationId: string;
  petNome: string;
  usuarioNome: string;
  ultimaMensagem: string;
  timestamp: string;
}

export const petsApi = createApi({
  reducerPath: "petsApi",
  // Modifica a baseQuery para incluir o token dinamicamente
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Pet", "Chat", "ChatConversations"],
  endpoints: (builder) => ({
    // Adicionar Mutations de Autenticação
    login: builder.mutation<TokenResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: (userInfo) => ({
        url: "auth/register",
        method: "POST",
        body: userInfo,
      }),
    }),
    getUsuarioLogado: builder.query<UsuarioLogado, void>({
      query: () => "auth/usuario-logado",
    }),
    getChatHistory: builder.query<ChatMessage[], string>({
      query: (conversationId) => `chat/history/${conversationId}`,
      providesTags: ["Chat"], // Adicione uma tag para o chat
    }),
    getAdminConversations: builder.query<ConversationSummary[], void>({
      query: () => `admin/chat/conversations`,
      providesTags: ["ChatConversations"],
    }),
    // Atualizar a query de getPets para lidar com paginação
    getPets: builder.query<
      Page<Pet>,
      { tipo?: string; page: number; size: number }
    >({
      query: ({ tipo, page, size }) => {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        if (tipo) {
          params.append("tipo", tipo);
        }
        return `pets?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: "Pet" as const, id })),
              { type: "Pet", id: "LIST" },
            ]
          : [{ type: "Pet", id: "LIST" }],
    }),

    getPetById: builder.query<Pet, string>({
      query: (id) => `pets/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Pet", id }],
    }),

    addPet: builder.mutation<Pet, PetCadastroDto>({
      query: (newPet) => ({
        url: "pets",
        method: "POST",
        body: newPet,
      }),
      // Invalida a lista de pets para forçar um refetch automático
      invalidatesTags: [{ type: "Pet", id: "LIST" }],
    }),

    // NOVA MUTATION PARA ATUALIZAR PET
    updatePet: builder.mutation<Pet, { id: number; pet: PetCadastroDto }>({
      query: ({ id, pet }) => ({
        url: `pets/${id}`,
        method: "PUT",
        body: pet,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Pet", id },
        { type: "Pet", id: "LIST" },
      ],
    }),

    // NOVA MUTATION PARA DELETAR PET
    deletePet: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `pets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Pet", id: "LIST" }],
    }),
  }),
});

// Exportar os novos hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetPetsQuery,
  useGetPetByIdQuery,
  useGetUsuarioLogadoQuery,
  useGetChatHistoryQuery,
  useAddPetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
  useGetAdminConversationsQuery,
} = petsApi;
