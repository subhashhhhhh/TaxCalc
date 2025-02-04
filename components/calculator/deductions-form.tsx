"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface DeductionsFormProps {
  form: UseFormReturn<any>;
  onBack: () => void;
  onNext: () => void;
}

export function DeductionsForm({ form, onBack, onNext }: DeductionsFormProps) {
  const employmentType = form.watch("employmentType");

  return (
    <div className="space-y-6">
      {employmentType === "salaried" && (
        <>
          <FormField
            control={form.control}
            name="deductions.standardDeduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Standard Deduction
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Fixed deduction of ₹75,000 for salaried employees</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    autoComplete="off"
                    inputMode="numeric"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deductions.hra"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  House Rent Allowance (HRA)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Exemption for rent paid</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter HRA amount"
                    autoComplete="off"
                    inputMode="numeric"
                    pattern="\d*"
                    value={field.value === 0 ? '' : field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty string or numbers only
                      if (value === '' || /^\d+$/.test(value)) {
                        field.onChange(value === '' ? 0 : Number(value));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      <FormField
        control={form.control}
        name="deductions.section80C"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Section 80C
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Investments in PPF, ELSS, Life Insurance, etc. (Max: ₹1.5L)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter 80C investments"
                autoComplete="off"
                inputMode="numeric"
                pattern="\d*"
                value={field.value === 0 ? '' : field.value}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string or numbers only
                  if (value === '' || /^\d+$/.test(value)) {
                    field.onChange(value === '' ? 0 : Number(value));
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="deductions.section80D"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Section 80D
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Health Insurance Premium (Max: ₹75,000)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter health insurance premium"
                autoComplete="off"
                inputMode="numeric"
                pattern="\d*"
                value={field.value === 0 ? '' : field.value}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string or numbers only
                  if (value === '' || /^\d+$/.test(value)) {
                    field.onChange(value === '' ? 0 : Number(value));
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onNext}>
          Calculate Tax
        </Button>
      </div>
    </div>
  );
}