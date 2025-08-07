<script setup lang="ts">
import { useRouter } from 'vue-router';
import BatteryMaintenanceForm from '@/components/forms/BatteryMaintenanceForm.vue';

const router = useRouter();

const goBack = () => {
  router.push('/user/inspections/routine');
};
</script>

<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6 sm:mb-8">
      <button 
        @click="goBack"
        class="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <svg class="h-5 w-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        <h1 class="text-xl sm:text-3xl font-bold truncate">Battery Maintenance Log Sheet</h1>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-x-auto">
      <span class="cursor-pointer hover:text-foreground whitespace-nowrap" @click="goBack">Inspections</span>
      <span class="whitespace-nowrap">/</span>
      <span class="cursor-pointer hover:text-foreground whitespace-nowrap" @click="goBack">Routine Inspection</span>
      <span class="whitespace-nowrap">/</span>
      <span class="text-foreground whitespace-nowrap">Battery Maintenance</span>
    </div>

    <!-- Battery Maintenance Form -->
    <BatteryMaintenanceForm />
  </div>
</template> 