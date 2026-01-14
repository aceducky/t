import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";

import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PredictionResult } from "@/components/PredictionResult";
import { HealthInsights } from "@/components/HealthInsights";

import { 
  predictionInputSchema,
  defaultPredictionValues,
  fieldMetadata,
  type PredictionInput,
  type PredictionResponse,
} from "@/lib/schemas";
import { predictDisease, ApiClientError } from "@/lib/api";

export const Route = createFileRoute("/predict")({ component: PredictPage });

function PredictPage() {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PredictionInput>({
    resolver: zodResolver(predictionInputSchema),
    defaultValues: defaultPredictionValues,
  });

  async function onSubmit(values: PredictionInput) {
    setError(null);
    setResult(null);
    setIsSubmitting(true);
    
    try {
      const response = await predictDisease(values);
      setResult(response);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
        if (err.details) {
          setError(`${err.message}: ${err.details.join(", ")}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClear = () => {
    form.reset();
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header Banner */}
      <section className="bg-slate-900 py-8 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] animate-fade-in">
            Liver Disease Prediction
          </h1>
          <p className="text-white/80 mt-2 animate-slide-up">
            Fill in the clinical parameters to predict the likelihood of liver disease.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="animate-slide-up">
              <div className="bg-card rounded-xl border p-6 md:p-8 shadow-sm space-y-6">
                {/* Row 1: Age and Gender */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldMetadata.age.label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={120}
                            placeholder={fieldMetadata.age.placeholder}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldMetadata.gender.label}</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value, 10))}
                          value={field.value?.toString() ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={fieldMetadata.gender.placeholder} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fieldMetadata.gender.options.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Total Bilirubin and Direct Bilirubin */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="total_bilirubin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldMetadata.total_bilirubin.label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min={0}
                            placeholder={fieldMetadata.total_bilirubin.placeholder}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="direct_bilirubin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldMetadata.direct_bilirubin.label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min={0}
                            placeholder={fieldMetadata.direct_bilirubin.placeholder}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3: Alkaline Phosphatase and ALT */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="alkaline_phosphatase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldMetadata.alkaline_phosphatase.label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            min={0}
                            placeholder={fieldMetadata.alkaline_phosphatase.placeholder}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldMetadata.alt.label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            min={0}
                            placeholder={fieldMetadata.alt.placeholder}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 4: AST and Total Proteins */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ast"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldMetadata.ast.label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            min={0}
                            placeholder={fieldMetadata.ast.placeholder}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_proteins"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldMetadata.total_proteins.label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min={0}
                            placeholder={fieldMetadata.total_proteins.placeholder}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 5: Albumin and A/G Ratio */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="albumin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldMetadata.albumin.label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min={0}
                            placeholder={fieldMetadata.albumin.placeholder}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ag_ratio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldMetadata.ag_ratio.label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min={0}
                            max={3}
                            placeholder={fieldMetadata.ag_ratio.placeholder}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-liver-teal hover:bg-liver-teal/90 text-white font-semibold px-8 py-2 min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "PREDICT"
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    className="font-semibold px-8 py-2 min-w-[140px]"
                  >
                    CLEAR
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          {/* Error Display */}
          {error && (
            <div className="mt-8 rounded-xl border-2 border-destructive bg-destructive/10 p-6 animate-slide-up">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-destructive">Error</h3>
                  <p className="text-destructive/80">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="mt-8">
              <PredictionResult result={result} />
              <HealthInsights warnings={result.warnings} />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
