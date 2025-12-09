"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Store user info (simplified for prototype)
                localStorage.setItem("user", JSON.stringify(data));
                if (data.role === "teacher") router.push("/dashboard/teacher");
                else if (data.role === "student") router.push("/dashboard/student");
                else router.push("/dashboard/admin");
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Failed to connect to server");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Login to School Hub</h2>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Sign In
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-slate-600">
                    Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}
