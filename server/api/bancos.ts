import { parsearBancos } from "../../utils/parsearBancos";
import { Banco } from "../../utils/parsearBancos";
import axios from "axios";

let cachedBancos: Banco[] | null = null;
const API = "https://api.hipotecarios.info/creditos/";

// Función para obtener los datos de los bancos y almacenarlos en caché
const getDataBank = async () => {
  const query = {
    valorPropiedad: "4000",
    Pie: "300",
    Tiempo: "20",
    Dfl2: "true",
  };

  const queryParams = new URLSearchParams(query).toString();
  const url = `${API}?${queryParams}`;
  console.log(url);

  try {
    const response = await axios.get(url);
    const banksData = response.data;

    // Ppocesar los datos para obtener los nombres y las imágenes de los bancos
    cachedBancos = parsearBancos(banksData);
    console.log("Datos de los bancos almacenados en caché:", cachedBancos);

    // Invalidar la caché si contiene menos de 8 elementos lo dejamos asi por mientras
    // if (cachedBancos && cachedBancos.length < 8) {
    //   console.log(
    //     "Invalidando la caché debido a la cantidad insuficiente de datos."
    //   );
    //   cachedBancos = null;
    // }
  } catch (error) {
    console.error("Error al obtener los datos de los bancos:", error);
    throw createError({
      statusCode: 500,
      message: "Error al obtener los datos de los bancos",
    });
  }
};

// Función para actualizar los datos de los bancos diariamente
const actualizarDatosBancosDiariamente = async () => {
  await getDataBank();
  setInterval(async () => {
    await getDataBank();
  }, 24 * 60 * 60 * 1000);
};

// Obtener los datos de los bancos al iniciar la aplicación y luego actualizarlos diariamente
actualizarDatosBancosDiariamente();

export default defineEventHandler(async (event) => {
  if (!cachedBancos) {
    throw createError({
      statusCode: 500,
      message: "Los datos de los bancos aun no se han cargado",
    });
  }
  return cachedBancos;
});
