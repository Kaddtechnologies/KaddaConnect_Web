
'use server';
/**
 * @fileOverview A Genkit flow for explaining Bible verses.
 * - explainBibleVerse - Explains a given Bible verse or passage.
 * - ExplainBibleVerseInput - Input type for explainBibleVerse.
 * - ExplainBibleVerseOutput - Output type for explainBibleVerse.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ExplainBibleVerseInputSchema = z.object({
  verseReference: z.string().describe("The Bible verse reference, e.g., 'John 3:16' or 'Genesis 1:1-3'."),
  verseText: z.string().describe("The actual text of the Bible verse(s)."),
  translation: z.string().optional().default("KJV").describe("The Bible translation, defaults to KJV."),
});
export type ExplainBibleVerseInput = z.infer<typeof ExplainBibleVerseInputSchema>;

export const ExplainBibleVerseOutputSchema = z.object({
  explanation: z.string().describe("A clear and concise explanation of the Bible verse(s), considering its context."),
});
export type ExplainBibleVerseOutput = z.infer<typeof ExplainBibleVerseOutputSchema>;

export async function explainBibleVerse(input: ExplainBibleVerseInput): Promise<ExplainBibleVerseOutput> {
  return explainBibleVerseFlow(input);
}

const explainBibleVersePrompt = ai.definePrompt({
  name: 'explainBibleVersePrompt',
  input: {schema: ExplainBibleVerseInputSchema},
  output: {schema: ExplainBibleVerseOutputSchema},
  prompt: `You are a helpful Bible study assistant. Your goal is to provide clear, concise, and insightful explanations of Bible passages.

Please explain the following Bible verse(s) from the {{translation}} translation:

Reference: {{{verseReference}}}
Text:
"""
{{{verseText}}}
"""

Your explanation should:
1.  Be easy to understand for a general audience.
2.  Briefly consider the historical and literary context if relevant and helpful for understanding.
3.  Focus on the core meaning and significance of the selected text.
4.  If the passage is part of a larger narrative or argument, briefly mention that connection.
5.  Maintain a respectful and informative tone.
6.  The explanation should be a few paragraphs long.

Explanation:
`,
});

const explainBibleVerseFlow = ai.defineFlow(
  {
    name: 'explainBibleVerseFlow',
    inputSchema: ExplainBibleVerseInputSchema,
    outputSchema: ExplainBibleVerseOutputSchema,
  },
  async (input) => {
    const {output} = await explainBibleVersePrompt(input);
    return output!;
  }
);
