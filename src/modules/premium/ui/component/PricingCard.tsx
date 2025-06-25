import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheckIcon } from "lucide-react";
import React from "react";

const PricingCardVariant = cva("rounded-lg p-4 py-6 w-full", {
  variants: {
    variant: {
      default: "bg-white text-black ",
      highlighted: "bg-linear-to-br from-[#093C23] to-[#051B16] text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
const PricingCardIconVariant = cva("size-5", {
  variants: {
    variant: {
      default: "fill-primary text-black ",
      highlighted: "fill-white text-black",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
const PricingCardSecondaryTextVariant = cva("text-neutral-700", {
  variants: {
    variant: {
      default: "text-neutral-700  ",
      highlighted: "text-neutral-300 ",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
const PricingCardBadgeVariant = cva("text-black text-xs  font-normal p-1 ", {
  variants: {
    variant: {
      default: "bg-primary/20",
      highlighted: "bg-[#F5B797]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface Props extends VariantProps<typeof PricingCardVariant> {
  badge?: string | null;
  price: number;
  features: string[];
  title: string;
  description?: string | null;
  priceSuffix: string;
  className?: string;
  buttonText: string;
  onClick: () => void;
}
function PricingCard({
  badge,
  price,
  features,
  title,
  description,
  priceSuffix,
  className,
  buttonText,
  onClick,
  variant,
}: Props) {
  return (
    <div className={cn(PricingCardVariant({ variant }), className, "border")}>
      <div className="flex items-end gap-x-4  justify-between ">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <h6 className="font-medium text-xl">{title}</h6>
            {badge ? (
              <Badge
                className={cn(PricingCardBadgeVariant({ variant }), className)}
              >
                {badge}
              </Badge>
            ) : null}
          </div>
          <p
            className={cn(
              "text-xs",
              PricingCardSecondaryTextVariant({ variant })
            )}
          >
            {description}
          </p>
        </div>
        <div className="flex  items-end  shrink-0 gap-x-0.5">
          <h4 className="text-3xl  font-medium">
            {Intl.NumberFormat("en-us", {
              currency: "USD",
              style: "currency",
              minimumFractionDigits: 0,
            }).format(price)}
          </h4>
          <span className={cn(PricingCardSecondaryTextVariant({ variant }))}>
            {priceSuffix}
          </span>
        </div>
      </div>
      <div className="py-6">
        <Separator className=" opacity-10  text-[#5D6B68]" />
      </div>
      <Button
        className="w-full"
        size={"lg"}
        variant={variant !== "highlighted" ? "outline" : "default"}
        onClick={onClick}
      >
        {buttonText}
      </Button>
      <div className="flex  flex-col gap-y-2 mt-6">
        <p className="font-medium uppercase">Features</p>
        <ul
          className={cn(
            "flex flex-col  gap-y-2.5",
            PricingCardSecondaryTextVariant({ variant })
          )}
        >
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-x-2">
              <CircleCheckIcon
              className={PricingCardIconVariant({ variant })}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PricingCard;
