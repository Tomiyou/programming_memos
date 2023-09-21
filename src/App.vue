<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from "vue";

import { writeText } from '@tauri-apps/api/clipboard';
import { message } from '@tauri-apps/api/dialog';
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';

import contenteditable from 'vue-contenteditable';

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
  const newCode = newMemo.value.code;
  if (newCode === '' || newCode === '\n') return

  memos.value.push({
    ...newMemo.value,
    code: newCode.trim(),
  });
  newMemo.value.id += 1;
  newMemo.value.title = 'New memo ...';
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

loadMemos().then((loadedMemos: Memo[]) => {
  const maxId = loadedMemos.reduce((max, memo) => memo.id > max ? memo.id : max, -1);

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
            class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 text-sm rounded-lg px-3 py-1"
          >
            Save
          </button>
    </div>
    <div class="flex flex-col w-full gap-y-2">
      <!-- New Memo html -->
      <MemoComponent>
        <template v-slot:title>
          <div class="flex flex-row justify-between w-full items-center gap-2">
            <contenteditable
              tag="div"
              v-model="newMemo.title"
              :no-html="true"
              class="w-full px-3 codearea"
            />
            <button
              @click="addMemo"
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 text-sm rounded-lg px-3 py-1"
            >
              +
            </button>
          </div>
        </template>
        <div class="px-1 mb-1">
          <contenteditable
            tag="div"
            v-model="newMemo.code"
            :no-html="true"
            class="p-1 w-full rounded-sm px-3 text-sm codearea"
          />
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
        <div class="">
            <highlightjs
            :code="memo.code"
            autodetect
            class="p-1 w-full rounded-sm px-1 text-sm"/>
        </div>
      </MemoComponent>
    </div>
    <highlightjs code="import { createApp } from 'vue';
import './styles.css';
import App from './App.vue';

import 'highlight.js/styles/stackoverflow-dark.css'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
// @ts-ignore
// import hljs from 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';

hljs.registerLanguage('javascript', javascript);

const app = createApp(App);
app.use(hljsVuePlugin);
app.mount('#app');
" autodetect/>
    <!-- <highlightjs code="function main() { return 0; }" language='javascript'/> -->
    <div>kekw</div>
  </div>
</template>

<style scoped>

</style>
