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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface BasicDetailsProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

export function BasicDetails({ form, onNext }: BasicDetailsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="income"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Annual Income (₹)</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter your annual income"
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
        name="employmentType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employment Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="salaried">Salaried</SelectItem>
                <SelectItem value="self-employed">Self Employed</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end">
        <Button type="button" onClick={onNext}>
          Next: Deductions
        </Button>
      </div>
    </div>
  );
}