import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export type SubscriptionInfo = {
  planId: string;
  planName: string;
  startDate?: string;
  endDate?: string;
  tierLabel: string;
  isPremier: boolean;
  isActive: boolean;
};

export const SubscriptionContext = createContext<SubscriptionInfo | null>(null);

export const SubscriptionProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: SubscriptionInfo | null;
}) => {
  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};
