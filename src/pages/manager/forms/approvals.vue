<script setup lang="ts">
import FormSubmissionTable from '@/components/forms/FormSubmissionTable.vue';
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Inspection Form Approvals</h1>
        <p class="text-muted-foreground mt-2">Review and approve inspection forms with location and site data from team members</p>
      </div>
      
      <FormSubmissionTable :can-approve="true" />
    </div>
  </div>
</template>