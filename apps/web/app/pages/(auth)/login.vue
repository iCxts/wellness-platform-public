<script setup lang="ts">
const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const inputClass =
  'h-14 rounded-[20px] border border-[#d9d9d9] bg-[#f8f8f8] px-4 flex items-center gap-3'
const inputTextClass =
  'flex-1 border-0 bg-transparent text-[15px] text-[#111] outline-none placeholder:text-[#a5a5a5]'

const handleLogin = async () => {
  await router.push('/')
}
</script>

<template>
  <main
    class="min-h-dvh grid place-items-center bg-[#efefef] p-8 font-[Poppins,Inter,system-ui,sans-serif] max-[940px]:bg-white max-[940px]:p-0"
  >
    <section
      class="w-full max-w-[1040px] min-h-[min(760px,calc(100dvh-4rem))] grid grid-cols-[minmax(320px,1fr)_minmax(420px,1fr)] overflow-hidden rounded-[28px] bg-white max-[940px]:min-h-dvh max-[940px]:grid-cols-1 max-[940px]:rounded-none"
    >
      <div
        class="relative overflow-hidden flex items-end p-12 text-white max-[940px]:min-h-[22rem] max-[940px]:overflow-hidden max-[940px]:rounded-br-[10rem]"
      >
        <img
          class="absolute inset-0 h-full w-full object-cover scale-110"
          src="https://www.figma.com/api/mcp/asset/5b1c26fc-59d3-4b56-a723-39c5e83d5ae2"
          alt="Wellness training session"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.56)]"
        />
        <!-- <h1
          class="relative z-[2] m-0 text-[clamp(1.6rem,3vw,2.2rem)] font-medium"
        >
          Welcome back to B. Well
        </h1> -->
      </div>

      <div
        class="flex flex-col justify-center gap-5 bg-white px-12 py-14 max-[940px]:px-6 max-[940px]:py-9"
      >
        <h2 class="mb-4 text-center text-[2rem] font-semibold text-black">
          Log In
        </h2>

        <label :class="inputClass">
          <span class="text-sm text-[#ff6727]" aria-hidden="true">✉</span>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            autocomplete="email"
            :class="inputTextClass"
          />
        </label>

        <label :class="inputClass">
          <span class="text-sm text-[#ff6727]" aria-hidden="true">🔒</span>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            autocomplete="current-password"
            :class="inputTextClass"
          />
          <button
            type="button"
            class="border-0 bg-transparent text-[15px] text-[#9d9d9d] cursor-pointer"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '🙈' : '👁' }}
          </button>
        </label>

        <button
          class="mt-2 h-14 rounded-[20px] border-0 bg-[#ff6727] text-[17px] font-bold text-white flex items-center justify-center gap-3 cursor-pointer"
          type="button"
          @click="handleLogin"
        >
          Log in
          <span aria-hidden="true">›</span>
        </button>

        <p class="mt-4 text-center text-[15px] text-black">
          Don&apos;t have an account?
          <NuxtLink
            to="/register"
            class="ml-1.5 text-[#ff6727] font-bold no-underline"
            >Sign up</NuxtLink
          >
        </p>
      </div>
    </section>
  </main>
</template>
