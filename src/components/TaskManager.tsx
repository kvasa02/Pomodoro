import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Plus, Calendar, ChevronLeft, ChevronRight, Check, Square } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

type TaskView = 'pending' | 'completed';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [view, setView] = useState<TaskView>('pending');
  const [currentDate, setCurrentDate] = useState(new Date());

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => 
    view === 'pending' ? !task.completed : task.completed
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <Card className="p-6 bg-card shadow-soft h-full">
      <div className="space-y-6">
        {/* Header with tabs and date */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={view === 'pending' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setView('pending')}
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Pending
            </Button>
            <Button
              variant={view === 'completed' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setView('completed')}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Completed
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(currentDate)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Add new task */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={addTask}
            disabled={!newTaskTitle.trim()}
            className="px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-6xl mb-4 opacity-20">✓</div>
              <p className="text-sm">No tasks for this day</p>
              {view === 'pending' && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setNewTaskTitle('')}
                  className="mt-2"
                >
                  Add a new task
                </Button>
              )}
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  task.completed 
                    ? 'bg-muted/50 border-muted' 
                    : 'bg-background border-border hover:border-primary/50'
                }`}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-0"
                />
                <span
                  className={`flex-1 text-sm ${
                    task.completed 
                      ? 'line-through text-muted-foreground' 
                      : 'text-foreground'
                  }`}
                >
                  {task.title}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  ×
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Task stats */}
        <div className="flex justify-between text-xs text-muted-foreground pt-4 border-t">
          <span>{tasks.filter(t => !t.completed).length} pending</span>
          <span>{tasks.filter(t => t.completed).length} completed</span>
        </div>
      </div>
    </Card>
  );
} 