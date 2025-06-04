'use server';

import { generateSermonSummaryFlow } from '@/ai/flows/sermon-analysis-flow';
import type { GenerateSermonSummaryInput, GenerateSermonSummaryOutput } from '@/ai/flows/sermon-analysis-flow';

export async function generateSermonSummary(input: GenerateSermonSummaryInput): Promise<GenerateSermonSummaryOutput> {
  return generateSermonSummaryFlow(input);
} 