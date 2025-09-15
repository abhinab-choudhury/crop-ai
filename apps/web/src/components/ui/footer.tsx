'use client';

import { motion } from 'framer-motion';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaSeedling,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Thank you for subscribing!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <footer className="w-full bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-green-200 dark:border-gray-700 py-12 mt-20">
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
          <svg
            className="relative block w-full h-16 text-green-50 dark:text-gray-900"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V56.44Z"
              className="fill-current"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Brand Section - Expanded to take more space */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2 text-center md:text-left"
            >
              <div className="flex items-center justify-center md:justify-start">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <FaSeedling className="text-4xl text-green-600 mr-3" />
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  CropAI
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-md leading-relaxed">
                Revolutionizing agriculture through AI-powered insights. We provide farmers with
                real-time crop suggestions, weather updates, and plant health analysis for
                sustainable farming and increased yields.
              </p>

              <div className="mt-6 flex flex-col space-y-2">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaEnvelope className="text-green-600 mr-2" />
                  <span>contact@cropai.tech</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaPhone className="text-green-600 mr-2" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-start text-gray-600 dark:text-gray-400">
                  <FaMapMarkerAlt className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Smart India Hackathon 2025</span>
                </div>
              </div>
            </motion.div>

            {/* Contact & Socials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <h3 className="font-semibold text-green-800 dark:text-green-400 text-lg mb-5 relative inline-block">
                Stay Connected
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-green-500 rounded-full"></span>
              </h3>

              {/* Newsletter Subscription */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  Get farming insights delivered to your inbox
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-green-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    required
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                    ) : (
                      <>Subscribe Now</>
                    )}
                  </motion.button>
                </form>
              </div>

              {/* Social Media */}
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">Follow our journey</p>
                <div className="flex justify-center md:justify-start space-x-3">
                  {[
                    { icon: FaGithub, href: 'https://github.com/your-repo', label: 'GitHub' },
                    {
                      icon: FaLinkedin,
                      href: 'https://linkedin.com/company/your-linkedin',
                      label: 'LinkedIn',
                    },
                    { icon: FaTwitter, href: 'https://twitter.com/your-twitter', label: 'Twitter' },
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3 }}
                      className="bg-white dark:bg-gray-800 text-green-600 p-3 rounded-full shadow-md hover:shadow-lg transition-all border border-green-100 dark:border-gray-700"
                      aria-label={social.label}
                    >
                      <social.icon size={18} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Our Impact Section - Replaced Demo CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 pt-10 border-t border-green-200 dark:border-gray-700 text-center"
          >
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-6">
              Transforming Agriculture with AI
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Impact Stat 1 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-green-100 dark:border-gray-700"
              >
                <div className="text-4xl font-bold text-green-600 mb-2">30%</div>
                <p className="text-gray-600 dark:text-gray-300">
                  Increase in crop yield prediction accuracy
                </p>
              </motion.div>

              {/* Impact Stat 2 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-green-100 dark:border-gray-700"
              >
                <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
                <p className="text-gray-600 dark:text-gray-300">
                  Disease detection accuracy with AI analysis
                </p>
              </motion.div>

              {/* Impact Stat 3 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-green-100 dark:border-gray-700"
              >
                <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                <p className="text-gray-600 dark:text-gray-300">
                  Crop varieties supported in our system
                </p>
              </motion.div>
            </div>

            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-medium text-lg"
            >
              <FaSeedling className="mr-3" />
              Explore Features
            </motion.a>
          </motion.div>

          {/* Copyright - Simplified */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-green-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400 space-y-2"
          >
            <p>© {new Date().getFullYear()} CropAI. All rights reserved.</p>
            <p>
              Developed with <span className="text-red-500">❤️</span> by{' '}
              <span className="font-semibold text-green-700 dark:text-green-400">Team Paradox</span>{' '}
              for{' '}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-bold">
                Smart India Hackathon 2025
              </span>
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
}
