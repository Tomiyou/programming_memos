import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";

import 'highlight.js/styles/stackoverflow-dark.css'
// import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
// @ts-ignore
// import hljs from 'highlight.js/lib/common';


// @ts-ignore
import hljs from 'highlight.js';
import hljsVuePlugin from "@highlightjs/vue-plugin";

hljs.registerLanguage('javascript', javascript);
const app = createApp(App);
app.use(hljsVuePlugin);
app.mount('#app');
