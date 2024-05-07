<template>
  <div>
    <p>Dividendo mensual: {{ formatCLP(monthlyDividend) }}</p>
    <p>Renta mínima: {{ formatCLP(requiredSalary) }}</p>
    <span>Esta información es meramente referencial. El cálculo real siempre está sujeto a evaluación por las entidades financieras.</span>
  </div>
</template>

<script setup>
import { formatCLP } from '~/utils/formatCLP';
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