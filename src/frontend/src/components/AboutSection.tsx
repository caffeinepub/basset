import { Award, Leaf, Recycle, Users } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const pillars = [
  {
    icon: Recycle,
    title: "Circular by Design",
    description:
      "Every BASSET piece is conceived with end-of-life in mind. We design for disassembly and full material recovery.",
  },
  {
    icon: Leaf,
    title: "Zero Landfill Pledge",
    description:
      "We divert 100% of sourced waste materials from landfill. Manufacturing surplus becomes the next garment.",
  },
  {
    icon: Users,
    title: "Artist Platform",
    description:
      "BASSET is a launchpad for emerging designers who share our values. Selected artists are compensated fairly for their creative work.",
  },
  {
    icon: Award,
    title: "Verified Traceability",
    description:
      "Every material source is documented. Customers can trace the origin of the waste that became their garment.",
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
          ref={sectionRef}
        >
          {/* Text Side */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs font-body tracking-[0.3em] uppercase text-primary block mb-4"
            >
              Our Mission
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-display font-bold text-foreground leading-tight mb-6"
            >
              Closing the Loop
              <br />
              <span className="font-italic-accent font-normal">
                on Fashion Waste
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base font-body text-muted-foreground leading-relaxed mb-6"
            >
              The global fashion industry produces over 92 million tonnes of
              textile waste each year. BASSET exists to interrupt that cycle. We
              partner with manufacturers to recover their off-cuts, with
              recyclers to transform plastic waste into premium polyester, and
              with artists to turn recovered materials into garments worth
              wearing.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base font-body text-muted-foreground leading-relaxed"
            >
              For artists, BASSET is more than a brand — it's a competition
              platform where talent meets sustainability. Submit your design,
              get selected, get paid. No gatekeeping. No greenwashing. Just
              great clothes made from what already exists.
            </motion.p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="p-6 bg-card border border-border"
                  data-ocid={`about.item.${i + 1}`}
                >
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-base mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm font-body text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border"
        >
          {[
            { value: "3", unit: "Materials", label: "Waste Sources" },
            { value: "100%", unit: "", label: "Recycled Input" },
            { value: "0", unit: "kg", label: "Landfill Output" },
            { value: "Fair", unit: "", label: "Artist Pay" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card p-8 text-center">
              <div className="text-4xl font-display font-bold text-primary mb-1">
                {stat.value}
                <span className="text-xl">{stat.unit}</span>
              </div>
              <div className="text-xs font-body tracking-widest uppercase text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Founders */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-20"
        >
          <span className="text-xs font-body tracking-[0.3em] uppercase text-primary block mb-6">
            The People Behind BASSET
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Founder */}
            <div
              className="p-8 bg-card border border-border"
              data-ocid="about.panel"
            >
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-5 text-2xl font-display font-bold text-primary">
                MT
              </div>
              <p className="text-xs font-body tracking-[0.25em] uppercase text-primary mb-2">
                Founder
              </p>
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                Madhav Tyagi
              </h3>
              <p className="text-sm font-body text-muted-foreground leading-relaxed">
                Madhav founded BASSET with a singular vision: to prove that
                fashion can be both beautiful and responsible. With a background
                in sustainable materials and a passion for design, he built
                BASSET as a platform where creativity and circularity converge.
              </p>
            </div>
            {/* Co-Founder */}
            <div
              className="p-8 bg-card border border-border"
              data-ocid="about.panel"
            >
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-5 text-2xl font-display font-bold text-primary">
                VV
              </div>
              <p className="text-xs font-body tracking-[0.25em] uppercase text-primary mb-2">
                Co-Founder
              </p>
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                Vishal Verma
              </h3>
              <p className="text-sm font-body text-muted-foreground leading-relaxed">
                Vishal co-founded BASSET to bring operational excellence and
                artist community building to the brand. He oversees partnerships
                with manufacturers, manages the artist competition platform, and
                ensures every BASSET piece tells an authentic story of
                transformation.
              </p>
            </div>
          </div>
          {/* Company intro paragraph */}
          <div className="mt-10 p-8 bg-secondary/40 border border-border">
            <h3 className="text-xl font-display font-semibold text-foreground mb-3">
              What is BASSET?
            </h3>
            <p className="text-base font-body text-muted-foreground leading-relaxed">
              BASSET is a sustainable circular fashion brand born from the
              belief that waste is just creativity waiting to be unlocked. We
              source recycled plastic polyester, reclaimed cotton fabric, and
              industrial cloth shreds from companies, then collaborate with
              emerging artists to transform these materials into premium
              garments. Every BASSET piece is traceable, ethical, and designed
              to last — fashion that gives back to the planet rather than taking
              from it.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
