
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Ensure your GOOGLE_API_KEY environment variable is set in your Genkit execution environment.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash', // Default model for generate calls
  embedder: 'googleai/text-embedding-004', // Default model for embedText calls
  telemetry: {
    instrumentation: {
      // For OpenTelemetry, you would configure exporters here if needed
    },
    logger: {
      // Configure logging level and format if needed
    },
  },
});
