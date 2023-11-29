import { ref, computed } from 'vue'

/**
 * Функция принимает два массива — названия мастей и названия
 * достоинств карт соответственно. Затем она объединяет их, добавляя
 * к названиям мастей названия достоинств карт, и возвращает
 * получившийся массив.
 * @param {string[]} cardTypes - масти карт
 * @param {string[]} cardLabels - надпись на карте
 * @returns {string[]} Колода из 54 карт
 */
function getCardNames(cardTypes: string[], cardLabels: string[]): string[] {
  const extraCards = ['joker_red', 'joker_black'];
  const result = [];
  
  for(let i = 0; i < cardTypes.length; i++){
      const type = cardTypes[i];
      const labels = cardLabels.map(label => type + label);
      result.push(...labels);
  }
  
  result.concat(extraCards);
  
  return result;
}

/**
 * Функция выполняет случайную перестановку элементов массива,
 * возвращая отсортированный массив.
 * Процесс перестановки продолжается до тех пор, пока длина массива больше 0.
 * Для генерации случайного индекса используется функция Math.random().
 * После получения случайного индекса, он используется для замены позиций двух
 * элементов массива.
 * @param {string[]} array - исходный массив
 * @returns {string[]} Массив с перемешаннми значенями
 */
function shuffle(array: string[]): string[] {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const counter = ref<Number>(0);

export default function useStore() {
    const allCards = getCardNames(["clubs_", "diamonds_", "hearts_", "spades_"], ["2", "3", "4", "5", "6", "7", "8", "9", "10", "ace", "jack", "king", "queen"]);
    const deckCards = ref<Array<string | null>>([]);

    /**
     * Создаёт начальную колоду случайных карт из всего набора
     * @param {number} payload - число карт в колоде
     */
    function getCardDeck(payload: number) {
      const randomCards = shuffle(allCards).slice(0, payload);
      deckCards.value = shuffle([...randomCards, ...randomCards]);
    }

    /**
     * Обновляет колоду карт
     * @param {string[]|null[]} payload - Массив карт в колоде
     */
    function setCardDeck(payload = [] as (string | null)[]) {
      deckCards.value = payload;
    }

    /**
     * Обновляет значение счётчика баллов. Устанавливает 0, если новое значение < 0
     * @param {number} payload - новое значение счётчика
     */
    function setCounter(payload: number) {
      counter.value = payload > 0 ? payload : 0;
    }
  
    return {
      counter: computed(() => counter.value),
      allCards,
      deckCards,

      getCardDeck,
      setCardDeck,
      setCounter
    }
  }