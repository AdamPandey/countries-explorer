// src/custom-components/Navbar.jsx

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { Link } from "react-router-dom";
import { Search, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar({ searchTerm, onSearchChange, showSearch = false }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef(null);

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

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all",
        scrolled ? "border-border bg-background/95 backdrop-blur" : "border-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        
        {/* Wrapper for both side and center titles */}
        <div className="flex-1 flex items-center">
          <AnimatePresence>
            {scrolled ? (
              // SIDE TITLE (Visible when scrolled)
              <motion.div
                key="sideTitle"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Link to="/" className="flex items-center space-x-2">
                  <Globe className="h-6 w-6" />
                  <span className="font-bold">Country Explorer</span>
                </Link>
              </motion.div>
            ) : (
              // CENTER TITLE (Visible at top of page)
              <motion.div
                key="centerTitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex justify-center absolute left-1/2 -translate-x-1/2"
              >
                <Link to="/" className="flex items-center space-x-2">
                  <Globe className="h-6 w-6" />
                  <span className="font-bold">Country Explorer</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-2">
          {showSearch && (
            <div className="flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "10rem", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
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