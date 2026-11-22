<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Play, RotateCcw, Download, Monitor, Tablet, Smartphone, Terminal, Trash2, Sparkles } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ log: [text: string] }>()
const { showToast } = useToast()

type Tab = 'html' | 'css' | 'js'
type ViewportMode = 'desktop' | 'tablet' | 'mobile'

interface Preset {
  name: string
  html: string
  css: string
  js: string
}

const presets: Preset[] = [
  {
    name: 'Cyber Neon Card',
    html: `<div class="card">
  <span class="badge">LIVE SANDBOX</span>
  <h2>Trọng Min Cyber Lab</h2>
  <p>Chỉnh sửa HTML, CSS, JS bên trái và xem thay đổi ngay lập tức!</p>
  <button id="pulseBtn">Kích hoạt năng lượng ⚡</button>
  <div id="counter" class="counter">Số lần click: 0</div>
</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, #0d2e5c, #040d1e);
  font-family: system-ui, sans-serif;
  color: #f0f9ff;
}
.card {
  width: 310px;
  padding: 28px;
  border-radius: 20px;
  background: rgba(14, 42, 82, 0.72);
  border: 1px solid rgba(0, 245, 255, 0.45);
  box-shadow: 0 0 36px rgba(0, 245, 255, 0.22);
  text-align: center;
}
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #00f5ff;
  background: rgba(0, 245, 255, 0.14);
}
h2 { margin: 14px 0 8px; font-size: 22px; }
p { font-size: 13px; color: #bae6fd; line-height: 1.5; }
button {
  margin-top: 14px;
  width: 100%;
  padding: 11px;
  border: 0;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(90deg, #0ea5e9, #00f5ff);
  color: #041022;
  transition: transform 0.15s;
}
button:active { transform: scale(0.96); }
.counter { margin-top: 12px; font-family: monospace; color: #34d399; }`,
    js: `let count = 0;
const btn = document.getElementById('pulseBtn');
const counter = document.getElementById('counter');

console.log('Cyber Sandbox initialized!');

btn.addEventListener('click', () => {
  count++;
  counter.textContent = 'Số lần click: ' + count;
  console.log('Energy pulse #' + count);
});`,
  },
  {
    name: 'Matrix Rain Canvas',
    html: `<canvas id="matrix"></canvas>`,
    css: `body { margin: 0; overflow: hidden; background: #020814; }
canvas { display: block; }`,
    js: `const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '01TRONGMINDEVAI<>/{}';
const size = 16;
const cols = Math.floor(canvas.width / size);
const drops = Array(cols).fill(1);

function draw() {
  ctx.fillStyle = 'rgba(2, 8, 20, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00f5ff';
  ctx.font = size + 'px monospace';
  drops.forEach((y, i) => {
    const ch = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(ch, i * size, y * size);
    if (y * size > canvas.height && Math.random() > 0.97) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(draw, 45);
console.log('Matrix rain active with ' + cols + ' columns');`,
  },
  {
    name: 'Digital Cyber Clock',
    html: `<div class="clock-box">
  <div id="time" class="time">00:00:00</div>
  <div id="date" class="date">Loading...</div>
</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #06142c;
  font-family: 'Courier New', monospace;
}
.clock-box {
  padding: 32px 44px;
  border-radius: 22px;
  border: 1px solid rgba(56, 189, 248, 0.45);
  background: rgba(10, 35, 71, 0.75);
  box-shadow: 0 0 40px rgba(0, 245, 255, 0.25);
  text-align: center;
}
.time {
  font-size: 46px;
  font-weight: 800;
  color: #00f5ff;
  text-shadow: 0 0 18px rgba(0, 245, 255, 0.65);
}
.date { margin-top: 8px; color: #93c5fd; font-size: 14px; }`,
    js: `function tick() {
  const now = new Date();
  document.getElementById('time').textContent = now.toLocaleTimeString('vi-VN');
  document.getElementById('date').textContent = now.toLocaleDateString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
  });
}
tick();
setInterval(tick, 1000);
console.log('Digital clock synced');`,
  },
]

const activeTab = ref<Tab>('html')
const htmlCode = ref(presets[0].html)
const cssCode = ref(presets[0].css)
const jsCode = ref(presets[0].js)
const autoRun = ref(true)
const viewport = ref<ViewportMode>('desktop')
const renderVersion = ref(0)
const consoleLogs = ref<{ level: 'log' | 'warn' | 'error'; text: string; time: string }[]>([])

