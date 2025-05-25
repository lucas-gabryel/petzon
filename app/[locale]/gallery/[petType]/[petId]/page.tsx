"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  useGetCatByIdQuery,
  useGetDogByIdQuery,
} from "@/app/store/api/petsApi";
import Image from "next/image"; // Mantido

export default function PetDetailPage() {
  const params = useParams();
  const petType = params.petType as "cat" | "dog";
  const petId = params.petId as string;

  const {
    data: catData,
    error: catError,
    isLoading: catIsLoading,
  } = useGetCatByIdQuery(petId, { skip: petType !== "cat" || !petId });

  const {
    data: dogData,
    error: dogError,
    isLoading: dogIsLoading,
  } = useGetDogByIdQuery(petId, { skip: petType !== "dog" || !petId });

  const isLoading = petType === "cat" ? catIsLoading : dogIsLoading;
  const error = petType === "cat" ? catError : dogError;
  const pet = petType === "cat" ? catData : dogData;

  if (isLoading) {
    return (
      <main className="flex-1 bg-purple-50 py-8 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-700"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 bg-purple-50 py-8 px-4 md:px-6">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto text-center"
          role="alert"
        >
          Falha ao buscar detalhes do pet. ID: {petId}
        </div>
      </main>
    );
  }

  if (!pet) {
    return (
      <main className="flex-1 bg-purple-50 py-8 px-4 md:px-6">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md mx-auto text-center"
          role="alert"
        >
          Pet não encontrado. ID: {petId}
        </div>
      </main>
    );
  }

  const breedInfo = pet.breeds && pet.breeds.length > 0 ? pet.breeds[0] : null;

  return (
    <main className="flex-1 bg-purple-50 py-8 px-4 md:px-6">
      <div className="bg-white max-w-4xl mx-auto overflow-hidden rounded-lg shadow-xl">
        <div className="relative w-full h-72 md:h-96">
          <Image
            src={pet.url}
            alt={breedInfo?.name || (petType === "cat" ? "Gato" : "Cachorro")}
            layout="fill"
            className="object-cover"
            priority
          />
        </div>
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-950 mb-4">
            {breedInfo?.name ||
              (petType === "cat" ? "Gatinho Adorável" : "Cachorrinho Adorável")}
          </h1>
          {breedInfo?.temperament && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                Temperamento:
              </h2>
              <div className="flex flex-wrap gap-2">
                {breedInfo.temperament.split(", ").map((temp) => (
                  <span
                    key={temp}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {temp}
                  </span>
                ))}
              </div>
            </div>
          )}
          {breedInfo?.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-1">
                Descrição:
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {breedInfo.description}
              </p>
            </div>
          )}
          {breedInfo?.life_span && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-1">
                Expectativa de vida:
              </h2>
              <p className="text-gray-700">{breedInfo.life_span} anos</p>
            </div>
          )}
          {breedInfo?.origin && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-purple-700 mb-1">
                Origem:
              </h2>
              <p className="text-gray-700">{breedInfo.origin}</p>
            </div>
          )}
          {!breedInfo && (
            <p className="text-gray-600 mt-6 italic">
              Informações detalhadas da raça não disponíveis para este
              amiguinho. Mas ele certamente tem muito amor para dar!
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
