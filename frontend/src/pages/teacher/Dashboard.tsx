import React from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  ClipboardCheck,
  BookOpen,
  Sparkles,
  FileText,
  PenTool,
  Image,
  ChevronRight,
  Clock,
  CheckCircle,
} from "lucide-react";

const recentActivity = [
  {
    id: 1,
    type: "submission",
    student: "Emma Wilson",
    task: "Math Worksheet",
    time: "5 min ago",
  },
  {
    id: 2,
    type: "generated",
    content: "Science Quiz",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "submission",
    student: "James Chen",
    task: "English Essay",
    time: "2 hours ago",
  },
  {
    id: 4,
    type: "graded",
    student: "Sofia Martinez",
    task: "History Project",
    grade: 95,
    time: "3 hours ago",
  },
];

export default function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <MobileLayout role="teacher" userName="Mr. Johnson" schoolName="Lincoln Elementary">
      <div className="px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Good morning, Mr. Johnson!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your classes today
          </p>
        </div>

        {/* Quick Stats */}
        <section className="animate-fade-in stagger-1">
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              title="Students"
              value={45}
              icon={Users}
              color="teacher"
            />
            <StatCard
              title="To Grade"
              value={8}
              icon={ClipboardCheck}
              color="warning"
            />
            <StatCard
              title="Resources"
              value={23}
              icon={BookOpen}
              color="success"
            />
          </div>
        </section>

        {/* AI Action Center */}
        <section className="animate-fade-in stagger-2">
          <h2 className="font-display font-semibold text-lg text-foreground mb-3">
            AI Teaching Tools
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              title="AI Assistant"
              description="Get teaching help"
              icon={Sparkles}
              color="teacher"
              onClick={() => navigate("/teacher/ai")}
            />
            <QuickActionCard
              title="Worksheet Maker"
              description="Create materials"
              icon={FileText}
              color="primary"
              onClick={() => navigate("/teacher/ai?tab=worksheet")}
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="animate-fade-in stagger-3">
          <h2 className="font-display font-semibold text-lg text-foreground mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="p-4 cursor-pointer hover:-translate-y-0.5 transition-all"
              onClick={() => navigate("/teacher/classes")}
            >
              <Users className="w-8 h-8 text-teacher mb-2" />
              <h3 className="font-medium text-foreground">My Classes</h3>
              <p className="text-sm text-muted-foreground">3 active classes</p>
            </Card>
            <Card
              className="p-4 cursor-pointer hover:-translate-y-0.5 transition-all"
              onClick={() => navigate("/teacher/library")}
            >
              <BookOpen className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-medium text-foreground">Library</h3>
              <p className="text-sm text-muted-foreground">23 resources</p>
            </Card>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="animate-fade-in stagger-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm" className="text-primary gap-1">
              View all
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Card className="divide-y divide-border">
            {recentActivity.map((activity, index) => (
              <div
                key={activity.id}
                className="p-4 flex items-start gap-3 animate-fade-in opacity-0"
                style={{
                  animationDelay: `${0.4 + index * 0.1}s`,
                  animationFillMode: "forwards",
                }}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    activity.type === "submission"
                      ? "bg-teacher/10 text-teacher"
                      : activity.type === "generated"
                      ? "bg-primary/10 text-primary"
                      : "bg-success/10 text-success"
                  }`}
                >
                  {activity.type === "submission" && <Clock className="w-4 h-4" />}
                  {activity.type === "generated" && <Sparkles className="w-4 h-4" />}
                  {activity.type === "graded" && <CheckCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  {activity.type === "submission" && (
                    <>
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.student} submitted
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.task}
                      </p>
                    </>
                  )}
                  {activity.type === "generated" && (
                    <>
                      <p className="text-sm font-medium text-foreground truncate">
                        AI generated content
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.content}
                      </p>
                    </>
                  )}
                  {activity.type === "graded" && (
                    <>
                      <p className="text-sm font-medium text-foreground truncate">
                        Graded {activity.student}'s work
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.task} • {activity.grade}%
                      </p>
                    </>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {activity.time}
                </span>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </MobileLayout>
  );
}
