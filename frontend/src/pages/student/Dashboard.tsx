import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  ClipboardList,
  CheckCircle,
  Star,
  ChevronRight,
  Sparkles,
  Image,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { assignmentsApi, submissionsApi, Assignment } from "@/lib/api";

interface Task {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  priority?: "high" | "medium" | "low";
  grade?: number;
}

const mockGallery = [
  { id: 1, title: "My Garden", image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=200&h=200&fit=crop" },
  { id: 2, title: "Family Portrait", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop" },
  { id: 3, title: "Space Adventure", image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=200&fit=crop" },
  { id: 4, title: "Ocean Life", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop" },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assignments and submissions
        const [assignments, submissions] = await Promise.all([
          assignmentsApi.getAll().catch(() => []),
          submissionsApi.getMine().catch(() => []),
        ]);
        
        // Merge assignments with submission status
        const tasksWithStatus: Task[] = assignments.map((assignment: any) => {
          const submission = submissions.find((s: any) => s.assignment_id === assignment.id);
          let status: "pending" | "submitted" | "graded" = "pending";
          let grade: number | undefined;
          
          if (submission) {
            if (submission.grade !== null && submission.grade !== undefined) {
              status = "graded";
              grade = submission.grade;
            } else {
              status = "submitted";
            }
          }
          
          return {
            id: assignment.id,
            title: assignment.title,
            subject: assignment.subject || "General",
            dueDate: new Date(assignment.due_date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            status,
            grade,
            priority: new Date(assignment.due_date) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) 
              ? "high" as const 
              : undefined,
          };
        });
        
        setTasks(tasksWithStatus);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const submittedCount = tasks.filter((t) => t.status === "submitted").length;
  const gradedCount = tasks.filter((t) => t.status === "graded").length;

  const userName = user?.name || "Student";
  const className = user?.className || "Class";

  return (
    <MobileLayout role="student" userName={userName} schoolName="Lincoln Elementary">
      <div className="px-4 py-6 space-y-6">
        {/* Welcome Hero */}
        <div className="animate-fade-in">
          <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground p-6 border-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">
                  {className}
                </p>
                <h1 className="text-2xl font-display font-bold mt-1">
                  Good morning, {userName.split(' ')[0]}! ☀️
                </h1>
                <p className="text-primary-foreground/80 mt-2">
                  You have {pendingCount} assignment{pendingCount !== 1 ? "s" : ""} pending
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate("/student/buddy")}
              className="mt-5 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0 w-full"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Ask Learning Buddy
            </Button>
          </Card>
        </div>

        {/* Quick Stats */}
        <section className="animate-fade-in stagger-1">
          <h2 className="font-display font-semibold text-lg text-foreground mb-3">
            Your Tasks
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              title="Pending"
              value={pendingCount}
              icon={ClipboardList}
              color="warning"
            />
            <StatCard
              title="Submitted"
              value={submittedCount}
              icon={CheckCircle}
              color="teacher"
            />
            <StatCard
              title="Graded"
              value={gradedCount}
              icon={Star}
              color="success"
            />
          </div>
        </section>

        {/* Recent Tasks */}
        <section className="animate-fade-in stagger-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Recent Assignments
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/student/tasks")}
              className="text-primary gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : tasks.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              <p>No assignments yet! 🎉</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 2).map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  subject={task.subject}
                  dueDate={task.dueDate}
                  status={task.status}
                  priority={task.priority}
                  grade={task.grade}
                  onClick={() => navigate(`/student/task/${task.id}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Gallery Preview */}
        <section className="animate-fade-in stagger-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Your Gallery
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/student/gallery")}
              className="text-primary gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {mockGallery.map((item) => (
              <div
                key={item.id}
                className="aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="animate-fade-in stagger-4">
          <h2 className="font-display font-semibold text-lg text-foreground mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              title="Chat with Buddy"
              description="Get help anytime"
              icon={MessageCircle}
              color="student"
              onClick={() => navigate("/student/buddy")}
            />
            <QuickActionCard
              title="My Drawings"
              description="View your art"
              icon={Image}
              color="primary"
              onClick={() => navigate("/student/gallery")}
            />
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}
