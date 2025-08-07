<script setup lang="ts">
import { useRouter } from 'vue-router';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft as ArrowLeftIcon,
  CheckSquare as CheckSquareIcon,
  CheckCircle as CheckCircleIcon
} from "lucide-vue-next";

const router = useRouter();

const goBack = () => {
  router.push('/user/inspections/routine');
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
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <CheckSquareIcon class="h-5 w-5 text-primary flex-shrink-0" />
        <h1 class="text-xl sm:text-3xl font-bold truncate">AM Checklist</h1>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-x-auto">
      <span class="cursor-pointer hover:text-foreground whitespace-nowrap" @click="goBack">Inspections</span>
      <span class="whitespace-nowrap">/</span>
      <span class="cursor-pointer hover:text-foreground whitespace-nowrap" @click="goBack">Routine Inspection</span>
      <span class="whitespace-nowrap">/</span>
      <span class="text-foreground whitespace-nowrap">AM Checklist</span>
    </div>

    <!-- Coming Soon Message -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center text-base sm:text-lg">
          <CheckSquareIcon class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          AM Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="text-center py-12">
          <div class="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <CheckSquareIcon class="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 class="text-lg sm:text-xl font-semibold mb-4">Coming Soon</h3>
          <p class="text-muted-foreground mb-6 max-w-md mx-auto">
            The AM Checklist form is currently under development. 
            This form will provide a comprehensive morning checklist 
            for daily operations and safety checks.
          </p>
          <div class="space-y-3 text-sm text-muted-foreground">
            <p class="flex items-center justify-center gap-2">
              <CheckCircleIcon class="h-4 w-4 text-green-500" />
              Daily safety inspections
            </p>
            <p class="flex items-center justify-center gap-2">
              <CheckCircleIcon class="h-4 w-4 text-green-500" />
              Equipment readiness checks
            </p>
            <p class="flex items-center justify-center gap-2">
              <CheckCircleIcon class="h-4 w-4 text-green-500" />
              Operational procedures
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template> 