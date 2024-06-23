/**
 * [
 *    {
 *      id: <int>,
 *      task: <string>,
 *      timestamp: <string>,
 *      isCompleted: <boolean>
 *    }
 * ]
 */
const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function generateId() {
  return +new Date();
}

function generateTodoObject(id, task, author, year, isCompleted) {
  return {
    id,
    task,
    author,
    year, // Use year as number
    isCompleted
  };
}

function findTodoIndex(todoId) {
  return todos.findIndex(todo => todo.id === todoId);
}

function makeTodo(todoObject) {
  const { id, task, author, year, isCompleted } = todoObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = task;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Penulis: ${author}`;

  const textYear = document.createElement('p');
  textYear.innerText = `Tahun: ${year}`; // Format year

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `todo-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.innerText = 'Undo';
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.innerText = 'Delete';
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.innerText = 'Complete';
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('trash-button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', function () {
      removeTaskFromUncompleted(id);
    });

    container.append(checkButton, deleteButton);
  }

  return container;
}

function addTodo() {
  const textTodo = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const date = new Date(document.getElementById('date').value); // Convert date to Date object
  const year = date.getFullYear(); // Get year

  if (textTodo && author && year) {
    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo, author, year, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    // Clear the form
    document.getElementById('form').reset();
  } else {
    alert("Form tidak boleh kosong!");
  }
}

function addTaskToCompleted(todoId) {
  const todoIndex = findTodoIndex(todoId);
  if (todoIndex === -1) return;

  todos[todoIndex].isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(todoId) {
  const todoIndex = findTodoIndex(todoId);
  if (todoIndex === -1) return;

  todos.splice(todoIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId) {
  const todoIndex = findTodoIndex(todoId);
  if (todoIndex === -1) return;

  todos[todoIndex].isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromUncompleted(todoId) {
  const todoIndex = findTodoIndex(todoId);
  if (todoIndex === -1) return;

  todos.splice(todoIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === 'undefined') {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    todos.length = 0;  // Clear existing data before loading
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('todos');
  const listCompleted = document.getElementById('completed-todos');

  uncompletedTODOList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isCompleted) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
});
