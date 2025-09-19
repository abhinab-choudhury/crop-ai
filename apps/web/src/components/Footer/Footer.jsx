import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import './footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const fade = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const Counter = ({ target, suffix = '', duration = 1600 }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
    const [val, setVal] = useState(0);
    useEffect(() => {
      if (!inView) return;
      let start = null;
      const endValue = parseFloat(target);
      const isInt = Number.isInteger(endValue);
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = endValue * eased;
        setVal(isInt ? Math.round(current) : current.toFixed(0));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, [inView, target, duration]);
    return (
      <span ref={ref}>
        {val}
        {suffix}
      </span>
    );
  };

  return (
    <>
      <section className="prefooter-impact" id="impact">
        <div className="impact-inner">
          <motion.h3
            className="impact-title"
            initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Transforming Agriculture with AI
          </motion.h3>

          <motion.div
            className="impact-cards"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
          >
            {[
              { n: 30, suffix: '%', t: 'Increase in crop yield prediction accuracy' },
              { n: 95, suffix: '%', t: 'Disease detection accuracy with AI analysis' },
              { n: 50, suffix: '+', t: 'Crop varieties supported in our system' },
            ].map((it, i) => (
              <motion.article key={i} className="impact-card" variants={fade}>
                <div className="impact-number">
                  <Counter target={it.n} suffix={it.suffix} />
                </div>
                <div className="impact-text">{it.t}</div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="footer" id="footer">
        <div className="footer-inner">
          <motion.div
            className="footer-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
          >
            <motion.div className="col brand-col" variants={fade}>
              <div className="logo">
                <span className="logo-mark">🌱</span>
                <span className="logo-text">CropAI</span>
              </div>
              <p className="desc">
                Crop AI provides real-time crop suggestions, plant health analysis — all through a
                simple, farmer-friendly chat interface.
              </p>
              <ul className="contact">
                <li>
                  <span>✉</span> arpitmishra5096@gmail.com
                </li>
                <li>
                  <span>📍</span> Smart India Hackathon 2025
                </li>
              </ul>
            </motion.div>

            <motion.div className="col links-col" variants={fade}>
              <h4 className="col-title">Quick Links</h4>
              <div className="underline" />
              <nav>
                <a href="#hero">Home</a>
                <a href="#features">Features</a>
              </nav>
            </motion.div>

            <motion.div className="col social-col" variants={fade}>
              <h4 className="col-title">Connect with us</h4>
              <div className="underline" />
              <div className="socials">
                <a
                  aria-label="GitHub"
                  href="https://github.com/abhinab-choudhury/crop-ai"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub />
                </a>
                <a aria-label="LinkedIn" href="#" target="_blank" rel="noreferrer">
                  <FaLinkedin />
                </a>
                <a aria-label="Twitter" href="#" target="_blank" rel="noreferrer">
                  <FaTwitter />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </>
  );
}
