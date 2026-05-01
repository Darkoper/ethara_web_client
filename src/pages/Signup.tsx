import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { CosmicBackground } from "@/components/CosmicBackground";
import { BrandLogo } from "@/components/BrandLogo";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(60),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

export default function Signup() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      await signup(data);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <CosmicBackground />
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <BrandLogo className="h-10 w-10" iconClassName="h-5 w-5" />
          <span className="font-display text-3xl">Harmony</span>
        </div>

        <div className="glass-strong rounded-3xl p-8 shadow-elegant">
          <h1 className="font-display text-4xl text-center">Create your workspace</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Free forever, no credit card required.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9 h-11 bg-secondary/50 border-border" placeholder="Aria Vale" {...register("name")} />
              </div>
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>}
            </Button>

            <p className="text-center text-xs text-muted-foreground">Already have an account? <Link to="/login" className="text-primary-glow hover:underline">Sign in</Link></p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
