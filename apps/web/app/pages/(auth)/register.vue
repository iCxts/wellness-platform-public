<script setup lang="ts">
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const inputClass =
  'h-14 rounded-[20px] border border-[#d9d9d9] bg-[#f8f8f8] px-4 flex items-center gap-3'
const inputTextClass =
  'flex-1 border-0 bg-transparent text-[15px] text-[#111] outline-none placeholder:text-[#a5a5a5]'
</script>

<template>
  <main
    class="min-h-dvh grid place-items-center bg-[#efefef] p-8 font-[Poppins,Inter,system-ui,sans-serif] max-[940px]:bg-white max-[940px]:p-0"
  >
    <section
      class="w-full max-w-[980px] min-h-[min(740px,calc(100dvh-4rem))] grid grid-cols-[minmax(280px,0.9fr)_minmax(420px,1.4fr)] overflow-hidden rounded-[28px] bg-white max-[940px]:min-h-dvh max-[940px]:grid-cols-1 max-[940px]:rounded-none"
    >
      <div
        class="bg-[#f5f5f5] px-9 py-10 flex flex-col items-center justify-center gap-3 text-center max-[940px]:min-h-[15.5rem] max-[940px]:pt-8 max-[940px]:pb-5"
      >
        <img
          class="h-[110px] w-[110px] rounded-full object-cover"
          src="https://www.figma.com/api/mcp/asset/6e2ee42a-0662-42cc-887f-4a3f7fa5aab4"
          alt="B Grimm logo"
        />
        <h1
          class="mt-3 text-[2.3rem] font-bold text-black max-[940px]:text-[2rem]"
        >
          Sign up
        </h1>
        <p class="text-[15px] text-[#222]">
          Welcome to the B.Grimm Wellness Hub
        </p>
      </div>

      <div
        class="flex flex-col justify-center gap-[1.15rem] bg-white px-9 py-11 max-[940px]:px-5 max-[940px]:py-6"
      >
        <label :class="inputClass">
          <span class="text-sm text-[#ff6727]" aria-hidden="true">👤</span>
          <input
            v-model="name"
            type="text"
            placeholder="Name"
            autocomplete="name"
            :class="inputTextClass"
          />
        </label>

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
            autocomplete="new-password"
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

        <label :class="inputClass">
          <span class="text-sm text-[#ff6727]" aria-hidden="true">🔒</span>
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm Password"
            autocomplete="new-password"
            :class="inputTextClass"
          />
          <button
            type="button"
            class="border-0 bg-transparent text-[15px] text-[#9d9d9d] cursor-pointer"
            :aria-label="
              showConfirmPassword
                ? 'Hide confirm password'
                : 'Show confirm password'
            "
            @click="showConfirmPassword = !showConfirmPassword"
          >
            {{ showConfirmPassword ? '🙈' : '👁' }}
          </button>
        </label>

        <button
          class="mt-3 h-14 rounded-[20px] border-0 bg-[#ff6727] text-[17px] font-bold text-white flex items-center justify-center gap-3 cursor-pointer"
          type="button"
        >
          Sign up
          <span aria-hidden="true">›</span>
        </button>

        <p
          class="mt-1.5 text-right text-[15px] text-black max-[940px]:text-center"
        >
          Already have an account?
          <NuxtLink
            to="/login"
            class="ml-1.5 text-[#ff6727] font-bold no-underline"
            >Log in</NuxtLink
          >
        </p>
      </div>
    </section>
  </main>
</template>
