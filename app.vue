<template>
  <div class="font-optinaval">
    <Form @update-data="handleUpdateData" @submit="handleSubmit" :uf-value="ufValue" />
    <Transition name="fade">
      <Result v-if="monthlyDividend && requiredSalary" :monthlyDividend="monthlyDividend" :requiredSalary="requiredSalary" />
    </Transition>

    <TransitionGroup v-if="showCards" name="card-transition" mode="out-in" tag="div" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Card v-for="(banco, index) in cachedBancos" :key="index" :banco="banco" :credit="getCreditsForBank(banco)" :loading="loading" />
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
const cachedBancos = ref([]);
const lowestCostCredits = ref(null);
const showCards = ref(false);

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

// Obtener el valor de la UF del día desde el servidor
const { data } = await useFetch('/api/uf');
if (data.value && !data.value.error) {
  ufValue.value = data.value.ufValue;
}

// Llamar al caché de los bancos
const { data: bancos } = await useFetch('/api/bancos');
cachedBancos.value = bancos.value;

// Función para obtener los créditos de un banco específico
const getCreditsForBank = (banco) => {
  if (lowestCostCredits.value && lowestCostCredits.value[banco.nombre]) {
    return lowestCostCredits.value[banco.nombre];
  }
  return null;
};

const handleUpdateData = (data) => {
  monthlyDividend.value = data.monthlyDividend;
  requiredSalary.value = data.requiredSalary;
};

// Fetch a la api y mostrar el esqueleto
const handleSubmit = async (formData) => {
  loading.value = true;
  showCards.value = true;
  credits.value = [];
  lowestCostCredits.value = null;
  
  try {
    const response = await $fetch(`${API}?valorPropiedad=${formData.propertyValue}&Pie=${formData.downPayment}&Tiempo=${formData.term}&Dfl2=${formData.dfl2}`);
    credits.value = response;

    // Obtener los créditos de menor costo para cada banco
    lowestCostCredits.value = Object.values(response).reduce((acc, bankCredits) => {
      const lowestCostCredit = getLowestCostCredit(bankCredits);
      if (lowestCostCredit) {
        acc[lowestCostCredit.banco.nombre] = lowestCostCredit;
      }
      return acc;
    }, {});
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);
  } finally {
    loading.value = false;
  }
};
// Esta función selecciona los créditos con menor costo total de cada banco
const getLowestCostCredit = (bankCredits) => {
  // Formatear el costo total
  const formatCost = (costString) => {
    return parseFloat(costString.replace(/[-\s]|UF/g, '').replace(/\./g, '').replace(',', '.'));
  };

  // Si hay más créditos por banco, es un array, buscar el crédito con el menor costo total
  if (Array.isArray(bankCredits)) {
    return bankCredits.reduce((lowestCostCredit, credit) => {
      const creditCost = formatCost(credit.costoTotal);
      const lowestCost = lowestCostCredit ? formatCost(lowestCostCredit.costoTotal) : Number.MAX_SAFE_INTEGER;
      return creditCost < lowestCost ? { ...credit, formattedCostoTotal: creditCost } : lowestCostCredit;
    }, null);
  }

  // Si bankCredits es un objeto individual y tiene la propiedad costoTotal, formatear su costo total
  if (typeof bankCredits === 'object' && bankCredits !== null && 'costoTotal' in bankCredits) {
    return { ...bankCredits, formattedCostoTotal: formatCost(bankCredits.costoTotal) };
  }
  return null;
};
</script>