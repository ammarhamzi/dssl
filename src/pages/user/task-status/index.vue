<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold">Task Status</h1>
        <p class="text-muted-foreground mt-1">Track and monitor your assigned tasks and their progress</p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Button variant="outline" @click="refreshTasks" class="w-full sm:w-auto">
          <RefreshCwIcon class="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button @click="showFilters = !showFilters" class="w-full sm:w-auto">
          <FilterIcon class="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>

    <!-- Filter Panel -->
    <Card v-if="showFilters">
      <CardContent class="p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label for="statusFilter">Status</Label>
            <Select v-model="filters.status">
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="priorityFilter">Priority</Label>
            <Select v-model="filters.priority">
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="assignedBy">Assigned By</Label>
            <Select v-model="filters.assignedBy">
              <SelectTrigger>
                <SelectValue placeholder="All assigners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assigners</SelectItem>
                <SelectItem value="manager-smith">Manager Smith</SelectItem>
                <SelectItem value="hr-dept">HR Department</SelectItem>
                <SelectItem value="technical-lead">Technical Lead</SelectItem>
                <SelectItem value="operations">Operations Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="category">Category</Label>
            <Select v-model="filters.category">
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Status Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Not Started</p>
              <p class="text-xl sm:text-2xl font-bold text-gray-600">{{ statusCounts.notStarted }}</p>
            </div>
            <CircleIcon class="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">In Progress</p>
              <p class="text-xl sm:text-2xl font-bold text-blue-600">{{ statusCounts.inProgress }}</p>
            </div>
            <PlayIcon class="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Under Review</p>
              <p class="text-xl sm:text-2xl font-bold text-yellow-600">{{ statusCounts.underReview }}</p>
            </div>
            <EyeIcon class="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Completed</p>
              <p class="text-xl sm:text-2xl font-bold text-green-600">{{ statusCounts.completed }}</p>
            </div>
            <CheckCircleIcon class="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Overdue</p>
              <p class="text-xl sm:text-2xl font-bold text-red-600">{{ statusCounts.overdue }}</p>
            </div>
            <AlertTriangleIcon class="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Task List -->
    <div class="space-y-4">
      <div v-for="task in filteredTasks" :key="task.id" 
           class="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <div class="flex-shrink-0">
              <div class="w-3 h-3 rounded-full" :class="getPriorityColor(task.priority)"></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h3 class="font-medium text-sm sm:text-base truncate">{{ task.title }}</h3>
                <Badge :variant="getStatusVariant(task.status)" class="text-xs">
                  {{ task.status.replace('-', ' ') }}
                </Badge>
                <Badge :variant="getPriorityVariant(task.priority)" class="text-xs">
                  {{ task.priority }}
                </Badge>
              </div>
              <p class="text-xs sm:text-sm text-muted-foreground mb-2">{{ task.description }}</p>
              <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span class="flex items-center gap-1">
                  <CalendarIcon class="h-3 w-3" />
                  Due: {{ formatDate(task.dueDate) }}
                </span>
                <span class="flex items-center gap-1">
                  <UserIcon class="h-3 w-3" />
                  {{ task.assignedBy }}
                </span>
                <span class="flex items-center gap-1">
                  <TagIcon class="h-3 w-3" />
                  {{ task.category }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" @click="viewTaskDetails(task)">
              <EyeIcon class="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" @click="updateTaskStatus(task.id)">
              <EditIcon class="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredTasks.length === 0" class="text-center py-12">
      <div class="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
        <ClipboardListIcon class="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-semibold mb-2">No tasks found</h3>
      <p class="text-muted-foreground mb-4">Try adjusting your filters or check back later</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  RefreshCw as RefreshCwIcon,
  Filter as FilterIcon,
  Circle as CircleIcon,
  Play as PlayIcon,
  Eye as EyeIcon,
  CheckCircle as CheckCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  TrendingUp as ProgressIcon,
  List as ListIcon,
  User as UserIcon,
  Calendar as CalendarIcon,
  Tag as TagIcon,
  Clock as ClockIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Paperclip as PaperclipIcon,
  ClipboardList as ClipboardListIcon
} from "lucide-vue-next";
import { toast } from "vue-sonner";

