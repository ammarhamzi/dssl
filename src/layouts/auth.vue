<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { useRouter } from "vue-router";

// Initialize color mode
const mode = useColorMode();
const router = useRouter();

function toggleMode() {
  mode.value = mode.value === "dark" ? "light" : "dark";
}

function navigateTo(path: string) {
  router.push(path);
}
</script>

<template>
  <div class="min-h-svh">
    <div
      class="container relative min-h-svh flex flex-col items-center justify-center px-4 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
    >
      <!-- Theme Toggle Button -->
      <button
        @click="toggleMode"
        class="fixed right-4 top-4 z-50 rounded-lg p-2 hover:bg-muted"
        aria-label="Toggle theme"
      >
        <svg
          v-if="mode === 'dark'"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-6 w-6 text-yellow-300"
        >
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-6 w-6 text-slate-700"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      </button>

      <!-- Left: Logo & Image -->
      <div
        class="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex"
      >
        <div class="absolute inset-0 bg-zinc-900">
          <img
            src="https://imgs.search.brave.com/yIGAdl_QQPQ35P7yzwlqLAV-fxoqEa5YigeaEpLJjFo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcGlj/bXMudGhlc3Rhci5j/b20ubXkvdXBsb2Fk/cy9pbWFnZXMvMjAy/NS8wMS8xNS8zMTE4/MDcwLmpwZw"
            alt="Authentication"
            class="h-full w-full object-cover opacity-30"
          />
        </div>
        <div class="relative z-20 flex items-center text-lg font-medium">
          <img
            src="https://imgs.search.brave.com/BVxLn68bbaAsQl4nkX_f_bmCKTk2UieN5EiaR-L-oJg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzgvMS9tYWxheXNp/YS1haXJwb3J0cy1s/b2dvLXBuZ19zZWVr/bG9nby04NzY4OC5w/bmc"
            alt="Malaysia Airports Logo"
            class="h-16 w-auto rounded-lg"
          />
        </div>
        <div class="relative z-20 mt-auto">
          <div class="space-y-2">
            <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Malaysia Airports 
            </h1>
            <p class="text-slate-300">
              Digital Substations Logbook System
            </p>
          </div>
        </div>
      </div>

      <!-- Right: Auth Content -->
      <div class="py-6 lg:p-8">
        <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <slot />
          
          <!-- Footer with links -->
          <div class="mt-8 text-center text-sm text-muted-foreground">
            <div class="flex justify-center space-x-4">
              <button 
                @click="navigateTo('/about')" 
                class="hover:text-primary transition-colors"
              >
                About Us
              </button>
              <span class="text-muted-foreground/50">|</span>
              <button 
                @click="navigateTo('/privacy-policy')" 
                class="hover:text-primary transition-colors"
              >
                Privacy
              </button>
              <span class="text-muted-foreground/50">|</span>
              <button 
                @click="navigateTo('/terms-of-service')" 
                class="hover:text-primary transition-colors"
              >
                Terms
              </button>
            </div>
            <div class="mt-2 text-xs">
              Made with ❤️ by Infyra Ventures
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 