<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from "vue";

interface Memo {
  id: number;
  title: string;
  code: string;
}

const memos = ref<Memo[]>([
  { id: 0, title: 'Delej pizda', code: 'rm -rf /*' },
  { id: 1, title: 'omg', code: 'wtf'}
]);
const newMemo = ref<Memo>({
  id: 0,
  title: 'New memo ...',
  code: ''
});
// const text = ref("");


function addMemo(_: any) {
  memos.value.push({ ...newMemo.value});
  newMemo.value.id += 1;
  newMemo.value.code = '';
}

function removeMemo(_: any) {
  memos.value.push({ ...newMemo.value});
  newMemo.value.id += 1;
  newMemo.value.code = '';
  console.log('Removing memo');
}

</script>

<template>
  <div class="container">
    <h1>ToDo List</h1>
    <ul>
      <li
        v-for="(memo, _) in memos"
        :key="memo.id"
      >
        <button @click="addMemo">X</button>
        <div>{{ memo.title }}</div>
        <textarea v-model="memo.code"></textarea>
      </li>
      <li>
        <button @click="addMemo">+</button>
        <div>{{ newMemo.title }}</div>
        <textarea v-model="newMemo.code"></textarea>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
