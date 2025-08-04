<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, Eye, MessageSquare } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import type { FormSubmission } from '@/types/form-submission';

const props = defineProps<{
  canApprove?: boolean;
}>();

// Sample data (in a real app, this would come from an API)
const submissions = ref<FormSubmission[]>([
  {
    id: 1,
    uuid: 'sub-001',
    inspector_name: 'John Doe',
    inspector_id: 'INS001',
    inspector_email: 'john.doe@mahb.com.my',
    date_time: new Date('2024-01-15T10:30:00'),
    geolocation: '3.149922, 101.694462',
    site: 'APC',
    inspection_type: 'Routine Inspection',
    remarks: 'Regular inspection of electrical systems',
    submitted_by: 1,
    status: 'pending',
    created_at: new Date('2024-01-15T10:30:00'),
    updated_at: new Date('2024-01-15T10:30:00'),
    submitter: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    }
  },
  {
    id: 2,
    uuid: 'sub-002',
    inspector_name: 'Jane Smith',
    inspector_id: 'INS002',
    inspector_email: 'jane.smith@mahb.com.my',
    date_time: new Date('2024-01-14T09:15:00'),
    geolocation: '2.760665, 101.709342',
    site: 'SSA',
    inspection_type: 'Safety Inspection',
    remarks: 'All safety protocols verified and compliant',
    submitted_by: 2,
    status: 'approved',
    reviewed_by: 3,
    reviewed_at: new Date('2024-01-14T15:45:00'),
    review_notes: 'Inspection completed successfully, location verified.',
    created_at: new Date('2024-01-14T09:15:00'),
    updated_at: new Date('2024-01-14T15:45:00'),
    submitter: {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    reviewer: {
      id: 3,
      name: 'Manager Mike',
      email: 'mike@example.com'
    }
  },
  {
    id: 3,
    uuid: 'sub-003',
    inspector_name: 'Bob Wilson',
    inspector_id: 'INS003',
    inspector_email: 'bob.wilson@mahb.com.my',
    date_time: new Date('2024-01-13T08:10:00'),
    geolocation: '2.724394, 101.722041',
    site: 'FTA',
    inspection_type: 'Equipment Inspection',
    remarks: 'Equipment operational status check',
    submitted_by: 4,
    status: 'rejected',
    reviewed_by: 3,
    reviewed_at: new Date('2024-01-13T11:20:00'),
    review_notes: 'Location coordinates do not match selected site. Please verify and resubmit.',
    created_at: new Date('2024-01-13T08:10:00'),
    updated_at: new Date('2024-01-13T11:20:00'),
    submitter: {
      id: 4,
      name: 'Bob Wilson',
      email: 'bob@example.com'
    },
    reviewer: {
      id: 3,
      name: 'Manager Mike',
      email: 'mike@example.com'
    }
  }
]);

// Dialog state
const isReviewDialogOpen = ref(false);
const selectedSubmission = ref<FormSubmission | null>(null);
const reviewAction = ref<'approve' | 'reject'>('approve');
const reviewNotes = ref('');
const isProcessing = ref(false);

// Computed
const pendingCount = computed(() => submissions.value.filter(s => s.status === 'pending').length);
const approvedCount = computed(() => submissions.value.filter(s => s.status === 'approved').length);
const rejectedCount = computed(() => submissions.value.filter(s => s.status === 'rejected').length);

// Methods
function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'approved':
      return 'default';
    case 'rejected':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending':
      return Clock;
    case 'approved':
      return CheckCircle;
    case 'rejected':
      return XCircle;
    default:
      return Clock;
  }
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString();
}

function openReviewDialog(submission: FormSubmission, action: 'approve' | 'reject') {
  selectedSubmission.value = submission;
  reviewAction.value = action;
  reviewNotes.value = '';
  isReviewDialogOpen.value = true;
}

async function submitReview() {
  if (!selectedSubmission.value) return;
  
  try {
    isProcessing.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the submission
    const submission = selectedSubmission.value;
    submission.status = reviewAction.value === 'approve' ? 'approved' : 'rejected';
    submission.reviewed_at = new Date();
    submission.review_notes = reviewNotes.value;
    submission.reviewer = {
      id: 3,
      name: 'Manager Mike',
      email: 'mike@example.com'
    };
    
    toast.success(`Form ${reviewAction.value}d successfully!`);
    isReviewDialogOpen.value = false;
    
  } catch (error) {
    toast.error('Failed to process review');
  } finally {
    isProcessing.value = false;
  }
}

function viewDetails(submission: FormSubmission) {
  // Open view dialog or navigate to details page
  console.log('View details for:', submission);
}

onMounted(() => {
  // In a real app, fetch submissions from API
  console.log('Loading form submissions...');
});
</script>

