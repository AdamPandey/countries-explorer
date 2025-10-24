// src/custom-components/CountryCard.jsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export function CountryCard({ country }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }} // Trigger when 20% of the card is visible
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full"
    >
      <Link to={`/country/${country.cca3}`} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg block h-full">
        <Card className="flex flex-col justify-between h-full hover:scale-105 transition-transform duration-200 ease-in-out hover:shadow-xl">
          <CardHeader>
            <CardTitle>{country.name.common}</CardTitle>
            <CardDescription>{country.region}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}
            </p>
            <p>
              <span className="font-semibold">Population:</span> {country.population.toLocaleString()}
            </p>
          </CardContent>
          <CardFooter>
            <img 
              src={country.flags.svg} 
              alt={`Flag of ${country.name.common}`} 
              className="w-10 border"
            />
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}