// src/custom-components/Navbar.jsx

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { Link } from "react-router-dom";
import { Search, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery"; // Import the hook
import { Logo } from "./Logo";

export function Navbar({ searchTerm, onSearchChange, showSearch = false }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef(null);
  const isDesktop = useMediaQuery('(min-width: 1000px)'); // Check for desktop screen size

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const sideTitleVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const centerTitleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all",
        scrolled ? "border-border bg-background/95 backdrop-blur" : "border-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        
        {/* --- LEFT SIDE: The Title --- */}
        <div className="flex items-center">
          <AnimatePresence>
            {/* On mobile OR when scrolled on desktop, show the simple side title */}
            {(!isDesktop || scrolled) && (
              <motion.div
                key="sideTitle"
                variants={sideTitleVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Link to="/" className="flex items-center space-x-2">
                  <Logo className="h-6 w-6" />
                  <span className="font-bold sm:inline-block">Meridian</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- CENTER: The Animated Desktop Title --- */}
        {/* This entire block will ONLY render on desktop when not scrolled */}
        <AnimatePresence>
          {isDesktop && !scrolled && (
            <motion.div
              key="centerTitle"
              className="absolute left-1/2 -translate-x-1/2"
              variants={centerTitleVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Link to="/" className="flex items-center space-x-2">
                <Logo className="h-6 w-6" />
                <span className="font-bold sm:inline-block">Meridian</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- RIGHT SIDE: Icons --- */}
        <div className="flex items-center space-x-2">
          {showSearch && (
            <div className="flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: isDesktop ? "12rem" : "8rem", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <Input 
                      ref={inputRef}
                      type="text"
                      placeholder="Search..."
                      className="w-full"
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      onBlur={() => { if (!searchTerm) setIsSearchOpen(false); }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="h-5 w-5" />
              </Button>
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}