<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Inspections Statistics</h1>
        <p class="text-muted-foreground mt-1">Analytics and insights for your inspection activities</p>
      </div>
      <div class="flex items-center gap-2">
        <Select v-model="timeRange">
          <SelectTrigger class="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" @click="refreshData">
          <RefreshCwIcon class="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Inspections</p>
              <p class="text-3xl font-bold">{{ metrics.totalInspections }}</p>
              <p class="text-xs text-green-600 mt-1">+12% from last period</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg dark:bg-blue-900">
              <ClipboardCheckIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Completion Rate</p>
              <p class="text-3xl font-bold">{{ metrics.completionRate }}%</p>
              <p class="text-xs text-green-600 mt-1">+3% from last period</p>
            </div>
            <div class="bg-green-100 p-3 rounded-lg dark:bg-green-900">
              <TrendingUpIcon class="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
              <p class="text-3xl font-bold">{{ metrics.avgResponseTime }}h</p>
              <p class="text-xs text-red-600 mt-1">-2h from last period</p>
            </div>
            <div class="bg-yellow-100 p-3 rounded-lg dark:bg-yellow-900">
              <ClockIcon class="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Approval Rate</p>
              <p class="text-3xl font-bold">{{ metrics.approvalRate }}%</p>
              <p class="text-xs text-green-600 mt-1">+1% from last period</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-lg dark:bg-purple-900">
              <CheckCircleIcon class="h-8 w-8 text-purple-600 dark:text-purple-400" />
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
          <CardTitle class="flex items-center">
            <BarChart3Icon class="h-5 w-5 mr-2" />
            Inspection Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
            <!-- Simple bar chart visualization -->
            <div class="w-full max-w-sm space-y-4">
              <div v-for="(item, index) in trendData" :key="index" class="flex items-center space-x-3">
                <div class="w-16 text-sm text-muted-foreground">{{ item.period }}</div>
                <div class="flex-1 bg-muted rounded-full h-6 relative">
                  <div 
                    class="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500" 
                    :style="{ width: `${(item.value / Math.max(...trendData.map(d => d.value))) * 100}%` }"
                  >
                    <span class="text-white text-xs font-medium">{{ item.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Status Distribution -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <PieChartIcon class="h-5 w-5 mr-2" />
            Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="status in statusDistribution" :key="status.label" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: status.color }"></div>
                <span class="text-sm font-medium">{{ status.label }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-muted-foreground">{{ status.count }}</span>
                <span class="text-sm font-medium">{{ status.percentage }}%</span>
              </div>
            </div>
            <div class="mt-6 space-y-2">
              <div v-for="status in statusDistribution" :key="status.label" class="flex items-center space-x-2">
                <div class="flex-1 bg-muted rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-500" 
                    :style="{ 
                      width: `${status.percentage}%`, 
                      backgroundColor: status.color 
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Site Performance and Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Site Performance -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <MapPinIcon class="h-5 w-5 mr-2" />
            Site Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="site in sitePerformance" :key="site.code" 
                 class="flex items-center justify-between p-3 border rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span class="text-sm font-bold text-primary">{{ site.code }}</span>
                </div>
                <div>
                  <p class="font-medium">{{ site.name }}</p>
                  <p class="text-sm text-muted-foreground">{{ site.inspections }} inspections</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">{{ site.score }}%</p>
                <div class="w-16 bg-muted rounded-full h-2 mt-1">
                  <div 
                    class="h-2 rounded-full transition-all duration-500"
                    :class="site.score >= 90 ? 'bg-green-500' : site.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'"
                    :style="{ width: `${site.score}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Activity -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <ActivityIcon class="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
              <div class="w-2 h-2 rounded-full mt-2" :class="getActivityColor(activity.type)"></div>
              <div class="flex-1">
                <p class="text-sm font-medium">{{ activity.title }}</p>
                <p class="text-xs text-muted-foreground">{{ activity.site }}</p>
                <p class="text-xs text-muted-foreground mt-1">{{ formatTimeAgo(activity.timestamp) }}</p>
              </div>
              <Badge :variant="getActivityBadgeVariant(activity.status)">
                {{ activity.status }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Detailed Statistics Table -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center">
          <TableIcon class="h-5 w-5 mr-2" />
          Detailed Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-2">Site</th>
                <th class="text-left p-2">Total Inspections</th>
                <th class="text-left p-2">Completed</th>
                <th class="text-left p-2">Pending</th>
                <th class="text-left p-2">Approval Rate</th>
                <th class="text-left p-2">Avg. Time</th>
                <th class="text-left p-2">Last Inspection</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in detailedStats" :key="row.site" class="border-b hover:bg-muted/50">
                <td class="p-2 font-medium">{{ row.site }}</td>
                <td class="p-2">{{ row.total }}</td>
                <td class="p-2">
                  <span class="text-green-600">{{ row.completed }}</span>
                </td>
                <td class="p-2">
                  <span class="text-yellow-600">{{ row.pending }}</span>
                </td>
                <td class="p-2">
                  <span :class="row.approvalRate >= 90 ? 'text-green-600' : row.approvalRate >= 70 ? 'text-yellow-600' : 'text-red-600'">
                    {{ row.approvalRate }}%
                  </span>
                </td>
                <td class="p-2">{{ row.avgTime }}h</td>
                <td class="p-2 text-muted-foreground">{{ formatDate(row.lastInspection) }}</td>
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