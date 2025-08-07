<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMemoryLeakPrevention } from '@/composables/useMemoryLeakPrevention';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Camera, 
  FileText, 
  User, 
  ChevronRight, 
  ChevronLeft,
  Battery,
  Zap,
  Settings,
  Wrench,
  Shield,
  CheckSquare,
  MapPin,
  Navigation,
  MapIcon
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const router = useRouter();
const authStore = useAuthStore();
const { addTimeout, clearAll } = useMemoryLeakPrevention();

// Battery types
const batteryTypes = ref([
  'Lead Acid',
  'Lithium Ion',
  'Nickel Cadmium',
  'Nickel Metal Hydride',
  'VRLA (Valve Regulated Lead Acid)',
  'Flooded Lead Acid',
  'Gel Cell',
  'AGM (Absorbed Glass Mat)'
]);

// Battery conditions
const batteryConditions = ref([
  'Excellent',
  'Good',
  'Fair',
  'Poor',
  'Critical',
  'Failed'
]);

// Equipment types
const equipmentTypes = ref([
  'Multimeter',
  'Battery Tester',
  'Hydrometer',
  'Load Tester',
  'Charger',
  'Thermal Camera',
  'Voltage Meter',
  'Current Clamp',
  'Temperature Sensor',
  'Other'
]);

// Substation/Site data
const substations = ref([
  { id: 'APC', name: 'APC - Airport Central', coordinates: [2.760665, 101.709342], rtu: 'Y', remarks: 'EPS' },
  { id: 'SSA', name: 'SSA - Southern Support Area', coordinates: [2.724394, 101.722041], rtu: 'Y', remarks: 'EPS' },
  { id: 'FTA', name: 'FTA - Forward Technical Area', coordinates: [2.741487, 101.715015], rtu: 'Y', remarks: 'EPS' },
  { id: 'WAC', name: 'WAC - Western Access', coordinates: [2.753038, 101.696910], rtu: 'Y', remarks: 'EPS' },
  { id: 'MOS', name: 'MOS - Mosque', coordinates: [2.786518, 101.677904], rtu: 'Y', remarks: 'EPS' }
]);

// Form data
const formData = ref({
  // General Info
  dateTime: new Date().toISOString(),
  inspectorName: '',
  inspectorId: '',
  inspectorEmail: '',
  inspectorImage: null as File | null,
  
  // Site details
  geolocation: '',
  site: '',
  
  // Battery Bank Info
  batteryBankName: '',
  batteryBankLocation: '',
  batteryType: '',
  totalBatteries: '',
  batteryCapacity: '',
  batteryVoltage: '',
  installationDate: '',
  
  // Battery Reading
  voltageReadings: [] as Array<{
    batteryNumber: string;
    voltage: string;
    temperature: string;
    specificGravity: string;
  }>,
  
  // Battery Condition
  overallCondition: '',
  visualInspection: '',
  corrosionLevel: '',
  terminalCondition: '',
  caseCondition: '',
  electrolyteLevel: '',
  
  // Equipment Used
  equipmentUsed: [] as string[],
  otherEquipment: '',
  
  // Inspector
  inspectionNotes: '',
  recommendations: '',
  maintenanceImage: null as File | null,
  
  // Verification
  verifiedBy: '',
  verificationDate: '',
  verificationNotes: '',
  
  // Verification SE
  verifiedBySE: '',
  verificationDateSE: '',
  verificationNotesSE: ''
});

// Form state
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const error = ref<string | null>(null);
const isLoadingLocation = ref(false);

// Step management
const currentStep = ref(1);
const totalSteps = 9;

