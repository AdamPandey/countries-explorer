# Meridian

### An Interactive 3D Globe for Exploring World Data

#### GitHub Repo
https://github.com/AdamPandey/countries-explorer.git



---

## Project Description

**Meridian** is a modern, immersive web application that reimagines how we explore data about countries around the world. Built with React and Vite, this project moves beyond traditional lists and grids by presenting a fully interactive 3D globe as its centerpiece. Users can navigate the globe, click on countries to receive detailed information, and experience a rich, multi-API data environment that provides insights into geography, culture, and current events.

---

## Key Features

This project incorporates a wide range of modern front-end features:

-   **Interactive 3D Globe:**
    -   Built with **React Three Fiber** and **Three.js**.
    -   Users can click, drag, and zoom to explore the globe.
    -   Clicking a country smoothly animates the camera to focus on it.
    -   Features a minimalist, theme-aware design with country outlines.
    -   **3D Info Card:** A beautiful, semi-transparent info card appears in 3D space next to a selected country, showing key data without leaving the immersive view.

-   **Immersive Hero Section:**
    -   **Multi-column Animated Ticker:** A captivating, auto-scrolling hero section displays travel photos from around the world using the **Pexels API**.
    -   Features five counter-scrolling columns for a dynamic effect.
    -   Animation intelligently slows down on hover.

-   **Responsive & Dynamic UI:**
    -   **Conditional Layout:** The application serves the full 3D Globe experience on desktop, while providing a performant and beautiful Hero Ticker and grid view on mobile.
    -   **Animated Search:** When a user searches, the hero elements gracefully fade away to focus on the search results.
    -   **Dynamic Navbar:** A highly polished navbar with a title that animates from the center to the side on scroll, and a search icon that elegantly expands into a functional search bar.

-   **Rich Data Integration (Multi-API):**
    -   **REST Countries API:** The core source for all geographical and demographic data.
    -   **The Movie Database (TMDB):** Fetches a list of popular movies originating from the selected country.
    -   **GNews API:** Displays the latest news headlines related to the selected country.
    -   **ExchangeRate-API:** Provides live currency exchange rates against the USD.
    -   **Pexels API:** Powers the immersive hero ticker with beautiful travel photography.

-   **Modern Styling & Animations:**
    -   Styled with **Tailwind CSS** and **ShadCN/UI** for a clean, professional, and consistent component-based design.
    -   **Dark/Light Mode:** A beautiful theme toggle allows users to switch between modes.
    -   **Fluid Animations:** Built with **Framer Motion** for smooth page transitions, scroll-triggered card animations, and a polished user experience.
    -   **Professional Loading State:** Uses skeleton loaders to prevent layout shifts and improve perceived performance.

---

## Tech Stack

-   **Frontend:** React, Vite
-   **3D Graphics:** React Three Fiber, Three.js, React Three Drei
-   **Styling:** Tailwind CSS, ShadCN/UI
-   **Animations:** Framer Motion
-   **Data Fetching:** Axios
-   **Geography & Geometry:** `world-atlas`, `topojson-client`, `three-geojson-geometry`, `earcut`
-   **APIs Used:** REST Countries, TMDB, GNews, ExchangeRate-API, Pexels

---

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/AdamPandey/countries-explorer.git]
    cd meridian-project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## Development Highlights & Challenges

This project involved overcoming several significant technical challenges, which were crucial to its development:

-   **The 3D Globe Debugging Saga:** The implementation of the interactive globe was the most challenging and rewarding part of this project.
    -   **Problem:** Early versions of the globe would crash the renderer due to malformed or incomplete geographical data from the `world-atlas` package.
    -   **Solution:** After extensive debugging, the final solution involved using the `earcut` library to manually triangulate the GeoJSON data into a robust `BufferGeometry` that the 3D engine could reliably render. This solved all rendering crashes and visual artifacts.
    -   **Problem:** A deep and complex series of bugs prevented click and hover events from working correctly, due to conflicts between the `OrbitControls` and React Three Fiber's event system.
    -   **Solution:** The final architecture uses a self-contained event system within each `Country` component. This elegant solution separates concerns, eliminates conflicts, and provides a robust, professional-grade user interaction model.

-   **UI/UX Refinement:** The project underwent a significant iterative design process. What started as a simple grid evolved into a polished experience with a dynamic navbar, an immersive hero section, and fluid animations, all aimed at exceeding the user's expectations.

-   **Data Integration & Mismatch:** A critical bug where clicks failed was traced back to a fundamental data mismatch between the geographical data (`world-atlas`) and the API data (`restcountries.com`). The solution was to switch from matching by numeric IDs (which didn't exist in both datasets) to matching by the country's **name**, which created a reliable bridge between the two data sources.

---

## 🙏 Acknowledgements & References

-- @MohammedChe for the collab