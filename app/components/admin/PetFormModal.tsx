"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Pet, PetCadastroDto } from "@/app/store/api/petsApi";
import {
  useAddPetMutation,
  useUpdatePetMutation,
} from "@/app/store/api/petsApi";
import { FiX } from "react-icons/fi";

// Props que o nosso modal vai receber
interface PetFormModalProps {
  pet?: Pet | null; // Pet existente para edição (opcional)
  onClose: () => void; // Função para fechar o modal
}

export default function PetFormModal({ pet, onClose }: PetFormModalProps) {
  const isEditMode = !!pet;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PetCadastroDto>();

  const [addPet, { isLoading: isAdding }] = useAddPetMutation();
  const [updatePet, { isLoading: isUpdating }] = useUpdatePetMutation();

  useEffect(() => {
    if (isEditMode) {
      reset(pet);
    }
  }, [pet, isEditMode, reset]);

  const onSubmit: SubmitHandler<PetCadastroDto> = async (data) => {
    const formData = { ...data, idade: Number(data.idade) };
    try {
      if (isEditMode && pet) {
        await updatePet({ id: pet.id, pet: formData }).unwrap();
        alert("Pet atualizado com sucesso!");
      } else {
        await addPet(formData).unwrap();
        alert("Pet cadastrado com sucesso!");
      }
      onClose();
    } catch (err) {
      console.error("Falha ao salvar o pet:", err);
      alert("Ocorreu um erro. Verifique os dados e tente novamente.");
    }
  };

  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    // Fundo semi-transparente (overlay) - A CORREÇÃO ESTÁ AQUI
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      {/* Container do Modal */}
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold text-purple-800 mb-6">
          {isEditMode ? "Editar Pet" : "Adicionar Novo Pet"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="nome">
              Nome
            </label>
            <input
              id="nome"
              {...register("nome", { required: "Nome é obrigatório" })}
              className={inputClass}
            />
            {errors.nome && <p className={errorClass}>{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="tipo">
                Tipo
              </label>
              <select
                id="tipo"
                {...register("tipo", { required: "Tipo é obrigatório" })}
                className={inputClass}
              >
                <option value="GATO">Gato</option>
                <option value="CACHORRO">Cachorro</option>
              </select>
              {errors.tipo && (
                <p className={errorClass}>{errors.tipo.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="idade">
                Idade (anos)
              </label>
              <input
                id="idade"
                type="number"
                {...register("idade", {
                  required: "Idade é obrigatória",
                  min: { value: 0, message: "Idade não pode ser negativa" },
                })}
                className={inputClass}
              />
              {errors.idade && (
                <p className={errorClass}>{errors.idade.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="temperamento">
              Temperamento
            </label>
            <input
              id="temperamento"
              {...register("temperamento", {
                required: "Temperamento é obrigatório",
              })}
              className={inputClass}
              placeholder="Ex: Calmo e dócil"
            />
            {errors.temperamento && (
              <p className={errorClass}>{errors.temperamento.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="descricao">
              Descrição
            </label>
            <textarea
              id="descricao"
              {...register("descricao")}
              className={inputClass}
              rows={3}
            ></textarea>
          </div>

          <div>
            <label className={labelClass} htmlFor="urlFoto">
              URL da Foto
            </label>
            <input
              id="urlFoto"
              {...register("urlFoto", {
                required: "URL da foto é obrigatória",
              })}
              className={inputClass}
              placeholder="Ex: /images/pets/nome-do-pet.jpg"
            />
            {errors.urlFoto && (
              <p className={errorClass}>{errors.urlFoto.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isAdding || isUpdating}
              className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 disabled:bg-purple-400"
            >
              {isAdding || isUpdating ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
