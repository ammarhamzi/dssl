<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold">Inspections Statistics</h1>
        <p class="text-muted-foreground mt-1">Analytics and insights for your inspection activities</p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Select v-model="timeRange" class="w-full sm:w-[180px]">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" @click="refreshData" class="w-full sm:w-auto">
          <RefreshCwIcon class="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Inspections</p>
              <p class="text-2xl sm:text-3xl font-bold">{{ metrics.totalInspections }}</p>
              <p class="text-xs text-green-600 mt-1">+12% from last period</p>
            </div>
            <div class="bg-blue-100 p-2 sm:p-3 rounded-lg dark:bg-blue-900">
              <ClipboardCheckIcon class="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Completion Rate</p>
              <p class="text-2xl sm:text-3xl font-bold">{{ metrics.completionRate }}%</p>
              <p class="text-xs text-green-600 mt-1">+3% from last period</p>
            </div>
            <div class="bg-green-100 p-2 sm:p-3 rounded-lg dark:bg-green-900">
              <TrendingUpIcon class="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
              <p class="text-2xl sm:text-3xl font-bold">{{ metrics.avgResponseTime }}h</p>
              <p class="text-xs text-red-600 mt-1">-2h from last period</p>
            </div>
            <div class="bg-yellow-100 p-2 sm:p-3 rounded-lg dark:bg-yellow-900">
              <ClockIcon class="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Approval Rate</p>
              <p class="text-2xl sm:text-3xl font-bold">{{ metrics.approvalRate }}%</p>
              <p class="text-xs text-green-600 mt-1">+1% from last period</p>
            </div>
            <div class="bg-purple-100 p-2 sm:p-3 rounded-lg dark:bg-purple-900">
              <CheckCircleIcon class="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Inspection Trends Chart -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center text-base sm:text-lg">
            <BarChart3Icon class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Inspection Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-64 sm:h-80">
            <!-- Chart placeholder -->
            <div class="w-full h-full bg-muted rounded-lg flex items-center justify-center">
              <div class="text-center">
                <BarChart3Icon class="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p class="text-sm text-muted-foreground">Chart visualization</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Site Performance Chart -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center text-base sm:text-lg">
            <PieChartIcon class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Site Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-64 sm:h-80">
            <!-- Chart placeholder -->
            <div class="w-full h-full bg-muted rounded-lg flex items-center justify-center">
              <div class="text-center">
                <PieChartIcon class="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p class="text-sm text-muted-foreground">Chart visualization</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Performance Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Inspection Types Distribution -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center text-base sm:text-lg">
            <PieChartIcon class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Inspection Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="type in inspectionTypes" :key="type.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: type.color }"></div>
                <span class="text-sm font-medium">{{ type.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-muted-foreground">{{ type.count }}</span>
                <span class="text-sm font-medium">{{ type.percentage }}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Site Performance -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center text-base sm:text-lg">
            <MapPinIcon class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Site Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="site in sitePerformance" :key="site.name" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">{{ site.name }}</span>
                <span class="text-sm text-muted-foreground">{{ site.score }}/10</span>
              </div>
              <div class="w-full bg-muted rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  :class="getScoreColor(site.score)"
                  :style="{ width: `${site.score * 10}%` }"
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
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
    </div>

    <!-- Detailed Statistics Table -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center text-base sm:text-lg">
          <TableIcon class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Detailed Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-2 text-xs sm:text-sm font-medium">Site</th>
                <th class="text-left p-2 text-xs sm:text-sm font-medium">Inspections</th>
                <th class="text-left p-2 text-xs sm:text-sm font-medium">Completion Rate</th>
                <th class="text-left p-2 text-xs sm:text-sm font-medium">Avg. Score</th>
                <th class="text-left p-2 text-xs sm:text-sm font-medium">Issues Found</th>
                <th class="text-left p-2 text-xs sm:text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stat in detailedStats" :key="stat.site" class="border-b hover:bg-muted/50">
                <td class="p-2 text-xs sm:text-sm font-medium">{{ stat.site }}</td>
                <td class="p-2 text-xs sm:text-sm">{{ stat.inspections }}</td>
                <td class="p-2 text-xs sm:text-sm">{{ stat.completionRate }}%</td>
                <td class="p-2 text-xs sm:text-sm">{{ stat.avgScore }}/10</td>
                <td class="p-2 text-xs sm:text-sm">{{ stat.issuesFound }}</td>
                <td class="p-2">
                  <Badge :variant="getStatusVariant(stat.status)" class="text-xs">
                    {{ stat.status }}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  RefreshCw as RefreshCwIcon,
  ClipboardCheck as ClipboardCheckIcon,
  TrendingUp as TrendingUpIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  MapPin as MapPinIcon,
  Activity as ActivityIcon,
  Table as TableIcon
} from "lucide-vue-next";
import { toast } from "vue-sonner";

// Reactive data
const timeRange = ref('30d');

// Metrics
const metrics = ref({
  totalInspections: 156,
  completionRate: 94,
  avgResponseTime: 2.5,
  approvalRate: 96
});

// Trend data for chart
const trendData = ref([
  { period: 'Week 1', value: 25 },
  { period: 'Week 2', value: 32 },
  { period: 'Week 3', value: 28 },
  { period: 'Week 4', value: 35 },
  { period: 'Week 5', value: 42 }
]);

// Status distribution
const statusDistribution = ref([
  { label: 'Approved', count: 89, percentage: 57, color: '#22c55e' },
  { label: 'Pending', count: 25, percentage: 16, color: '#eab308' },
  { label: 'In Review', count: 31, percentage: 20, color: '#3b82f6' },
  { label: 'Rejected', count: 11, percentage: 7, color: '#ef4444' }
]);

// Site performance data
const sitePerformance = ref([
  { code: 'APC', name: 'Substation Alpha', inspections: 45, score: 96 },
  { code: 'SSA', name: 'Substation Sigma', inspections: 38, score: 92 },
  { code: 'FTA', name: 'Substation Foxtrot', inspections: 41, score: 88 },
  { code: 'BTA', name: 'Substation Beta', inspections: 32, score: 85 }
]);

// Recent activity
const recentActivity = ref([
  {
    id: 1,
    type: 'completed',
    title: 'Transformer inspection completed',
    site: 'APC-01',
    status: 'approved',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    type: 'submitted',
    title: 'Safety equipment check submitted',
    site: 'SSA-02',
    status: 'pending',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: 3,
    type: 'approved',
    title: 'Visual inspection approved',
    site: 'FTA-03',
    status: 'approved',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: 4,
    type: 'rejected',
    title: 'Documentation needs revision',
    site: 'BTA-01',
    status: 'rejected',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
  }
]);

// Detailed statistics table data
const detailedStats = ref([
  {
    site: 'APC-01',
    total: 45,
    completed: 42,
    pending: 3,
    approvalRate: 96,
    avgTime: 2.1,
    lastInspection: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    site: 'SSA-02',
    total: 38,
    completed: 35,
    pending: 3,
    approvalRate: 92,
    avgTime: 2.8,
    lastInspection: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    site: 'FTA-03',
    total: 41,
    completed: 36,
    pending: 5,
    approvalRate: 88,
    avgTime: 3.2,
    lastInspection: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    site: 'BTA-01',
    total: 32,
    completed: 27,
    pending: 5,
    approvalRate: 85,
    avgTime: 3.8,
    lastInspection: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
]);

// Methods
const refreshData = () => {
  toast.success('Data refreshed successfully');
  // In a real app, you would fetch new data from the API
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'completed': return 'bg-green-500';
    case 'submitted': return 'bg-blue-500';
    case 'approved': return 'bg-green-500';
    case 'rejected': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getActivityBadgeVariant = (status: string) => {
  switch (status) {
    case 'approved': return 'success';
    case 'pending': return 'secondary';
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
};

onMounted(() => {
  console.log('Inspection statistics loaded');
});
</script>