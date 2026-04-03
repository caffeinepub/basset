import { Button } from "@/components/ui/button";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

const PRODUCTS = [
  {
    id: "p1",
    name: "Emerald Weave Jacket",
    price: 189,
    image: "/assets/generated/design-sample-1.dim_600x750.jpg",
    material: "rPET",
    description: "Structured jacket woven from reclaimed plastic polyester.",
  },
  {
    id: "p2",
    name: "Cotton Revival Dress",
    price: 145,
    image: "/assets/generated/design-sample-2.dim_600x750.jpg",
    material: "rCotton",
    description:
      "Airy patchwork dress stitched from reclaimed cotton swatches.",
  },
  {
    id: "p3",
    name: "Patchwork Urban Hoodie",
    price: 129,
    image: "/assets/generated/design-sample-3.dim_600x750.jpg",
    material: "Upcycled",
    description: "Bold streetwear hoodie from industrial cloth shreds.",
  },
];

function ProductCard({
  product,
  index,
}: {
  product: (typeof PRODUCTS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`, {
      description: `$${product.price} · ${product.material}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      className="group card-hover bg-card border border-border overflow-hidden"
      data-ocid={`shop.item.${index + 1}`}
    >
      <div className="aspect-[4/5] overflow-hidden bg-muted relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 text-[10px] font-body tracking-[0.2em] uppercase bg-background/90 backdrop-blur-sm px-2.5 py-1 text-foreground border border-border">
          {product.material}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-display font-semibold text-foreground text-base leading-tight">
            {product.name}
          </h3>
          <span className="font-display font-bold text-foreground text-base ml-2 flex-shrink-0">
            ${product.price}
          </span>
        </div>
        <p className="text-xs font-body text-muted-foreground mb-4 leading-relaxed">
          {product.description}
        </p>
        <Button
          onClick={handleAdd}
          className={`w-full font-body text-xs tracking-widest uppercase rounded-none h-10 transition-all ${
            added
              ? "bg-accent text-accent-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
          data-ocid={`shop.primary_button.${index + 1}`}
        >
          {added ? "Added!" : "Add to Cart"}
        </Button>
      </div>
    </motion.div>
  );
}

export default function ShopSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section className="py-24 sm:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-xs font-body tracking-[0.3em] uppercase text-primary block mb-4">
            The Collection
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground leading-tight">
              Shop the{" "}
              <span className="font-italic-accent font-normal">Collection</span>
            </h2>
            <p className="text-sm font-body text-muted-foreground max-w-xs leading-relaxed">
              Each piece made from reclaimed materials. Fashion with a story.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
