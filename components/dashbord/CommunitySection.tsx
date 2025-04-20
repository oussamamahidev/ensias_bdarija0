"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, ChevronRight, Award, Star, Zap } from "lucide-react";

// Mock data
const topContributors = [
  {
    id: "u1",
    name: "Alex Johnson",
    avatar: "/assets/images/user.svg",
    role: "Full Stack Developer",
    reputation: 15420,
    badges: { gold: 24, silver: 108, bronze: 214 },
  },
  {
    id: "u2",
    name: "Maria Garcia",
    avatar: "/assets/images/user.svg",
    role: "Frontend Engineer",
    reputation: 12840,
    badges: { gold: 18, silver: 92, bronze: 187 },
  },
  {
    id: "u3",
    name: "John Smith",
    avatar: "/assets/images/user.svg",
    role: "Backend Developer",
    reputation: 10560,
    badges: { gold: 15, silver: 76, bronze: 154 },
  },
];

export default function CommunitySection() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users size={20} className="text-orange-500" />
                <h2 className="text-2xl font-bold text-dark100_light900">
                  Join Our Community
                </h2>
              </div>
              <p className="text-dark400_light700 max-w-xl">
                Connect with developers from around the world, share knowledge,
                and grow together. Our community is built on collaboration and
                mutual support.
              </p>
            </div>

            <Link href="/community">
              <Button className="primary-gradient text-white">
                Explore Community
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {topContributors.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Link href={`/profile/${user.id}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Image
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          width={60}
                          height={60}
                          className="rounded-full border-2 border-orange-100 dark:border-gray-700 group-hover:border-primary-500 transition-colors"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white rounded-full p-1">
                          <Zap size={12} />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-dark200_light900 group-hover:text-primary-500 transition-colors">
                          {user.name}
                        </h3>
                        <p className="text-sm text-dark400_light700">
                          {user.role}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-orange-500" />
                          <span className="font-medium text-dark200_light900">
                            {user.reputation.toLocaleString()}
                          </span>
                          <span className="text-sm text-dark400_light700">
                            rep
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Award size={14} className="text-yellow-500" />
                            <span className="text-xs font-medium ml-1">
                              {user.badges.gold}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Award size={14} className="text-gray-400" />
                            <span className="text-xs font-medium ml-1">
                              {user.badges.silver}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Award size={14} className="text-amber-700" />
                            <span className="text-xs font-medium ml-1">
                              {user.badges.bronze}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
