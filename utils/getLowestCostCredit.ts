interface Credit {
  costoTotal: string;
  [key: string]: any;
}

// Esta función selecciona los créditos con menor costo total de cada banco
export const getLowestCostCredit = (
  bankCredits: Credit[] | Credit
): Credit | null => {
  // Formatear el costo total
  const formatCost = (costString: string) => {
    return parseFloat(
      costString
        .replace(/[-\s]|UF/g, "")
        .replace(/\./g, "")
        .replace(",", ".")
    );
  };

  // Si hay más créditos por banco, es un array, buscar el crédito con el menor costo total
  if (Array.isArray(bankCredits)) {
    return bankCredits.reduce(
      (lowestCostCredit: Credit | null, credit: Credit) => {
        const creditCost = formatCost(credit.costoTotal);
        const lowestCost = lowestCostCredit
          ? formatCost(lowestCostCredit.costoTotal)
          : Number.MAX_SAFE_INTEGER;

        return creditCost < lowestCost
          ? { ...credit, formattedCostoTotal: creditCost }
          : lowestCostCredit;
      },
      null as Credit | null
    );
  }

  // Si bankCredits es un objeto individual y tiene la propiedad costoTotal, formatear su costo total
  if (
    typeof bankCredits === "object" &&
    bankCredits !== null &&
    "costoTotal" in bankCredits
  ) {
    return {
      ...bankCredits,
      formattedCostoTotal: formatCost(bankCredits.costoTotal),
    };
  }

  return null;
};
