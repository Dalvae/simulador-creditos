<template>
  <div>
    <p>Dividendo mensual: {{ monthlyDividend }}</p>
    <p>Renta mínima: {{ requiredSalary }}</p>
    <span>Esta información es meramente referencial el cálculo real siempre esta sujeto a evaluación por las entidades financieras. </span>
  </div>
</template>

<script setup>
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