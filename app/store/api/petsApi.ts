import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Breed {
  id: string;
  name: string;
  description?: string; // Tornar opcional se não sempre presente
  temperament?: string; // Tornar opcional
  life_span?: string;
  origin?: string;
}

interface PetImage {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds: Breed[];
}

export const petsApi = createApi({
  reducerPath: "petsApi",

  baseQuery: fetchBaseQuery(), // Removendo baseUrl daqui para especificar por endpoint
  tagTypes: ["Cat", "Dog", "PetDetail"], // Adicionando mais tipos de tags
  endpoints: (builder) => ({
    getCatList: builder.query<PetImage[], number>({
      query: (limit = 10) => ({
        url: `https://api.thecatapi.com/v1/images/search?limit=${limit}&has_breeds=1&api_key=YOUR_CAT_API_KEY`, // Adicione sua chave se tiver uma
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Cat" as const, id })),
              { type: "Cat", id: "LIST" },
            ]
          : [{ type: "Cat", id: "LIST" }],
    }),

    getDogList: builder.query<PetImage[], number>({
      query: (limit = 10) => ({
        url: `https://api.thedogapi.com/v1/images/search?limit=${limit}&has_breeds=1&api_key=YOUR_DOG_API_KEY`, // Adicione sua chave se tiver uma
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Dog" as const, id })),
              { type: "Dog", id: "LIST" },
            ]
          : [{ type: "Dog", id: "LIST" }],
    }),

    getCatById: builder.query<PetImage, string>({
      query: (id) => ({
        url: `https://api.thecatapi.com/v1/images/${id}?api_key=YOUR_CAT_API_KEY`,
      }),
      providesTags: (_result, _error, id) => [{ type: "PetDetail", id }],
    }),

    getDogById: builder.query<PetImage, string>({
      query: (id) => ({
        url: `https://api.thedogapi.com/v1/images/${id}?api_key=YOUR_DOG_API_KEY`,
      }),
      providesTags: (_result, _error, id) => [{ type: "PetDetail", id }],
    }),
  }),
});

export const {
  useGetCatListQuery,
  useGetDogListQuery,
  useGetCatByIdQuery,
  useGetDogByIdQuery,
} = petsApi;
