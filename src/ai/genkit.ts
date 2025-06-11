
'use server';

import 'server-only';
import {genkit} from 'genkit';
import {gemini10Pro, gemini20Flash, gemini20FlashLite, gemini25ProExp0325, gemini25ProPreview0325, googleAI} from '@genkit-ai/googleai';

// Ensure your GOOGLE_API_KEY environment variable is set in your Genkit execution environment.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || 'AIzaSyAGxugbJDi84dIQeIvx6moBPdCDwJdhJIw', // Use the API key from .env
      models: [gemini20FlashLite,gemini10Pro,gemini25ProPreview0325,gemini20Flash, gemini25ProExp0325], // Explicitly include the gemini20FlashLite model
    }),
  ],
  model: gemini20Flash, // Use gemini20Flash as the default model
});
