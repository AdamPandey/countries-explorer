// src/custom-components/Navbar.jsx

import { Input } from "@/components/ui/input";
import { ModeToggle } from "./ModeToggle";
import { Link } from "react-router-dom";

export function Navbar({ searchTerm, onSearchChange, showSearch = false }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Country Explorer</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {showSearch && (
            <div className="w-full flex-1 md:w-auto md:flex-none">
               <Input 
                type="text"
                placeholder="Search for a country..."
                className="w-full md:w-64"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
          <nav className="flex items-center">
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}