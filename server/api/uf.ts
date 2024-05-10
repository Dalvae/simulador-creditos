import { defineEventHandler } from "h3";
import { cache } from "../cache";
import axios from "axios";

const getUfValue = async () => {
  if (cache.ufCache) {
    return cache.ufCache;
  }

  try {
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL || "http://localhost:3000";
    const response = await axios.get(`${baseURL}/proxy/uf`);
    const ufValue = response.data.uf.valor;

    if (!ufValue) {
      throw new Error("No se pudo obtener el valor de la UF");
    }

    cache.ufCache = {
      ufValue: ufValue,
      updatedAt: new Date().toISOString(),
    };

    console.log("UF del día", ufValue);
    return cache.ufCache;
  } catch (error) {
    console.error("Error al obtener el valor de la UF:", error);
    cache.ufCache = null;
    throw error;
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
  try {
    const ufData = await getUfValue();
    return ufData;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "No se pudo obtener el valor de la UF",
    });
  }
});
