"use client";

import { Check, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { formatINR } from "@/lib/shopApi";

export interface AddedToCartItem {
  name: string;
  image?: string;
  price?: number;
  variantLabel?: string;
  quantity: number;
}

interface CartToastProps {
  id: string | number;
  item: AddedToCartItem;
  onViewCart: () => void;
}

function CartToast({ id, item, onViewCart }: CartToastProps) {
  const lineTotal = item.price ? item.price * item.quantity : undefined;

  return (
    <div className="pointer-events-auto flex w-[calc(100vw-2rem)] max-w-sm items-center gap-3 rounded-2xl border border-gold/30 bg-background/95 p-3 shadow-elevated backdrop-blur-xl">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ShoppingBag className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
          <Check className="h-3.5 w-3.5" /> Added to cart
        </p>
        <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-foreground">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          {item.variantLabel ? `${item.variantLabel} · ` : ""}Qty {item.quantity}
          {lineTotal ? ` · ${formatINR(lineTotal)}` : ""}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          onViewCart();
          toast.dismiss(id);
        }}
        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-gold px-3.5 py-2 text-[11px] font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5"
      >
        Cart <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

/**
 * Show the elegant "added to cart" confirmation. `onViewCart` is invoked when
 * the devotee taps the Cart button — typically the cart drawer's openCart —
 * so the toast doesn't need cart context itself (it renders outside the shop
 * provider's React tree position).
 */
export function showAddedToCart(item: AddedToCartItem, onViewCart: () => void) {
  toast.custom((id) => <CartToast id={id} item={item} onViewCart={onViewCart} />, {
    duration: 3200,
    unstyled: true,
  });
}
