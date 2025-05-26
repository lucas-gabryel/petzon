"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import MultiActionAreaCard from "../../components/multiActionAreaCard/MultiActionAreaCard"; //
import {
  useGetCatListQuery,
  useGetDogListQuery,
} from "@/app/store/api/petsApi";

type PetType = "cats" | "dogs";

const mockCatNames = [
  "Frajola",
  "Mia",
  "Bolinha",
  "Simba",
  "Luna",
  "Oliver",
  "Nina",
  "Tom",
  "Garfield",
  "Salem",
  "Cleo",
  "Felix",
];
const mockDogNames = [
  "Rex",
  "Buddy",
  "Max",
  "Bella",
  "Charlie",
  "Lucy",
  "Cooper",
  "Daisy",
  "Milo",
  "Sadie",
  "Rocky",
  "Lola",
];

export default function Gallery() {
  const t = useTranslations("gallery");
  const navT = useTranslations("nav");
  const [selectedPetType, setSelectedPetType] = useState<PetType>("cats");

  const {
    data: catData,
    error: catError,
    isLoading: catIsLoading,
  } = useGetCatListQuery(12, { skip: selectedPetType !== "cats" });

  const {
    data: dogData,
    error: dogError,
    isLoading: dogIsLoading,
  } = useGetDogListQuery(12, { skip: selectedPetType !== "dogs" });

  const isLoading = selectedPetType === "cats" ? catIsLoading : dogIsLoading;
  const error = selectedPetType === "cats" ? catError : dogError;
  const pets = selectedPetType === "cats" ? catData : dogData;

  const renderPetCards = () => {
    if (!pets || pets.length === 0) {
      return (
        <div className="w-full flex justify-center mt-4">
          <div
            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative w-full sm:w-auto text-center"
            role="alert"
          >
            Nenhum {selectedPetType === "cats" ? "gatinho" : "cachorrinho"}{" "}
            encontrado no momento.
          </div>
        </div>
      );
    }
    const descriptionText =
      selectedPetType === "cats" ? t("catDescription") : t("dogDescription");

    return pets.map((pet, index) => {
      const breedInfo =
        pet.breeds && pet.breeds.length > 0 ? pet.breeds[0] : null;

      const titleText =
        breedInfo?.name ||
        (selectedPetType === "cats"
          ? mockCatNames[index % mockCatNames.length]
          : mockDogNames[index % mockDogNames.length]);
      const altText = titleText;

      const detailLink = `/gallery/${
        selectedPetType === "cats" ? "cat" : "dog"
      }/${pet.id}`;

      return (
        <div key={pet.id} className="flex justify-center">
          <MultiActionAreaCard
            id={pet.id}
            image={pet.url}
            alt={altText}
            title={titleText}
            description={breedInfo?.temperament || descriptionText}
            detailLink={detailLink}
          />
        </div>
      );
    });
  };

  const baseButtonClass =
    "px-4 py-2 rounded-md font-semibold transition-colors duration-150 ease-in-out text-sm sm:text-base shadow-sm";
  const activeButtonClass = "bg-purple-700 text-white hover:bg-purple-800";
  const inactiveButtonClass =
    "bg-white text-purple-700 border border-purple-700 hover:bg-purple-100";

  return (
    <main className="flex-1 bg-purple-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800 text-center sm:text-left mb-4 sm:mb-0">
            {t("previewTitle")}
          </h1>
          <div className="flex flex-col sm:flex-row sm:gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
            <button
              onClick={() => setSelectedPetType("cats")}
              className={`${baseButtonClass} ${
                selectedPetType === "cats"
                  ? activeButtonClass
                  : inactiveButtonClass
              } w-full sm:w-auto mb-2 sm:mb-0`}
            >
              {navT("cats")}
            </button>
            <button
              onClick={() => setSelectedPetType("dogs")}
              className={`${baseButtonClass} ${
                selectedPetType === "dogs"
                  ? activeButtonClass
                  : inactiveButtonClass
              } w-full sm:w-auto`}
            >
              {navT("dogs")}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-700"></div>
          </div>
        )}
        {error && (
          <div className="w-full flex justify-center">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full sm:w-auto text-center"
              role="alert"
            >
              Falha ao buscar os pets. Tente novamente mais tarde.
            </div>
          </div>
        )}
        {!isLoading && !error && (
          <div className="flex flex-col items-center sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:items-stretch gap-6">
            {renderPetCards()}
          </div>
        )}
      </div>
    </main>
  );
}
