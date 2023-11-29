<script setup lang="ts">
import { useRouter } from "vue-router";
import UiButton from "@/components/Ui-Button.vue";
import useStore from "@/stores/store";

const router = useRouter();
const { counter, setCounter } = useStore();

function handleNewGame() {
  setCounter(0);
  router.push({ name: "game" });
}
</script>

<template>
  <div class="app-screen finish-screen">
    <div class="finish-flag" />
    <h1>Игра завершена!</h1>
    <h2>
      Вы набрали <strong>{{ counter }}</strong> баллов
    </h2>

    <ui-button class="btn-primary" @click="handleNewGame">Повторить игру</ui-button>
  </div>
</template>

<style scoped>
.finish-flag {
  width: 300px;
  height: auto;
  aspect-ratio: 2/1;
  margin-bottom: 1.75rem;
  background: transparent url("../assets/images/flag.svg") no-repeat center/contain;
}

.btn {
  font-size: 1.4rem;
  border-radius: 33px;
  padding-left: 48px;
  padding-right: 48px;
  min-width: 320px;
  max-width: 100%;
}

h1 {
  margin-bottom: 2rem;
}

h2 strong {
  font-size: 1.65rem;
}
</style>
