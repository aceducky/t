import { useStore } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";

import { useFieldContext, useFormContext } from "@/hooks/form-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as ShadcnSelect from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

interface NumberFieldProps {
  label: string;
  placeholder?: string;
  hint?: string;
  unit?: string;
}

export function NumberField({ label, placeholder, hint, unit }: NumberFieldProps) {
  const field = useFieldContext<number>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <Field data-invalid={field.state.meta.isTouched && errors.length > 0}>
      <FieldLabel htmlFor={field.name}>
        {label}
        {unit && <span className="text-muted-foreground font-normal ml-1">({unit})</span>}
      </FieldLabel>
      <div className="relative">
        <Input
          id={field.name}
          type="number"
          step="any"
          value={field.state.value === 0 ? "" : field.state.value}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => {
            const val = e.target.value;
            field.handleChange(val === "" ? 0 : parseFloat(val));
          }}
          className="form-field-focus"
        />
      </div>
      {hint && !errors.length && (
        <FieldDescription>{hint}</FieldDescription>
      )}
      {field.state.meta.isTouched && errors.length > 0 && (
        <FieldError>
          {errors.map((error) => 
            typeof error === "string" ? error : error?.message
          ).join(", ")}
        </FieldError>
      )}
    </Field>
  );
}

interface SelectFieldProps {
  label: string;
  placeholder?: string;
  options: Array<{ label: string; value: string }>;
}

export function PredictSelectField({ label, placeholder, options }: SelectFieldProps) {
  const field = useFieldContext<number>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <Field data-invalid={field.state.meta.isTouched && errors.length > 0}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <ShadcnSelect.Select
        name={field.name}
        value={field.state.value.toString()}
        onValueChange={(value) => field.handleChange(parseInt(value, 10))}
      >
        <ShadcnSelect.SelectTrigger className="w-full form-field-focus">
          <ShadcnSelect.SelectValue placeholder={placeholder} />
        </ShadcnSelect.SelectTrigger>
        <ShadcnSelect.SelectContent>
          <ShadcnSelect.SelectGroup>
            <ShadcnSelect.SelectLabel>{label}</ShadcnSelect.SelectLabel>
            {options.map((option) => (
              <ShadcnSelect.SelectItem key={option.value} value={option.value}>
                {option.label}
              </ShadcnSelect.SelectItem>
            ))}
          </ShadcnSelect.SelectGroup>
        </ShadcnSelect.SelectContent>
      </ShadcnSelect.Select>
      {field.state.meta.isTouched && errors.length > 0 && (
        <FieldError>
          {errors.map((error) => 
            typeof error === "string" ? error : error?.message
          ).join(", ")}
        </FieldError>
      )}
    </Field>
  );
}

export function FormSubmitButton({ label = "PREDICT" }: { label?: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => (
        <Button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className="bg-liver-teal hover:bg-liver-teal/90 text-white font-semibold px-8 py-2 min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            label
          )}
        </Button>
      )}
    </form.Subscribe>
  );
}

export function FormClearButton({ label = "CLEAR" }: { label?: string }) {
  const form = useFormContext();
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => form.reset()}
      className="font-semibold px-8 py-2 min-w-[120px]"
    >
      {label}
    </Button>
  );
}
