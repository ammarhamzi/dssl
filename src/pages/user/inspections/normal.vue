<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BasicSubmissionForm from '@/components/forms/BasicSubmissionForm.vue';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft as ArrowLeftIcon,
  ClipboardList as ClipboardListIcon
} from "lucide-vue-next";

const router = useRouter();

const goBack = () => {
  router.push('/user/inspections');
};
</script>

<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6 sm:mb-8">
      <Button 
        variant="ghost" 
        size="icon" 
        @click="goBack"
        class="h-8 w-8 flex-shrink-0"
      >
        <ArrowLeftIcon class="h-4 w-4" />
      </Button>
      <div class="min-w-0 flex-1">
        <h1 class="text-xl sm:text-3xl font-bold truncate">Normal Inspection</h1>
        <p class="text-muted-foreground mt-1">Submit general inspection reports</p>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-x-auto">
      <span class="cursor-pointer hover:text-foreground whitespace-nowrap" @click="goBack">Inspections</span>
      <span class="whitespace-nowrap">/</span>
      <span class="text-foreground whitespace-nowrap">Normal Inspection</span>
    </div>

    <!-- Form -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center text-base sm:text-lg">
          <ClipboardListIcon class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Normal Inspection Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BasicSubmissionForm />
      </CardContent>
    </Card>
  </div>
</template> 