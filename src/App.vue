<script setup>
import Todolist from './components/todolist/Todolist.vue';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
</script>

<template>
  <AppHeader />
  <main class="w-full max-w-xl mt-8 bg-slate-200 rounded-xl">
    <Todolist />
  </main>
  <AppFooter />
</template>

<style scoped></style>
