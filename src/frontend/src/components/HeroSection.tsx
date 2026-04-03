import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { AppView } from "../App";

interface HeroSectionProps {
  onNavigate: (view: AppView) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollToMaterials = () => {
    document
      .querySelector("#materials")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <img
          src="/assets/generated/hero-basset.dim_1920x1080.jpg"
          alt="BASSET sustainable fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full"
      >
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-body tracking-[0.3em] uppercase text-primary">
              Circular Fashion
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold leading-[0.95] mb-6"
          >
            <span className="block text-foreground">Fashion</span>
            <span className="block text-gradient-earth">from Waste.</span>
            <span className="block text-foreground">
              Art{" "}
              <span className="font-italic-accent font-normal text-5xl sm:text-6xl lg:text-7xl">
                from Purpose.
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-muted-foreground font-body leading-relaxed mb-10 max-w-lg"
          >
            BASSET transforms{" "}
            <span className="text-foreground">recycled plastic polyester</span>,{" "}
            <span className="text-foreground">reclaimed cotton fabric</span>,
            and <span className="text-foreground">company cloth shreds</span>{" "}
            into premium sustainable clothing — giving waste a new life and
            artists a platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              onClick={() => onNavigate("gallery")}
              size="lg"
              data-ocid="hero.primary_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body tracking-widest uppercase text-sm px-8 rounded-none h-12"
            >
              Explore Collection
            </Button>
            <Button
              onClick={() => onNavigate("submit")}
              variant="outline"
              size="lg"
              data-ocid="hero.secondary_button"
              className="border-foreground/30 text-foreground hover:bg-foreground/10 font-body tracking-widest uppercase text-sm px-8 rounded-none h-12"
            >
              Submit Your Design
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={scrollToMaterials}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll down"
      >
        <span className="text-xs font-body tracking-widest uppercase">
          Discover
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Stat Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-0 right-0 z-10 flex gap-8 p-6 sm:p-8"
      >
        {[
          { value: "100%", label: "Recycled" },
          { value: "0", label: "Landfill" },
          { value: "∞", label: "Circular" },
        ].map((stat) => (
          <div key={stat.label} className="text-right hidden sm:block">
            <div className="text-2xl font-display font-bold text-primary">
              {stat.value}
            </div>
            <div className="text-xs font-body tracking-widest uppercase text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
