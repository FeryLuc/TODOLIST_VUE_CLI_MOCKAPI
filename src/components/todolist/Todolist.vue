<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import DB from '../../services/DB.js';
import TodolistFooter from './TodolistFooter.vue';
import TodolistAddForm from './TodolistAddForm.vue';
import Todo from './Todo.vue';

const todos = reactive([]);

onMounted(async () => {
  DB.setApiUrl('https://691b0e532d8d7855757146d3.mockapi.io/');
  todos.splice(todos.length, 0, ...(await DB.findAll()));
  console.table(todos);
});
//affiche les non complétées totals. filtrer sur filteredTodos pour changer le count en fonction des filtre cliqué.
const todosLeft = computed(() => {
  return todos.filter((t) => t.isCompleted === false).length;
});

const deleteOneById = async (id) => {
  await DB.deleteOneById(id);
  const index = todos.findIndex((t) => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
  }
  console.log('deleted: ' + id);
};

const updateOneById = async (todo) => {
  const response = await DB.updateOne(todo);
  const index = todos.findIndex((t) => t.id === todo.id);
  if (index !== -1) {
    todos[index].content = todo.content;
  }
};

const createOneTodo = async (newTodo) => {
  if (newTodo == '') return;
  const response = await DB.create(newTodo);
  console.log(response);
  todos.push(response);
};
//Footer actions
const filter = ref('all');
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'all':
      return todos;
      break;
    case 'active':
      return todos.filter((t) => !t.isCompleted);
      break;
    case 'completed':
      return todos.filter((t) => t.isCompleted);
      break;

    default:
      break;
  }
});
const displayAllTodos = () => {
  filter.value = 'all';
};
const displayActiveTodos = () => {
  filter.value = 'active';
};
const displayCompletedTodos = () => {
  filter.value = 'completed';
};
const clearCompletedTodos = async () => {
  // Récupérer uniquement les todos complétés
  const completedTodos = todos.filter((t) => t.isCompleted);

  // Boucle sur les complétés et supprime en DB
  for (const todo of completedTodos) {
    await DB.deleteOneById(todo.id);
  }

  // Supprimer du tableau local
  for (let i = todos.length - 1; i >= 0; i--) {
    if (todos[i].isCompleted) {
      todos.splice(i, 1);
    }
  }
};

watch(todos, () => {
  console.log('Changement dans todos :', todos);
});
</script>
<template>
  <!-- CARD LISTE -->
  <section
    class="bg-slate-100 rounded-xl shadow ring-1 ring-slate-200/60 overflow-hidden"
    aria-labelledby="todo-heading"
  >
    <h2 id="todo-heading" class="sr-only">Todo list</h2>

    <!-- INPUT PRINCIPAL -->
    <TodolistAddForm @add="createOneTodo" />
    <!-- LISTE DES TODOS -->
    <ul
      class="m-4 divide-y divide-slate-200 text-slate-700"
      role="list"
      aria-label="Todos"
    >
      <!-- ITEM (exemple) -->
      <Todo
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @delete="deleteOneById"
        @toggle="updateOneById"
        @update="updateOneById"
      />

      <!-- Message si aucun todo (à gérer en Vue) -->
      <li
        v-if="todos.length === 0"
        class="px-4 py-6 sm:px-5 text-slate-400 italic text-center"
        role="listitem"
      >
        No tasks yet.
      </li>
    </ul>

    <!-- FOOTER DE LISTE -->
    <TodolistFooter
      :todosLeft="todosLeft"
      @displayAll="displayAllTodos"
      @displayActive="displayActiveTodos"
      @displayCompleted="displayCompletedTodos"
      @clearCompleted="clearCompletedTodos"
    />
  </section>
</template>
<style scoped></style>
