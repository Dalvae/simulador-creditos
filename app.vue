<template>
  <div class="font-optinaval">
    <Form @update-data="handleUpdateData" @submit="handleSubmit" :uf-value="ufValue" />
    <Transition name="fade">
      <Result v-if="monthlyDividend && requiredSalary" :monthlyDividend="monthlyDividend" :requiredSalary="requiredSalary" />
    </Transition>

    <TransitionGroup v-if="showCards" name="card" mode="out-in" tag="div" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" appear>
      <Card v-for="(banco, index) in cachedBancos" :key="index" :banco="banco" :credit="getCreditsForBank(banco)" :loading="loading" :style="{ transitionDelay: `${index * 100}ms` }" />
    </TransitionGroup>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useHead } from '@vueuse/head';
import { getLowestCostCredit } from './utils/getLowestCostCredit';

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
const { data } = await useFetch('/api/uf/');
if (data.value && !data.value.error) {
  ufValue.value = data.value.ufValue;
}

// Llamar al caché de los bancos
const { data: bancos } = await useFetch('/api/bancos/');
cachedBancos.value = bancos.value;
console.log('cachedBancos:', cachedBancos.value);
// Función para obtener los créditos de un banco específico
const getCreditsForBank = (banco) => {
  console.log('Banco:', banco.nombre);
  if (lowestCostCredits.value && lowestCostCredits.value[banco.nombre]) {
    console.log('Crédito encontrado:', lowestCostCredits.value[banco.nombre]);
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
    const response = await $fetch(`/proxy/bancos/?valorPropiedad=${formData.propertyValue}&Pie=${formData.downPayment}&Tiempo=${formData.term}&Dfl2=${formData.dfl2}`);
    credits.value = response;
    console.log('Datos recibidos:', response);
    // Obtener los créditos de menor costo para cada banco
    lowestCostCredits.value = Object.values(response).reduce((acc, bankCredits) => {
      const lowestCostCredit = getLowestCostCredit(bankCredits);
      if (lowestCostCredit) {
        acc[lowestCostCredit.banco.nombre] = lowestCostCredit;
      }
      return acc;
    }, {});
    console.log('lowestCostCredits:', lowestCostCredits.value);
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.card-enter-active {
  transition: all 0.5s ease;
}

.card-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.card-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>