// Task interface
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'under-review' | 'completed' | 'overdue';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  assignedBy: string;
  dueDate: Date;
  progress: number;
  attachments?: Array<{ name: string; url: string }>;
  createdAt: Date;
}

// Reactive data
const showFilters = ref(false);
const filters = ref({
  status: 'all',
  priority: 'all',
  assignedBy: 'all',
  category: 'all'
});

// Sample tasks data
const tasks = ref<Task[]>([
  {
    id: 1,
    title: 'Substation APC-01 Monthly Inspection',
    description: 'Perform comprehensive monthly inspection of APC-01 substation including visual checks, thermal scanning, and equipment testing.',
    status: 'in-progress',
    priority: 'high',
    category: 'inspection',
    assignedBy: 'Manager Smith',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    progress: 65,
    attachments: [
      { name: 'inspection_checklist.pdf', url: '#' },
      { name: 'safety_guidelines.pdf', url: '#' }
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    title: 'Safety Training Documentation Update',
    description: 'Update and review safety training materials for Q2 compliance requirements.',
    status: 'not-started',
    priority: 'medium',
    category: 'training',
    assignedBy: 'HR Department',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 3,
    title: 'Equipment Calibration Report Review',
    description: 'Review and approve quarterly equipment calibration reports for all measurement devices.',
    status: 'completed',
    priority: 'low',
    category: 'documentation',
    assignedBy: 'Technical Lead',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    progress: 100,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    title: 'Emergency Response Drill Planning',
    description: 'Plan and coordinate quarterly emergency response drill for all substation locations.',
    status: 'under-review',
    priority: 'high',
    category: 'safety',
    assignedBy: 'Operations Manager',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    progress: 90,
    attachments: [
      { name: 'drill_plan.docx', url: '#' }
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 5,
    title: 'Transformer Oil Analysis',
    description: 'Collect and analyze transformer oil samples from all high-voltage transformers.',
    status: 'overdue',
    priority: 'urgent',
    category: 'maintenance',
    assignedBy: 'Manager Smith',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    progress: 30,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  }
]);

// Computed properties
const statusCounts = computed(() => ({
  notStarted: tasks.value.filter(t => t.status === 'not-started').length,
  inProgress: tasks.value.filter(t => t.status === 'in-progress').length,
  underReview: tasks.value.filter(t => t.status === 'under-review').length,
  completed: tasks.value.filter(t => t.status === 'completed').length,
  overdue: tasks.value.filter(t => t.status === 'overdue').length
}));

const overallProgress = computed(() => {
  const totalTasks = tasks.value.length;
  const completedTasks = tasks.value.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.value.filter(t => t.status === 'overdue').length;
  const completion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return {
    totalTasks,
    completedTasks,
    overdueTasks,
    completion
  };
});

const filteredTasks = computed(() => {
  let filtered = tasks.value;

  if (filters.value.status !== 'all') {
    filtered = filtered.filter(task => task.status === filters.value.status);
  }

  if (filters.value.priority !== 'all') {
    filtered = filtered.filter(task => task.priority === filters.value.priority);
  }

  if (filters.value.assignedBy !== 'all') {
    const assignerMap: Record<string, string> = {
      'manager-smith': 'Manager Smith',
      'hr-dept': 'HR Department',
      'technical-lead': 'Technical Lead',
      'operations': 'Operations Manager'
    };
    const assignerName = assignerMap[filters.value.assignedBy];
    if (assignerName) {
      filtered = filtered.filter(task => task.assignedBy === assignerName);
    }
  }

  if (filters.value.category !== 'all') {
    filtered = filtered.filter(task => task.category === filters.value.category);
  }

  return filtered.sort((a, b) => {
    // Sort by priority first, then by due date
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
});

const hasActiveFilters = computed(() => {
  return filters.value.status !== 'all' || 
         filters.value.priority !== 'all' || 
         filters.value.assignedBy !== 'all' || 
         filters.value.category !== 'all';
});

// Methods
const refreshTasks = () => {
  toast.success('Tasks refreshed successfully');
};

const clearFilters = () => {
  filters.value = {
    status: 'all',
    priority: 'all',
    assignedBy: 'all',
    category: 'all'
  };
};

const formatDate = (date: Date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString();
  }
};

const formatStatus = (status: string) => {
  return status.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const getTimeRemaining = (dueDate: Date) => {
  const now = new Date();
  const diffInMs = dueDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) {
    return `${Math.abs(diffInDays)} days overdue`;
  } else if (diffInDays === 0) {
    return 'Due today';
  } else if (diffInDays === 1) {
    return 'Due tomorrow';
  } else {
    return `${diffInDays} days remaining`;
  }
};

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'secondary';
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in-progress': return 'default';
    case 'under-review': return 'secondary';
    case 'overdue': return 'destructive';
    case 'not-started': return 'outline';
    default: return 'secondary';
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 100) return 'bg-green-500';
  if (progress >= 75) return 'bg-blue-500';
  if (progress >= 50) return 'bg-yellow-500';
  if (progress >= 25) return 'bg-orange-500';
  return 'bg-red-500';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'not-started': return CircleIcon;
    case 'in-progress': return PlayIcon;
    case 'under-review': return EyeIcon;
    case 'completed': return CheckCircleIcon;
    case 'overdue': return AlertTriangleIcon;
    default: return CircleIcon;
  }
};

