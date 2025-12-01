<script setup>
import { onMounted } from 'vue';
import { todosStore } from '../../stores/todos.js';
import TodolistFooter from './TodolistFooter.vue';
import TodolistAddForm from './TodolistAddForm.vue';
import Todo from './Todo.vue';
const props = defineProps({
  apiUrl: { type: String, required: true },
});
onMounted(async () => {
  todosStore.init(props.apiUrl);
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
    <TodolistAddForm @add="todosStore.createOneTodo" />
    <!-- LISTE DES TODOS -->
    <ul
      class="m-4 divide-y divide-slate-200 text-slate-700"
      role="list"
      aria-label="Todos"
    >
      <!-- ITEM (exemple) -->
      <Todo
        v-for="todo in todosStore.filteredTodos"
        :key="todo.id"
        :todo="todo"
        @delete="todosStore.deleteOneById"
        @toggle="todosStore.updateOneById"
        @update="todosStore.updateOneById"
      />

      <!-- Message si aucun todo (à gérer en Vue) -->
      <li
        v-if="todosStore.todos.length === 0"
        class="px-4 py-6 sm:px-5 text-slate-400 italic text-center"
        role="listitem"
      >
        No tasks yet.
      </li>
    </ul>

    <!-- FOOTER DE LISTE -->
    <TodolistFooter
      :todosLeft="todosStore.todosLeft"
      @displayAll="todosStore.displayAllTodos"
      @displayActive="todosStore.displayActiveTodos"
      @displayCompleted="todosStore.displayCompletedTodos"
      @clearCompleted="todosStore.clearCompletedTodos"
    />
  </section>
</template>
<style scoped></style>
