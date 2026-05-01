import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { CosmicBackground } from "@/components/CosmicBackground";
import { BrandLogo } from "@/components/BrandLogo";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "aria@nova.io", password: "demo1234" } });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <CosmicBackground />
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 flex items-center justify-center gap-2">
          <BrandLogo className="h-10 w-10" iconClassName="h-5 w-5" />
          <span className="font-display text-3xl">Harmony</span>
        </motion.div>

        <div className="glass-strong rounded-3xl p-8 shadow-elegant">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="font-display text-4xl text-center">Welcome back</motion.h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Sign in to your workspace</p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm hover:bg-secondary transition">
              <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.8 14.5 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12s4.1 9.2 9.2 9.2c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1.1-.2-1.6H12z"/></svg>
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm hover:bg-secondary transition">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.2-2.9.9-3.6.9-.7 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.1.7c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0-.1-2.5-1-2.5-3.9zm-2.4-7c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2z"/></svg>
              Apple
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />OR<div className="h-px flex-1 bg-border" /></div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9 h-11 bg-secondary/50 border-border" placeholder="you@nova.io" {...register("email")} />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="password" className="pl-9 h-11 bg-secondary/50 border-border" placeholder="••••••••" {...register("password")} />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-aurora hover:opacity-90 text-white shadow-glow border-0 group">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>}
            </Button>

            <p className="text-center text-xs text-muted-foreground">Don't have an account? <Link to="/signup" className="text-primary-glow hover:underline">Create one</Link></p>
          </form>

          <div className="mt-4 rounded-xl border border-dashed border-border/60 bg-secondary/30 p-3 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">Demo:</span> use <code className="text-primary-glow">aria@nova.io</code> (admin) or <code className="text-primary-glow">kai@nova.io</code> (member).
          </div>
        </div>
      </motion.div>
    </div>
  );
}