const getStatusIconBackground = (status: string) => {
  switch (status) {
    case 'not-started': return 'bg-gray-100 dark:bg-gray-800';
    case 'in-progress': return 'bg-blue-100 dark:bg-blue-900';
    case 'under-review': return 'bg-yellow-100 dark:bg-yellow-900';
    case 'completed': return 'bg-green-100 dark:bg-green-900';
    case 'overdue': return 'bg-red-100 dark:bg-red-900';
    default: return 'bg-gray-100 dark:bg-gray-800';
  }
};

const getStatusIconColor = (status: string) => {
  switch (status) {
    case 'not-started': return 'text-gray-600 dark:text-gray-400';
    case 'in-progress': return 'text-blue-600 dark:text-blue-400';
    case 'under-review': return 'text-yellow-600 dark:text-yellow-400';
    case 'completed': return 'text-green-600 dark:text-green-400';
    case 'overdue': return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

const startTask = (taskId: number) => {
  const task = tasks.value.find(t => t.id === taskId);
  if (task) {
    task.status = 'in-progress';
    task.progress = 10; // Initial progress
    toast.success('Task started successfully');
  }
};

const updateProgress = (taskId: number) => {
  toast.info('Progress update dialog would open here');
};

const submitForReview = (taskId: number) => {
  const task = tasks.value.find(t => t.id === taskId);
  if (task) {
    task.status = 'under-review';
    toast.success('Task submitted for review');
  }
};

const viewTaskDetails = (task: Task) => {
  toast.info(`Opening detailed view for task ${task.id}`);
};

const viewAttachments = (taskId: number) => {
  toast.info(`Opening attachments for task ${taskId}`);
};

const updateTaskStatus = (taskId: number) => {
  toast.info(`Updating status for task ${taskId}`);
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 dark:bg-red-900';
    case 'high': return 'bg-orange-100 dark:bg-orange-900';
    case 'medium': return 'bg-yellow-100 dark:bg-yellow-900';
    case 'low': return 'bg-green-100 dark:bg-green-900';
    default: return 'bg-gray-100 dark:bg-gray-800';
  }
};

onMounted(() => {
  console.log('Task status page loaded');
});
</script>