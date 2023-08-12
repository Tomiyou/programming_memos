<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from "vue";

import { writeText } from '@tauri-apps/api/clipboard';

import MemoComponent from './components/Memo.vue';

interface Memo {
  id: number;
  title: string;
  editable: boolean;
  code: string;
}

const memos = ref<Memo[]>([]);
const newMemo = ref<Memo>({
  id: 0,
  title: 'New memo ...',
  editable: false,
  code: ''
});

function addMemo(_: any) {
  if (newMemo.value.code === '') return

  memos.value.push({ ...newMemo.value});
  newMemo.value.id += 1;
  newMemo.value.code = '';
}

function removeMemo(id: number) {
  memos.value = memos.value.filter(memo => memo.id !== id);
}

function toggleEditable(id: number) {
  const memo = memos.value.find(memo => memo.id === id);
  if (memo) {
    memo.editable = !memo.editable
  }
}

async function copyCode(id: number) {
  const memo = memos.value.find(memo => memo.id === id);
  if (memo) {
    console.log(memo.id, memo.title, memo.code);
    await writeText(memo.code);
  }
}

</script>

<template>
  <div class="flex flex-col h-screen w-screen p-2">
    <div>Programming memos</div>
    <div class="flex flex-col bg-orange-500 py-2 w-full gap-y-2">
      <MemoComponent
        v-for="(memo, _) in memos"
        :key="memo.id"
      >
        <template v-slot:title>
          <div class="flex flex-row gap-x-2 items-center">
            <button
              @click="copyCode(memo.id)"
              class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-3 py-1"
            >
              Copy
            </button>
            <div>{{ memo.title }}</div>
          </div>
          <div class="flex flex-row gap-x-2 items-center">
            <button
              v-if="!memo.editable"
              @click="toggleEditable(memo.id)"
              class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-3 py-1"
            >
              Edit
            </button>
            <button
              v-else
              @click="toggleEditable(memo.id)"
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-3 py-1"
            >
              Done
            </button>
            <button
              @click="removeMemo(memo.id)"
              class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-3 py-1"
            >
              Delete
            </button>
          </div>
        </template>
        <textarea
          v-model="memo.code"
          :disabled="!memo.editable"
          class="p-1 w-full">
        </textarea>
      </MemoComponent>

      <hr v-if="memos.length > 0" class="border-black my-1"/>

      <!-- New Memo html -->
      <MemoComponent>
        <template v-slot:title>
          <div class="flex flex-row justify-between w-full items-center">
          <div>{{ newMemo.title }}</div>
          <button
            @click="addMemo"
            class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-3 py-1"
          >
            +
          </button>
        </div>
        </template>
        <textarea
          v-model="newMemo.code"
          class="p-1 w-full">
        </textarea>
      </MemoComponent>
    </div>
  </div>
</template>

<style scoped>

</style>
