<script setup lang="ts">
import { ref } from 'vue';
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
  Settings as SettingsIcon,
  Battery as BatteryIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  FileText as FileTextIcon,
  Zap as ZapIcon,
  Gauge as GaugeIcon,
  CheckSquare as CheckSquareIcon,
  CheckCircle as CheckCircleIcon,
  ClipboardList as ClipboardListIcon
} from "lucide-vue-next";

const router = useRouter();

const goBack = () => {
  router.push('/user/inspections');
};

const selectRoutineType = (type: 'battery' | 'maintenance' | 'checklist') => {
  router.push(`/user/inspections/routine/${type}`);
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
        <SettingsIcon class="h-5 w-5 text-primary flex-shrink-0" />
        <h1 class="text-xl sm:text-2xl font-bold truncate">Sub Menu Routine Inspection Form</h1>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-x-auto">
      <span class="cursor-pointer hover:text-foreground whitespace-nowrap" @click="goBack">Inspections</span>
      <span class="whitespace-nowrap">/</span>
      <span class="cursor-pointer hover:text-foreground whitespace-nowrap" @click="goBack">Routine Inspection</span>
      <span class="whitespace-nowrap">/</span>
      <span class="text-foreground whitespace-nowrap">Select Form</span>
    </div>

    <!-- Routine Inspection Selection -->
    <div class="space-y-8">
      <div class="text-center mb-6 sm:mb-8">
        <h2 class="text-lg sm:text-xl font-semibold mb-2">Choose Routine Inspection Type</h2>
        <p class="text-muted-foreground">Select the specific routine inspection form you need</p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Battery Maintenance Log Sheet -->
        <Card 
          class="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
          @click="selectRoutineType('battery')"
        >
          <CardContent class="p-4 sm:p-6 text-center">
            <div class="flex flex-col items-center space-y-3 sm:space-y-4">
              <!-- Icon -->
              <div class="relative">
                <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
                  <BatteryIcon class="w-8 h-8 sm:w-10 sm:h-10 text-gray-600 dark:text-gray-400" />
                </div>
                <!-- Lightning bolt overlay -->
                <div class="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-100 rounded-full flex items-center justify-center dark:bg-yellow-900">
                  <ZapIcon class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-600 dark:text-yellow-400" />
                </div>
                <!-- Multimeter overlay -->
                <div class="absolute -top-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                  <GaugeIcon class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <!-- Title -->
              <div>
                <h3 class="text-base sm:text-lg font-bold">Battery Maintenance Log Sheet</h3>
                <p class="text-xs sm:text-sm text-muted-foreground mt-1">
                  Comprehensive battery maintenance and monitoring
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Routine Maintenance Work Report -->
        <Card 
          class="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
          @click="selectRoutineType('maintenance')"
        >
          <CardContent class="p-4 sm:p-6 text-center">
            <div class="flex flex-col items-center space-y-3 sm:space-y-4">
              <!-- Icon -->
              <div class="relative">
                <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
                  <ClockIcon class="w-8 h-8 sm:w-10 sm:h-10 text-gray-600 dark:text-gray-400" />
                </div>
                <!-- Wrench overlay -->
                <div class="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center dark:bg-orange-900">
                  <FileTextIcon class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-600 dark:text-orange-400" />
                </div>
                <!-- Calendar overlay -->
                <div class="absolute -top-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900">
                  <CalendarIcon class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <!-- Title -->
              <div>
                <h3 class="text-base sm:text-lg font-bold">Routine Maintenance Work Report</h3>
                <p class="text-xs sm:text-sm text-muted-foreground mt-1">
                  Document routine maintenance activities and work performed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- AM Checklist -->
        <Card 
          class="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
          @click="selectRoutineType('checklist')"
        >
          <CardContent class="p-4 sm:p-6 text-center">
            <div class="flex flex-col items-center space-y-3 sm:space-y-4">
              <!-- Icon -->
              <div class="relative">
                <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
                  <CheckSquareIcon class="w-8 h-8 sm:w-10 sm:h-10 text-gray-600 dark:text-gray-400" />
                </div>
                <!-- Checkmark overlay -->
                <div class="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900">
                  <CheckCircleIcon class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 dark:text-green-400" />
                </div>
                <!-- List overlay -->
                <div class="absolute -top-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 bg-purple-100 rounded-full flex items-center justify-center dark:bg-purple-900">
                  <ClipboardListIcon class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              
              <!-- Title -->
              <div>
                <h3 class="text-base sm:text-lg font-bold">AM Checklist</h3>
                <p class="text-xs sm:text-sm text-muted-foreground mt-1">
                  Morning checklist for daily operations and safety checks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template> 