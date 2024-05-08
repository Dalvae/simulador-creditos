<template>
  <div class="font-optinaval">
    <Form @update-data="handleUpdateData" @submit="handleSubmit" :uf-value="ufValue" />
    <Transition name="fade">
      <Result v-if="monthlyDividend && requiredSalary" :monthlyDividend="monthlyDividend" :requiredSalary="requiredSalary" />
    </Transition>

    <TransitionGroup name="card-transition" tag="div" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <template v-if="loading">
        <Skeleton v-for="index in 10" :key="'skeleton-' + index" />
      </template>
      <template v-else>
        <Card v-for="(bankCredits, bankName) in credits" :key="bankName" :credit="getLowestCostCredit(bankCredits)" />
      </template>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useHead } from '@vueuse/head';
const API = useRuntimeConfig().public.API;

const monthlyDividend = ref(null);
const requiredSalary = ref(null);
const credits = ref(null);
const ufValue = ref(null);
const loading = ref(false);

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

//fetch UF del Dia
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
//  Fetch a la api y mostrar el squeleto 
const handleSubmit = async (formData) => {
  loading.value = true;
  credits.value = [];

  try {
    const response = await $fetch(`${API}?valorPropiedad=${formData.propertyValue}&Pie=${formData.downPayment}&Tiempo=${formData.term}&Dfl2=${formData.dfl2}`);
    credits.value = response;
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);
  } finally {
    loading.value = false;
  }
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

<style scoped>
.card-transition-enter-active,
.card-transition-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.card-transition-enter-from,
.card-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.card-transition-leave-active {
  position: absolute;
}
</style>