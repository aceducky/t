import { useMutation } from "@tanstack/react-query";
import type { PredictionInput, PredictionResponse } from "./schemas";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ApiClientError extends Error {
    constructor(
        message: string,
        public status: number,
        public details?: string[]
    ) {
        super(message);
        this.name = "ApiClientError";
    }
}

/**
 * Fetches a prediction from the API
 */
export async function predictDisease(
    input: PredictionInput
): Promise<PredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 400) {
            throw new ApiClientError(
                errorData.error || "Invalid input data",
                response.status,
                errorData.details
            );
        }

        if (response.status === 500) {
            throw new ApiClientError(
                "Server error. Please try again later.",
                response.status
            );
        }

        throw new ApiClientError(
            errorData.error || "An unexpected error occurred",
            response.status
        );
    }

    return response.json() as Promise<PredictionResponse>;
}

/**
 * React Query mutation hook for disease prediction
 */
export function usePrediction() {
    return useMutation<PredictionResponse, ApiClientError, PredictionInput>({
        mutationFn: predictDisease,
    });
}

