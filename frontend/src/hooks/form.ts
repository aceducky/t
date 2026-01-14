import { createFormHook } from "@tanstack/react-form";

import {
    NumberField,
    PredictSelectField,
    FormSubmitButton,
    FormClearButton,
} from "@/components/FormComponents";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm } = createFormHook({
    fieldComponents: {
        NumberField,
        SelectField: PredictSelectField,
    },
    formComponents: {
        SubmitButton: FormSubmitButton,
        ClearButton: FormClearButton,
    },
    fieldContext,
    formContext,
});
