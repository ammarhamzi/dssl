<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p class="text-muted-foreground mt-1">Digital Substation Log Book System</p>
      </div>
      <div class="text-sm text-muted-foreground">
        Last updated: {{ formatDate(new Date()) }}
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Pending Tasks</p>
              <p class="text-xl sm:text-2xl font-bold">{{ stats.pendingTasks }}</p>
            </div>
            <div class="bg-yellow-100 p-2 sm:p-3 rounded-lg dark:bg-yellow-900">
              <ClockIcon class="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Completed Inspections</p>
              <p class="text-xl sm:text-2xl font-bold">{{ stats.completedInspections }}</p>
            </div>
            <div class="bg-green-100 p-2 sm:p-3 rounded-lg dark:bg-green-900">
              <CheckCircleIcon class="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Reports</p>
              <p class="text-xl sm:text-2xl font-bold">{{ stats.totalReports }}</p>
            </div>
            <div class="bg-blue-100 p-2 sm:p-3 rounded-lg dark:bg-blue-900">
              <FileTextIcon class="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Success Rate</p>
              <p class="text-xl sm:text-2xl font-bold">{{ stats.successRate }}%</p>
            </div>
            <div class="bg-purple-100 p-2 sm:p-3 rounded-lg dark:bg-purple-900">
              <TrendingUpIcon class="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card class="cursor-pointer hover:shadow-md transition-shadow" @click="$router.push('/user/inspections')">
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center space-x-3 sm:space-x-4">
            <div class="bg-orange-100 p-2 sm:p-3 rounded-lg dark:bg-orange-900 flex-shrink-0">
              <ClipboardCheckIcon class="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="font-semibold text-sm sm:text-base">New Inspection</h3>
              <p class="text-xs sm:text-sm text-muted-foreground">Submit inspection report</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="cursor-pointer hover:shadow-md transition-shadow" @click="$router.push('/user/todo')">
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center space-x-3 sm:space-x-4">
            <div class="bg-blue-100 p-2 sm:p-3 rounded-lg dark:bg-blue-900 flex-shrink-0">
              <ListChecksIcon class="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="font-semibold text-sm sm:text-base">To Do List</h3>
              <p class="text-xs sm:text-sm text-muted-foreground">Manage your tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="cursor-pointer hover:shadow-md transition-shadow" @click="$router.push('/user/reports')">
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center space-x-3 sm:space-x-4">
            <div class="bg-green-100 p-2 sm:p-3 rounded-lg dark:bg-green-900 flex-shrink-0">
              <BarChart3Icon class="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="font-semibold text-sm sm:text-base">View Reports</h3>
              <p class="text-xs sm:text-sm text-muted-foreground">Analysis & insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity & Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center text-base sm:text-lg">
            <ActivityIcon class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3">
              <div class="w-2 h-2 rounded-full mt-2 flex-shrink-0" :class="getActivityColor(activity.type)"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ activity.title }}</p>
                <p class="text-xs text-muted-foreground">{{ activity.description }}</p>
                <p class="text-xs text-muted-foreground mt-1">{{ formatDate(activity.date) }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Weekly Progress Chart -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center text-base sm:text-lg">
            <TrendingUpIcon class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="(day, index) in weeklyProgress" :key="index" class="flex items-center space-x-3">
              <div class="w-10 sm:w-12 text-xs sm:text-sm text-muted-foreground">{{ day.day }}</div>
              <div class="flex-1 bg-muted rounded-full h-2">
                <div 
                  class="bg-primary h-2 rounded-full transition-all duration-300" 
                  :style="{ width: `${day.progress}%` }"
                ></div>
              </div>
              <div class="w-10 sm:w-12 text-xs sm:text-sm font-medium text-right">{{ day.progress }}%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Upcoming Tasks -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center text-base sm:text-lg">
          <CalendarIcon class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Upcoming Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div v-for="task in upcomingTasks" :key="task.id" 
               class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-2">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 rounded-full flex-shrink-0" :class="getPriorityColor(task.priority)"></div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-sm sm:text-base truncate">{{ task.title }}</p>
                <p class="text-xs sm:text-sm text-muted-foreground">{{ task.description }}</p>
              </div>
            </div>
            <div class="text-left sm:text-right">
              <p class="text-xs sm:text-sm font-medium">{{ formatDate(task.dueDate) }}</p>
              <p class="text-xs text-muted-foreground">{{ task.priority }} priority</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  FileText as FileTextIcon,
  TrendingUp as TrendingUpIcon,
  ClipboardCheck as ClipboardCheckIcon,
  ListChecks as ListChecksIcon,
  BarChart3 as BarChart3Icon,
  Activity as ActivityIcon,
  Calendar as CalendarIcon
} from "lucide-vue-next";

// Dashboard stats
const stats = ref({
  pendingTasks: 8,
  completedInspections: 24,
  totalReports: 156,
  successRate: 94
});

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    type: 'inspection',
    title: 'Substation APC-01 Inspection',
    description: 'Visual inspection completed and submitted for approval',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 2,
    type: 'task',
    title: 'Monthly Safety Report',
    description: 'Task assigned and in progress',
    date: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    id: 3,
    type: 'approval',
    title: 'Equipment Check Approved',
    description: 'SSA-02 equipment inspection approved by manager',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: 4,
    type: 'inspection',
    title: 'Routine Maintenance Check',
    description: 'FTA-03 routine maintenance inspection completed',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
]);

// Weekly progress data
const weeklyProgress = ref([
  { day: 'Mon', progress: 85 },
  { day: 'Tue', progress: 92 },
  { day: 'Wed', progress: 78 },
  { day: 'Thu', progress: 96 },
  { day: 'Fri', progress: 88 },
  { day: 'Sat', progress: 75 },
  { day: 'Sun', progress: 45 }
]);

// Upcoming tasks
const upcomingTasks = ref([
  {
    id: 1,
    title: 'Transformer Inspection',
    description: 'Quarterly transformer inspection for APC-02',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    priority: 'high'
  },
  {
    id: 2,
    title: 'Safety Training Documentation',
    description: 'Complete monthly safety training documentation',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Equipment Calibration',
    description: 'Calibration check for measurement equipment',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    priority: 'low'
  }
]);

// Utility functions
const formatDate = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'inspection':
      return 'bg-blue-500';
    case 'task':
      return 'bg-yellow-500';
    case 'approval':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

// Load dashboard data on mount
onMounted(() => {
  // In a real application, you would fetch this data from an API
  console.log('Dashboard loaded');
});
</script> 