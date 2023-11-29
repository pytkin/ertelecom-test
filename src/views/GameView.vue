<script setup lang="ts">
import { onMounted, ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import UiButton from "@/components/Ui-Button.vue";
import useStore from "@/stores/store";

const router = useRouter();
const { counter, getCardDeck, setCardDeck, deckCards, setCounter } = useStore();
const selectable = ref(false);
const selectedCards = reactive<Map>(new Map());
const allCardsOpened = ref(true);
const cardsCount = computed(() => deckCards.value.filter((item) => item !== null).length);
const nullableCardsCount = computed(() => deckCards.value.filter((item) => item === null).length);

onMounted(() => {
  getCardDeck(9);

  setTimeout(() => {
    allCardsOpened.value = false;
    selectable.value = true;
  }, 5000);
});

function handleEndGame() {
  router.push({ name: "finish" });
}

/**
 * Скрывает выбранные карты. Увеличивает количество баллов после скрытия пары карт
 * @param {}
 * @return {}
 * @description
 */
function hideSelectedCards() {
  const availableCards = deckCards.value.map((deckCard, index) => {
    if (selectedCards.has(index) && selectedCards.get(index).name === deckCard) {
      return null;
    }
    return deckCard;
  });

  setCardDeck(availableCards);
  selectedCards.clear();
  selectable.value = true;

  if (cardsCount.value > 0) {
    setCounter(Number(counter.value) + cardsCount.value / 2);
  }

  if (cardsCount.value === 0) {
    setTimeout(() => {
      router.push({ name: "finish" });
    }, 300);
  }
}

/**
 * "Переворачивает карту", если выбраны 2 одинаковые карты - скрывает их,
 * если выбраны разные карты - переворачивает карты рубашкой вверх и уменьшает количество баллов
 * @param {String|Null} card - Название выбранной карты
 * @param {Number} index - Индекс карты в колоде
 * @return {}
 */
function handleSelectCard(card: string | null, index: number) {
  if (selectable.value === false || card === null) return;
  if (!isCardOpened(card, index)) selectedCards.set(index, { name: card });

  if (selectedCards.size === 2) {
    const cardNames = Array.from(selectedCards).map((entry) => entry[1].name);

    selectable.value = false;

    if (cardNames.length === 2 && new Set(cardNames).size === 1) {
      setTimeout(() => {
        hideSelectedCards();
      }, 1000);
    } else {
      setTimeout(() => {
        selectedCards.clear();
        selectable.value = true;

        if (nullableCardsCount.value > 0) {
          setCounter(Number(counter.value) - nullableCardsCount.value / 2);
        }
      }, 1000);
    }
  }
}

/**
 * Проверяет, открыта ли карта
 * @param {String|Null} card - Название карты для проверки
 * @param {Number} index - Индекс карты в колоде
 * @return {Boolean} Возвращает true если карта открыта, иначе возвращается false
 */
function isCardOpened(card: string | null, index: number) {
  if (card === null) return false;

  return selectedCards.has(index) && selectedCards.get(index).name === card;
}
</script>

<template>
  <div class="app-screen game-screen">
    <div class="counter">Баллов: {{ counter }}</div>
    <div class="card-pole" :class="{ 'is-all-cards-opened': allCardsOpened }">
      <div v-for="(card, index) in deckCards" :key="`card-${index}`" class="card-holder">
        <div
          v-if="card"
          class="card"
          :class="[card, { 'is-card-opened': isCardOpened(card, index) }]"
          @click="handleSelectCard(card, index)"
        >
          <div class="card-inner" />
        </div>
      </div>
    </div>
    <ui-button class="btn-secondary" @click="handleEndGame">Завершить игру</ui-button>
  </div>
</template>

<style scoped>
.game-screen {
  padding: 80px 40px 140px;
}

.card-pole {
  display: grid;
  align-content: space-evenly;
  justify-items: center;
  align-items: center;
  justify-content: space-evenly;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  gap: 20px 16px;
  grid-template-areas:
    ". . ."
    ". . ."
    ". . ."
    ". . ."
    ". . .";
  max-width: 1140px;
  width: 100%;

  &.is-all-cards-opened {
    .card .card-inner {
      transform: rotateY(0);
    }
  }
}

@media (min-width: 768px) {
  .card-pole {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-areas:
      ". . . ."
      ". . . ."
      ". . . ."
      ". .";
  }
}

@media (min-width: 1024px) {
  .game-screen {
    padding: 140px 40px;
  }
  .card-pole {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 40px 32px;
    grid-template-areas:
      ". . . . . ."
      ". . . . . ."
      ". . . . . .";
  }
}

@media (min-width: 1680px) {
  .card-pole {
    max-width: 1280px;
  }
}

.card-holder {
  width: 100%;
  aspect-ratio: 0.7027027;
}

.card {
  position: relative;
  background-color: transparent;
  perspective: 1000px;
  height: 100%;

  &.is-card-opened .card-inner {
    transform: rotateY(0);
  }
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: rotateY(180deg);
}

.card-inner::before,
.card-inner::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  background-position: center;
  background-size: contain;
  backface-visibility: hidden;
}

.card-inner::after {
  background-image: url("../assets/images/card-back.svg");
  transform: rotateY(180deg);
}

.counter {
  position: absolute;
  top: 24px;
  right: 32px;
  font-size: 1.4rem;
}

.btn {
  border-radius: 27px;
  padding: 16px 48px;
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
  letter-spacing: normal;
}
</style>

<style lang="scss" scoped>
$card_types: ("clubs_", "diamonds_", "hearts_", "spades_");
$card_labels: ("2", "3", "4", "5", "6", "7", "8", "9", "10", "ace", "jack", "king", "queen");

@each $type in $card_types {
  @each $label in $card_labels {
    .card {
      &.#{$type}#{$label} .card-inner::before {
        background-image: url("../assets/images/cards/#{$type}#{$label}.svg");
      }
    }
  }
}

.card {
  &.joker_red .card-inner::before {
    background-image: url("../assets/images/cards/joker_red.svg");
  }
  &.joker_black .card-inner::before {
    background-image: url("../assets/images/cards/joker_black.svg");
  }
}
</style>
