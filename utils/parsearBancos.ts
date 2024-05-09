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
  // const imagenPlaceholder = "https://via.placeholder.com/150";

  for (const creditos in Bancos) {
    if (Array.isArray(Bancos[creditos])) {
      //itera de manera inversa en los array de bancos, casi siempre estan al reves.
      for (let i = Bancos[creditos].length - 1; i >= 0; i--) {
        const elemento = Bancos[creditos][i];
        if (elemento.banco && elemento.banco.nombre) {
          const banco: Banco = {
            nombre: elemento.banco.nombre,
            imagen: elemento.banco.imagen,
          };
          const bancoExistente = bancos.find((b) => b.nombre === banco.nombre);

          if (!bancoExistente) {
            bancos.push(banco);
          }
        }
      }
    } else {
      const elemento = Bancos[creditos];

      if (elemento.banco && elemento.banco.nombre) {
        const banco: Banco = {
          nombre: elemento.banco.nombre,
          imagen: elemento.banco.imagen,
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
