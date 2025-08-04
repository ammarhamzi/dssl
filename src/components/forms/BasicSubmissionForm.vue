<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, AlertCircle, MapPin, Navigation, Calendar, Camera, FileText, User, MapIcon, ChevronRight, ChevronLeft } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const router = useRouter();
const authStore = useAuthStore();

// Substation/Site data
const substations = ref([
  { id: 'APC', name: 'APC - Airport Central', coordinates: [2.760665, 101.709342], rtu: 'Y', remarks: 'EPS' },
  { id: 'SSA', name: 'SSA - Southern Support Area', coordinates: [2.724394, 101.722041], rtu: 'Y', remarks: 'EPS' },
  { id: 'FTA', name: 'FTA - Forward Technical Area', coordinates: [2.741487, 101.715015], rtu: 'Y', remarks: 'EPS' },
  { id: 'WAC', name: 'WAC - Western Access', coordinates: [2.753038, 101.696910], rtu: 'Y', remarks: 'EPS' },
  { id: 'MOS', name: 'MOS - Mosque', coordinates: [2.786518, 101.677904], rtu: 'Y', remarks: 'EPS' }
]);

// Inspection types
const inspectionTypes = ref([
  'Routine Inspection',
  'Safety Inspection', 
  'Equipment Inspection',
  'Electrical Inspection',
  'Security Inspection',
  'Emergency Systems Check',
  'Maintenance Review',
  'Compliance Audit'
]);

// Form data
const formData = ref({
  // Inspector details
  dateTime: new Date().toISOString(),
  inspectorName: '',
  inspectorId: '',
  inspectorEmail: '',
  inspectorImage: null as File | null,
  
  // Site details
  geolocation: '',
  site: '',
  
  // Inspection details
  inspectionType: '',
  remarks: '',
  inspectionImage: null as File | null
});

// Form state
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const error = ref<string | null>(null);
const isLoadingLocation = ref(false);

// Step management
const currentStep = ref(1);
const totalSteps = 3;

