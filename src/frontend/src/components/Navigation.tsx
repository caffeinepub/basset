import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  LogOut,
  Menu,
  ShieldCheck,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { AppView } from "../App";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavigationProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
  onCartOpen: () => void;
}

export default function Navigation({
  activeView,
  onNavigate,
  isAdmin,
  isAuthenticated,
  onCartOpen,
}: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { totalItems } = useCart();

  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      onNavigate("home");
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks: { label: string; view: AppView | null; href?: string }[] = [
    { label: "Home", view: "home" },
    { label: "Materials", view: null, href: "#materials" },
    { label: "About", view: null, href: "#about" },
    { label: "Gallery", view: "gallery" },
    { label: "Submit Design", view: "submit" },
  ];

  const handleNavClick = (link: { view: AppView | null; href?: string }) => {
    if (link.view) {
      onNavigate(link.view);
    } else if (link.href) {
      if (activeView !== "home") {
        onNavigate("home");
        setTimeout(() => {
          document
            .querySelector(link.href!)
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document
          .querySelector(link.href!)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-xs"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <span className="text-2xl font-display font-bold tracking-widest text-gradient-earth">
            BASSET
          </span>
          <span className="text-[10px] font-body text-muted-foreground tracking-[0.25em] uppercase hidden sm:block">
            Circular Fashion
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => handleNavClick(link)}
              data-ocid="nav.link"
              className={`px-4 py-2 text-sm font-body tracking-wide transition-colors rounded-sm ${
                link.view && activeView === link.view
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </button>
          ))}

          {isAdmin && (
            <button
              type="button"
              onClick={() => onNavigate("admin")}
              data-ocid="nav.link"
              className={`px-4 py-2 text-sm font-body tracking-wide transition-colors rounded-sm flex items-center gap-1 ${
                activeView === "admin"
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          )}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Cart Button */}
          <button
            type="button"
            onClick={onCartOpen}
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open cart"
            data-ocid="nav.toggle"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center leading-none">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {isAuthenticated && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" />
              {identity?.getPrincipal().toString().slice(0, 8)}...
            </span>
          )}
          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? "outline" : "default"}
            size="sm"
            data-ocid="nav.button"
            className={`font-body text-xs tracking-widest uppercase ${
              !isAuthenticated
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : ""
            }`}
          >
            {isLoggingIn && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
            {isLoggingIn ? (
              "Connecting..."
            ) : isAuthenticated ? (
              <>
                <LogOut className="w-3 h-3 mr-1" /> Logout
              </>
            ) : (
              "Admin Login"
            )}
          </Button>
        </div>

        {/* Mobile right actions */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Cart */}
          <button
            type="button"
            onClick={onCartOpen}
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open cart"
            data-ocid="nav.toggle"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center leading-none">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  data-ocid="nav.link"
                  className={`w-full text-left px-3 py-2.5 text-sm font-body tracking-wide transition-colors rounded-sm ${
                    link.view && activeView === link.view
                      ? "text-primary font-medium bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("admin");
                    setMobileOpen(false);
                  }}
                  data-ocid="nav.link"
                  className="w-full text-left px-3 py-2.5 text-sm font-body tracking-wide text-muted-foreground hover:text-foreground transition-colors rounded-sm flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin
                </button>
              )}
              <div className="pt-2 border-t border-border">
                <Button
                  onClick={() => {
                    handleAuth();
                    setMobileOpen(false);
                  }}
                  disabled={isLoggingIn}
                  variant={isAuthenticated ? "outline" : "default"}
                  className="w-full font-body text-xs tracking-widest uppercase"
                  data-ocid="nav.button"
                >
                  {isLoggingIn && (
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  )}
                  {isLoggingIn
                    ? "Connecting..."
                    : isAuthenticated
                      ? "Logout"
                      : "Admin Login"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
