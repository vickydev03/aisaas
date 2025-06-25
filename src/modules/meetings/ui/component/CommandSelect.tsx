import { Button } from "@/components/ui/button";
import {
  CommandResponsiveDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import React, { useState,ReactNode } from "react";

interface Props {
  options: Array<{ id: string; value: string; children: ReactNode }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  clasName?: string;
}
function CommandSelect({
  onSelect,
  options,
  onSearch,
  value,
  clasName,
  // isSearchable,
  placeholder = "Select an option",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((e) => e.value === value);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        type="button"
        variant={"outline"}
        className={cn(
          " flex px-2  justify-between font-normal h-9 ",
          !selectedOption && "text-muted-foreground",
          clasName
        )}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
      </Button>
      <CommandResponsiveDialog open={isOpen} onOpenChange={setIsOpen} shouldFilter={!onSearch}>
        <CommandInput placeholder="search " onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>
            <span className=" text-muted-foreground text-sm  ">No options</span>
          </CommandEmpty>
          {options.map((option) => {
            return (
              <CommandItem
                key={option.id}
                onSelect={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
              >
                {option.children}
              </CommandItem>
            );
          })}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
}

export default CommandSelect;
