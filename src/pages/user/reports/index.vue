<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold">Report Analysis</h1>
        <p class="text-muted-foreground mt-1">Comprehensive analysis and insights from inspection data</p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Button variant="outline" @click="generateReport" class="w-full sm:w-auto">
          <FileTextIcon class="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        <Button variant="outline" @click="exportData" class="w-full sm:w-auto">
          <DownloadIcon class="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>

    <!-- Filter Controls -->
    <Card>
      <CardContent class="p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Reports</p>
              <p class="text-2xl sm:text-3xl font-bold">{{ kpis.totalReports }}</p>
              <p class="text-xs text-green-600 mt-1">+8% vs last period</p>
            </div>
            <div class="bg-blue-100 p-2 sm:p-3 rounded-lg dark:bg-blue-900">
              <FileTextIcon class="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Success Rate</p>
              <p class="text-2xl sm:text-3xl font-bold">{{ kpis.successRate }}%</p>
              <p class="text-xs text-green-600 mt-1">+2% vs last period</p>
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
              <p class="text-2xl sm:text-3xl font-bold">{{ kpis.avgResponseTime }}h</p>
              <p class="text-xs text-red-600 mt-1">-1h vs last period</p>
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
              <p class="text-sm font-medium text-muted-foreground">Compliance Score</p>
              <p class="text-2xl sm:text-3xl font-bold">{{ kpis.complianceScore }}%</p>
              <p class="text-xs text-green-600 mt-1">+5% vs last period</p>
            </div>
            <div class="bg-purple-100 p-2 sm:p-3 rounded-lg dark:bg-purple-900">
              <ShieldIcon class="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Charts and Analytics -->
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

    <!-- Recent Reports Table -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center text-base sm:text-lg">
          <TableIcon class="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Recent Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-2 text-xs sm:text-sm font-medium">Report ID</th>
                <th class="text-left p-2 text-xs sm:text-sm font-medium">Site</th>
                <th class="text-left p-2 text-xs sm:text-sm font-medium">Type</th>
                <th class="text-left p-2 text-xs sm:text-sm font-medium">Status</th>
                <th class="text-left p-2 text-xs sm:text-sm font-medium">Date</th>
                <th class="text-left p-2 text-xs sm:text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in recentReports" :key="report.id" class="border-b hover:bg-muted/50">
                <td class="p-2 text-xs sm:text-sm">{{ report.id }}</td>
                <td class="p-2 text-xs sm:text-sm">{{ report.site }}</td>
                <td class="p-2 text-xs sm:text-sm">{{ report.type }}</td>
                <td class="p-2">
                  <Badge :variant="getStatusVariant(report.status)" class="text-xs">
                    {{ report.status }}
                  </Badge>
                </td>
                <td class="p-2 text-xs sm:text-sm">{{ formatDate(report.date) }}</td>
                <td class="p-2">
                  <div class="flex items-center gap-1">
                    <Button variant="ghost" size="sm" @click="viewReport(report.id)">
                      <EyeIcon class="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" @click="downloadReport(report.id)">
                      <DownloadIcon class="h-3 w-3" />
                    </Button>
                  </div>
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
  CheckCircle as CheckCircleIcon,
  Shield as ShieldIcon
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
  qualityScore: 9.2,
  successRate: 98,
  avgResponseTime: 3.5,
  complianceScore: 95
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

// Recent reports for the table
const recentReports = ref([
  { id: 1, site: 'APC-01', type: 'Visual', status: 'approved', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: 2, site: 'SSA-02', type: 'Thermal', status: 'pending', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: 3, site: 'FTA-03', type: 'Electrical', status: 'approved', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: 4, site: 'BTA-01', type: 'Safety', status: 'rejected', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) }
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