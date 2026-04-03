import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQty, totalItems, totalPrice } = useCart();

  const handleCheckout = () => {
    toast.info("Checkout coming soon — stay tuned!", {
      description: "We're working on secure payment integration.",
    });
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-card border-l border-border flex flex-col p-0"
        data-ocid="cart.sheet"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="font-display text-xl text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
            {totalItems > 0 && (
              <span className="ml-auto text-sm font-body font-normal text-muted-foreground">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center"
            data-ocid="cart.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <div>
              <p className="font-display text-lg text-foreground mb-1">
                Your cart is empty
              </p>
              <p className="text-sm font-body text-muted-foreground">
                Add pieces from our collection below.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="font-body text-xs tracking-widest uppercase rounded-none border-border"
              data-ocid="cart.secondary_button"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-4 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                    data-ocid={`cart.item.${index + 1}`}
                  >
                    <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-semibold text-foreground leading-tight mb-1 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm font-body text-muted-foreground mb-3">
                        ${item.price}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            aria-label="Decrease quantity"
                            data-ocid={`cart.toggle.${index + 1}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-body text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            aria-label="Increase quantity"
                            data-ocid={`cart.toggle.${index + 1}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label="Remove item"
                          data-ocid={`cart.delete_button.${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="px-6 py-5 border-t border-border space-y-4">
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-body text-muted-foreground uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="font-display text-xl font-bold text-foreground">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-widest uppercase rounded-none h-12"
                      data-ocid="cart.primary_button"
                    >
                      Proceed to Checkout
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="font-body text-xs">
                    Secure checkout coming soon
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
