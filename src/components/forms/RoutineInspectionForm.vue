<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Battery as BatteryIcon,
  Settings as SettingsIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  FileText as FileTextIcon,
  ArrowLeft as ArrowLeftIcon,
  Zap as ZapIcon,
  Gauge as GaugeIcon,
  CheckSquare as CheckSquareIcon
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

// Selected routine inspection type
const selectedRoutineType = ref<'battery' | 'maintenance' | 'checklist' | null>(null);

const selectRoutineType = (type: 'battery' | 'maintenance' | 'checklist') => {
  selectedRoutineType.value = type;
};

const goBack = () => {
  selectedRoutineType.value = null;
};

// Battery maintenance form data (simplified for demo)
const batteryFormData = ref({
  inspectorName: '',
  inspectorId: '',
  site: '',
  batteryType: '',
  voltageReadings: {
    cell1: '',
    cell2: '',
    cell3: '',
    cell4: '',
    cell5: '',
    cell6: ''
  },
  temperature: '',
  electrolyteLevel: '',
  terminalCondition: '',
  correctiveActions: ''
});

const isSubmitting = ref(false);
const isSubmitted = ref(false);

const submitBatteryForm = async () => {
  if (isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    isSubmitted.value = true;
  } catch (err) {
    console.error('Failed to submit form');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <Button 
        v-if="selectedRoutineType" 
        variant="ghost" 
        size="icon" 
        @click="goBack"
        class="h-8 w-8"
      >
        <ArrowLeftIcon class="h-4 w-4" />
      </Button>
      <div class="flex items-center gap-2">
        <SettingsIcon class="h-5 w-5 text-primary" />
        <h1 class="text-2xl font-bold">Sub Menu Routine Inspection Form</h1>
      </div>
    </div>

    <!-- Routine Inspection Selection -->
    <div v-if="!selectedRoutineType" class="space-y-8">
      <div class="text-center mb-8">
        <h2 class="text-xl font-semibold mb-2">Choose Routine Inspection Type</h2>
        <p class="text-muted-foreground">Select the specific routine inspection form you need</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Battery Maintenance Log Sheet -->
        <Card 
          class="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
          @click="selectRoutineType('battery')"
        >
          <CardContent class="p-6 text-center">
            <div class="flex flex-col items-center space-y-4">
              <!-- Icon -->
              <div class="relative">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
                  <BatteryIcon class="w-10 h-10 text-gray-600 dark:text-gray-400" />
                </div>
                <!-- Lightning bolt overlay -->
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center dark:bg-yellow-900">
                  <ZapIcon class="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                </div>
                <!-- Multimeter overlay -->
                <div class="absolute -top-1 -left-1 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                  <GaugeIcon class="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <!-- Title -->
              <div>
                <h3 class="text-lg font-bold">Battery Maintenance Log Sheet</h3>
                <p class="text-sm text-muted-foreground mt-1">
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
          <CardContent class="p-6 text-center">
            <div class="flex flex-col items-center space-y-4">
              <!-- Icon -->
              <div class="relative">
                <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                  <ClockIcon class="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <!-- Calendar overlay -->
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                  <CalendarIcon class="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <!-- Title -->
              <div>
                <h3 class="text-lg font-bold">Routine Maintenance Work Report</h3>
                <p class="text-sm text-muted-foreground mt-1">
                  Scheduled maintenance and work documentation
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
          <CardContent class="p-6 text-center">
            <div class="flex flex-col items-center space-y-4">
              <!-- Icon -->
              <div class="relative">
                <div class="w-20 h-20 bg-brown-100 rounded-full flex items-center justify-center dark:bg-brown-900">
                  <FileTextIcon class="w-10 h-10 text-brown-600 dark:text-brown-400" />
                </div>
                <!-- Clock overlay -->
                <div class="absolute -bottom-1 -left-1 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                  <ClockIcon class="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
                <!-- Checkbox overlay -->
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900">
                  <CheckSquareIcon class="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <!-- Title -->
              <div>
                <h3 class="text-lg font-bold">AM Checklist</h3>
                <p class="text-sm text-muted-foreground mt-1">
                  Morning checklist and daily tasks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Battery Maintenance Form -->
    <div v-else-if="selectedRoutineType === 'battery'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <BatteryIcon class="h-5 w-5 text-primary" />
            Battery Maintenance Log Sheet
          </CardTitle>
          <CardDescription>
            Complete battery maintenance inspection and monitoring form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="submitBatteryForm" class="space-y-6">
            <!-- Inspector Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Inspector Name *</label>
                <input
                  v-model="batteryFormData.inspectorName"
                  type="text"
                  placeholder="Enter inspector name"
                  required
                  class="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Inspector ID *</label>
                <input
                  v-model="batteryFormData.inspectorId"
                  type="text"
                  placeholder="Enter inspector ID"
                  required
                  class="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <!-- Site and Battery Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Site *</label>
                <select v-model="batteryFormData.site" required class="w-full px-3 py-2 border rounded-md">
                  <option value="">Select site</option>
                  <option value="APC">APC - Airport Central</option>
                  <option value="SSA">SSA - Southern Support Area</option>
                  <option value="FTA">FTA - Forward Technical Area</option>
                  <option value="WAC">WAC - Western Access</option>
                  <option value="MOS">MOS - Mosque</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Battery Type *</label>
                <select v-model="batteryFormData.batteryType" required class="w-full px-3 py-2 border rounded-md">
                  <option value="">Select battery type</option>
                  <option value="lead-acid">Lead-Acid</option>
                  <option value="lithium-ion">Lithium-Ion</option>
                  <option value="nickel-cadmium">Nickel-Cadmium</option>
                  <option value="valve-regulated">Valve-Regulated Lead-Acid (VRLA)</option>
                </select>
              </div>
            </div>

            <!-- Voltage Readings -->
            <div class="space-y-4">
              <label class="text-sm font-medium">Voltage Readings (V) *</label>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div v-for="i in 6" :key="i" class="space-y-2">
                  <label class="text-xs">Cell {{ i }}</label>
                  <input
                    v-model="batteryFormData.voltageReadings[`cell${i}` as keyof typeof batteryFormData.voltageReadings]"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    required
                    class="w-full px-3 py-2 border rounded-md text-center"
                  />
                </div>
              </div>
            </div>

            <!-- Temperature and Condition -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Temperature (°C) *</label>
                <input
                  v-model="batteryFormData.temperature"
                  type="number"
                  placeholder="Enter temperature"
                  step="0.1"
                  required
                  class="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Electrolyte Level *</label>
                <select v-model="batteryFormData.electrolyteLevel" required class="w-full px-3 py-2 border rounded-md">
                  <option value="">Select level</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Terminal Condition *</label>
                <select v-model="batteryFormData.terminalCondition" required class="w-full px-3 py-2 border rounded-md">
                  <option value="">Select condition</option>
                  <option value="clean">Clean</option>
                  <option value="corroded">Corroded</option>
                  <option value="loose">Loose</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>
            </div>

            <!-- Corrective Actions -->
            <div class="space-y-2">
              <label class="text-sm font-medium">Corrective Actions Taken</label>
              <textarea
                v-model="batteryFormData.correctiveActions"
                placeholder="Describe any corrective actions taken..."
                rows="4"
                class="w-full px-3 py-2 border rounded-md resize-none"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                @click="goBack"
                :disabled="isSubmitting"
              >
                Back
              </Button>
              
              <Button
                type="submit"
                :disabled="isSubmitting || isSubmitted"
              >
                <span v-if="isSubmitting">Submitting...</span>
                <span v-else-if="isSubmitted">Submitted</span>
                <span v-else>Submit Battery Maintenance Log</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- Routine Maintenance Work Report Form -->
    <div v-else-if="selectedRoutineType === 'maintenance'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <ClockIcon class="h-5 w-5 text-primary" />
            Routine Maintenance Work Report
          </CardTitle>
          <CardDescription>
            Document routine maintenance work and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-center py-12">
            <ClockIcon class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 class="text-lg font-semibold mb-2">Routine Maintenance Work Report</h3>
            <p class="text-muted-foreground mb-6">This form is under development and will be available soon.</p>
            <Button @click="goBack" variant="outline">
              Back to Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- AM Checklist Form -->
    <div v-else-if="selectedRoutineType === 'checklist'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <CheckSquareIcon class="h-5 w-5 text-primary" />
            AM Checklist
          </CardTitle>
          <CardDescription>
            Morning checklist and daily task verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-center py-12">
            <CheckSquareIcon class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 class="text-lg font-semibold mb-2">AM Checklist</h3>
            <p class="text-muted-foreground mb-6">This form is under development and will be available soon.</p>
            <Button @click="goBack" variant="outline">
              Back to Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template> 