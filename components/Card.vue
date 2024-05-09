<template>
  <Transition name="card-transition">
    <div class="bg-gray-100 rounded-lg shadow-md p-6 max-w-sm">
      <img :src="banco.imagen" :alt="banco.nombre" class="w-24 h-auto mb-4" />
      <h3 class="text-lg font-semibold mb-2">{{ banco.nombre }}</h3>

      <div v-if="loading">
        <div class="bg-white shadow rounded-lg p-4 mb-4 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>

      <div v-else>
        <p v-if="credit" class="mb-1">Tasa de interés: {{ credit.tasaDeInteres }}</p>
        <p v-if="credit" class="mb-1">Costo total: {{ formattedCostoTotal }} UF</p>
        <p v-if="credit" class="mb-1">Gastos operacionales: {{ formattedGastosOperacionales }}</p>
        <p v-if="credit" class="mb-1">Máximo plazo: {{ credit.maximoPlazo }}</p>
        <p v-if="credit" class="mb-1">Financiamiento hasta: {{ credit.financiamientoHasta?.valor }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  credit: {
    type: Object,
    default: null, 
  },
  banco: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const formattedCostoTotal = computed(() => {
  if (!props.credit || !props.credit.formattedCostoTotal) {
    return '';
  }

  const costoTotal = Math.round(props.credit.formattedCostoTotal);
  return costoTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
});

const formattedGastosOperacionales = computed(() => {
  if (!props.credit || !props.credit.gastosOperacionales) {
    return '';
  }

  return props.credit.gastosOperacionales.replace('-', '');
});
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
</style>