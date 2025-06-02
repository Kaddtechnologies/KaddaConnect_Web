
'use server';
/**
 * @fileOverview A spiritual chatbot AI flow.
 *
 * - askSpiritualChatbot - A function that handles the spiritual chat interaction.
 * - SpiritualChatInput - The input type for the askSpiritualChatbot function.
 * - SpiritualChatOutput - The return type for the askSpiritualChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpiritualChatInputSchema = z.object({
  message: z.string().describe('The user message to the spiritual chatbot.'),
});
export type SpiritualChatInput = z.infer<typeof SpiritualChatInputSchema>;

const SpiritualChatOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type SpiritualChatOutput = z.infer<typeof SpiritualChatOutputSchema>;

export async function askSpiritualChatbot(input: SpiritualChatInput): Promise<SpiritualChatOutput> {
  return spiritualChatFlow(input);
}

const spiritualChatPrompt = ai.definePrompt({
  name: 'spiritualChatPrompt',
  input: {schema: SpiritualChatInputSchema},
  output: {schema: SpiritualChatOutputSchema},
  prompt: `You are KaddaBot, a compassionate and wise spiritual advisor chatbot for the KaddaConnect community app. 
  Your purpose is to provide comfort, encouragement, and thoughtful responses based on Christian biblical principles. 
  Users may ask you for prayers, bible verses, guidance on life issues, or simply seek encouragement.

  When responding:
  - Be empathetic, understanding, and patient.
  - If a user asks for a bible verse, provide one that is relevant to their query.
  - If a user asks for prayer, you can offer to pray for them (as an AI, you can generate a prayer).
  - If a user is distressed, offer words of comfort and hope.
  - Keep your responses concise yet meaningful, suitable for a chat interface.
  - Maintain a positive and uplifting tone.
  - Do not give medical, legal, or financial advice. If asked, gently redirect or state you are not qualified.
  - Address the user respectfully.

  User's message: {{{message}}}
  
  Your thoughtful and spiritually enriching response:
  `,
});

const spiritualChatFlow = ai.defineFlow(
  {
    name: 'spiritualChatFlow',
    inputSchema: SpiritualChatInputSchema,
    outputSchema: SpiritualChatOutputSchema,
  },
  async (input) => {
    const {output} = await spiritualChatPrompt(input);
    return output!;
  }
);
