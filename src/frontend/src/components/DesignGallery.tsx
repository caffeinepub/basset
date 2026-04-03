import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ImageOff } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import type { AppView } from "../App";
import { type FashionDesignSubmission, SubmissionStatus } from "../backend";
import { useGetAllSubmissions } from "../hooks/useQueries";

// Sample content displayed before real submissions come in
const SAMPLE_SUBMISSIONS: Array<FashionDesignSubmission & { _id: string }> = [
  {
    _id: "sample-1",
    title: "Emerald Weave Jacket",
    artistName: "Maya Chandra",
    description:
      "A structured jacket made entirely from upcycled polyester strips, celebrating the interplay between rigidity and flow.",
    email: "maya@example.com",
    status: SubmissionStatus.selected,
    isPaid: true,
    timestamp: BigInt(Date.now() * 1000),
    image: {
      getDirectURL: () => "/assets/generated/design-sample-1.dim_600x750.jpg",
    } as any,
  },
  {
    _id: "sample-2",
    title: "Cotton Revival Dress",
    artistName: "Léa Fontaine",
    description:
      "An airy summer dress stitched from reclaimed cotton swatches, each panel telling a different factory story.",
    email: "lea@example.com",
    status: SubmissionStatus.selected,
    isPaid: false,
    timestamp: BigInt(Date.now() * 1000),
    image: {
      getDirectURL: () => "/assets/generated/design-sample-2.dim_600x750.jpg",
    } as any,
  },
  {
    _id: "sample-3",
    title: "Patchwork Urban Hoodie",
    artistName: "Kwame Asante",
    description:
      "A bold streetwear hoodie assembled from industrial cloth shreds — tactile, layered, and entirely unique.",
    email: "kwame@example.com",
    status: SubmissionStatus.pending,
    isPaid: false,
    timestamp: BigInt(Date.now() * 1000),
    image: {
      getDirectURL: () => "/assets/generated/design-sample-3.dim_600x750.jpg",
    } as any,
  },
];

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const config = {
    [SubmissionStatus.selected]: {
      label: "Selected",
      className: "bg-accent/20 text-accent-foreground border-accent/40",
    },
    [SubmissionStatus.pending]: {
      label: "Pending Review",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    [SubmissionStatus.rejected]: {
      label: "Not Selected",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

  const c = config[status];
  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-body tracking-widest uppercase ${c.className}`}
    >
      {c.label}
    </Badge>
  );
}

function DesignCard({
  submission,
  index,
}: {
  submission: FashionDesignSubmission & { _id?: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const imageUrl = submission.image?.getDirectURL();
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
      className="group card-hover bg-card border border-border overflow-hidden"
      data-ocid={`gallery.item.${index + 1}`}
    >
      <div className="aspect-[4/5] overflow-hidden bg-muted relative">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={submission.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <StatusBadge status={submission.status} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground text-base leading-tight mb-1 truncate">
          {submission.title}
        </h3>
        <p className="text-xs font-body text-muted-foreground mb-2 truncate">
          by {submission.artistName}
        </p>
        {submission.description && (
          <p className="text-xs font-body text-muted-foreground/70 leading-relaxed line-clamp-2">
            {submission.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function GallerySkeletons() {
  return (
    <>
      {["s1", "s2", "s3", "s4", "s5", "s6"].map((id) => (
        <div key={id} className="bg-card border border-border overflow-hidden">
          <Skeleton className="aspect-[4/5] w-full rounded-none" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-none" />
            <Skeleton className="h-3 w-1/2 rounded-none" />
          </div>
        </div>
      ))}
    </>
  );
}

interface DesignGalleryProps {
  onNavigate: (view: AppView) => void;
  preview?: boolean;
}

export default function DesignGallery({
  onNavigate,
  preview = false,
}: DesignGalleryProps) {
  const [filter, setFilter] = useState<"all" | "selected" | "pending">("all");
  const { data: backendSubmissions, isLoading } = useGetAllSubmissions();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  const allSubmissions: Array<FashionDesignSubmission & { _id?: string }> =
    backendSubmissions && backendSubmissions.length > 0
      ? backendSubmissions
      : SAMPLE_SUBMISSIONS;

  const filtered = allSubmissions.filter((s) => {
    if (filter === "all") return true;
    if (filter === "selected") return s.status === SubmissionStatus.selected;
    if (filter === "pending") return s.status === SubmissionStatus.pending;
    return true;
  });

  const displayed = preview ? filtered.slice(0, 3) : filtered;

  return (
    <section
      id="gallery"
      className={`${
        preview ? "py-24 sm:py-32 bg-card/30" : "py-16 sm:py-24 min-h-screen"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-body tracking-[0.3em] uppercase text-primary block mb-4">
            Design Gallery
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground leading-tight">
              Artist{" "}
              <span className="font-italic-accent font-normal">
                Submissions
              </span>
            </h2>
            {!preview && (
              <Tabs
                value={filter}
                onValueChange={(v) => setFilter(v as typeof filter)}
              >
                <TabsList
                  className="bg-muted border border-border rounded-none h-9"
                  data-ocid="gallery.tab"
                >
                  <TabsTrigger
                    value="all"
                    className="text-xs font-body tracking-widest uppercase rounded-none"
                    data-ocid="gallery.tab"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="selected"
                    className="text-xs font-body tracking-widest uppercase rounded-none"
                    data-ocid="gallery.tab"
                  >
                    Selected
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className="text-xs font-body tracking-widest uppercase rounded-none"
                    data-ocid="gallery.tab"
                  >
                    Pending
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </motion.div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="gallery.loading_state"
          >
            <GallerySkeletons />
          </div>
        ) : displayed.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="gallery.empty_state"
          >
            <ImageOff className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-xl text-foreground mb-2">
              No Designs Yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Be the first to submit your design to BASSET.
            </p>
            <Button
              onClick={() => onNavigate("submit")}
              className="bg-primary text-primary-foreground font-body tracking-widest uppercase text-xs rounded-none"
              data-ocid="gallery.primary_button"
            >
              Submit a Design
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((sub, i) => (
              <DesignCard
                key={(sub as any)._id || i}
                submission={sub}
                index={i}
              />
            ))}
          </div>
        )}

        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Button
              onClick={() => onNavigate("gallery")}
              variant="outline"
              className="border-border text-foreground hover:bg-foreground/10 font-body tracking-widest uppercase text-xs rounded-none h-11 px-8"
              data-ocid="gallery.secondary_button"
            >
              View Full Gallery
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
