<script setup lang="ts">
import { ref } from 'vue'
import { Bot, Sparkles, Copy } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ log: [text: string] }>()
const { copyText, showToast } = useToast()

const role = ref('Senior Fullstack Developer')
const promptInput = ref('')
const output = ref('Nhập yêu cầu và bấm nút để tạo prompt chuyên nghiệp...')

const generate = () => {
  const input = promptInput.value.trim() || 'viết api đăng nhập jwt trong ASP.NET 8'
  output.value = `Bạn là một ${role.value} xuất sắc với hơn 10 năm kinh nghiệm thực chiến.
Mục tiêu bài toán: "${input}"

Yêu cầu thực hiện:
1. Phân tích kiến trúc tối ưu (Clean Architecture, SOLID, Design Patterns).
2. Viết mã nguồn hoàn chỉnh, chuẩn Clean Code, kèm xử lý ngoại lệ (Exception Handling) và logging.
3. Nêu rõ các edge cases và lưu ý về bảo mật (Security), tối ưu hiệu năng (Performance).
4. Diễn giải bằng tiếng Việt súc tích, chuyên nghiệp.`
  showToast('Đã sinh Prompt AI thành công!', '✨')
  emit('log', `Tạo AI Prompt (${role.value.split(' ')[0]})`)
}

const copy = () => {
  if (output.value.startsWith('Nhập yêu cầu')) return
  copyText(output.value, 'Đã sao chép AI Prompt!')
  emit('log', 'Sao chép AI Prompt')
}
</script>

<template>
  <div class="cyber-glass flex flex-col rounded-2xl p-5">
    <div class="mb-4 flex items-start gap-3">
      <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/35 bg-cyan-400/15 text-cyan-400">
        <Bot class="h-5 w-5" />
      </div>
      <div>
        <h3 class="font-heading text-base font-bold">AI Prompt Studio</h3>
        <p class="text-xs" style="color: var(--text-muted)">Tối ưu hóa và chuẩn hóa câu nhắc cho ChatGPT, Claude, Gemini</p>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3">
      <div>
        <label class="mb-1 block text-xs font-semibold" style="color: var(--text-dim)">Vai trò của AI</label>
        <select
          v-model="role"
          class="w-full rounded-xl border px-3 py-2 text-xs outline-none focus:border-cyan-400"
          style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
        >
          <option value="Senior Fullstack Developer">Senior Fullstack Developer (ASP.NET Core / Vue)</option>
          <option value="AI Solutions Architect">Kiến trúc sư giải pháp AI & Hệ thống phân tán</option>
          <option value="Code Reviewer & Bug Hunter">Chuyên gia Code Review & Tối ưu hiệu năng</option>
          <option value="Database Architect">Chuyên gia Tối ưu Cơ sở dữ liệu (SQL / PostgreSQL)</option>
        </select>
      </div>

      <div>
        <label class="mb-1 block text-xs font-semibold" style="color: var(--text-dim)">Yêu cầu sơ bộ</label>
        <input
          v-model="promptInput"
          type="text"
          placeholder="Vd: viết api login bằng jwt trong ASP.NET 8..."
          class="w-full rounded-xl border px-3 py-2 text-xs outline-none focus:border-cyan-400"
          style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
          @keyup.enter="generate"
        />
      </div>

      <button
        type="button"
        class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
        @click="generate"
      >
        <Sparkles class="h-3.5 w-3.5" />
        <span>Tạo Prompt Chuẩn Cao Cấp</span>
      </button>

      <div class="mt-auto">
        <div class="mb-1 flex items-center justify-between text-xs">
          <span style="color: var(--text-dim)">Kết quả Prompt:</span>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] hover:border-cyan-400"
            style="border-color: var(--border-subtle); color: var(--accent-cyan)"
            @click="copy"
          >
            <Copy class="h-3 w-3" /> Sao chép
          </button>
        </div>
        <pre
          class="max-h-36 overflow-y-auto whitespace-pre-wrap rounded-xl border p-3 font-mono text-[11px] leading-relaxed"
          style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-muted)"
        >{{ output }}</pre>
      </div>
    </div>
  </div>
</template>