<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center space-x-2">
            <Clock class="h-5 w-5 text-orange-500" />
            <div>
              <p class="text-sm font-medium text-muted-foreground">Pending</p>
              <p class="text-2xl font-bold">{{ pendingCount }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center space-x-2">
            <CheckCircle class="h-5 w-5 text-green-500" />
            <div>
              <p class="text-sm font-medium text-muted-foreground">Approved</p>
              <p class="text-2xl font-bold">{{ approvedCount }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center space-x-2">
            <XCircle class="h-5 w-5 text-red-500" />
            <div>
              <p class="text-sm font-medium text-muted-foreground">Rejected</p>
              <p class="text-2xl font-bold">{{ rejectedCount }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Submissions Table -->
    <Card>
      <CardHeader>
        <CardTitle>Inspection Form Submissions</CardTitle>
        <CardDescription>
          {{ canApprove ? 'Review and manage inspection form submissions with location data' : 'View inspection form submissions and their status' }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Inspector</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="submission in submissions" :key="submission.id">
              <TableCell>
                <div>
                  <div class="font-medium">{{ submission.inspector_name }}</div>
                  <div class="text-sm text-muted-foreground">{{ submission.inspector_id }}</div>
                  <div class="text-xs text-muted-foreground">{{ submission.inspector_email }}</div>
                </div>
              </TableCell>
              <TableCell>
                <div class="font-medium">{{ submission.inspection_type }}</div>
                <div class="text-sm text-muted-foreground">{{ submission.site }}</div>
              </TableCell>
              <TableCell>
                <div class="font-medium">{{ submission.site }}</div>
                <div class="text-xs font-mono text-muted-foreground">{{ submission.geolocation }}</div>
              </TableCell>
              <TableCell>
                <div class="text-sm">{{ formatDate(submission.date_time) }}</div>
              </TableCell>
              <TableCell>
                <Badge :variant="getStatusBadgeVariant(submission.status)" class="flex items-center gap-1 w-fit">
                  <component :is="getStatusIcon(submission.status)" class="h-3 w-3" />
                  {{ submission.status.charAt(0).toUpperCase() + submission.status.slice(1) }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    @click="viewDetails(submission)"
                  >
                    <Eye class="h-4 w-4" />
                  </Button>
                  
                  <template v-if="canApprove && submission.status === 'pending'">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      class="text-green-600 hover:text-green-700"
                      @click="openReviewDialog(submission, 'approve')"
                    >
                      <CheckCircle class="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      class="text-red-600 hover:text-red-700"
                      @click="openReviewDialog(submission, 'reject')"
                    >
                      <XCircle class="h-4 w-4" />
                    </Button>
                  </template>
                  
                  <Button 
                    v-if="submission.review_notes" 
                    variant="ghost" 
                    size="sm"
                    :title="submission.review_notes"
                  >
                    <MessageSquare class="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Review Dialog -->
    <Dialog v-model:open="isReviewDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {{ reviewAction === 'approve' ? 'Approve' : 'Reject' }} Form Submission
          </DialogTitle>
          <DialogDescription>
            {{ reviewAction === 'approve' ? 'Approve' : 'Reject' }} the form submission from {{ selectedSubmission?.submitter?.name }}.
          </DialogDescription>
        </DialogHeader>
        
        <div v-if="selectedSubmission" class="space-y-4">
          <div class="bg-muted p-4 rounded-lg space-y-2">
            <div><strong>Inspector:</strong> {{ selectedSubmission.inspector_name }}</div>
            <div><strong>Inspector ID:</strong> {{ selectedSubmission.inspector_id }}</div>
            <div><strong>Inspector Email:</strong> {{ selectedSubmission.inspector_email }}</div>
            <div><strong>Date & Time:</strong> {{ formatDate(selectedSubmission.date_time) }}</div>
            <div><strong>Site:</strong> {{ selectedSubmission.site }}</div>
            <div><strong>Geolocation:</strong> {{ selectedSubmission.geolocation }}</div>
            <div><strong>Inspection Type:</strong> {{ selectedSubmission.inspection_type }}</div>
            <div v-if="selectedSubmission.remarks"><strong>Remarks:</strong> {{ selectedSubmission.remarks }}</div>
            <div><strong>Submitted by:</strong> {{ selectedSubmission.submitter?.name }}</div>
          </div>
          
          <div class="space-y-2">
            <Label for="review-notes">{{ reviewAction === 'approve' ? 'Approval' : 'Rejection' }} Notes</Label>
            <Textarea
              id="review-notes"
              v-model="reviewNotes"
              :placeholder="`Add notes for this ${reviewAction}...`"
              class="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            @click="isReviewDialogOpen = false"
            :disabled="isProcessing"
          >
            Cancel
          </Button>
          <Button 
            :variant="reviewAction === 'approve' ? 'default' : 'destructive'"
            @click="submitReview"
            :disabled="isProcessing"
          >
            {{ isProcessing ? 'Processing...' : (reviewAction === 'approve' ? 'Approve' : 'Reject') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>