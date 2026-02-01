import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { PinInput } from "@/components/auth/PinInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Sparkles, Star, Pencil, Calculator, Globe, Palette, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { authApi, PublicUser, ApiException } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type AuthStep = "role" | "user" | "pin";
type Role = "student" | "teacher" | "admin";

interface UserWithMeta extends PublicUser {
  class?: string;
  subject?: string;
  role?: string;
}

// Floating decoration component
function FloatingIcon({ 
  icon: Icon, 
  className, 
  delay = 0 
}: { 
  icon: React.ElementType; 
  className?: string;
  delay?: number;
}) {
  return (
    <div 
      className={cn(
        "absolute opacity-20 animate-float",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <Icon className="w-full h-full" />
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [step, setStep] = useState<AuthStep>("role");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [pinError, setPinError] = useState<string>("");
  const [users, setUsers] = useState<UserWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch users when role is selected
  useEffect(() => {
    if (selectedRole) {
      setIsLoading(true);
      authApi.getPublicUsers(selectedRole)
        .then((data) => {
          setUsers(data);
        })
        .catch((error) => {
          console.error('Failed to fetch users:', error);
          setUsers([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedRole]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep("user");
  };

  const handleUserSelect = (userId: number) => {
    setSelectedUser(userId);
    setStep("pin");
  };

  const handlePinComplete = async (pin: string) => {
    if (pin.length === 4 && selectedUser) {
      setIsSubmitting(true);
      setPinError("");
      
      try {
        await login(selectedUser, pin);
        navigate(`/${selectedRole}`);
      } catch (error) {
        if (error instanceof ApiException) {
          setPinError(error.message || "Invalid PIN. Please try again.");
        } else {
          setPinError("Login failed. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setPinError("Please enter a 4-digit PIN.");
    }
  };

  const handleBack = () => {
    if (step === "pin") {
      setStep("user");
      setSelectedUser(null);
      setPinError("");
    } else if (step === "user") {
      setStep("role");
      setSelectedRole(null);
      setUsers([]);
    }
  };

  const selectedUserData = users.find((u) => u.id === selectedUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background flex flex-col relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-student/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
        
        {/* Floating icons */}
        <FloatingIcon icon={Pencil} className="top-20 left-[10%] w-8 h-8 text-student" delay={0} />
        <FloatingIcon icon={Calculator} className="top-32 right-[15%] w-10 h-10 text-teacher" delay={0.5} />
        <FloatingIcon icon={Globe} className="bottom-40 left-[8%] w-12 h-12 text-primary" delay={1} />
        <FloatingIcon icon={Star} className="top-1/3 right-[8%] w-6 h-6 text-warning" delay={1.5} />
        <FloatingIcon icon={Palette} className="bottom-32 right-[12%] w-9 h-9 text-admin" delay={2} />
        <FloatingIcon icon={Sparkles} className="top-1/2 left-[5%] w-7 h-7 text-secondary" delay={0.3} />
        <FloatingIcon icon={BookOpen} className="bottom-1/4 left-[20%] w-8 h-8 text-success" delay={1.2} />

        {/* Decorative shapes */}
        <div className="absolute top-24 right-[20%] w-4 h-4 bg-student/30 rounded-full animate-bounce-gentle" />
        <div className="absolute bottom-48 left-[25%] w-3 h-3 bg-teacher/30 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 right-[30%] w-2 h-2 bg-admin/40 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="p-4 relative z-10">
        {step !== "role" && (
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2 bg-card/50 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo & Welcome */}
          <div className="text-center mb-10 animate-fade-in">
            {/* Animated Logo */}
            <div className="relative mx-auto w-24 h-24 mb-6">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl blur-xl opacity-40 animate-pulse-soft" />
              
              {/* Main logo */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-primary via-primary to-secondary rounded-3xl flex items-center justify-center shadow-elevated transform hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-12 h-12 text-primary-foreground" />
                
                {/* Sparkle decorations */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full flex items-center justify-center animate-bounce-gentle">
                  <Star className="w-2.5 h-2.5 text-warning-foreground" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-display font-bold text-foreground mb-2">
              School Hub
            </h1>
            <p className="text-muted-foreground text-lg">
              {step === "role" && "Select your role to continue"}
              {step === "user" && "Choose your profile"}
              {step === "pin" && `Welcome back, ${selectedUserData?.name}`}
            </p>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/30" />
              <Sparkles className="w-4 h-4 text-primary/50" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/30" />
            </div>
          </div>

          {/* Step Content - Glass Card */}
          <div className="animate-fade-in bg-card/70 backdrop-blur-md rounded-2xl p-6 shadow-elevated border border-border/50">
            {step === "role" && <RoleSelector onSelect={handleRoleSelect} />}

            {step === "user" && selectedRole && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Who's learning today? 📚
                </p>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No users found.</p>
                    <p className="text-sm mt-2">Contact your administrator.</p>
                  </div>
                ) : (
                  users.map((user, index) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user.id)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 bg-background/50 transition-all duration-200 text-left",
                        "hover:border-primary/30 hover:shadow-card hover:-translate-y-0.5 hover:bg-background",
                        "animate-fade-in opacity-0"
                      )}
                      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg shadow-sm",
                            selectedRole === "student" && "bg-gradient-to-br from-student/20 to-student/10 text-student",
                            selectedRole === "teacher" && "bg-gradient-to-br from-teacher/20 to-teacher/10 text-teacher",
                            selectedRole === "admin" && "bg-gradient-to-br from-admin/20 to-admin/10 text-admin"
                          )}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.class || user.subject || user.role || selectedRole}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {step === "pin" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    {isSubmitting ? (
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    ) : (
                      <span className="text-3xl">🔐</span>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    Enter your 4-digit PIN
                  </p>
                </div>
                <PinInput onComplete={handlePinComplete} error={pinError} disabled={isSubmitting} />
                <div className="text-center">
                  <Button variant="link" className="text-sm text-muted-foreground" disabled={isSubmitting}>
                    Forgot PIN?
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Register Link */}
          {step === "role" && (
            <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <p className="text-sm text-muted-foreground">
                New to School Hub?{" "}
                <Button variant="link" className="text-primary p-0 h-auto font-medium">
                  Contact your administrator
                </Button>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center relative z-10">
        <p className="text-xs text-muted-foreground">
          © 2024 School Digital Hub. All rights reserved.
        </p>
      </footer>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
    </div>
  );
}
