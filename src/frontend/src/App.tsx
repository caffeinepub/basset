import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AboutSection from "./components/AboutSection";
import AdminDashboard from "./components/AdminDashboard";
import CartDrawer from "./components/CartDrawer";
import DesignGallery from "./components/DesignGallery";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import MaterialsSection from "./components/MaterialsSection";
import Navigation from "./components/Navigation";
import ShopSection from "./components/ShopSection";
import SubmitDesignForm from "./components/SubmitDesignForm";
import { CartProvider } from "./context/CartContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsCallerAdmin } from "./hooks/useQueries";

export type AppView = "home" | "gallery" | "submit" | "admin";

export default function App() {
  const [activeView, setActiveView] = useState<AppView>("home");
  const [cartOpen, setCartOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  const navigateTo = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation
          activeView={activeView}
          onNavigate={navigateTo}
          isAdmin={!!isAdmin}
          isAuthenticated={isAuthenticated}
          onCartOpen={() => setCartOpen(true)}
        />

        {activeView === "home" && (
          <>
            <HeroSection onNavigate={navigateTo} />
            <MaterialsSection />
            <ShopSection />
            <DesignGallery onNavigate={navigateTo} preview />
            <AboutSection />
          </>
        )}

        {activeView === "gallery" && (
          <main className="pt-20">
            <DesignGallery onNavigate={navigateTo} />
          </main>
        )}

        {activeView === "submit" && (
          <main className="pt-20">
            <SubmitDesignForm onNavigate={navigateTo} />
          </main>
        )}

        {activeView === "admin" && isAuthenticated && isAdmin && (
          <main className="pt-20">
            <AdminDashboard />
          </main>
        )}

        {activeView === "admin" && (!isAuthenticated || !isAdmin) && (
          <main className="pt-20 min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">
                Admin Access Required
              </h2>
              <p className="text-muted-foreground">
                Please log in with an admin account to access the dashboard.
              </p>
            </div>
          </main>
        )}

        <Footer onNavigate={navigateTo} />
        <Toaster richColors position="bottom-right" />

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </CartProvider>
  );
}
