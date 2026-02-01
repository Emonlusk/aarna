import React from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  UserPlus,
  Settings,
  Database,
  BarChart3,
  Bell,
  Shield,
  ChevronRight,
  TrendingUp,
  Activity,
} from "lucide-react";

const recentUsers = [
  { id: 1, name: "Emma Wilson", role: "student", joinDate: "Dec 8, 2024" },
  { id: 2, name: "Mr. Johnson", role: "teacher", joinDate: "Dec 7, 2024" },
  { id: 3, name: "James Chen", role: "student", joinDate: "Dec 6, 2024" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <MobileLayout role="admin" userName="Dr. Anderson" schoolName="Lincoln Elementary">
      <div className="px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            School overview and management
          </p>
        </div>

        {/* Quick Stats */}
        <section className="animate-fade-in stagger-1">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="Total Users"
              value={156}
              icon={Users}
              color="admin"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Active Today"
              value={89}
              icon={Activity}
              color="success"
              trend={{ value: 8, isPositive: true }}
            />
          </div>
        </section>

        {/* System Health */}
        <section className="animate-fade-in stagger-2">
          <h2 className="font-display font-semibold text-lg text-foreground mb-3">
            System Health
          </h2>
          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage Used</span>
                <span className="font-medium text-foreground">2.4 GB / 10 GB</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Sessions</span>
                <span className="font-medium text-foreground">89 / 200</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">All systems operational</span>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                Details
              </Button>
            </div>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="animate-fade-in stagger-3">
          <h2 className="font-display font-semibold text-lg text-foreground mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              title="Add User"
              description="Create new account"
              icon={UserPlus}
              color="admin"
              onClick={() => navigate("/admin/users")}
            />
            <QuickActionCard
              title="Announcement"
              description="Send school-wide"
              icon={Bell}
              color="primary"
            />
          </div>
        </section>

        {/* Management Cards */}
        <section className="animate-fade-in stagger-4">
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="p-4 cursor-pointer hover:-translate-y-0.5 transition-all"
              onClick={() => navigate("/admin/users")}
            >
              <Users className="w-8 h-8 text-admin mb-2" />
              <h3 className="font-medium text-foreground">User Management</h3>
              <p className="text-sm text-muted-foreground">156 users</p>
            </Card>
            <Card
              className="p-4 cursor-pointer hover:-translate-y-0.5 transition-all"
              onClick={() => navigate("/admin/settings")}
            >
              <Settings className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-medium text-foreground">Settings</h3>
              <p className="text-sm text-muted-foreground">School config</p>
            </Card>
            <Card className="p-4 cursor-pointer hover:-translate-y-0.5 transition-all">
              <BarChart3 className="w-8 h-8 text-teacher mb-2" />
              <h3 className="font-medium text-foreground">Analytics</h3>
              <p className="text-sm text-muted-foreground">Usage reports</p>
            </Card>
            <Card className="p-4 cursor-pointer hover:-translate-y-0.5 transition-all">
              <Database className="w-8 h-8 text-success mb-2" />
              <h3 className="font-medium text-foreground">Backup</h3>
              <p className="text-sm text-muted-foreground">Data security</p>
            </Card>
          </div>
        </section>

        {/* Recent Users */}
        <section className="animate-fade-in stagger-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Recent Users
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/users")}
              className="text-primary gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Card className="divide-y divide-border">
            {recentUsers.map((user) => (
              <div key={user.id} className="p-4 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold ${
                    user.role === "student"
                      ? "bg-student/10 text-student"
                      : user.role === "teacher"
                      ? "bg-teacher/10 text-teacher"
                      : "bg-admin/10 text-admin"
                  }`}
                >
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                </div>
                <span className="text-xs text-muted-foreground">{user.joinDate}</span>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </MobileLayout>
  );
}
