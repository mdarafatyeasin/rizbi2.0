"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Rocket, Book } from "lucide-react"
import heroImg from '../../public/asset/heroImg.png'

const Hero: React.FC = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-12 lg:space-y-0 lg:space-x-8">
          <motion.div
            className="w-full lg:w-1/2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>
              <span className="block text-sm font-semibold uppercase tracking-wide text-gray-600 sm:text-base lg:text-sm xl:text-base">
                Welcome to RizbiHubs
              </span>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="block text-black">We provide customer</span>
                <span className="block text-gray-700">satisfaction</span>
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/shop"
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 md:py-4 md:text-lg md:px-10 transition duration-300"
              >
                Explore Toys
              </Link>
              <Link
                href="/categories"
                className="flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 transition duration-300"
              >
                View Categories
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="w-full lg:w-1/2 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full aspect-w-4 aspect-h-3 flex justify-center">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="w-2/3"
              >
                <Image
                  src={heroImg}
                  alt="Happy kids learning and playing"
                  width={800}
                  height={600}
                  className="rounded-md w-full h-auto"
                  priority
                />
              </motion.div>
            </div>
            <motion.div
              className="flex space-x-6 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <FeatureIcon icon={Sparkles} text="Inspire Creativity" />
              <FeatureIcon icon={Rocket} text="Boost Learning" />
              <FeatureIcon icon={Book} text="Foster Reading" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

interface FeatureIconProps {
  icon: React.ElementType
  text: string
}

const FeatureIcon: React.FC<FeatureIconProps> = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center">
    <div className="rounded-full bg-gray-100 p-3">
      <Icon className="h-6 w-6 text-gray-600" />
    </div>
    <span className="mt-2 text-sm font-medium text-gray-500">{text}</span>
  </div>
)

export default Hero

