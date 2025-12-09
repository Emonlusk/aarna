"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, User, BookOpen, Settings, KeyRound, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/api';

const roles = [
  {
    id: 'teacher' as UserRole,
    icon: BookOpen,
    label: 'I am a Teacher',
    color: 'hover:border-primary hover:bg-primary/5',
  },
  {
    id: 'student' as UserRole,
    icon: User,
    label: 'I am a Student',
    color: 'hover:border-accent hover:bg-accent/5',
  },
  {
    id: 'admin' as UserRole,
    icon: Settings,
    label: 'I am an Admin',
    color: 'hover:border-success hover:bg-success/5',
  },
];

export default function LoginPage() {
  const [step, setStep] = useState<'role' | 'class' | 'user' | 'pin'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [pin, setPin] = useState('');

  const [classes, setClasses] = useState<{ id: number, name: string }[]>([]);
  const [users, setUsers] = useState<{ id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  // Fetch classes when role is student
  useEffect(() => {
    if (step === 'class' && selectedRole === 'student') {
      const fetchClasses = async () => {
        try {
          const res = await auth.getPublicClasses();
          setClasses(res.data);
        } catch (error) {
          console.error("Failed to fetch classes", error);
        }
      };
      fetchClasses();
    }
  }, [step, selectedRole]);

  // Fetch users when step is user
  useEffect(() => {
    if (step === 'user' && selectedRole) {
      const fetchUsers = async () => {
        try {
          const params: any = { role: selectedRole };
          if (selectedRole === 'student' && selectedClass) {
            params.class_name = selectedClass;
          }
          const res = await auth.getPublicUsers(params);
          setUsers(res.data);
        } catch (error) {
          console.error("Failed to fetch users", error);
        }
      };
      fetchUsers();
    }
  }, [step, selectedRole, selectedClass]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') {
      setStep('class');
    } else {
      setStep('user');
    }
  };

  const handleClassSelect = (className: string) => {
    setSelectedClass(className);
    setStep('user');
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    setStep('pin');
  };

  const handleLogin = async () => {
    if (!selectedUser || pin.length !== 4) return;

    setIsLoading(true);
    const success = await login(selectedUser, pin);
    setIsLoading(false);

    if (success) {
      if (selectedRole === 'teacher') router.push('/dashboard/teacher');
      else if (selectedRole === 'student') router.push('/dashboard/student');
      else if (selectedRole === 'admin') router.push('/dashboard/admin');
    } else {
      setPin('');
    }
  };

  const handleBack = () => {
    if (step === 'pin') setStep('user');
    else if (step === 'user') {
      if (selectedRole === 'student') setStep('class');
      else setStep('role');
    }
    else if (step === 'class') setStep('role');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-4">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            School Digital Hub
          </h1>
          <p className="text-muted-foreground">
            Digital Hub for Learning
          </p>
        </div>

        <div className="w-full max-w-sm">
          {step === 'role' && (
            <div className="space-y-3 animate-slide-up">
              <p className="text-sm text-center text-muted-foreground mb-4">
                Select your role to continue
              </p>
              {roles.map((role, index) => (
                <Button
                  key={role.id}
                  variant="role"
                  size="xl"
                  className={cn('w-full justify-start gap-4', role.color)}
                  onClick={() => handleRoleSelect(role.id)}
                  style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
                >
                  <role.icon size={24} />
                  <span className="text-base">{role.label}</span>
                </Button>
              ))}
            </div>
          )}

          {step === 'class' && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Select Your Class</h2>
                <p className="text-sm text-muted-foreground">Which class are you in?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {classes.map((cls) => (
                  <Button
                    key={cls.id}
                    variant="outline"
                    className="h-14 text-lg"
                    onClick={() => handleClassSelect(cls.name)}
                  >
                    {cls.name}
                  </Button>
                ))}
              </div>
              <Button variant="ghost" onClick={handleBack} className="w-full">
                Back
              </Button>
            </div>
          )}

          {step === 'user' && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Who are you?</h2>
                <p className="text-sm text-muted-foreground">Select your name from the list</p>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {users.map((u) => (
                  <Button
                    key={u.id}
                    variant="outline"
                    className="w-full justify-between h-12"
                    onClick={() => handleUserSelect(u.id)}
                  >
                    {u.name}
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </Button>
                ))}
                {users.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No users found.</p>
                )}
              </div>
              <Button variant="ghost" onClick={handleBack} className="w-full">
                Back
              </Button>
            </div>
          )}

          {step === 'pin' && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Enter your 4-digit PIN
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Logging in as {users.find(u => u.id === selectedUser)?.name}
                </p>
              </div>

              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="password"
                  maxLength={4}
                  placeholder="• • • •"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-[0.5em] h-14 pl-12 font-mono"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && pin.length === 4) {
                      handleLogin();
                    }
                  }}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleLogin}
                  disabled={pin.length !== 4 || isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse-soft">Logging in...</span>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="py-4 text-center">
        <p className="text-xs text-muted-foreground">
          © 2024 NGO School Initiative
        </p>
      </footer>
    </div>
  );
}
