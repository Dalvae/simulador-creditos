<template>
  <div v-if="credit.banco" class="bg-gray-100 rounded-lg shadow-md p-6 max-w-sm">
    <img :src="credit.banco.imagen" :alt="credit.banco.nombre" class="w-24 h-auto mb-4" />
    <h3 class="text-lg font-semibold mb-2">{{ credit.banco.nombre }}</h3>
    <p class="mb-1">Tasa de interés: {{ credit.tasaDeInteres }}</p>
    <p class="mb-1">Costo total: {{ credit.formattedCostoTotal }} UF</p>
    <p class="mb-1">Gastos operacionales: {{ credit.gastosOperacionales }}</p>
    <p class="mb-1">Máximo plazo: {{ credit.maximoPlazo }}</p>
    <p class="mb-1">Financiamiento hasta: {{ credit.financiamientoHasta.valor }}</p>
  </div>
</template>

<script setup>
defineProps({
  credit: {
    type: Object,
    required: true,
  },
});


</script>