const buildSrcDoc = (html: string, css: string, js: string) => `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>${css}</style>
</head>
<body>
${html}
<script>
(function(){
  const send = (level, args) => {
    try {
      const text = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      parent.postMessage({ source: 'tm-sandbox', level, text }, '*');
    } catch(e){}
  };
  ['log','warn','error'].forEach(fn => {
    const orig = console[fn];
    console[fn] = function(...args){ send(fn, args); orig && orig.apply(console, args); };
  });
  window.onerror = function(msg, _src, line){
    send('error', [msg + ' (line ' + line + ')']);
  };
})();
<\/script>
<script>
try {
${js}
} catch(err) {
  console.error(err.message || err);
}
<\/script>
</body>
</html>`

const srcDoc = ref(buildSrcDoc(htmlCode.value, cssCode.value, jsCode.value))
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const runCode = (manual = false) => {
  consoleLogs.value = []
  srcDoc.value = buildSrcDoc(htmlCode.value, cssCode.value, jsCode.value)
  renderVersion.value++
  if (manual) emit('log', 'Chạy lại Sandbox HTML/CSS/JS')
}

watch([htmlCode, cssCode, jsCode], () => {
  if (!autoRun.value) return
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => runCode(false), 450)
})

const applyPreset = (p: Preset) => {
  htmlCode.value = p.html
  cssCode.value = p.css
  jsCode.value = p.js
  runCode(false)
  showToast(`Đã nạp mẫu: ${p.name}`, '✨')
  emit('log', `Nạp mẫu Sandbox: ${p.name}`)
}

const handleTabKey = (e: KeyboardEvent, target: 'html' | 'css' | 'js') => {
  if (e.key !== 'Tab') return
  e.preventDefault()
  const el = e.target as HTMLTextAreaElement
  const start = el.selectionStart
  const end = el.selectionEnd
  const model = target === 'html' ? htmlCode : target === 'css' ? cssCode : jsCode
  model.value = model.value.substring(0, start) + '  ' + model.value.substring(end)
  requestAnimationFrame(() => {
    el.selectionStart = el.selectionEnd = start + 2
  })
}

