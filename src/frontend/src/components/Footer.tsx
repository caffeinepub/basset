import { Recycle } from "lucide-react";
import type { AppView } from "../App";

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="block mb-4"
            >
              <span className="text-3xl font-display font-bold tracking-widest text-gradient-earth">
                BASSET
              </span>
            </button>
            <p className="text-sm font-body text-muted-foreground leading-relaxed max-w-sm">
              Transforming industrial textile waste into premium sustainable
              fashion. We partner with artists and recyclers to close the loop
              on fashion.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs font-body text-primary">
              <Recycle className="w-3.5 h-3.5" />
              <span>100% Circular Materials</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-body tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", view: "home" as AppView },
                { label: "Design Gallery", view: "gallery" as AppView },
                { label: "Submit Design", view: "submit" as AppView },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.view)}
                    className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid="footer.link"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          <div>
            <h4 className="text-xs font-body tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Materials
            </h4>
            <ul className="space-y-2.5 text-sm font-body text-muted-foreground">
              <li>Recycled Plastic Polyester</li>
              <li>Recycled Cotton Fabric</li>
              <li>Company Cloth Shreds</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-body text-muted-foreground/60">
            &copy; {year} BASSET &mdash; Circular Fashion Brand. All rights
            reserved.
          </p>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-body text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
