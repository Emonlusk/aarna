import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreVertical,
  UserPlus,
  Download,
  Filter,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usersApi, User } from "@/lib/api";

interface UserWithStatus extends User {
  status: 'active' | 'inactive';
  joinDate?: string;
}

type FilterType = "all" | "student" | "teacher" | "admin";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersApi.getAll();
        // Add status to users (in production this would come from API)
        const usersWithStatus: UserWithStatus[] = data.map(u => ({
          ...u,
          status: 'active' as const,
          joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }));
        setUsers(usersWithStatus);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((user) =>
      filter === "all" ? true : user.role === filter
    )
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filters: { label: string; value: FilterType; count: number }[] = [
    { label: "All", value: "all", count: users.length },
    { label: "Students", value: "student", count: users.filter((u) => u.role === "student").length },
    { label: "Teachers", value: "teacher", count: users.filter((u) => u.role === "teacher").length },
  ];

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersApi.delete(userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const userName = currentUser?.name || "Admin";

  return (
    <MobileLayout role="admin" userName={userName} schoolName="Lincoln Elementary">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between animate-fade-in">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Users
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage school accounts
            </p>
          </div>
          <Button size="sm" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3 animate-fade-in stagger-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f.value)}
                className="shrink-0 gap-2"
              >
                {f.label}
                <Badge
                  variant={filter === f.value ? "secondary" : "outline"}
                  className="px-1.5 py-0 text-xs"
                >
                  {f.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Users List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Card className="divide-y divide-border animate-fade-in stagger-2">
            {filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className="p-4 flex items-center gap-3 animate-fade-in opacity-0"
                style={{
                  animationDelay: `${0.2 + index * 0.05}s`,
                  animationFillMode: "forwards",
                }}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold shrink-0",
                    user.role === "student" && "bg-student/10 text-student",
                    user.role === "teacher" && "bg-teacher/10 text-teacher",
                    user.role === "admin" && "bg-admin/10 text-admin"
                  )}
                >
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">
                      {user.name}
                    </p>
                    <Badge
                      variant={user.status === "active" ? "default" : "secondary"}
                      className={cn(
                        "text-[10px] px-1.5",
                        user.status === "active" && "bg-success/10 text-success border-success/20"
                      )}
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Reset Password</DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </Card>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground">
              No users found
            </h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Export Button */}
        <Button variant="outline" className="w-full gap-2">
          <Download className="w-4 h-4" />
          Export to CSV
        </Button>
      </div>
    </MobileLayout>
  );
}
