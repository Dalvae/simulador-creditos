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
  } catch (error: unknown) {
    console.error("Error:", error);
  }
};

// Cada 24 horas
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

  return {
    ufValue: cachedUfValue,
    updatedAt: cachedUpdatedAt,
  };
});
