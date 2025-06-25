import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 1. Definir a interface que corresponde aos dados do nosso Backend Spring
export interface Pet {
  id: number;
  tipo: "CACHORRO" | "GATO";
  nome: string;
  temperamento: string;
  descricao: string;
  idade: number;
  urlFoto: string;
}

// 2. Configurar a API para usar a URL base do nosso backend
export const petsApi = createApi({
  reducerPath: "petsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/api/" }), // URL do nosso backend
  tagTypes: ["Pet"],
  endpoints: (builder) => ({
    // 3. Unificar os endpoints de lista em um só
    getPets: builder.query<Pet[], string | void>({
      query: (tipo) => (tipo ? `pets?tipo=${tipo}` : "pets"),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Pet" as const, id })),
              { type: "Pet", id: "LIST" },
            ]
          : [{ type: "Pet", id: "LIST" }],
    }),

    // 4. Unificar os endpoints de busca por ID em um só
    getPetById: builder.query<Pet, string>({
      query: (id) => `pets/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Pet", id }],
    }),
  }),
});

// 5. Exportar os novos hooks gerados
export const { useGetPetsQuery, useGetPetByIdQuery } = petsApi;
