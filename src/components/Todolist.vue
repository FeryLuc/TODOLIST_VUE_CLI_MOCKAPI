<script>
import TodolistFooter from './TodolistFooter.vue';
import DB from '../services/DB.js';
export default {
  props: {
    apiUrl: String,
  },
  data() {
    return {
      todos: [],
    };
  },
  components: {
    TodolistFooter,
  },
  async created() {
    DB.setApiUrl(this.apiUrl);
    this.todos = await DB.findAll();
    console.table(this.todos);
  },
};
</script>
<template>
  <TodolistFooter />
</template>
<style scoped></style>
