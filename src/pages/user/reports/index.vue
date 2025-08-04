<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Report Analysis</h1>
        <p class="text-muted-foreground mt-1">Comprehensive analysis and insights from inspection data</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" @click="generateReport">
          <FileTextIcon class="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        <Button variant="outline" @click="exportData">
          <DownloadIcon class="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>

    <!-- Filter Controls -->
    <Card>
      <CardContent class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label for="dateRange">Date Range</Label>
            <Select v-model="filters.dateRange">
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="site">Site</Label>
            <Select v-model="filters.site">
              <SelectTrigger>
                <SelectValue placeholder="All sites" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                <SelectItem value="APC">APC - Substation Alpha</SelectItem>
                <SelectItem value="SSA">SSA - Substation Sigma</SelectItem>
                <SelectItem value="FTA">FTA - Substation Foxtrot</SelectItem>
                <SelectItem value="BTA">BTA - Substation Beta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="inspectionType">Inspection Type</Label>
            <Select v-model="filters.inspectionType">
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="visual">Visual Inspection</SelectItem>
                <SelectItem value="thermal">Thermal Inspection</SelectItem>
                <SelectItem value="electrical">Electrical Testing</SelectItem>
                <SelectItem value="safety">Safety Check</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="status">Status</Label>
            <Select v-model="filters.status">
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Key Performance Indicators -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Reports</p>
              <p class="text-3xl font-bold">{{ kpis.totalReports }}</p>
              <p class="text-xs text-green-600 mt-1">+8% vs last period</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg dark:bg-blue-900">
              <FileTextIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Issues Found</p>
              <p class="text-3xl font-bold">{{ kpis.issuesFound }}</p>
              <p class="text-xs text-red-600 mt-1">+3 vs last period</p>
            </div>
            <div class="bg-red-100 p-3 rounded-lg dark:bg-red-900">
              <AlertTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Avg. Response</p>
              <p class="text-3xl font-bold">{{ kpis.avgResponse }}h</p>
              <p class="text-xs text-green-600 mt-1">-1.2h vs last period</p>
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
              <p class="text-sm font-medium text-muted-foreground">Quality Score</p>
              <p class="text-3xl font-bold">{{ kpis.qualityScore }}/10</p>
              <p class="text-xs text-green-600 mt-1">+0.3 vs last period</p>
            </div>
            <div class="bg-green-100 p-3 rounded-lg dark:bg-green-900">
              <StarIcon class="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Charts and Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Performance Trends -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <TrendingUpIcon class="h-5 w-5 mr-2" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Inspection Completion Rate</span>
              <span class="text-sm text-muted-foreground">94%</span>
            </div>
            <div class="w-full bg-muted rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" style="width: 94%"></div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Issue Resolution Rate</span>
              <span class="text-sm text-muted-foreground">89%</span>
            </div>
            <div class="w-full bg-muted rounded-full h-2">
              <div class="bg-green-600 h-2 rounded-full transition-all duration-500" style="width: 89%"></div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">On-time Submission</span>
              <span class="text-sm text-muted-foreground">96%</span>
            </div>
            <div class="w-full bg-muted rounded-full h-2">
              <div class="bg-purple-600 h-2 rounded-full transition-all duration-500" style="width: 96%"></div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Data Quality</span>
              <span class="text-sm text-muted-foreground">92%</span>
            </div>
            <div class="w-full bg-muted rounded-full h-2">
              <div class="bg-yellow-600 h-2 rounded-full transition-all duration-500" style="width: 92%"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Issue Categories -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <PieChartIcon class="h-5 w-5 mr-2" />
            Issue Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="category in issueCategories" :key="category.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: category.color }"></div>
                <span class="text-sm font-medium">{{ category.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-muted-foreground">{{ category.count }}</span>
                <span class="text-sm font-medium">{{ category.percentage }}%</span>
              </div>
            </div>
            <div class="mt-6 h-2 bg-muted rounded-full overflow-hidden flex">
              <div 
                v-for="category in issueCategories" 
                :key="category.name"
                class="h-full transition-all duration-500"
                :style="{ 
                  width: `${category.percentage}%`, 
                  backgroundColor: category.color 
                }"
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Monthly Comparison -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center">
          <BarChart3Icon class="h-5 w-5 mr-2" />
          Monthly Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="month in monthlyData" :key="month.month" class="text-center">
            <h4 class="font-semibold mb-2">{{ month.month }}</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Inspections</span>
                <span class="text-sm font-medium">{{ month.inspections }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Issues</span>
                <span class="text-sm font-medium text-red-600">{{ month.issues }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Avg. Score</span>
                <span class="text-sm font-medium text-green-600">{{ month.avgScore }}/10</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Detailed Report Table -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center">
          <TableIcon class="h-5 w-5 mr-2" />
          Detailed Report Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-3">Date</th>
                <th class="text-left p-3">Site</th>
                <th class="text-left p-3">Inspector</th>
                <th class="text-left p-3">Type</th>
                <th class="text-left p-3">Status</th>
                <th class="text-left p-3">Issues</th>
                <th class="text-left p-3">Score</th>
                <th class="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in detailedReports" :key="report.id" class="border-b hover:bg-muted/50">
                <td class="p-3">{{ formatDate(report.date) }}</td>
                <td class="p-3 font-medium">{{ report.site }}</td>
                <td class="p-3">{{ report.inspector }}</td>
                <td class="p-3">
                  <Badge variant="outline">{{ report.type }}</Badge>
                </td>
                <td class="p-3">
                  <Badge :variant="getStatusVariant(report.status)">
                    {{ report.status }}
                  </Badge>
                </td>
                <td class="p-3">
                  <span :class="report.issues > 0 ? 'text-red-600' : 'text-green-600'">
                    {{ report.issues }}
                  </span>
                </td>
                <td class="p-3">
                  <span :class="report.score >= 8 ? 'text-green-600' : report.score >= 6 ? 'text-yellow-600' : 'text-red-600'">
                    {{ report.score }}/10
                  </span>
                </td>
                <td class="p-3">
                  <div class="flex items-center gap-2">
                    <Button variant="ghost" size="sm" @click="viewReport(report.id)">
                      <EyeIcon class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" @click="downloadReport(report.id)">
                      <DownloadIcon class="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Insights and Recommendations -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center">
          <LightbulbIcon class="h-5 w-5 mr-2" />
          Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-3 text-green-600">Positive Trends</h4>
            <ul class="space-y-2">
              <li class="flex items-start space-x-2">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mt-0.5" />
                <span class="text-sm">Inspection completion rate improved by 8%</span>
              </li>
              <li class="flex items-start space-x-2">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mt-0.5" />
                <span class="text-sm">Average response time reduced by 1.2 hours</span>
              </li>
              <li class="flex items-start space-x-2">
                <CheckCircleIcon class="h-4 w-4 text-green-600 mt-0.5" />
                <span class="text-sm">Quality scores consistently above 9.0</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-3 text-yellow-600">Areas for Improvement</h4>
            <ul class="space-y-2">
              <li class="flex items-start space-x-2">
                <AlertTriangleIcon class="h-4 w-4 text-yellow-600 mt-0.5" />
                <span class="text-sm">Increase focus on electrical safety checks</span>
              </li>
              <li class="flex items-start space-x-2">
                <AlertTriangleIcon class="h-4 w-4 text-yellow-600 mt-0.5" />
                <span class="text-sm">BTA site requires additional attention</span>
              </li>
              <li class="flex items-start space-x-2">
                <AlertTriangleIcon class="h-4 w-4 text-yellow-600 mt-0.5" />
                <span class="text-sm">Consider more frequent thermal inspections</span>
              </li>
            </ul>
          </div>
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText as FileTextIcon,
  Download as DownloadIcon,
  AlertTriangle as AlertTriangleIcon,
  Clock as ClockIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  BarChart3 as BarChart3Icon,
  Table as TableIcon,
  Eye as EyeIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon
} from "lucide-vue-next";
import { toast } from "vue-sonner";

// Filters
const filters = ref({
  dateRange: '30d',
  site: 'all',
  inspectionType: 'all',
  status: 'all'
});

// KPIs
const kpis = ref({
  totalReports: 156,
  issuesFound: 23,
  avgResponse: 2.8,
  qualityScore: 9.2
});

// Issue categories
const issueCategories = ref([
  { name: 'Electrical Safety', count: 8, percentage: 35, color: '#ef4444' },
  { name: 'Equipment Wear', count: 6, percentage: 26, color: '#f97316' },
  { name: 'Documentation', count: 5, percentage: 22, color: '#eab308' },
  { name: 'Environmental', count: 4, percentage: 17, color: '#22c55e' }
]);

// Monthly data
const monthlyData = ref([
  { month: 'January', inspections: 48, issues: 7, avgScore: 9.1 },
  { month: 'February', inspections: 52, issues: 9, avgScore: 8.9 },
  { month: 'March', inspections: 56, issues: 7, avgScore: 9.3 }
]);

// Detailed reports
const detailedReports = ref([
  {
    id: 1,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    site: 'APC-01',
    inspector: 'John Smith',
    type: 'Visual',
    status: 'approved',
    issues: 0,
    score: 9.5
  },
  {
    id: 2,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    site: 'SSA-02',
    inspector: 'Sarah Johnson',
    type: 'Thermal',
    status: 'pending',
    issues: 2,
    score: 8.2
  },
  {
    id: 3,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    site: 'FTA-03',
    inspector: 'Mike Davis',
    type: 'Electrical',
    status: 'approved',
    issues: 1,
    score: 8.8
  },
  {
    id: 4,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    site: 'BTA-01',
    inspector: 'Lisa Wilson',
    type: 'Safety',
    status: 'rejected',
    issues: 5,
    score: 6.5
  }
]);

// Methods
const generateReport = () => {
  toast.success('Report generation started. You will be notified when ready.');
};

const exportData = () => {
  toast.success('Data export started. Download will begin shortly.');
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'approved': return 'success';
    case 'pending': return 'secondary';
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
};

const viewReport = (reportId: number) => {
  toast.info(`Opening report ${reportId} for detailed view`);
};

const downloadReport = (reportId: number) => {
  toast.success(`Downloading report ${reportId}`);
};

onMounted(() => {
  console.log('Report analysis loaded');
});
</script>