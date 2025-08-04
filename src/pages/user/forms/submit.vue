<script setup lang="ts">
import { ref, computed } from 'vue';
import BasicSubmissionForm from '@/components/forms/BasicSubmissionForm.vue';
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
  Plus as PlusIcon,
  Eye as EyeIcon
} from "lucide-vue-next";
import { useRouter } from 'vue-router';

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
</script>

<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Inspections</h1>
        <p class="text-muted-foreground mt-1">Submit inspection reports for Digital Substation Log Book System</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" @click="router.push('/user/inspections-stats')">
          <FileTextIcon class="h-4 w-4 mr-2" />
          View Statistics
        </Button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Total Submissions</p>
              <p class="text-2xl font-bold">{{ submissionStats.total }}</p>
            </div>
            <ClipboardCheckIcon class="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Approved</p>
              <p class="text-2xl font-bold text-green-600">{{ submissionStats.approved }}</p>
            </div>
            <CheckCircleIcon class="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Pending</p>
              <p class="text-2xl font-bold text-yellow-600">{{ submissionStats.pending }}</p>
            </div>
            <ClockIcon class="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Under Review</p>
              <p class="text-2xl font-bold text-blue-600">{{ submissionStats.underReview }}</p>
            </div>
            <AlertTriangleIcon class="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- New Inspection Form -->
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <PlusIcon class="h-5 w-5 mr-2" />
              New Inspection Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BasicSubmissionForm />
          </CardContent>
        </Card>
      </div>

      <!-- Recent Submissions Sidebar -->
      <div class="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <FileTextIcon class="h-5 w-5 mr-2" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="submission in recentSubmissions" :key="submission.id" 
                   class="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                   @click="viewSubmission(submission.id)">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="font-medium text-sm">{{ submission.id }}</p>
                    <p class="text-xs text-muted-foreground">{{ submission.site }} - {{ submission.type }}</p>
                  </div>
                  <Badge :variant="getStatusVariant(submission.status)" class="text-xs">
                    {{ formatStatus(submission.status) }}
                  </Badge>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-xs text-muted-foreground">{{ formatDate(submission.date) }}</p>
                  <Button variant="ghost" size="sm">
                    <EyeIcon class="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="mt-6 space-y-2">
              <Button variant="outline" size="sm" class="w-full" @click="router.push('/user/task-status')">
                <ClockIcon class="h-4 w-4 mr-2" />
                View All Tasks
              </Button>
              <Button variant="outline" size="sm" class="w-full" @click="router.push('/user/reports')">
                <FileTextIcon class="h-4 w-4 mr-2" />
                Analysis Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Help & Guidelines -->
        <Card class="mt-6">
          <CardHeader>
            <CardTitle class="text-base">Inspection Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3 text-sm">
              <div>
                <h4 class="font-medium mb-1">Required Information:</h4>
                <ul class="list-disc list-inside text-xs text-muted-foreground space-y-1">
                  <li>Inspector details & credentials</li>
                  <li>Precise geolocation coordinates</li>
                  <li>Site/substation code (APC, SSA, FTA, etc.)</li>
                  <li>Inspection type and findings</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-1">Common Site Codes:</h4>
                <div class="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  <div>APC - Alpha</div>
                  <div>SSA - Sigma</div>
                  <div>FTA - Foxtrot</div>
                  <div>BTA - Beta</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>