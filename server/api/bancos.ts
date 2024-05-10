import { parsearBancos } from "../../utils/parsearBancos";
import { Banco } from "../../utils/parsearBancos";
import axios from "axios";

let cachedBancos: Banco[] | null = null;

// Función para obtener los datos de los bancos y almacenarlos en caché
const getDataBank = async () => {
  const query = {
    valorPropiedad: "4000",
    Pie: "300",
    Tiempo: "20",
    Dfl2: "true",
  };

  const queryParams = new URLSearchParams(query).toString();

  try {
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL || "http://localhost:3000";
    const response = await axios.get(`${baseURL}/proxy/bancos?${queryParams}`, {
      timeout: 5000,
    });
    const banksData = response.data;

    // Procesar los datos para obtener los nombres y las imágenes de los bancos
    cachedBancos = parsearBancos(banksData);
    console.log("Datos de los bancos almacenados en caché:", cachedBancos);
  } catch (error) {
    console.error("Error al obtener los datos de los bancos:", error);
    cachedBancos = null;
  }
};

// Obtener los datos de los bancos al iniciar la aplicación
getDataBank();

export default defineEventHandler(async (event) => {
  if (!cachedBancos) {
    throw createError({
      statusCode: 500,
      message: "Los datos de los bancos aún no se han cargado",
    });
  }

  return cachedBancos;
});
