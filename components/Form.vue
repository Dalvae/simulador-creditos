<template>
  <div class="space-y-2 m-4">
    <form @submit.prevent="handleSubmit">
      <div class="space-y-2">
        <label for="propertyValue">Valor Propiedad (UF):</label>
        <input type="number" id="propertyValue" v-model.number="propertyValue" required class="input-style">
      </div>
      <div class="space-y-2">
        <label for="downPayment">Pie (UF):</label>
        <input type="number" id="downPayment" v-model.number="downPayment" required>
      </div>
      <div class="space-y-2">
        <label for="interestRate">Tasa de Interés (%):</label>
        <input type="number" id="interestRate" v-model.number="interestRate" step="0.01" required>
      </div>
      <div class="space-y-2"> 
        <label for="term">Plazo (años):</label>
        <select id="term" v-model.number="term" required>
          <option v-for="option in termOptions" :value="option" :key="option">{{ option }}</option>
        </select>
      </div>
      <div class="space-y-2">
        <label for="dfl2">DFL2:</label>
        <select id="dfl2" v-model="dfl2">
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>
      <button type="submit ">Calcular</button>
    </form>
    <span class="italic ">Uf de hoy {{formatCLP(ufValue)}}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { formatCLP } from '~/utils/formatCLP';

// Form input refs
const propertyValue = ref(null);
const downPayment = ref(null);
const interestRate = ref(5);
const term = ref(null);
const dfl2 = ref('true');

const termOptions = [5, 10, 15, 20, 25, 30];
// Dividendo mensual y salario requerido estas tienen ref porque son reactivas
const monthlyDividend = ref(null);
const requiredSalary = ref(null);
const emit = defineEmits(['update-data', 'submit']);

const props = defineProps({
  ufValue: {
    type: Number,
    default: null,
  },
});
// Handle form submission
const handleSubmit = () => {
  // Calcular el dividendo mensual
  const dividend = calculateMonthlyDividend(propertyValue.value, downPayment.value, interestRate.value, term.value);
  monthlyDividend.value = dividend;
  requiredSalary.value = dividend * 4;

  // Emitir 'update-data' con los datos calculados
  emit('update-data', {
    monthlyDividend: monthlyDividend.value,
    requiredSalary: requiredSalary.value,
  });

  // Emitir 'submit' con los datos del formulario
  emit('submit', {
    propertyValue: propertyValue.value,
    downPayment: downPayment.value,
    term: term.value,
    dfl2: dfl2.value,
  });
};

const calculateMonthlyDividend = (propertyValue, downPayment, interestRate, term) => {
  if (props.ufValue) {
  const loanAmount = (propertyValue - downPayment)* props.ufValue;;
  const numberOfMonths = term * 12; 
  const monthlyInterestRate = interestRate / 100 / 12; 

  const monthlyDividend = //este codigo espero que sea asi. 
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths)); 

  return monthlyDividend;
}
return null;
};
</script>

<style>
input[type=number] {
  -moz-appearance: textfield;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
select,
input {
  @apply flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ;
}
button {
  @apply
  inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-4 py-2 w-full mt-5;
}
</style>