<template>
  <div class="font-optinaval">
    <Form @update-data="handleUpdateData" @fetch-data="handleFetchData" :uf-value="ufValue"/>
    <Result v-if="monthlyDividend && requiredSalary" :monthlyDividend="monthlyDividend" :requiredSalary="requiredSalary" />
    <div v-if="credits">
      <div v-for="(bankCredits, bankName) in credits" :key="bankName">
        <Card v-if="getLowestCostCredit(bankCredits)" :credit="getLowestCostCredit(bankCredits)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useHead } from '@vueuse/head';

const monthlyDividend = ref(null);
const requiredSalary = ref(null);
const credits = ref(null);
const ufValue = ref(null);

// Configurar metadatos y descripción de la página
useHead({
  title: 'Simulador de Crédito Hipotecario',
  meta: [
    {
      name: 'description',
      content: 'Calcula tu dividendo mensual y compara opciones de crédito hipotecario.',
    },
  ],
});

const { data } = await useFetch('https://mindicador.cl/api', {
  key: 'ufValue',
  server: true,
  maxAge: 60 * 60 * 24, // Cada un dia
  transform: (response) => {
    if (response && response.uf && response.uf.valor) {
      console.log("valor UF de hoy", response.uf.valor);
      return response.uf.valor;
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: 'Fallo en fecth de uf',
      });
    }
  },
});

if (data.value) {
  ufValue.value = data.value;
}
const handleUpdateData = (data) => {
  monthlyDividend.value = data.monthlyDividend;
  requiredSalary.value = data.requiredSalary;
};

const handleFetchData = (data) => {
  credits.value = data.credits;
};

//esta funcion selecciona los creditos con menor costo total de cada banco. Para ello primero tiene que dar formato numero a los respuestas de costoTotal en la api. Para hacer el regex use chatgpt. Aunque creo que es mucha overengienier -- El problema es que 
const getLowestCostCredit = (bankCredits) => {
  // formatear el costo total
  const formatCost = (costString) => {
    return parseFloat(costString.replace(/[-\s]|UF/g, '').replace(/\./g, '').replace(',', '.'));
  };

  // Si hay mas creditos por banco, es un array, buscar el credito con el menor costo total
  if (Array.isArray(bankCredits)) {
    return bankCredits.reduce((lowestCostCredit, credit) => {
      const creditCost = formatCost(credit.costoTotal);
      const lowestCost = lowestCostCredit ? formatCost(lowestCostCredit.costoTotal) : Number.MAX_SAFE_INTEGER;

      return creditCost < lowestCost ? { ...credit, formattedCostoTotal: creditCost } : lowestCostCredit;
    }, null);
  }
  
  // Si bankCredits es un objeto individual, formatear su costo total
  return { ...bankCredits, formattedCostoTotal: formatCost(bankCredits.costoTotal) };
};
</script>