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
const delActionButton = document.querySelector('.del__action__btn'); // кнопка добавления


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
  {"id": "1", "kind": "Мангустин", "color": "фиолетовый", "weight": 13, "checked": false},
  {"id": "2", "kind": "Дуриан", "color": "зеленый", "weight": 35, "checked": false },
  {"id": "3", "kind": "Личи", "color": "розово-красный", "weight": 17, "checked": false},
  {"id": "4", "kind": "Карамбола", "color": "желтый", "weight": 28, "checked": false},
  {"id": "5", "kind": "Тамаринд", "color": "светло-коричневый", "weight": 22, "checked": false}
]`;

// преобразование списка фруктов из JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
// сохраним список для отмены фильтрации
let fruitsNoFilter = fruits.slice();

// Цвета фруктов 
const colorRGB = new Map(JSON.parse(colorRGBJson));

// ограничение полей ввода "только числа"
function onlyNumLiter() {
  this.value = this.value.replace(/[^\d.]/g, '');
}
// вес при добавлении фрукта
weightInput.addEventListener('input', onlyNumLiter);
// веса при фильтрации
minWeight.addEventListener('input', onlyNumLiter);
maxWeight.addEventListener('input', onlyNumLiter);

// возвращает fruit по id
function fruitByID(arr, id){
  
  for (let i=0; i < arr.length; i++){
    if (id == arr[i].id){
      return arr[i];
    }
  }
}

// обработка клика по фрукту
function fruitClick(event){
  let id = event.currentTarget.id.substring(6);
  let fruit = fruitByID(fruits, id); 
  fruit.checked = !fruit.checked;
  display();
}
//fruitsList.addEventListener('click', fruitClick);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  let checkClass = '';
  let bgColor;
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = '';

  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    const oneFruit = document.createElement('li');
    oneFruit.className = 'fruit__item';
    if (fruits[i].checked) {
      oneFruit.className +=  ' fruit__item__checked';
    }
    oneFruit.id = 'fruit_' + fruits[i].id;
    bgColor = colorRGB.get(fruits[i].color);
    oneFruit.style.background = !bgColor ? '#96969d' : bgColor;
    oneFruit.innerHTML = `<div class="fruit__info">
    <div>index: ${i}</div>
    <div>id: ${fruits[i].id}</div>
    <div>kind: ${fruits[i].kind}</div>
    <div>color: ${fruits[i].color}</div>
    <div>weight (кг): ${fruits[i].weight}</div>
    </div>`;
    oneFruit.onclick = fruitClick;
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

  if (fruits.length <= 1){
    alert('Нечего перемешивать :(');
    return;
  }
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
    arrayIndex = getRandomInt(0, fruits.length - 1);
    result.push(fruits[arrayIndex]);
    fruits.splice(arrayIndex, 1)
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
  if (!a) {
    return true;
  }
  else if (!b) {
    return false;
  }
  if (a.color == b.color) {
    return a.id < b.id;
  }

  let aColor = colorRGB.get(a.color);
  let bColor = colorRGB.get(b.color);
  
  if (!aColor) {
    return true;
  }
  if (!bColor) {
    return false;
  }

  // TODO: допишите функцию сравнения двух элементов по цвету
  const aNum = Number(aColor.replace('#', '0x'));
  const bNum = Number(bColor.replace('#', '0x'));
  
  return aNum < bNum;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
    const n = arr.length;
    // внешняя итерация по элементам
    for (let i = 0; i < n - 1; i++) {
      // внутренняя итерация для перестановки элемента в конец массива
      for (let j = 0; j < n - 1 - i; j++) {
        // сравниваем элементы
        if (comparation(arr[j], arr[j + 1])) {
          // делаем обмен элементов
          let temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
  },

  quickSort(arr, comparation) {
    // TODO: допишите функцию быстрой сортировки
    // обмен элементов массива
    function swap(items, firstIndex, secondIndex) {
      const temp = items[firstIndex];
      items[firstIndex] = items[secondIndex];
      items[secondIndex] = temp;
    }
    // функция разделитель
    function partition(items, left, right) {
      var pivot = items[Math.floor((right + left) / 2)],
        i = left,
        j = right;
      while (i <= j) {
        while (i <= j && comparation(pivot, items[i])) {
          i++;
        }
        while (i <= j && comparation(items[j], pivot)) {
          j--;
        }
        if (i <= j) {
          swap(items, i, j);
          i++;
          j--;
        }
      }
      return i;
    }
    // функция быстрой сортировки
    function quickSortA(arr, start, end) {
      var index;
      if (arr.length > 1) {
        start = typeof start != "number" ? 0 : start;
        end = typeof end != "number" ? arr.length - 1 : end;
        index = partition(arr, start, end);

        if (start < index - 1) {
          quickSortA(arr, start, index - 1);
        }
        if (index < end) {
          quickSortA(arr, index, end);
        }
      }
    }

    quickSortA(arr);
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
    sortTimeLabel.textContent = sortTime;
  },
};


// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/
// поиск следующего fruit.id
function nextID(arr){
  let id = 0;
  for (let i=0; i < arr.length; i++){
    if (id < Number(arr[i].id)){
      id = Number(arr[i].id);
    }
  }
  return id + 1;
}
// добавление
addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  // проверки заполнения полей
  let kindInputValue = kindInput.value;
  if (!kindInputValue) {
    alert('Заполните поле "kind:"!');
    return;
  }
  kindInputValue = kindInputValue.charAt(0).toUpperCase() + kindInputValue.slice(1).toLowerCase();
  const colorInputValue = colorInput.value;
  if (!colorInputValue) {
    alert('Заполните поле "color:"!');
    return;
  }
  const weightInputValue = Number(weightInput.value);
  if (!weightInputValue) {
    alert('Заполните поле "weight:"!');
    return;
  }
  // проверка на уникальность по типу
  if (fruits.some((fruit => fruit.kind == kindInputValue))) {
    alert(kindInputValue + ' уже есть в списке!');
    return;
  }
  fruits.push({
    "id": nextID(fruits),
    "kind": kindInputValue,
    "color": colorInputValue,
    "weight": weightInputValue,
    "checked": false
  });
  display();
});

/*** УДАЛИТЬ ВЫБРАННЫЕ ФРУКТЫ ***/
delActionButton.addEventListener('click', () => {
  let result = [];
  
  // фильтруем  массив
  result = fruits.filter((item) => {
    return !item.checked;
  });
  fruits = result;
  display();
});