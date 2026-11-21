<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import {
  Mail,
  Phone,
  MapPin,
  Copy,
  Send,
  CheckCircle2,
  Terminal,
  Laptop,
  Bot,
  Briefcase,
  Coffee,
  Loader2,
  X,
} from 'lucide-vue-next'
import { contactInfo } from '@/data/portfolio'
import { useI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'
import { useAudio } from '@/composables/useAudio'
import SocialIcons from '@/components/common/SocialIcons.vue'

const { lang, t } = useI18n()
const { copyText, showToast } = useToast()
const { playBeep, playSuccess } = useAudio()

const topics = [
  { value: 'Dự án Web', labelKey: 'topic_web' as const, icon: Laptop },
  { value: 'Tích hợp AI', labelKey: 'topic_ai' as const, icon: Bot },
  { value: 'Tuyển dụng', labelKey: 'topic_job' as const, icon: Briefcase },
  { value: 'Giao lưu / Khác', labelKey: 'topic_other' as const, icon: Coffee },
]

const form = reactive({
  topic: 'Dự án Web',
  name: '',
  email: '',
  phone: '',
  message: '',
})

const errors = reactive({
  name: false,
  email: false,
  message: false,
})

const isSubmitting = ref(false)
const successModal = ref<{ open: boolean; name: string; email: string; topic: string }>({
  open: false,
  name: '',
  email: '',
  topic: '',
})

onMounted(() => {
  form.name = localStorage.getItem('cv_contact_name') || ''
  form.email = localStorage.getItem('cv_contact_email') || ''
  form.message = localStorage.getItem('cv_contact_message') || ''
})

watch(
  () => form.name,
  (v) => localStorage.setItem('cv_contact_name', v),
)
watch(
  () => form.email,
  (v) => localStorage.setItem('cv_contact_email', v),
)
watch(
  () => form.message,
  (v) => localStorage.setItem('cv_contact_message', v),
)

const selectTopic = (val: string) => {
  form.topic = val
  playBeep(950, 'sine', 0.04)
}

const handleSubmit = () => {
  errors.name = !form.name.trim()
  errors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  errors.message = form.message.trim().length < 5

  if (errors.name || errors.email || errors.message) {
    playBeep(320, 'sawtooth', 0.14)
    showToast(t('fill_required_toast'), '✕')
    return
  }

  isSubmitting.value = true
  playBeep(620, 'square', 0.09)

  const submittedName = form.name.trim()
  const submittedEmail = form.email.trim()
  const submittedTopic = form.topic

  setTimeout(() => {
    isSubmitting.value = false
    playSuccess()
    form.message = ''
    localStorage.removeItem('cv_contact_message')
    successModal.value = {
      open: true,
      name: submittedName,
      email: submittedEmail,
      topic: submittedTopic,
    }
  }, 900)
}
</script>

<template>
  <section id="contact" class="py-20">
    <div class="mb-2 font-mono text-xs font-semibold tracking-widest uppercase" style="color: var(--accent-cyan)">
      {{ t('contact_tag') }}
    </div>
    <h2 class="font-heading text-3xl font-bold sm:text-4xl">{{ t('contact_title') }}</h2>
    <p class="mt-3 mb-10 max-w-2xl text-sm sm:text-base" style="color: var(--text-muted)">
      {{ t('contact_intro') }}
    </p>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <!-- Left HUD Info -->
      <div class="space-y-4 xl:col-span-5">
        <!-- Email -->
        <div v-spatial-tilt class="cyber-glass flex items-center justify-between gap-3 rounded-2xl p-4">
          <div class="flex min-w-0 items-center gap-3.5">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-400">
              <Mail class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wide" style="color: var(--text-dim)">
                {{ t('contact_email_label') }}
              </div>
              <a
                :href="`mailto:${contactInfo.email}`"
                class="block truncate font-mono text-sm font-semibold hover:underline"
                style="color: var(--text-main)"
              >
                {{ contactInfo.email }}
              </a>
            </div>
          </div>
          <div class="flex shrink-0 gap-1.5">
            <button
              type="button"
              class="cursor-pointer rounded-lg border p-2 transition hover:border-cyan-400"
              style="border-color: var(--border-subtle); background: var(--bg-input)"
              @click="copyText(contactInfo.email, t('copied_toast'))"
              title="Copy Email"
            >
              <Copy class="h-4 w-4 text-cyan-400" />
            </button>
            <a
              :href="`mailto:${contactInfo.email}`"
              class="rounded-lg border p-2 transition hover:border-cyan-400"
              style="border-color: var(--border-subtle); background: var(--bg-input)"
              title="Send Email"
            >
              <Send class="h-4 w-4 text-sky-400" />
            </a>
          </div>
        </div>

        <!-- Phone -->
        <div v-spatial-tilt class="cyber-glass flex items-center justify-between gap-3 rounded-2xl p-4">
          <div class="flex min-w-0 items-center gap-3.5">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-400">
              <Phone class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wide" style="color: var(--text-dim)">
                {{ t('contact_phone_label') }}
              </div>
              <a
                :href="`tel:${contactInfo.phone}`"
                class="block truncate font-mono text-sm font-semibold hover:underline"
                style="color: var(--text-main)"
              >
                {{ contactInfo.phoneDisplay }}
              </a>
            </div>
          </div>
          <div class="flex shrink-0 gap-1.5">
            <button
              type="button"
              class="cursor-pointer rounded-lg border p-2 transition hover:border-cyan-400"
              style="border-color: var(--border-subtle); background: var(--bg-input)"
              @click="copyText(contactInfo.phone, t('copied_toast'))"
              title="Copy Phone"
            >
              <Copy class="h-4 w-4 text-cyan-400" />
            </button>
            <a
              :href="`tel:${contactInfo.phone}`"
              class="rounded-lg border p-2 transition hover:border-emerald-400"
              style="border-color: var(--border-subtle); background: var(--bg-input)"
              title="Call"
            >
              <Phone class="h-4 w-4 text-emerald-400" />
            </a>
          </div>
        </div>

        <!-- Location -->
        <div v-spatial-tilt class="cyber-glass flex items-center justify-between gap-3 rounded-2xl p-4">
          <div class="flex items-center gap-3.5">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-400/15 text-purple-400">
              <MapPin class="h-5 w-5" />
            </div>
            <div>
              <div class="text-xs font-semibold uppercase tracking-wide" style="color: var(--text-dim)">
                {{ t('contact_location_label') }}
              </div>
              <div class="text-sm font-semibold">{{ t('contact_location_val') }}</div>
            </div>
          </div>
          <span
            class="rounded-md px-2.5 py-1 font-mono text-xs font-bold"
            style="background: var(--accent-blue-dim); color: var(--accent-cyan)"
          >
            GMT+7
          </span>
        </div>

        <!-- Status Terminal -->
        <div class="cyber-glass rounded-2xl p-5 font-mono text-xs leading-relaxed">
          <div class="mb-2.5 flex items-center gap-2 font-bold text-emerald-400">
            <CheckCircle2 class="h-4 w-4" />
            <span>{{ t('sys_status') }}</span>
          </div>
          <div class="space-y-1" style="color: var(--text-muted)">
            <div>{{ t('status_line1') }}</div>
            <div>{{ t('status_line2') }}</div>
            <div>{{ t('status_line3') }}</div>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span class="font-mono text-xs font-semibold" style="color: var(--text-dim)">
            {{ t('contact_social_label') }}
          </span>
          <SocialIcons size="sm" />
        </div>
      </div>

      <!-- Right Contact Form -->
      <div class="cyber-glass rounded-2xl p-6 sm:p-7 xl:col-span-7">
        <div class="flex items-center gap-2.5 font-heading text-xl font-bold">
          <Terminal class="h-5 w-5 text-cyan-400" />
          <span>{{ t('form_title') }}</span>
        </div>
        <p class="mt-1 mb-6 text-sm" style="color: var(--text-muted)">{{ t('form_desc') }}</p>

        <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
          <!-- Topic Chips -->
          <div>
            <label class="mb-2 block text-xs font-semibold uppercase tracking-wider" style="color: var(--text-dim)">
              {{ t('topic_label') }}
            </label>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                v-for="item in topics"
                :key="item.value"
                type="button"
                class="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition"
                :style="
                  form.topic === item.value
                    ? 'background: var(--accent-cyan-dim); border-color: var(--accent-cyan); color: var(--accent-cyan)'
                    : 'background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-muted)'
                "
                @click="selectTopic(item.value)"
              >
                <component :is="item.icon" class="h-3.5 w-3.5" />
                <span>{{ t(item.labelKey) }}</span>
              </button>
            </div>
          </div>

          <!-- Name & Email -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="contact-name" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                {{ t('label_name') }} <span class="text-rose-400">*</span>
              </label>
              <input
                id="contact-name"
                v-model="form.name"
                type="text"
                :placeholder="t('placeholder_name')"
                class="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:border-cyan-400"
                :class="errors.name ? 'border-rose-500' : ''"
                style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-rose-400">{{ t('err_name') }}</p>
            </div>

            <div>
              <label for="contact-email" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider">
                {{ t('label_email') }} <span class="text-rose-400">*</span>
              </label>
              <input
                id="contact-email"
                v-model="form.email"
                type="email"
                :placeholder="t('placeholder_email')"
                class="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:border-cyan-400"
                :class="errors.email ? 'border-rose-500' : ''"
                style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
              />
              <p v-if="errors.email" class="mt-1 text-xs text-rose-400">{{ t('err_email') }}</p>
            </div>
          </div>

          <!-- Phone -->
          <div>
            <label for="contact-phone" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider">
              {{ t('label_phone') }}
              <span class="font-normal normal-case opacity-70">{{ t('label_optional') }}</span>
            </label>
            <input
              id="contact-phone"
              v-model="form.phone"
              type="tel"
              :placeholder="t('placeholder_phone')"
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:border-cyan-400"
              style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
            />
          </div>

          <!-- Message -->
          <div>
            <label for="contact-msg" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider">
              {{ t('label_message') }} <span class="text-rose-400">*</span>
            </label>
            <textarea
              id="contact-msg"
              v-model="form.message"
              rows="4"
              maxlength="500"
              :placeholder="t('placeholder_message')"
              class="w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:border-cyan-400"
              :class="errors.message ? 'border-rose-500' : ''"
              style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
            />
            <div class="mt-1 flex items-center justify-between text-xs">
              <span v-if="errors.message" class="text-rose-400">{{ t('err_message') }}</span>
              <span v-else />
              <span class="font-mono" style="color: var(--text-dim)">
                {{ form.message.length }}/500 {{ t('char_suffix') }}
              </span>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 py-3.5 text-sm font-bold tracking-wider text-slate-950 shadow-[0_0_24px_rgba(0,245,255,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
            <Send v-else class="h-4 w-4" />
            <span>{{ isSubmitting ? t('btn_transmitting') : t('btn_submit') }}</span>
          </button>
        </form>
      </div>
    </div>

    <!-- Transmission Success Modal -->
    <Transition name="modal">
      <div
        v-if="successModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
        @click.self="successModal.open = false"
      >
        <div class="cyber-glass relative w-full max-w-md rounded-2xl p-6">
          <button
            type="button"
            class="absolute top-4 right-4 cursor-pointer rounded-lg p-1 opacity-70 hover:opacity-100"
            @click="successModal.open = false"
          >
            <X class="h-5 w-5" />
          </button>

          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-400">
            <CheckCircle2 class="h-7 w-7" />
          </div>

          <h3 class="font-heading text-xl font-bold text-cyan-300">{{ t('form_success_title') }}</h3>
          <div class="mt-3 space-y-2 rounded-xl border p-4 font-mono text-xs leading-relaxed" style="border-color: var(--border-subtle); background: var(--bg-input)">
            <p class="font-bold text-cyan-400">&gt; TRANSMISSION RECEIVED</p>
            <p v-if="lang === 'en'">
              Thank you <b>{{ successModal.name }}</b> for reaching out regarding <b>[{{ successModal.topic }}]</b>. Trong Min will reply via <u>{{ successModal.email }}</u> shortly!
            </p>
            <p v-else>
              Cảm ơn <b>{{ successModal.name }}</b> đã gửi liên hệ về chủ đề <b>[{{ successModal.topic }}]</b>. Trọng Min sẽ phản hồi qua <u>{{ successModal.email }}</u> trong thời gian sớm nhất!
            </p>
          </div>

          <button
            type="button"
            class="mt-5 w-full cursor-pointer rounded-xl bg-cyan-400 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110"
            @click="successModal.open = false"
          >
            {{ t('form_success_btn') }}
          </button>
        </div>
      </div>
    </Transition>
  </section>
</template>