const steps = ref([
  { 
    id: 1, 
    title: 'General Info', 
    icon: FileText, 
    description: 'Basic inspection information',
    completed: false 
  },
  { 
    id: 2, 
    title: 'Site Details', 
    icon: MapIcon, 
    description: 'Location and site information',
    completed: false 
  },
  { 
    id: 3, 
    title: 'Battery Bank Info', 
    icon: Battery, 
    description: 'Battery bank specifications',
    completed: false 
  },
  { 
    id: 4, 
    title: 'Battery Reading', 
    icon: Zap, 
    description: 'Individual battery measurements',
    completed: false 
  },
  { 
    id: 5, 
    title: 'Battery Condition', 
    icon: Settings, 
    description: 'Physical condition assessment',
    completed: false 
  },
  { 
    id: 6, 
    title: 'Equipment Used', 
    icon: Wrench, 
    description: 'Tools and equipment utilized',
    completed: false 
  },
  { 
    id: 7, 
    title: 'Inspector', 
    icon: User, 
    description: 'Inspector notes and recommendations',
    completed: false 
  },
  { 
    id: 8, 
    title: 'Verification', 
    icon: Shield, 
    description: 'Primary verification',
    completed: false 
  },
  { 
    id: 9, 
    title: 'Verification SE', 
    icon: CheckSquare, 
    description: 'Senior engineer verification',
    completed: false 
  }
]);

// Step validation
const isStep1Valid = computed(() => {
  return formData.value.inspectorName.trim().length > 0 && 
         formData.value.inspectorId.trim().length > 0 &&
         formData.value.inspectorEmail.trim().length > 0;
});

const isStep2Valid = computed(() => {
  return formData.value.geolocation.trim().length > 0 && 
         formData.value.site.trim().length > 0;
});

const isStep3Valid = computed(() => {
  return formData.value.batteryBankName.trim().length > 0 && 
         formData.value.batteryBankLocation.trim().length > 0 &&
         formData.value.batteryType.trim().length > 0 &&
         formData.value.totalBatteries.trim().length > 0;
});

const isStep4Valid = computed(() => {
  return formData.value.voltageReadings.length > 0;
});

const isStep5Valid = computed(() => {
  return formData.value.overallCondition.trim().length > 0;
});

const isStep6Valid = computed(() => {
  return formData.value.equipmentUsed.length > 0;
});

const isStep7Valid = computed(() => {
  return formData.value.inspectionNotes.trim().length > 0;
});

const isStep8Valid = computed(() => {
  return formData.value.verifiedBy.trim().length > 0;
});

const isStep9Valid = computed(() => {
  return formData.value.verifiedBySE.trim().length > 0;
});



// Overall validation
const isFormValid = computed(() => {
  return isStep1Valid.value && isStep2Valid.value && isStep3Valid.value && 
         isStep4Valid.value && isStep5Valid.value && isStep6Valid.value && 
         isStep7Valid.value && isStep8Valid.value && isStep9Valid.value;
});

// Current step validation
const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 1: return isStep1Valid.value;
    case 2: return isStep2Valid.value;
    case 3: return isStep3Valid.value;
    case 4: return isStep4Valid.value;
    case 5: return isStep5Valid.value;
    case 6: return isStep6Valid.value;
    case 7: return isStep7Valid.value;
    case 8: return isStep8Valid.value;
    case 9: return isStep9Valid.value;
    default: return false;
  }
});

// Add battery reading
function addBatteryReading() {
  formData.value.voltageReadings.push({
    batteryNumber: '',
    voltage: '',
    temperature: '',
    specificGravity: ''
  });
}

// Remove battery reading
function removeBatteryReading(index: number) {
  formData.value.voltageReadings.splice(index, 1);
}

// Toggle equipment selection
function toggleEquipment(equipment: string) {
  const index = formData.value.equipmentUsed.indexOf(equipment);
  if (index > -1) {
    formData.value.equipmentUsed.splice(index, 1);
  } else {
    formData.value.equipmentUsed.push(equipment);
  }
}

// Get current location
async function getCurrentLocation() {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by this browser.';
    return;
  }

  isLoadingLocation.value = true;
  error.value = null;

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      });
    });

    const { latitude, longitude } = position.coords;
    formData.value.geolocation = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    toast.success('Location captured successfully!');
  } catch (err) {
    error.value = 'Unable to retrieve your location. Please enter manually.';
    toast.error('Failed to get location');
  } finally {
    isLoadingLocation.value = false;
  }
}

// Handle site selection
function handleSiteChange(siteId: any) {
  if (!siteId || typeof siteId !== 'string') return;
  const selectedSite = substations.value.find(s => s.id === siteId);
  if (selectedSite) {
    formData.value.site = siteId;
    // Auto-fill location based on selected site
    formData.value.geolocation = `${selectedSite.coordinates[0]}, ${selectedSite.coordinates[1]}`;
    toast.success(`Location auto-filled for ${selectedSite.name}`);
  }
}

