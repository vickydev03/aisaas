"use client";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import PricingCard from "../component/PricingCard";

function UpgradeView() {
  const trpc = useTRPC();
  const { data: currentSubscription } = useSuspenseQuery(
    trpc.premium.getsCurrentSubscription.queryOptions()
  );

  const { data: products } = useSuspenseQuery(
    trpc.premium.getProduct.queryOptions()
  );

  console.log(products);

  return (
    <div className="flex flex-1  px-4  md:px-8 flex-col gap-y-10 ">
      <div className="mt-4  flex-1  flex  flex-col  gap-y-10  items-center bg-red-3000">
        <h5 className="  font-medium  text-2xl  md:text-3xl ">
          you are on the{" "}
          <span className="font-semibold  text-primary">
            {currentSubscription?.name ?? "Free"}
          </span>{" "}
          plan
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
          {products.map((product) => {
            const isCurrentProduct = currentSubscription?.id === product.id;
            const isPremium = !!currentSubscription;

            let buttonText = "Upgrade";
            const onClick = () => authClient.checkout({ products: [product.id] });

            if (isCurrentProduct) {
              buttonText = "Manage";
              onclick = () => authClient.customer.portal();
            } else if (isPremium) {
              buttonText = "Change plan";
              onclick = () => authClient.customer.portal();
            }

            return (
              <PricingCard
                key={product.id}
                buttonText={buttonText}
                onClick={onClick}
                variant={
                  product.metadata.variant === "highlighted"
                    ? "highlighted"
                    : "default"
                }
                title={product.name}
                price={
                  product.prices[0].amountType === "fixed"
                    ? product.prices[0].priceAmount / 100
                    : 0
                }
                description={product.description}
                priceSuffix={`/${product.prices[0].recurringInterval}`}
                features={product.benefits.map((e) => e.description)}
                badge={product.metadata.badge as string | null}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UpgradeView;
