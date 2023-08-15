<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from "vue";

import { writeText } from '@tauri-apps/api/clipboard';
import { message } from '@tauri-apps/api/dialog';
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';

import MemoComponent from './components/Memo.vue';

interface Memo {
  id: number;
  title: string;
  editable: boolean;
  code: string;
}

const memos_file = 'memos.json';

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

async function loadMemos(): Promise<Memo[]> {
  try {
    const contents = await readTextFile(memos_file, { dir: BaseDirectory.AppData });
    return JSON.parse(contents);
  } catch (error) {
    console.log('Cannot load memos:', error);
    return [];
  }
}

async function saveMemos() {
  if (memos.value.length < 1) return;

  // TODO: Check if AppData directory exists
  // const data_exists = await exists('avatar.png', { dir: BaseDirectory.AppData });

  try {
    await writeTextFile(memos_file, JSON.stringify(memos.value), { dir: BaseDirectory.AppData });
  } catch (error) {
    await message('Unable to save memos', { title: 'Programming memos', type: 'error' });
    return
  }

  await message('Memos saved', 'Programming memos');
}

function editCode(event: Event) {
  if (event instanceof InputEvent) {
    // newMemo.value.code
    if (event.target instanceof HTMLElement) {
      newMemo.value.code = event.target.innerText
    }
  }
}

loadMemos().then((loadedMemos: Memo[]) => {
  const maxId = loadedMemos.reduce((max, memo) => memo.id > max ? memo.id : max, 0);

  memos.value = loadedMemos;
  newMemo.value.id = maxId + 1;
  console.log('New memo id:', maxId + 1, 'wtf')
})

</script>

<template>
  <div class="flex flex-col w-screen p-2 gap-y-4">
    <div class="flex flex-row gap-x-2 items-center">
      <div class="text-2xl">Programming memos</div>
      <button
            @click="saveMemos"
            class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-3 py-1"
          >
            Save
          </button>
    </div>
    <div class="flex flex-col w-full gap-y-2">
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
        <div
          contenteditable="true"
          @input="editCode"
          class="p-1 w-full rounded-sm px-1 text-sm h-fit">
          {{ newMemo.code }}
        </div>
      </MemoComponent>

      <hr v-if="memos.length > 0" class="border-black my-1"/>

      <MemoComponent
        v-for="(memo, _) in memos"
        :key="memo.id"
      >
        <template v-slot:title>
          <div class="flex flex-row gap-x-2 items-center">
            <button
              @click="copyCode(memo.id)"
              class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-sm rounded-lg px-3 py-1"
            >
              Copy
            </button>
            <div>{{ memo.title }}</div>
          </div>
          <div class="flex flex-row gap-x-2 items-center">
            <button
              v-if="!memo.editable"
              @click="toggleEditable(memo.id)"
              class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-sm rounded-lg px-3 py-1"
            >
              Edit
            </button>
            <button
              v-else
              @click="toggleEditable(memo.id)"
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 text-sm rounded-lg px-3 py-1"
            >
              Done
            </button>
            <button
              @click="removeMemo(memo.id)"
              class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 text-sm rounded-lg px-3 py-1"
            >
              Delete
            </button>
          </div>
        </template>
        <highlightjs
          :code="memo.code"
          autodetect
          class="p-1 w-full rounded-sm px-1 text-sm"/>
      </MemoComponent>
    </div>
  </div>
</template>

<style scoped>

</style>
