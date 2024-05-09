import axios from "axios";

export default defineEventHandler(async (event) => {
  try {
    const response = await axios.get("https://mindicador.cl/api");
    const ufValue = response.data.uf.valor;

    if (!ufValue) {
      throw new Error("No se pudo obtener el valor de la UF");
    }
    return {
      ufValue,
      updatedAt: new Date().toISOString(),
    };
  } catch (error: unknown) {
    return {
      error,
    };
  }
});
