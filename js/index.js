// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const minWeight = document.querySelector('.minweight__input'); // поле минимального веса для фильтрации
const maxWeight = document.querySelector('.maxweight__input'); // поле максимального веса для фильтрации
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const filterClearButton = document.querySelector('.filter__clear__btn'); // кнопка отмены фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// трансляция цветов: русское название => #RGB
let colorRGBJson = `[
  ["фиолетовый", "#8b00ff"],
  ["зеленый", "#84cd1b"],
  ["розово-красный", "#dc143c"],
  ["желтый", "#ffd800"],
  ["светло-коричневый", "#cd853f"],
  ["оранжевый", "#ff8800"]
]`;

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование списка фруктов из JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
// сохраним список для отмены фильтрации
let fruitsNoFilter = fruits.slice();

// Цвета фруктов 
const colorRGB = new Map(JSON.parse(colorRGBJson));

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = '';

  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    const oneFruit = document.createElement('li');
    oneFruit.className = 'fruit__item';
    oneFruit.style.background = colorRGB.get(fruits[i].color);
    oneFruit.innerHTML = `<div class="fruit__info">
    <div>index: ${i}</div>
    <div>kind: ${fruits[i].kind}</div>
    <div>color: ${fruits[i].color}</div>
    <div>weight (кг): ${fruits[i].weight}</div>
    </div>`;
    fruitsList.appendChild(oneFruit);
  }

};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  let arrayIndex;

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
    arrayIndex = getRandomInt(0, fruits.length-1);
    result.push(fruits[arrayIndex]);
    fruits.splice(arrayIndex,1)
  }

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  let result = [];
  let minWeightValue = Number(minWeight.value);
  let maxWeightValue = Number(maxWeight.value);

  if (!minWeightValue) {
    minWeightValue = 0;
    minWeight.value = minWeightValue;
  } 
  if (!maxWeightValue) {
    maxWeightValue = 1000;
    maxWeight.value = maxWeightValue;
  } 
  if (maxWeightValue < minWeightValue) {
    maxWeightValue = minWeightValue;
    maxWeight.value = maxWeightValue;
  }
  // фильтруем каждый раз исходный массив
  result = fruitsNoFilter.filter((item) => {
    // TODO: допишите функцию
    return (item.weight >= minWeightValue) && (item.weight <= maxWeightValue);
    });
  fruits = result;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

// отмена фильтрации массива
const filterClearFruits = () => {
  fruits = fruitsNoFilter.slice();
}

filterClearButton.addEventListener('click', () => {
  filterClearFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  // TODO: допишите функцию сравнения двух элементов по цвету
  const aNum = Number(colorRGB.get(a.color).replace('#', '0x'));
  const bNum = Number(colorRGB.get(b.color).replace('#', '0x'));
  return aNum < bNum;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
    const n = arr.length;
   // внешняя итерация по элементам
   for (let i = 0; i < n-1; i++) { 
       // внутренняя итерация для перестановки элемента в конец массива
       for (let j = 0; j < n-1-i; j++) { 
           // сравниваем элементы
           if (comparation(arr[j], arr[j+1])) { 
               // делаем обмен элементов
               let temp = arr[j+1]; 
               arr[j+1] = arr[j]; 
               arr[j] = temp; 
           }
       }
   }        
  },

  quickSort(arr, comparation) {
    // TODO: допишите функцию быстрой сортировки
    
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};


// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  let kindInputValue = kindInput.value;
  kindInputValue = kindInputValue.charAt(0).toUpperCase() + kindInputValue.slice(1).toLowerCase();
  const colorInputValue = colorInput.value;
  const weightInputValue = Number(weightInput.value);
  fruits.push({
    "kind": kindInputValue,
    "color": colorInputValue,
    "weight": weightInputValue
  });
  display();
});