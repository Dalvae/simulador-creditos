import axios from "axios";
import { defineEventHandler } from "h3";

let cachedUfValue: number | null = null;
let cachedUpdatedAt: string | null = null;

const getUfValue = async () => {
  try {
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL || "http://localhost:3000";
    const response = await axios.get(`${baseURL}/proxy/uf`);

    const ufValue = response.data.uf.valor;
    if (!ufValue) {
      throw new Error("No se pudo obtener el valor de la UF");
    }

    cachedUfValue = ufValue;
    cachedUpdatedAt = new Date().toISOString();
    console.log("UF del día", ufValue);
  } catch (error) {
    console.error("Error al obtener el valor de la UF:", error);
    cachedUfValue = null;
    cachedUpdatedAt = null;
  }
};

const actualizarUfDiario = async () => {
  await getUfValue();
  setInterval(() => {
    getUfValue();
  }, 24 * 60 * 60 * 1000);
};

actualizarUfDiario();

export default defineEventHandler(async (event) => {
  if (!cachedUfValue || !cachedUpdatedAt) {
    await getUfValue();
  }

  if (!cachedUfValue || !cachedUpdatedAt) {
    throw createError({
      statusCode: 500,
      message: "No se pudo obtener el valor de la UF",
    });
  }

  return {
    ufValue: cachedUfValue,
    updatedAt: cachedUpdatedAt,
  };
});
