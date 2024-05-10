<template>
  <div class="font-raleway">
    <div class="space-y-2 my-2 text-center">
      <h1 class="text-3xl font-bold">Simula tu crédito</h1>
      <p class="text-gray-500">
        Rellena el formulario y obtén los créditos más convenientes
      </p>
    </div>
    <div class="mx-auto space-y-6 flex lg:flex-row flex-col lg:space-x-8">
      <div class="mx-[10%] md:m-0 flex flex-col lg:top-4 lg:self-start md:w-2/3 lg:w-1/3 xl:w-1/4 2xl:w-1/5">
        <Form
          @update-data="handleUpdateData"
          @submit="handleSubmit"
          :uf-value="ufValue"
        />
        <Transition name="fade">
          <Result
            v-if="monthlyDividend && requiredSalary"
            :monthlyDividend="monthlyDividend"
            :requiredSalary="requiredSalary"
          />
        </Transition>
      </div>
      <TransitionGroup
      v-if="showCards"
      name="card"
      mode="out-in"
      tag="div"
      class="grid mx-[10%] md:mx-auto grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 p-4 lg:w-2/3"
      appear
    >
      <Card
        v-for="(banco, index) in displayedBancos"
        :key="banco.nombre"
        :banco="banco"
        :credit="banco.credit"
        :loading="loading"
        :style="{ transitionDelay: `${index * 100}ms` }"
      />
    </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useHead } from "@vueuse/head";
import { getLowestCostCredit } from "./utils/getLowestCostCredit";

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
  title: "Simulador de Crédito Hipotecario",
  meta: [
    {
      name: "description",
      content:
        "Calcula tu dividendo mensual y compara opciones de crédito hipotecario.",
    },
  ],
});

// Obtener el valor de la UF del día desde el servidor
const { data } = await useFetch("/api/uf/");
if (data.value && !data.value.error) {
  ufValue.value = data.value.ufValue;
}

// Llamar al caché de los bancos
const { data: bancos } = await useFetch("/api/bancos/");
cachedBancos.value = bancos.value;
console.log("cachedBancos:", cachedBancos.value);

// Función para obtener los créditos de un banco específico
const displayedBancos = computed(() => {
  if (lowestCostCredits.value) {
    return cachedBancos.value
      .map((banco) => {
        const credit = lowestCostCredits.value[banco.nombre];
        return credit ? { ...banco, credit } : null;
      })
      .filter((banco) => banco !== null);
  }
  return cachedBancos.value.map((banco) => ({ ...banco, credit: null }));
});

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
    const response = await $fetch(
      `/proxy/bancos/?valorPropiedad=${formData.propertyValue}&Pie=${formData.downPayment}&Tiempo=${formData.term}&Dfl2=${formData.dfl2}`
    );
    credits.value = response;
    console.log("Datos recibidos:", response);
    // Obtener los créditos de menor costo para cada banco
    lowestCostCredits.value = Object.values(response).reduce(
      (acc, bankCredits) => {
        const lowestCostCredit = getLowestCostCredit(bankCredits);
        if (lowestCostCredit) {
          acc[lowestCostCredit.banco.nombre] = lowestCostCredit;
        }
        return acc;
      },
      {}
    );
    console.log("lowestCostCredits:", lowestCostCredits.value);
  } catch (error) {
    console.error("Error al obtener los datos de la API:", error);
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
