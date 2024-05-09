import axios from "axios";

export default defineEventHandler(async (event) => {
  try {
    const response = await axios.get("https://mindicador.cl/api");
    const ufValue = response.data.uf.valor;

    // Verificar si el valor es válido
    if (!ufValue) {
      throw new Error("No se pudo obtener el valor de la UF");
    }

    // Puedes almacenar el valor de la UF en una base de datos o caché
    // para evitar realizar la solicitud cada vez que se acceda a esta ruta

    return {
      ufValue,
      updatedAt: new Date().toISOString(),
    };
  } catch (error: unknown) {
    // Manejar errores
    return {
      error,
    };
  }
});
