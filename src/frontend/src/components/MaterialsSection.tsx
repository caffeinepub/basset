import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

const materials = [
  {
    id: 1,
    name: "Recycled Plastic Polyester",
    tag: "rPET",
    description:
      "Diverted from ocean and landfill waste, our rPET fabric is crafted from post-consumer plastic bottles. Each garment saves approximately 10 bottles from entering the waste stream.",
    image: "/assets/generated/material-polyester.dim_600x400.jpg",
    stats: "8–10 bottles per jacket",
    color: "moss",
  },
  {
    id: 2,
    name: "Recycled Cotton Fabric",
    tag: "rCotton",
    description:
      "Pre-consumer and post-industrial cotton waste is reprocessed into premium quality fabric. We partner with textile mills to recover fiber before it reaches the waste stream.",
    image: "/assets/generated/material-cotton.dim_600x400.jpg",
    stats: "80% less water than virgin cotton",
    color: "earth",
  },
  {
    id: 3,
    name: "Company Cloth Shreds",
    tag: "Upcycled",
    description:
      "Industrial off-cuts and surplus fabric shreds from manufacturing partners are collected and reimagined into textural, one-of-a-kind pieces. No two garments are identical.",
    image: "/assets/generated/material-cloth-shreds.dim_600x400.jpg",
    stats: "Zero manufacturing waste",
    color: "accent",
  },
];

function MaterialCard({
  material,
  index,
}: {
  material: (typeof materials)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group card-hover bg-card border border-border overflow-hidden"
      data-ocid={`materials.item.${index + 1}`}
    >
      <div className="aspect-[3/2] overflow-hidden relative">
        <img
          src={material.image}
          alt={material.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <span className="absolute top-4 left-4 text-xs font-body tracking-[0.2em] uppercase bg-background/80 backdrop-blur-sm px-3 py-1 text-primary border border-primary/30">
          {material.tag}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-display font-semibold text-foreground mb-3">
          {material.name}
        </h3>
        <p className="text-sm font-body text-muted-foreground leading-relaxed mb-4">
          {material.description}
        </p>
        <div className="flex items-center gap-2 text-xs font-body text-primary">
          <span className="w-4 h-px bg-primary" />
          {material.stats}
        </div>
      </div>
    </motion.div>
  );
}

export default function MaterialsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section id="materials" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-body tracking-[0.3em] uppercase text-primary block mb-4">
            Our Materials
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground max-w-lg leading-tight">
              Waste Reimagined as{" "}
              <span className="font-italic-accent font-normal">
                Wearable Art
              </span>
            </h2>
            <p className="text-sm font-body text-muted-foreground max-w-xs leading-relaxed">
              Every fiber in BASSET garments has a previous life. We trace and
              celebrate that story.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {materials.map((material, i) => (
            <MaterialCard key={material.id} material={material} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