// Get selected site for map display
const selectedSiteData = computed(() => {
  if (!formData.value.site) return null;
  return substations.value.find(s => s.id === formData.value.site);
});

// Get coordinates for map display
const mapCoordinates = computed(() => {
  if (formData.value.geolocation) {
    const coords = formData.value.geolocation.split(',').map(c => parseFloat(c.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      return { lat: coords[0], lng: coords[1] };
    }
  }
  return null;
});

// Submit form
async function submitForm() {
  if (!isFormValid.value || isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    error.value = null;
    
    // Here you would typically make an API call
    // For now, we'll simulate it
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate form submission
    console.log('Battery maintenance form submitted:', formData.value);
    
    isSubmitted.value = true;
    toast.success('Battery maintenance log submitted successfully!');
    
    // Reset form after a delay
    addTimeout(() => {
          // Reset form data
    formData.value = {
      dateTime: new Date().toISOString(),
      inspectorName: '',
      inspectorId: '',
      inspectorEmail: '',
      inspectorImage: null,
      geolocation: '',
      site: '',
      batteryBankName: '',
      batteryBankLocation: '',
      batteryType: '',
      totalBatteries: '',
      batteryCapacity: '',
      batteryVoltage: '',
      installationDate: '',
      voltageReadings: [],
      overallCondition: '',
      visualInspection: '',
      corrosionLevel: '',
      terminalCondition: '',
      caseCondition: '',
      electrolyteLevel: '',
      equipmentUsed: [],
      otherEquipment: '',
      inspectionNotes: '',
      recommendations: '',
      maintenanceImage: null,
      verifiedBy: '',
      verificationDate: '',
      verificationNotes: '',
      verifiedBySE: '',
      verificationDateSE: '',
      verificationNotesSE: ''
    };
      currentStep.value = 1;
      steps.value.forEach(step => step.completed = false);
      isSubmitted.value = false;
    }, 3000);
    
  } catch (err) {
    error.value = 'Failed to submit form. Please try again.';
    toast.error('Failed to submit form');
  } finally {
    isSubmitting.value = false;
  }
}

// Handle file uploads
function handleInspectorImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formData.value.inspectorImage = file;
    toast.success('Inspector image uploaded');
  }
}

function handleMaintenanceImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formData.value.maintenanceImage = file;
    toast.success('Maintenance image uploaded');
  }
}

