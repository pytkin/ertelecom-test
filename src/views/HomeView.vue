<script setup lang="ts">
import { useRouter } from "vue-router";
import UiButton from "@/components/Ui-Button.vue";

const router = useRouter();

function handleStartGame() {
  router.push({ name: "game" });
}
</script>

<template>
  <div class="app-screen home-screen">
    <div class="joker-logo" />
    <h1>Игра "Memory"</h1>

    <ui-button class="btn-primary" @click="handleStartGame">Начать игру!</ui-button>
  </div>
</template>

<style scoped>
.joker-logo {
  width: 150px;
  height: auto;
  aspect-ratio: 0.7027;
  margin-bottom: 1.75rem;
  background: transparent url("../assets/images/cards/joker_red.svg") no-repeat center/contain;
}

.btn {
  font-size: 1.4rem;
  border-radius: 33px;
  padding-left: 48px;
  padding-right: 48px;
  min-width: 320px;
  max-width: 100%;
}
</style>
