import axios from "axios";
import { defineEventHandler } from "h3";
import { cache } from "../cache";

const getUfValue = async () => {
  try {
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL || "http://localhost:3000";
    const response = await axios.get(`${baseURL}/proxy/uf`);
    const ufValue = response.data.uf.valor;

    if (!ufValue) {
      throw new Error("No se pudo obtener el valor de la UF");
    }

    cache.ufCache = {
      value: ufValue,
      updatedAt: new Date().toISOString(),
    };

    console.log("UF del día", ufValue);
  } catch (error) {
    console.error("Error al obtener el valor de la UF:", error);
    cache.ufCache = null;
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
  if (cache.ufCache && cache.ufCache.updatedAt) {
    return cache.ufCache;
  }

  await getUfValue();

  if (!cache.ufCache) {
    throw createError({
      statusCode: 500,
      message: "No se pudo obtener el valor de la UF",
    });
  }

  return cache.ufCache;
});