// Format date and time for display
const formattedDateTime = computed(() => {
  return new Date(formData.value.dateTime).toLocaleString('en-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
});

// Step navigation
function nextStep() {
  if (currentStep.value < totalSteps && isCurrentStepValid.value) {
    steps.value[currentStep.value - 1].completed = true;
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

// Calculate progress percentage
const progressPercentage = computed(() => {
  const completedSteps = steps.value.filter(step => step.completed).length;
  const currentProgress = (completedSteps / totalSteps) * 100;
  
  // Add partial progress for current step if it's valid
  if (isCurrentStepValid.value && !steps.value[currentStep.value - 1].completed) {
    return Math.min(currentProgress + (100 / totalSteps * 0.5), 100);
  }
  
  return currentProgress;
});

// Initialize form
onMounted(() => {
  // Add initial battery reading
  addBatteryReading();
});

// Component lifecycle
onUnmounted(() => {
  clearAll();
});
</script>

<template>
  <div class="min-h-screen bg-background p-4 md:p-8">
    <div class="mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <Battery class="h-8 w-8 text-primary" />
          <h1 class="text-3xl font-bold text-foreground">Battery Maintenance Log Sheet</h1>
        </div>
        <p class="text-muted-foreground">
          Complete battery maintenance inspection and log all readings, conditions, and verifications.
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-foreground">Progress</span>
          <span class="text-sm text-muted-foreground">{{ Math.round(progressPercentage) }}%</span>
        </div>
        <div class="w-full bg-muted rounded-full h-2">
          <div 
            class="bg-primary h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Steps Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-between overflow-x-auto pb-4">
          <div 
            v-for="(step, index) in steps" 
            :key="step.id"
            class="flex items-center"
          >
            <div class="flex items-center">
              <div 
                class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200"
                :class="[
                  step.completed 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : currentStep === step.id
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground text-muted-foreground'
                ]"
              >
                <component 
                  :is="step.icon" 
                  class="h-5 w-5"
                  :class="step.completed ? 'text-primary-foreground' : ''"
                />
              </div>
              
              <div class="ml-3 hidden sm:block">
                <p 
                  class="text-sm font-medium"
                  :class="[
                    step.completed 
                      ? 'text-primary' 
                      : currentStep === step.id
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  ]"
                >
                  {{ step.title }}
                </p>
                <p class="text-xs text-muted-foreground">{{ step.description }}</p>
              </div>

              <!-- Connector -->
              <ChevronRight 
                v-if="index < steps.length - 1" 
                class="w-5 h-5 mx-4 text-muted-foreground hidden sm:block" 
              />
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- STEP 1: GENERAL INFO -->
        <div v-show="currentStep === 1" class="space-y-6">
          <div class="flex items-center gap-2 text-lg font-semibold text-foreground">
            <FileText class="h-5 w-5 text-primary" />
            <span>Step 1: General Information</span>
          </div>

          <!-- Date & Time (Locked) -->
          <div class="space-y-2">
            <Label for="datetime" class="text-sm font-medium">
              Date & Time <span class="text-red-500">*</span>
            </Label>
            <div class="flex gap-2">
              <Input
                id="datetime"
                :value="formattedDateTime"
                type="text"
                :disabled="true"
                class="flex-1 bg-muted"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled
                title="System date and time (auto-locked)"
              >
                <Calendar class="h-4 w-4" />
              </Button>
            </div>
            <p class="text-xs text-muted-foreground">
              System date and time - automatically locked to current timestamp
            </p>
          </div>

          <!-- Inspector Name -->
          <div class="space-y-2">
            <Label for="inspectorName" class="text-sm font-medium">
              Inspector Name <span class="text-red-500">*</span>
            </Label>
            <Input
              id="inspectorName"
              v-model="formData.inspectorName"
              type="text"
              placeholder="Enter inspector's full name"
              :disabled="isSubmitting || isSubmitted"
              required
              class="w-full"
            />
          </div>
          
          <!-- Inspector ID -->
          <div class="space-y-2">
            <Label for="inspectorId" class="text-sm font-medium">
              Inspector ID <span class="text-red-500">*</span>
            </Label>
            <Input
              id="inspectorId"
              v-model="formData.inspectorId"
              type="text"
              placeholder="Enter inspector ID (e.g., INS001, EMP12345)"
              :disabled="isSubmitting || isSubmitted"
              required
              class="w-full"
            />
          </div>

          <!-- Inspector Email -->
          <div class="space-y-2">
            <Label for="inspectorEmail" class="text-sm font-medium">
              Inspector Email <span class="text-red-500">*</span>
            </Label>
            <Input
              id="inspectorEmail"
              v-model="formData.inspectorEmail"
              type="email"
              placeholder="Enter inspector's email address"
              :disabled="isSubmitting || isSubmitted"
              required
              class="w-full"
            />
          </div>

          <!-- Inspector Image -->
          <div class="space-y-2">
            <Label for="inspectorImage" class="text-sm font-medium">
              Inspector Photo
            </Label>
            <div class="flex gap-2">
              <Input
                id="inspectorImage"
                type="file"
                accept="image/*"
                @change="handleInspectorImageChange"
                :disabled="isSubmitting || isSubmitted"
                class="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled
                title="Upload inspector photo"
              >
                <Camera class="h-4 w-4" />
              </Button>
            </div>
            <p class="text-xs text-muted-foreground">
              Upload a photo of the inspector (optional)
            </p>
          </div>
                 </div>

         <!-- STEP 2: SITE DETAILS -->
         <div v-show="currentStep === 2" class="space-y-6">
           <div class="flex items-center gap-2 text-lg font-semibold text-foreground">
             <MapIcon class="h-5 w-5 text-primary" />
             <span>Step 2: Site Details</span>
           </div>

           <!-- Site Selection -->
           <div class="space-y-2">
             <Label for="site" class="text-sm font-medium">
               Site <span class="text-red-500">*</span>
             </Label>
             <Select 
               v-model="formData.site" 
               :disabled="isSubmitting || isSubmitted"
               @update:model-value="handleSiteChange"
             >
               <SelectTrigger>
                 <SelectValue placeholder="Select a site/substation" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem v-for="substation in substations" :key="substation.id" :value="substation.id">
                   <div class="flex flex-col">
                     <span class="font-medium">{{ substation.id }}</span>
                     <span class="text-sm text-muted-foreground">{{ substation.name }}</span>
                   </div>
                 </SelectItem>
               </SelectContent>
             </Select>
             <p class="text-xs text-muted-foreground">
               Select the site/substation - coordinates will be auto-filled
             </p>
           </div>

           <!-- Geolocation Field -->
           <div class="space-y-2">
             <Label for="geolocation" class="text-sm font-medium">
               Geolocation <span class="text-red-500">*</span>
             </Label>
             <div class="flex gap-2">
               <Input
                 id="geolocation"
                 v-model="formData.geolocation"
                 type="text"
                 placeholder="Latitude, Longitude (e.g., 3.149922, 101.694462)"
                 :disabled="isSubmitting || isSubmitted || isLoadingLocation"
                 required
                 class="flex-1"
               />
               <Button
                 type="button"
                 variant="outline"
                 size="icon"
                 @click="getCurrentLocation"
                 :disabled="isSubmitting || isSubmitted || isLoadingLocation"
                 :title="isLoadingLocation ? 'Getting location...' : 'Get current location'"
               >
                 <Loader2 v-if="isLoadingLocation" class="h-4 w-4 animate-spin" />
                 <Navigation v-else class="h-4 w-4" />
               </Button>
             </div>
             <p class="text-xs text-muted-foreground">
               Click the location button to auto-detect or enter coordinates manually
             </p>
           </div>

           <!-- Map Display -->
           <div v-if="mapCoordinates" class="space-y-2">
             <Label class="text-sm font-medium">Location Map</Label>
             <div class="border rounded-lg overflow-hidden bg-muted">
               <div class="h-64 w-full relative">
                 <!-- Map Header -->
                 <div class="absolute top-2 left-2 z-10 bg-background/90 backdrop-blur-sm rounded-md px-3 py-1 text-sm font-medium shadow-sm">
                   <span v-if="selectedSiteData" class="text-foreground">{{ selectedSiteData.name }}</span>
                   <span v-else class="text-muted-foreground">Custom Location</span>
                 </div>
                 
                 <!-- Interactive Map using OpenStreetMap -->
                 <iframe
                   :src="`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoordinates.lng-0.01},${mapCoordinates.lat-0.01},${mapCoordinates.lng+0.01},${mapCoordinates.lat+0.01}&layer=mapnik&marker=${mapCoordinates.lat},${mapCoordinates.lng}`"
                   class="w-full h-full border-0"
                   style="border: none;"
                   allowfullscreen
                 ></iframe>
                 
                 <!-- Fallback: Static Map Display -->
                 <div class="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-muted-foreground">
                   {{ mapCoordinates.lat.toFixed(6) }}, {{ mapCoordinates.lng.toFixed(6) }}
                 </div>
               </div>
             </div>
             <p class="text-xs text-muted-foreground flex items-center gap-1">
               <MapPin class="h-3 w-3" />
               Showing location on map - coordinates auto-updated when site is selected
             </p>
           </div>
         </div>

         <!-- Navigation Buttons -->
        <div class="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            @click="prevStep"
            :disabled="currentStep === 1 || isSubmitting || isSubmitted"
            class="flex items-center gap-2"
          >
            <ChevronLeft class="h-4 w-4" />
            Previous
          </Button>

          <div class="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              @click="nextStep"
              :disabled="!isCurrentStepValid || currentStep === totalSteps || isSubmitting || isSubmitted"
              class="flex items-center gap-2"
            >
              Next
              <ChevronRight class="h-4 w-4" />
            </Button>

            <Button
              type="submit"
              :disabled="!isFormValid || isSubmitting || isSubmitted"
              class="flex items-center gap-2"
            >
              <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
              <CheckCircle v-else class="h-4 w-4" />
              {{ isSubmitting ? 'Submitting...' : 'Submit Form' }}
            </Button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template> 