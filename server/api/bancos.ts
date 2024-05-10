import { parsearBancos } from "../../utils/parsearBancos";
import { Banco } from "../../utils/parsearBancos";
import axios from "axios";
import { cache } from "../cache";

let cachedBancos: Banco[] | null = null;

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
    cachedBancos = parsearBancos(banksData);
    cache.banksCache = cachedBancos;
    console.log("Datos de los bancos almacenados en caché:", cachedBancos);
  } catch (error) {
    console.error("Error al obtener los datos de los bancos:", error);
    cachedBancos = null;
  }
};

getDataBank();

export default defineEventHandler(async (event) => {
  if (cache.banksCache) {
    return cache.banksCache;
  }

  await getDataBank();

  if (!cachedBancos) {
    throw createError({
      statusCode: 500,
      message: "No se pudieron obtener los datos de los bancos",
    });
  }

  return cachedBancos;
});