const steps = ref([
  { 
    id: 1, 
    title: 'Inspector Details', 
    icon: User, 
    description: 'Personal information and credentials',
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
    title: 'Inspection Details', 
    icon: FileText, 
    description: 'Inspection type and findings',
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
  return formData.value.inspectionType.trim().length > 0;
});

// Overall validation
const isFormValid = computed(() => {
  return isStep1Valid.value && isStep2Valid.value && isStep3Valid.value;
});

// Current step validation
const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 1: return isStep1Valid.value;
    case 2: return isStep2Valid.value;
    case 3: return isStep3Valid.value;
    default: return false;
  }
});

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
function handleSiteChange(siteId: string) {
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
    console.log('Form submitted:', formData.value);
    
    isSubmitted.value = true;
    toast.success('Form submitted successfully! Waiting for manager approval.');
    
    // Reset form after a delay
    setTimeout(() => {
      formData.value = { name: '', id: '' };
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

function handleInspectionImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formData.value.inspectionImage = file;
    toast.success('Inspection image uploaded');
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

function goToStep(step: number) {
  // Allow going to completed steps or the next incomplete step
  const canGoToStep = step <= currentStep.value || 
                     (step === currentStep.value + 1 && isCurrentStepValid.value);
  
  if (canGoToStep && step >= 1 && step <= totalSteps) {
    // Mark previous steps as completed if moving forward
    if (step > currentStep.value) {
      for (let i = currentStep.value - 1; i < step - 1; i++) {
        steps.value[i].completed = true;
      }
    }
    currentStep.value = step;
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

// Reset form
function resetForm() {
  formData.value = {
    dateTime: new Date().toISOString(),
    inspectorName: '',
    inspectorId: '',
    inspectorEmail: '',
    inspectorImage: null,
    geolocation: '',
    site: '',
    inspectionType: '',
    remarks: '',
    inspectionImage: null
  };
  error.value = null;
  isSubmitted.value = false;
  currentStep.value = 1;
  steps.value.forEach(step => step.completed = false);
}

// Auto-get location on mount
onMounted(() => {
  // Optionally auto-get location when component loads
  // getCurrentLocation();
});
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <MapPin class="h-5 w-5 text-primary" />
          <span>New Inspection Form</span>
        </CardTitle>
        <CardDescription>
          Complete the inspection form with location and site details. A manager will review and approve your submission.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <!-- Success Message -->
        <Alert v-if="isSubmitted" class="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle class="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription class="text-green-800 dark:text-green-200">
            Your form has been submitted successfully! A manager will review it shortly.
          </AlertDescription>
        </Alert>
        
        <!-- Error Message -->
        <Alert v-if="error" variant="destructive" class="mb-6">
          <AlertCircle class="h-4 w-4" />
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>
        
        <!-- Progress Indicator -->
        <div class="mb-8">
          <!-- Progress Bar -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-foreground">Progress</span>
              <span class="text-sm text-muted-foreground">{{ Math.round(progressPercentage) }}% Complete</span>
            </div>
            <div class="w-full bg-muted rounded-full h-2">
              <div 
                class="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out" 
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
          </div>

          <!-- Step Indicators -->
          <div class="flex items-center justify-between">
            <div 
              v-for="(step, index) in steps" 
              :key="step.id"
              class="flex items-center cursor-pointer"
              @click="goToStep(step.id)"
            >
              <!-- Step Circle -->
              <div class="flex items-center">
                <div 
                  class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200"
                  :class="{
                    'bg-primary border-primary text-primary-foreground': step.completed,
                    'bg-primary border-primary text-primary-foreground': currentStep === step.id && isCurrentStepValid,
                    'border-primary text-primary': currentStep === step.id && !isCurrentStepValid,
                    'border-muted-foreground text-muted-foreground': currentStep > step.id && !step.completed,
                    'border-muted text-muted-foreground': currentStep < step.id
                  }"
                >
                  <CheckCircle v-if="step.completed" class="w-5 h-5" />
                  <component v-else :is="step.icon" class="w-5 h-5" />
                </div>
              </div>

              <!-- Step Content -->
              <div class="ml-3 hidden sm:block">
                <p 
                  class="text-sm font-medium transition-colors"
                  :class="{
                    'text-primary': currentStep === step.id,
                    'text-foreground': step.completed,
                    'text-muted-foreground': currentStep !== step.id && !step.completed
                  }"
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

        <form @submit.prevent="submitForm" class="space-y-8">
          <!-- STEP 1: INSPECTOR SECTION -->
          <div v-show="currentStep === 1" class="space-y-6">
            <div class="flex items-center gap-2 text-lg font-semibold text-foreground">
              <User class="h-5 w-5 text-primary" />
              <span>Step 1: Inspector Details</span>
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
                Inspector Image
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
                Upload inspector photo (optional) - JPG, PNG formats supported
              </p>
            </div>
          </div>

          <!-- STEP 2: SITE DETAILS SECTION -->
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

          <!-- STEP 3: INSPECTION DETAILS SECTION -->
          <div v-show="currentStep === 3" class="space-y-6">
            <div class="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FileText class="h-5 w-5 text-primary" />
              <span>Step 3: Inspection Details</span>
            </div>

            <!-- Inspection Type -->
            <div class="space-y-2">
              <Label for="inspectionType" class="text-sm font-medium">
                Inspection Type <span class="text-red-500">*</span>
              </Label>
              <Select 
                v-model="formData.inspectionType" 
                :disabled="isSubmitting || isSubmitted"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select inspection type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="type in inspectionTypes" :key="type" :value="type">
                    {{ type }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground">
                Select the type of inspection being performed
              </p>
            </div>

            <!-- Remarks -->
            <div class="space-y-2">
              <Label for="remarks" class="text-sm font-medium">
                Remarks
              </Label>
              <Textarea
                id="remarks"
                v-model="formData.remarks"
                placeholder="Enter inspection notes, observations, or remarks..."
                :disabled="isSubmitting || isSubmitted"
                class="min-h-[100px] resize-none"
              />
              <p class="text-xs text-muted-foreground">
                Optional notes about the inspection findings or observations
              </p>
            </div>

            <!-- Inspection Image -->
            <div class="space-y-2">
              <Label for="inspectionImage" class="text-sm font-medium">
                Inspection Image
              </Label>
              <div class="flex gap-2">
                <Input
                  id="inspectionImage"
                  type="file"
                  accept="image/*"
                  @change="handleInspectionImageChange"
                  :disabled="isSubmitting || isSubmitted"
                  class="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled
                  title="Upload inspection photo"
                >
                  <Camera class="h-4 w-4" />
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                Upload photos related to the inspection (optional) - JPG, PNG formats supported
              </p>
            </div>
          </div>
          
          <!-- Current User Info -->
          <div class="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
            <p><strong class="text-foreground">Submitted by:</strong> {{ authStore.user?.name }} ({{ authStore.user?.email }})</p>
            <p><strong class="text-foreground">Role:</strong> {{ authStore.user?.user_type }}</p>
          </div>
          
          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between pt-6 border-t border-border">
            <!-- Previous Button -->
            <Button
              type="button"
              variant="outline"
              @click="prevStep"
              :disabled="currentStep === 1 || isSubmitting || isSubmitted"
              class="flex items-center gap-2"
            >
              <ChevronLeft class="w-4 h-4" />
              Previous
            </Button>

            <!-- Step Indicator (Mobile) -->
            <div class="flex items-center gap-2 sm:hidden">
              <span class="text-sm text-muted-foreground">
                {{ currentStep }} of {{ totalSteps }}
              </span>
            </div>

            <!-- Next/Submit Button -->
            <div class="flex gap-3">
              <Button
                v-if="currentStep < totalSteps"
                type="button"
                @click="nextStep"
                :disabled="!isCurrentStepValid || isSubmitting || isSubmitted"
                class="flex items-center gap-2"
              >
                Next
                <ChevronRight class="w-4 h-4" />
              </Button>

              <Button
                v-else
                type="submit"
                :disabled="!isFormValid || isSubmitting || isSubmitted"
                class="flex items-center gap-2"
              >
                <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                <CheckCircle v-else-if="isSubmitted" class="mr-2 h-4 w-4" />
                <span v-if="isSubmitting">Submitting...</span>
                <span v-else-if="isSubmitted">Submitted</span>
                <span v-else>Submit Inspection</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                @click="resetForm"
                :disabled="isSubmitting"
                v-if="!isSubmitted"
                class="hidden sm:flex"
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>