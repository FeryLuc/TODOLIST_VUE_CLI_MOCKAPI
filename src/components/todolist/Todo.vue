<script setup>
import { ref } from 'vue';
const props = defineProps({ todo: Object });
const emit = defineEmits(['delete', 'toggle', 'update']);

const isEditing = ref(false);
const todoContent = ref('');
const startEdit = () => {
  isEditing.value = true;
  todoContent.value = props.todo.content;
};
const save = () => {
  isEditing.value = false;
  const newContent = todoContent.value;
  if (newContent) {
    emit('update', { id: props.todo.id, content: newContent });
  }
};
</script>
<template>
  <li class="px-4 py-3 sm:px-5" role="listitem">
    <div
      class="flex items-center gap-3"
      v-if="!isEditing"
      @dblclick="startEdit"
    >
      <!-- La ligne entière est cliquable via label -->
      <input
        :id="props.todo.id"
        type="checkbox"
        v-model="props.todo.isCompleted"
        @change="emit('toggle', props.todo)"
        class="h-4 w-4 text-blue-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      />
      <label
        :for="props.todo.id"
        class="flex-1 cursor-pointer"
        :class="{ 'line-through text-slate-400': props.todo.isCompleted }"
      >
        {{ props.todo.content }}
      </label>
      <button
        class="text-red-600/90 hover:text-red-700 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
        aria-label="Delete task"
        title="Delete"
        @click="emit('delete', props.todo.id)"
      >
        ✕
      </button>
    </div>
    <!-- Champ d'édition (masqué par défaut, visible en mode edit) -->
    <input
      v-else
      @keyup.enter="save"
      v-model="todoContent"
      type="text"
      class="mt-2 w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </li>
</template>
<style scoped></style>
