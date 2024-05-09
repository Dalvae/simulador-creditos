import axios from "axios";

let cachedUfValue: number | null = null;
let cachedUpdatedAt: string | null = null;

const getUfValue = async () => {
  try {
    const response = await axios.get("https://mindicador.cl/api");
    const ufValue = response.data.uf.valor;

    if (!ufValue) {
      throw new Error("no se pudo obtener el valor de la UF");
    }

    cachedUfValue = ufValue;
    cachedUpdatedAt = new Date().toISOString();

    console.log("UF del dia", ufValue);
  } catch (error: unknown) {
    console.error("Error:", error);
  }
};

getUfValue();

// cada 24 horas
setInterval(() => {
  getUfValue();
}, 24 * 60 * 60 * 1000);

export default defineEventHandler((event) => {
  if (!cachedUfValue || !cachedUpdatedAt) {
    throw createError({
      statusCode: 500,
    });
  }

  return {
    ufValue: cachedUfValue,
    updatedAt: cachedUpdatedAt,
  };
});
