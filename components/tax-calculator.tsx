"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calculator, IndianRupee, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicDetails } from "@/components/calculator/basic-details";
import { DeductionsForm } from "@/components/calculator/deductions-form";
import { TaxResults } from "@/components/calculator/tax-results";
import { calculateTax } from "@/lib/tax-calculator";
import { TaxDetails } from "@/lib/types";

const formSchema = z.object({
  income: z.number().min(0, "Income must be positive"),
  employmentType: z.enum(["salaried", "self-employed"]),
  deductions: z.object({
    section80C: z.number().min(0).max(150000),
    section80D: z.number().min(0).max(75000),
    hra: z.number().min(0),
    lta: z.number().min(0),
    nps: z.number().min(0).max(50000),
    standardDeduction: z.number().min(0).max(75000),
  }),
});

export default function TaxCalculator() {
  const [activeTab, setActiveTab] = useState("basic");
  const [taxResults, setTaxResults] = useState<TaxDetails | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 0,
      employmentType: "salaried",
      deductions: {
        section80C: 0,
        section80D: 0,
        hra: 0,
        lta: 0,
        nps: 0,
        standardDeduction: 75000,
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const results = calculateTax(values);
    setTaxResults(results);
    setActiveTab("results");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="basic">
                <Calculator className="w-4 h-4 mr-2" />
                Basic Details
              </TabsTrigger>
              <TabsTrigger value="deductions">
                <IndianRupee className="w-4 h-4 mr-2" />
                Deductions
              </TabsTrigger>
              <TabsTrigger value="results">
                <FileDown className="w-4 h-4 mr-2" />
                Results
              </TabsTrigger>
            </TabsList>

            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === "basic" && "Enter Your Income Details"}
                  {activeTab === "deductions" && "Applicable Deductions"}
                  {activeTab === "results" && "Tax Calculation Results"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TabsContent value="basic">
                  <BasicDetails form={form} onNext={() => setActiveTab("deductions")} />
                </TabsContent>
                <TabsContent value="deductions">
                  <DeductionsForm 
                    form={form} 
                    onBack={() => setActiveTab("basic")}
                    onNext={() => form.handleSubmit(onSubmit)()} 
                  />
                </TabsContent>
                <TabsContent value="results">
                  {taxResults && <TaxResults results={taxResults} onReset={() => {
                    form.reset();
                    setActiveTab("basic");
                    setTaxResults(null);
                  }} />}
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}