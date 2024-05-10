import { parsearBancos } from "../../utils/parsearBancos";
import { Banco } from "../../utils/parsearBancos";
import axios from "axios";
import { cache } from "../cache";

const getDataBank = async () => {
  if (cache.banksCache) {
    return cache.banksCache;
  }

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
    const cachedBancos = parsearBancos(banksData);
    cache.banksCache = cachedBancos;
    console.log("Datos de los bancos almacenados en caché:", cachedBancos);
    return cachedBancos;
  } catch (error) {
    console.error("Error al obtener los datos de los bancos:", error);
    cache.banksCache = null;
    throw error;
  }
};

export default defineEventHandler(async (event) => {
  try {
    const banksData = await getDataBank();
    return banksData;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "No se pudieron obtener los datos de los bancos",
    });
  }
});
