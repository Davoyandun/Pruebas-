import { logIn, logOut } from "./auth.js";
import { insert, getItems, update } from "./firestore.js";
import { getUUID } from "./utils.js";

const logInButton = document.getElementById("logIn");
const logOutButton = document.getElementById("logOut");
const todoForm = document.getElementById("todo-form");
const userInfo = document.getElementById("user-info");
const todoInput = document.getElementById("todo-input");
const todosContainer = document.getElementById("todos-container");

// autenticación de firebase
let currentUser;
let todos = [];

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;

    init();
  } else {
    console.log("no user");
    logInButton.style.display = "block";
    logOutButton.style.display = "none";
  }
});

logInButton.addEventListener("click", async (event) => {
  try {
    currentUser = await logIn();
  } catch (error) {
    throw new Error(error);
  }
});

function init() {
  logInButton.style.display = "none";
  logOutButton.style.display = "block";
  todoForm.style.display = "block";
  userInfo.innerHTML = `
    <img src="${currentUser.photoURL}" width="32" />
    <span>${currentUser.displayName}</span>
  `;
}

logOutButton.addEventListener("click", (e) => {
  try {
    logOut();
    console.log("logout");
  } catch (error) {
    throw new Error(error);
  }
});

// agregar todo

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value;
  if (text.length > 0) {
    addTodo(text);
    todoInput.value = "";
  }
});

async function addTodo(text) {
  try {
    console.log(currentUser.displayName);
    const obj = {
      id: getUUID(),
      text: text,
      completed: false,
      userId: currentUser.uid,
    };

    const newAdd = await insert(obj);

    loadTodos();
  } catch (error) {
    throw new Error(error);
  }
}

async function loadTodos() {
    todosContainer.innerHTML = "";
    todos = [];
  
    try {
      const response = await getItems(currentUser.uid);
  console.log(response, "es el response")
      todos = [...response];
      renderTodos();
    } catch (error) {
      console.error(error);
    }
  }
  
  function renderTodos() {
    let html = "";
    todos.forEach((todo) => {
      html += `
        <li>
          <input type="checkbox" id="${todo.id}" ${
        todo.completed ? "checked" : ""
      } />
          <label for="${todo.id}">${todo.text}</label>
        </li>
      `;
    });
  
    todosContainer.innerHTML = html;
  
    document
      .querySelectorAll('#todos-container input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", async (e) => {
          const id = e.target.id;
          try {
            await update(id, e.target.checked);
          } catch (error) {
            console.error(error);
          }
        });
      });
  }