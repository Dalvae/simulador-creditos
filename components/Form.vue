<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="propertyValue">Valor Propiedad (UF):</label>
        <input type="number" id="propertyValue" v-model.number="propertyValue" required>
      </div>
      <div>
        <label for="downPayment">Pie (UF):</label>
        <input type="number" id="downPayment" v-model.number="downPayment" required>
      </div>
      <div>
        <label for="interestRate">Tasa de Interés (%):</label>
        <input type="number" id="interestRate" v-model.number="interestRate" step="0.01" required>
      </div>
      <div>
        <label for="term">Plazo (años):</label>
        <input type="number" id="term" v-model.number="term" required>
      </div>
      <div>
        <label for="dfl2">DFL2:</label>
        <select id="dfl2" v-model="dfl2">
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>
      <button type="submit">Calcular</button>
    </form>
    <span>Uf de hoy {{formatCLP(ufValue)}}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFetch } from 'nuxt/app';
import { formatCLP } from '~/utils/formatCLP';
const config = useRuntimeConfig();
const API = config.public.API;

// Form input refs
const propertyValue = ref(null);
const downPayment = ref(null);
const interestRate = ref(5);
const term = ref(null);
const dfl2 = ref('true');

// Dividendo mensual y salario requerido estas tienen ref porque son reactivas
const monthlyDividend = ref(null);
const requiredSalary = ref(null);

const emit = defineEmits(['update-data', 'fetch-data']);

const props = defineProps({
  ufValue: {
    type: Number,
    default: null,
  },
});
// Handle form submission
const handleSubmit = async () => {
  // Calcular el dividendo mensual
  const dividend = calculateMonthlyDividend(propertyValue.value, downPayment.value, interestRate.value, term.value);
  monthlyDividend.value = dividend;
  requiredSalary.value = dividend * 4;

  // Emitir 'update-data' con los datos calculados
  emit('update-data', {
    monthlyDividend: monthlyDividend.value,
    requiredSalary: requiredSalary.value,
  });

  // Fetch data desde API, use env y usuaria un proxy para no exponerla, pero ya es publica de todos modos. Es un saludo a la bandera
  const { data: credits } = await useFetch(`${API}?valorPropiedad=${propertyValue.value}&Pie=${downPayment.value}&Tiempo=${term.value}&Dfl2=${dfl2.value}`, {
  server: false,
});

  // Emitir 'fetch-data' con los datos obtenidos de la API
  emit('fetch-data', {
    credits: credits.value,
  });
};

// TODO calcular valor de la uf una vez al dia server side. Sé hacerlo en next pero en nuxt ni idear

const calculateMonthlyDividend = (propertyValue, downPayment, interestRate, term) => {
  if (props.ufValue) {
  const loanAmount = (propertyValue - downPayment)* props.ufValue;;
  const numberOfMonths = term * 12; // Convertir años a meses
  const monthlyInterestRate = interestRate / 100 / 12; // Convertir interés anual a interés mensual

  const monthlyDividend = //este codigo espero que sea asi. 
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths)); 

  return monthlyDividend;
}
return null;
};
</script>