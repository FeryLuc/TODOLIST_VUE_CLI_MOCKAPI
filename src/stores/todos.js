import { ref, reactive, computed, watch } from 'vue';
import DB from '../services/DB.js';

const todos = reactive([]);
//affiche les non complétées totals. filtrer sur filteredTodos pour changer le count en fonction des filtre cliqué.
const todosLeft = computed(() => {
  return todos.filter((t) => t.isCompleted === false).length;
});

//Main features
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
      return todos;
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
const init = async () => {
  DB.setApiUrl('https://691b0e532d8d7855757146d3.mockapi.io/');
  todos.splice(todos.length, 0, ...(await DB.findAll()));
};
watch(todos, () => {
  console.log('Changement dans todos :', todos);
});

export const todosStore = reactive({
  todos,
  todosLeft,
  deleteOneById,
  updateOneById,
  createOneTodo,
  filteredTodos,
  displayAllTodos,
  displayActiveTodos,
  displayCompletedTodos,
  clearCompletedTodos,
  init,
});
