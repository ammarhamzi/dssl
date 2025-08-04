<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">To Do List</h1>
        <p class="text-muted-foreground mt-1">Manage your tasks and assignments</p>
      </div>
      <Button @click="showAddTask = true" class="flex items-center gap-2">
        <PlusIcon class="h-4 w-4" />
        Add Task
      </Button>
    </div>

    <!-- Task Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Total Tasks</p>
              <p class="text-2xl font-bold">{{ taskStats.total }}</p>
            </div>
            <ListChecksIcon class="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Pending</p>
              <p class="text-2xl font-bold text-yellow-600">{{ taskStats.pending }}</p>
            </div>
            <ClockIcon class="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">In Progress</p>
              <p class="text-2xl font-bold text-blue-600">{{ taskStats.inProgress }}</p>
            </div>
            <PlayIcon class="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Completed</p>
              <p class="text-2xl font-bold text-green-600">{{ taskStats.completed }}</p>
            </div>
            <CheckCircleIcon class="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filter and Search -->
    <Card>
      <CardContent class="p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                v-model="searchQuery"
                placeholder="Search tasks..."
                class="pl-10"
              />
            </div>
          </div>
          <Select v-model="statusFilter">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="priorityFilter">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Tasks List -->
    <div class="space-y-4">
      <div v-for="task in filteredTasks" :key="task.id" class="group">
        <Card class="hover:shadow-md transition-shadow">
          <CardContent class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-4 flex-1">
                <Checkbox 
                  :checked="task.status === 'completed'"
                  @update:checked="toggleTaskStatus(task)"
                  class="mt-1"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold" :class="task.status === 'completed' ? 'line-through text-muted-foreground' : ''">
                      {{ task.title }}
                    </h3>
                    <Badge :variant="getPriorityVariant(task.priority)">
                      {{ task.priority }}
                    </Badge>
                    <Badge :variant="getStatusVariant(task.status)">
                      {{ task.status.replace('-', ' ') }}
                    </Badge>
                  </div>
                  <p class="text-sm text-muted-foreground mb-2">{{ task.description }}</p>
                  <div class="flex items-center gap-4 text-xs text-muted-foreground">
                    <div class="flex items-center gap-1">
                      <CalendarIcon class="h-3 w-3" />
                      <span>Due: {{ formatDate(task.dueDate) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <UserIcon class="h-3 w-3" />
                      <span>Assigned by: {{ task.assignedBy }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <TagIcon class="h-3 w-3" />
                      <span>{{ task.category }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" @click="editTask(task)">
                  <EditIcon class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" @click="deleteTask(task.id)">
                  <TrashIcon class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredTasks.length === 0" class="text-center py-12">
      <ClipboardListIcon class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-xl font-semibold mb-2">No tasks found</h3>
      <p class="text-muted-foreground mb-4">
        {{ searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
           ? 'Try adjusting your filters or search terms.' 
           : 'Get started by adding your first task.' }}
      </p>
      <Button @click="showAddTask = true" v-if="!searchQuery && statusFilter === 'all' && priorityFilter === 'all'">
        <PlusIcon class="h-4 w-4 mr-2" />
        Add Your First Task
      </Button>
    </div>

    <!-- Add/Edit Task Dialog -->
    <Dialog v-model:open="showAddTask">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ editingTask ? 'Edit Task' : 'Add New Task' }}</DialogTitle>
          <DialogDescription>
            {{ editingTask ? 'Update task details below.' : 'Create a new task to track your work.' }}
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="saveTask" class="space-y-4">
          <div>
            <Label for="title">Task Title</Label>
            <Input
              id="title"
              v-model="taskForm.title"
              placeholder="Enter task title"
              required
            />
          </div>
          <div>
            <Label for="description">Description</Label>
            <Textarea
              id="description"
              v-model="taskForm.description"
              placeholder="Enter task description"
              rows="3"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="priority">Priority</Label>
              <Select v-model="taskForm.priority">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="category">Category</Label>
              <Select v-model="taskForm.category">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label for="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              v-model="taskForm.dueDate"
              type="date"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="showAddTask = false">
              Cancel
            </Button>
            <Button type="submit">
              {{ editingTask ? 'Update Task' : 'Create Task' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Plus as PlusIcon,
  ListChecks as ListChecksIcon,
  Clock as ClockIcon,
  Play as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Tag as TagIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  ClipboardList as ClipboardListIcon
} from "lucide-vue-next";
import { toast } from "vue-sonner";

// Task interface
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: Date;
  assignedBy: string;
  createdAt: Date;
}

// Reactive data
const searchQuery = ref('');
const statusFilter = ref('all');
const priorityFilter = ref('all');
const showAddTask = ref(false);
const editingTask = ref<Task | null>(null);

// Sample tasks data
const tasks = ref<Task[]>([
  {
    id: 1,
    title: 'Substation APC-01 Visual Inspection',
    description: 'Perform monthly visual inspection of APC-01 substation equipment',
    status: 'pending',
    priority: 'high',
    category: 'inspection',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    assignedBy: 'Manager Smith',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    title: 'Complete Safety Training Documentation',
    description: 'Update and complete monthly safety training records',
    status: 'in-progress',
    priority: 'medium',
    category: 'training',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    assignedBy: 'HR Department',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 3,
    title: 'Equipment Calibration Report',
    description: 'Review and submit equipment calibration reports for Q1',
    status: 'completed',
    priority: 'low',
    category: 'documentation',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    assignedBy: 'Technical Lead',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    title: 'Transformer Temperature Check',
    description: 'Weekly temperature monitoring for all transformers',
    status: 'pending',
    priority: 'high',
    category: 'inspection',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    assignedBy: 'Operations Manager',
    createdAt: new Date()
  }
]);

// Task form
const taskForm = ref({
  title: '',
  description: '',
  priority: 'medium',
  category: 'inspection',
  dueDate: new Date().toISOString().split('T')[0]
});

// Computed properties
const taskStats = computed(() => ({
  total: tasks.value.length,
  pending: tasks.value.filter(t => t.status === 'pending').length,
  inProgress: tasks.value.filter(t => t.status === 'in-progress').length,
  completed: tasks.value.filter(t => t.status === 'completed').length
}));

const filteredTasks = computed(() => {
  let filtered = tasks.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.category.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(task => task.status === statusFilter.value);
  }

  // Filter by priority
  if (priorityFilter.value !== 'all') {
    filtered = filtered.filter(task => task.priority === priorityFilter.value);
  }

  return filtered.sort((a, b) => {
    // Sort by due date (earliest first)
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
});

// Methods
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

const getPriorityVariant = (priority: string) => {
  switch (priority) {
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
    case 'pending': return 'secondary';
    default: return 'secondary';
  }
};

const toggleTaskStatus = (task: Task) => {
  if (task.status === 'completed') {
    task.status = 'pending';
  } else {
    task.status = 'completed';
  }
  toast.success(`Task marked as ${task.status === 'completed' ? 'completed' : 'pending'}`);
};

const editTask = (task: Task) => {
  editingTask.value = task;
  taskForm.value = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    category: task.category,
    dueDate: task.dueDate.toISOString().split('T')[0]
  };
  showAddTask.value = true;
};

const deleteTask = (taskId: number) => {
  const index = tasks.value.findIndex(t => t.id === taskId);
  if (index !== -1) {
    tasks.value.splice(index, 1);
    toast.success('Task deleted successfully');
  }
};

const saveTask = () => {
  if (editingTask.value) {
    // Update existing task
    Object.assign(editingTask.value, {
      title: taskForm.value.title,
      description: taskForm.value.description,
      priority: taskForm.value.priority,
      category: taskForm.value.category,
      dueDate: new Date(taskForm.value.dueDate)
    });
    toast.success('Task updated successfully');
  } else {
    // Create new task
    const newTask: Task = {
      id: Math.max(...tasks.value.map(t => t.id)) + 1,
      title: taskForm.value.title,
      description: taskForm.value.description,
      status: 'pending',
      priority: taskForm.value.priority as 'low' | 'medium' | 'high',
      category: taskForm.value.category,
      dueDate: new Date(taskForm.value.dueDate),
      assignedBy: 'Self',
      createdAt: new Date()
    };
    tasks.value.push(newTask);
    toast.success('Task created successfully');
  }

  // Reset form
  resetForm();
};

const resetForm = () => {
  showAddTask.value = false;
  editingTask.value = null;
  taskForm.value = {
    title: '',
    description: '',
    priority: 'medium',
    category: 'inspection',
    dueDate: new Date().toISOString().split('T')[0]
  };
};

onMounted(() => {
  console.log('Todo list loaded');
});
</script>