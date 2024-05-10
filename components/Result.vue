<template>
  <div
    class="rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm p-6 m-4"
  >
  <!-- <div class="grid grid-cols-2 gap-4"> -->
    <div class="flex justify-between my-2">
      <p>Dividendo mensual:</p>
      <p>{{ formatCLP(monthlyDividend) }}</p>
    </div>
    <div class="flex justify-between my-2">
      <p>Renta mínima:</p>
      <p>{{ formatCLP(requiredSalary) }}</p>
    </div>
    <span class="italic text-sm">Esta información es meramente referencial. El cálculo real siempre está
      sujeto a evaluación por las entidades financieras</span
    >
  <!-- </div> -->
  </div>
</template>

<script setup>
import { formatCLP } from "~/utils/formatCLP";
const props = defineProps({
  monthlyDividend: {
    type: Number,
    required: true,
  },
  requiredSalary: {
    type: Number,
    required: true,
  },
});
</script>
