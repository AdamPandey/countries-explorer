// src/custom-components/ScrollPrompt.jsx

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function ScrollPrompt({ onClick }) {
  return (
    <motion.div
      className="absolute bottom-8 left-0 right-0 flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Button variant="outline" onClick={onClick} className="backdrop-blur-sm bg-background/50">
        Click here to see more
        <ChevronDown className="ml-2 h-4 w-4 animate-bounce" />
      </Button>
    </motion.div>
    
  );
}