const exportHtml = () => {
  const fullDoc = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Trong Min Sandbox Export</title>
  <style>
${cssCode.value}
  </style>
</head>
<body>
${htmlCode.value}
  <script>
${jsCode.value}
  <\/script>
</body>
</html>`
  const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'trongmin-sandbox.html'
  a.click()
  URL.revokeObjectURL(url)
  showToast('Đã xuất tệp trongmin-sandbox.html!', '💾')
  emit('log', 'Export file HTML từ Sandbox')
}

const previewWidthClass = computed(() => {
  if (viewport.value === 'mobile') return 'max-w-[390px]'
  if (viewport.value === 'tablet') return 'max-w-[768px]'
  return 'w-full'
})

const onMessage = (e: MessageEvent) => {
  if (e.data?.source !== 'tm-sandbox') return
  consoleLogs.value.push({
    level: e.data.level || 'log',
    text: String(e.data.text ?? ''),
    time: new Date().toTimeString().split(' ')[0],
  })
  if (consoleLogs.value.length > 40) consoleLogs.value.shift()
}

onMounted(() => window.addEventListener('message', onMessage))
onUnmounted(() => {
  window.removeEventListener('message', onMessage)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="space-y-4">
    <!-- Top Toolbar -->
    <div class="cyber-glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-3.5">
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400">
          <Sparkles class="h-3.5 w-3.5" /> Mẫu có sẵn:
        </span>
        <button
          v-for="p in presets"
          :key="p.name"
          type="button"
          class="cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:border-cyan-400 hover:text-cyan-300"
          style="border-color: var(--border-subtle); background: var(--bg-input); color: var(--text-main)"
          @click="applyPreset(p)"
        >
          {{ p.name }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <label class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold" style="border-color: var(--border-subtle)">
          <input v-model="autoRun" type="checkbox" class="accent-cyan-400" />
          <span>Auto-Run</span>
        </label>

        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-1.5 text-xs font-bold text-slate-950 transition hover:brightness-110"
          @click="runCode(true)"
        >
          <Play class="h-3.5 w-3.5" /> Chạy
        </button>

        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold hover:border-cyan-400"
          style="border-color: var(--border-subtle)"
          @click="applyPreset(presets[0])"
        >
          <RotateCcw class="h-3.5 w-3.5" /> Reset
        </button>

        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-400/45 bg-emerald-400/12 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-400/20"
          @click="exportHtml"
        >
          <Download class="h-3.5 w-3.5" /> Xuất .HTML
        </button>
      </div>
    </div>

    <!-- Split Workspace -->
    <div class="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <!-- Code Editor Column -->
      <div class="cyber-glass flex flex-col overflow-hidden rounded-2xl xl:col-span-6">
        <div class="flex items-center justify-between border-b px-3 py-2" style="border-color: var(--border-subtle)">
          <div class="flex gap-1.5">
            <button
              v-for="tab in (['html', 'css', 'js'] as Tab[])"
              :key="tab"
              type="button"
              class="cursor-pointer rounded-lg px-3.5 py-1.5 font-mono text-xs font-bold uppercase transition"
              :style="
                activeTab === tab
                  ? 'background: var(--accent-cyan-dim); color: var(--accent-cyan); border: 1px solid var(--border-active)'
                  : 'color: var(--text-muted); border: 1px solid transparent'
              "
              @click="activeTab = tab"
            >
              {{ tab }}
            </button>
          </div>
          <span class="font-mono text-[10px]" style="color: var(--text-dim)">Tab = 2 spaces</span>
        </div>

        <textarea
          v-show="activeTab === 'html'"
          v-model="htmlCode"
          spellcheck="false"
          class="h-[460px] w-full resize-none p-4 font-mono text-xs leading-6 outline-none"
          style="background: var(--bg-input); color: var(--text-main)"
          @keydown="handleTabKey($event, 'html')"
        />
        <textarea
          v-show="activeTab === 'css'"
          v-model="cssCode"
          spellcheck="false"
          class="h-[460px] w-full resize-none p-4 font-mono text-xs leading-6 outline-none"
          style="background: var(--bg-input); color: var(--text-main)"
          @keydown="handleTabKey($event, 'css')"
        />
        <textarea
          v-show="activeTab === 'js'"
          v-model="jsCode"
          spellcheck="false"
          class="h-[460px] w-full resize-none p-4 font-mono text-xs leading-6 outline-none"
          style="background: var(--bg-input); color: var(--text-main)"
          @keydown="handleTabKey($event, 'js')"
        />
      </div>

      <!-- Live Preview + Console Column -->
      <div class="flex flex-col gap-4 xl:col-span-6">
        <div class="cyber-glass flex flex-col overflow-hidden rounded-2xl">
          <div class="flex items-center justify-between border-b px-4 py-2" style="border-color: var(--border-subtle)">
            <span class="font-mono text-xs font-bold text-emerald-400">● LIVE PREVIEW</span>
            <div class="flex items-center gap-1">
              <button
                type="button"
                title="Desktop"
                class="cursor-pointer rounded-lg p-1.5 transition"
                :class="viewport === 'desktop' ? 'bg-cyan-400/20 text-cyan-400' : 'opacity-60 hover:opacity-100'"
                @click="viewport = 'desktop'"
              >
                <Monitor class="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Tablet"
                class="cursor-pointer rounded-lg p-1.5 transition"
                :class="viewport === 'tablet' ? 'bg-cyan-400/20 text-cyan-400' : 'opacity-60 hover:opacity-100'"
                @click="viewport = 'tablet'"
              >
                <Tablet class="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Mobile"
                class="cursor-pointer rounded-lg p-1.5 transition"
                :class="viewport === 'mobile' ? 'bg-cyan-400/20 text-cyan-400' : 'opacity-60 hover:opacity-100'"
                @click="viewport = 'mobile'"
              >
                <Smartphone class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="flex justify-center bg-slate-950/60 p-2">
            <iframe
              :key="renderVersion"
              :srcdoc="srcDoc"
              sandbox="allow-scripts allow-modals"
              title="Live Code Preview"
              class="h-[340px] rounded-xl bg-white transition-all duration-300"
              :class="previewWidthClass"
            />
          </div>
        </div>

        <!-- Console Panel -->
        <div class="cyber-glass rounded-2xl p-4">
          <div class="mb-2 flex items-center justify-between">
            <span class="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400">
              <Terminal class="h-3.5 w-3.5" /> CONSOLE ({{ consoleLogs.length }})
            </span>
            <button
              type="button"
              class="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] opacity-75 hover:border-rose-400 hover:text-rose-400"
              style="border-color: var(--border-subtle)"
              @click="consoleLogs = []"
            >
              <Trash2 class="h-3 w-3" /> Clear
            </button>
          </div>
          <div
            class="max-h-28 space-y-1 overflow-y-auto rounded-xl border p-2.5 font-mono text-[11px]"
            style="background: var(--bg-input); border-color: var(--border-subtle)"
          >
            <div v-if="consoleLogs.length === 0" class="opacity-50">Chưa có log nào từ console...</div>
            <div
              v-for="(item, idx) in consoleLogs"
              :key="idx"
              :class="item.level === 'error' ? 'text-rose-400' : item.level === 'warn' ? 'text-amber-300' : 'text-sky-200'"
            >
              <span class="opacity-50">[{{ item.time }}]</span> {{ item.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
