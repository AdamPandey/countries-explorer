// src/routes/Root.jsx

import { Outlet } from "react-router-dom";

export function Root() {
  return (
    // The min-h-screen class is now applied here to ensure all pages fill the screen
    <div className="bg-background text-foreground min-h-screen">
      <Outlet />
    </div>
  );
}