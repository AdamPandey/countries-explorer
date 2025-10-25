// src/custom-components/CountryGrid.jsx

import { motion } from 'framer-motion';
import { CountryCard } from "./CountryCard";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    }
  }
};

export function CountryGrid({ countries }) {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {countries.map(country => (
        <CountryCard key={country.cca3} country={country} />
      ))}
    </motion.div>
  );
}