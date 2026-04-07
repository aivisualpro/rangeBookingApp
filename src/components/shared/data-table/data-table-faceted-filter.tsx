"use client";

import { type Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@dashboardpack/core/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dashboardpack/core/components/ui/popover";
import { Separator } from "@dashboardpack/core/components/ui/separator";

interface FacetedFilterOption {
  label: string;
  value: string;
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  options?: FacetedFilterOption[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options: explicitOptions,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facetedValues = column.getFacetedUniqueValues();
  const selectedValues = new Set(
    (column.getFilterValue() as string[]) ?? []
  );

  // Use explicit options or auto-generate from faceted values
  const options: FacetedFilterOption[] =
    explicitOptions ??
    Array.from(facetedValues.keys())
      .sort()
      .map((value) => ({ label: String(value), value: String(value) }));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed gap-1.5">
          <PlusCircle className="size-3.5" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-1 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const next = new Set(selectedValues);
                      if (isSelected) {
                        next.delete(option.value);
                      } else {
                        next.add(option.value);
                      }
                      const filterValue =
                        next.size > 0 ? Array.from(next) : undefined;
                      column.setFilterValue(filterValue);
                    }}
                  >
                    <div
                      className={cn(
                        "me-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="size-3" />
                    </div>
                    <span>{option.label}</span>
                    <span className="ms-auto flex size-4 items-center justify-center font-mono text-xs">
                      {facetedValues.get(option.value) ?? 0}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
