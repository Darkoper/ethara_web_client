import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { CosmicBackground } from "@/components/CosmicBackground";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="relative min-h-screen flex items-center justify-center px-4">
    <CosmicBackground />
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
      <BrandLogo className="mx-auto mb-6 h-16 w-16 rounded-2xl" iconClassName="h-8 w-8" />
      <h1 className="font-display text-7xl text-gradient">404</h1>
      <p className="mt-2 text-muted-foreground">This page drifted into the void.</p>
      <Link to="/dashboard"><Button className="mt-6 bg-aurora text-white border-0 hover:opacity-90 rounded-xl"><ArrowLeft className="h-4 w-4 mr-1.5" />Back to dashboard</Button></Link>
    </motion.div>
  </div>
);

export default NotFound;
