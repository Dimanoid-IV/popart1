"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/funnel-analytics.mjs";

type Purchase = { transaction_id: string; value: number; currency: string; items: { item_id: string; item_name: string; item_variant: string; price: number; quantity: number }[] };

export default function PurchaseAnalytics({ purchase }: { purchase: Purchase | null }) {
  useEffect(() => {
    trackPurchase(purchase);
  }, [purchase]);
  return null;
}
