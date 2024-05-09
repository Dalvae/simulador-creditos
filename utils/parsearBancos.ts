export interface Banco {
  nombre: string;
  imagen?: string;
}

interface BancoData {
  banco: {
    nombre: string;
    imagen?: string;
  };
  [key: string]: any;
}

export function parsearBancos(Bancos: {
  [key: string]: BancoData[] | BancoData;
}): Banco[] {
  const bancos: Banco[] = [];
  const imagenPlaceholder = "https://via.placeholder.com/150";

  for (const creditos in Bancos) {
    if (Array.isArray(Bancos[creditos])) {
      // Iterar sobre los elementos del arreglo de atrás hacia adelante
      for (let i = Bancos[creditos].length - 1; i >= 0; i--) {
        const elemento = Bancos[creditos][i];

        // Verificar si el elemento tiene una propiedad "banco" y "banco.nombre"
        if (elemento.banco && elemento.banco.nombre) {
          const banco: Banco = {
            nombre: elemento.banco.nombre,
            imagen: elemento.banco.imagen || imagenPlaceholder,
          };

          // Buscar si el banco ya existe en el arreglo bancos
          const bancoExistente = bancos.find((b) => b.nombre === banco.nombre);

          // Si el banco no existe, agregarlo al arreglo bancos
          if (!bancoExistente) {
            bancos.push(banco);
          }
        }
      }
    } else {
      // caso: la propiedad es un objeto (no un arreglo)
      const elemento = Bancos[creditos];

      // verificar si el elemento tiene una propiedad "banco" y "banco.nombre"
      if (elemento.banco && elemento.banco.nombre) {
        const banco: Banco = {
          nombre: elemento.banco.nombre,
          imagen: elemento.banco.imagen || imagenPlaceholder,
        };

        const bancoExistente = bancos.find((b) => b.nombre === banco.nombre);

        if (!bancoExistente) {
          bancos.push(banco);
        }
      }
    }
  }

  return bancos;
}
