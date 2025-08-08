<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardCheck as ClipboardCheckIcon,
  FileText as FileTextIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Settings as SettingsIcon,
  Battery as BatteryIcon,
  ClipboardList as ClipboardListIcon,
  Eye as EyeIcon,
  
} from "lucide-vue-next";

const router = useRouter();

// Sample recent submissions for context
const recentSubmissions = ref([
  {
    id: 'INS-2025-001',
    site: 'APC-01',
    type: 'Visual Inspection',
    status: 'approved',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    inspector: 'Current User'
  },
  {
    id: 'INS-2025-002', 
    site: 'SSA-02',
    type: 'Thermal Inspection',
    status: 'pending',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    inspector: 'Current User'
  },
  {
    id: 'INS-2025-003',
    site: 'FTA-03', 
    type: 'Safety Check',
    status: 'under_review',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    inspector: 'Current User'
  },
  {
    id: 'RIN-2025-001',
    site: 'APC-01',
    type: 'Battery Maintenance',
    status: 'approved',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    inspector: 'Current User'
  }
]);

const submissionStats = computed(() => ({
  total: recentSubmissions.value.length,
  approved: recentSubmissions.value.filter(s => s.status === 'approved').length,
  pending: recentSubmissions.value.filter(s => s.status === 'pending').length,
  underReview: recentSubmissions.value.filter(s => s.status === 'under_review').length
}));

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'approved': return 'success';
    case 'pending': return 'secondary';
    case 'under_review': return 'default';
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
};

const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};

const viewSubmission = (id: string) => {
  console.log('View submission:', id);
  // In a real app, navigate to submission details
};

const selectForm = (formType: 'normal' | 'routine') => {
  if (formType === 'normal') {
    router.push('/user/inspections/normal');
  } else {
    router.push('/user/inspections/routine');
  }
};
</script>

<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold">Inspections</h1>
        <p class="text-muted-foreground mt-1">Submit inspection reports for Digital Substation Log Book System</p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Button variant="outline" @click="router.push('/user/inspections-stats')" class="w-full sm:w-auto">
          <FileTextIcon class="h-4 w-4 mr-2" />
          View Statistics
        </Button>
      </div>
    </div>

    <!-- Form Selection Cards (moved above quick stats) -->
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-xl sm:text-2xl font-bold mb-2">Choose Inspection Type</h2>
        <p class="text-muted-foreground">Select the type of inspection you want to submit</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <!-- Normal Inspections Card -->
        <Card 
          class="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
          @click="selectForm('normal')"
        >
          <CardContent class="p-6 sm:p-8 text-center">
            <div class="flex flex-col items-center space-y-4 sm:space-y-6">
              <!-- Icon -->
              <div class="relative">
                <div class="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                  <ClipboardListIcon class="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <!-- Magnifying glass overlay -->
                <div class="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center dark:bg-yellow-900">
                  <FileTextIcon class="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              
              <!-- Title -->
              <div>
                <h3 class="text-lg sm:text-xl font-bold mb-2">Normal Inspections</h3>
                <p class="text-muted-foreground text-sm">
                  General inspections for various types including safety, equipment, electrical, and security checks
                </p>
              </div>
              
              <!-- Features -->
              <div class="space-y-2 text-sm text-muted-foreground">
                <div class="flex items-center justify-center gap-2">
                  <CheckCircleIcon class="h-4 w-4 text-green-500" />
                  <span>Safety Inspections</span>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <CheckCircleIcon class="h-4 w-4 text-green-500" />
                  <span>Equipment Checks</span>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <CheckCircleIcon class="h-4 w-4 text-green-500" />
                  <span>Electrical Testing</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Routine Inspections Card -->
        <Card 
          class="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
          @click="selectForm('routine')"
        >
          <CardContent class="p-6 sm:p-8 text-center">
            <div class="flex flex-col items-center space-y-4 sm:space-y-6">
              <!-- Icon -->
              <div class="relative">
                <div class="w-20 h-20 sm:w-24 sm:h-24 bg-orange-100 rounded-full flex items-center justify-center dark:bg-orange-900">
                  <SettingsIcon class="w-10 h-10 sm:w-12 sm:h-12 text-orange-600 dark:text-orange-400" />
                </div>
                <!-- Battery overlay -->
                <div class="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900">
                  <BatteryIcon class="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <!-- Title -->
              <div>
                <h3 class="text-lg sm:text-xl font-bold mb-2">Routine Inspections</h3>
                <p class="text-muted-foreground text-sm">
                  Specialized routine maintenance forms including battery maintenance, work reports, and checklists
                </p>
              </div>
              
              <!-- Features -->
              <div class="space-y-2 text-sm text-muted-foreground">
                <div class="flex items-center justify-center gap-2">
                  <CheckCircleIcon class="h-4 w-4 text-green-500" />
                  <span>Battery Maintenance</span>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <CheckCircleIcon class="h-4 w-4 text-green-500" />
                  <span>Work Reports</span>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <CheckCircleIcon class="h-4 w-4 text-green-500" />
                  <span>AM Checklists</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Total Submissions</p>
              <p class="text-xl sm:text-2xl font-bold">{{ submissionStats.total }}</p>
            </div>
            <ClipboardCheckIcon class="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Approved</p>
              <p class="text-xl sm:text-2xl font-bold text-green-600">{{ submissionStats.approved }}</p>
            </div>
            <CheckCircleIcon class="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Pending</p>
              <p class="text-xl sm:text-2xl font-bold text-yellow-600">{{ submissionStats.pending }}</p>
            </div>
            <ClockIcon class="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Under Review</p>
              <p class="text-xl sm:text-2xl font-bold text-blue-600">{{ submissionStats.underReview }}</p>
            </div>
            <AlertTriangleIcon class="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>


    <!-- Recent Submissions -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center text-base sm:text-lg">
          <FileTextIcon class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Recent Submissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-for="submission in recentSubmissions" :key="submission.id" 
               class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileTextIcon class="h-5 w-5 text-primary" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <h4 class="font-medium text-sm sm:text-base truncate">{{ submission.id }}</h4>
                  <Badge :variant="getStatusVariant(submission.status)" class="text-xs">
                    {{ formatStatus(submission.status) }}
                  </Badge>
                </div>
                <div class="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span>{{ submission.site }}</span>
                  <span>•</span>
                  <span>{{ submission.type }}</span>
                  <span>•</span>
                  <span>{{ formatDate(submission.date) }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" @click="viewSubmission(submission.id)">
                <EyeIcon class="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>