
'use server';
/**
 * @fileOverview A Genkit flow for analyzing sermon content, e.g., generating a summary.
 *
 * - generateSermonSummary - Generates a summary for a given sermon.
 * - GenerateSermonSummaryInput - Input type for generateSermonSummary.
 * - GenerateSermonSummaryOutput - Output type for generateSermonSummary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateSermonSummaryInputSchema = z.object({
  sermonTitle: z.string().describe("The title of the sermon."),
  sermonScriptures: z.array(z.string()).optional().describe("Key scripture references for the sermon. e.g. ['John 3:16', 'Psalm 23']"),
  sermonNotesContent: z.string().optional().describe("Concatenated user notes related to this sermon. Use this to enrich the summary if available and relevant."),
});
export type GenerateSermonSummaryInput = z.infer<typeof GenerateSermonSummaryInputSchema>;

export const GenerateSermonSummaryOutputSchema = z.object({
  generatedSummary: z.string().describe("A concise summary of the sermon based on the provided information."),
});
export type GenerateSermonSummaryOutput = z.infer<typeof GenerateSermonSummaryOutputSchema>;

export async function generateSermonSummary(input: GenerateSermonSummaryInput): Promise<GenerateSermonSummaryOutput> {
  return generateSermonSummaryFlow(input);
}

const generateSermonSummaryPrompt = ai.definePrompt({
  name: 'generateSermonSummaryPrompt',
  input: {schema: GenerateSermonSummaryInputSchema},
  output: {schema: GenerateSermonSummaryOutputSchema},
  prompt: `Generate a concise and insightful summary (2-3 paragraphs) for a sermon with the following details.
The summary should capture the main theme and key takeaways.

Sermon Title: {{{sermonTitle}}}

{{#if sermonScriptures.length}}
Key Scripture References:
{{#each sermonScriptures}}
- {{{this}}}
{{/each}}
{{/if}}

{{#if sermonNotesContent}}
User's Notes (Consider these for additional context if they seem to highlight key points):
{{{sermonNotesContent}}}
{{else}}
No user notes provided. Base the summary primarily on the title and scriptures.
{{/if}}

Generated Summary:
`,
});

const generateSermonSummaryFlow = ai.defineFlow(
  {
    name: 'generateSermonSummaryFlow',
    inputSchema: GenerateSermonSummaryInputSchema,
    outputSchema: GenerateSermonSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await generateSermonSummaryPrompt(input);
    return output!;
  }
);
