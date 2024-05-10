<template>
  <Transition name="card-transition">
    <div
      class="rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm"
    >
      <div class="flex justify-around items-center p-6">
        <div class="flex items-center">
          <img :src="banco.imagen" class="w-10 rounded-full h-auto mr-4" />
          <h3 class="text font-semibold tracking-tight">{{ banco.nombre }}</h3>
        </div>
      </div>
      <table class="w-full text-left">
        <tbody class="bg-white">
          <tr class="bg-emerald-50 h-12">
            <th class="p-4 font-semibold">Costo total:</th>
            <td class="p-4 text-emerald-500 font-medium">
              <span v-if="!loading && credit">{{ formattedCostoTotal }} UF</span>
              <div v-else class="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
          </tr>
          <tr class="h-12">
            <th class="p-4">Gastos operacionales:</th>
            <td class="p-4">
              <span v-if="!loading && credit">{{ formattedGastosOperacionales }}</span>
              <div v-else class="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
          </tr>
          <tr class="h-12">
            <th class="p-4">Máximo plazo:</th>
            <td class="p-4">
              <span v-if="!loading && credit">{{ credit.maximoPlazo }} años</span>
              <div v-else class="h-4 text-start bg-gray-200 rounded animate-pulse"></div>
            </td>
          </tr>
          <tr class="h-12">
            <th class="p-4">Financiamiento hasta:</th>
            <td class="p-4 ">
              <span v-if="!loading && credit">
                <span v-if="credit.financiamientoHasta?.valor.length > 30">
                  {{ credit.financiamientoHasta?.valor.slice(0, 50) }}...
                </span>
                <span v-else>{{ credit.financiamientoHasta?.valor }}</span>
              </span>
              <div v-else class="h-4 bg-gray-200 rounded animate-pulse w-5"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Transition>
</template>
<script setup>
import { computed } from "vue";

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
    return "";
  }

  const costoTotal = Math.round(props.credit.formattedCostoTotal);
  return costoTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

const formattedGastosOperacionales = computed(() => {
  if (!props.credit || !props.credit.gastosOperacionales) {
    return "";
  }

  return props.credit.gastosOperacionales.replace("-", "");
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
