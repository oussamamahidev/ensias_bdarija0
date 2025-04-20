"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
  color: string;
  delay?: number;
}

const colorMap = {
  orange:
    "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  purple:
    "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  cyan: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  yellow:
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const borderColorMap = {
  orange: "group-hover:border-orange-500/50",
  blue: "group-hover:border-blue-500/50",
  green: "group-hover:border-green-500/50",
  purple: "group-hover:border-purple-500/50",
  cyan: "group-hover:border-cyan-500/50",
  yellow: "group-hover:border-yellow-500/50",
};

const shadowColorMap = {
  orange: "group-hover:shadow-orange-500/20",
  blue: "group-hover:shadow-blue-500/20",
  green: "group-hover:shadow-green-500/20",
  purple: "group-hover:shadow-purple-500/20",
  cyan: "group-hover:shadow-cyan-500/20",
  yellow: "group-hover:shadow-yellow-500/20",
};

export default function FeatureCard({
  icon,
  title,
  description,
  link,
  linkText,
  color,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link href={link} className="block h-full">
        <div
          className={`group h-full card-wrapper border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-all duration-300 ${
            borderColorMap[color as keyof typeof borderColorMap]
          } ${
            shadowColorMap[color as keyof typeof shadowColorMap]
          } bg-white dark:bg-gray-800`}
        >
          <div
            className={`w-12 h-12 rounded-lg ${
              colorMap[color as keyof typeof colorMap]
            } flex items-center justify-center mb-4`}
          >
            {icon}
          </div>

          <h3 className="text-xl font-bold text-dark200_light900 mb-2 group-hover:text-primary-500 transition-colors">
            {title}
          </h3>

          <p className="text-dark400_light700 mb-6">{description}</p>

          <div className="flex items-center text-primary-500 font-medium mt-auto">
            <span>{linkText}</span>
            <ArrowRight
              size={16}
              className="ml-2 transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
