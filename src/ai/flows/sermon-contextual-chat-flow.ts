
'use server';
/**
 * @fileOverview A Genkit flow for contextual chat about a specific sermon.
 *
 * - askSermonChatbot - Handles chat interaction related to a specific sermon.
 * - SermonContextualChatInput - Input type for askSermonChatbot.
 * - SermonContextualChatOutput - Output type for askSermonChatbot.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatHistoryMessageSchema = z.object({
  sender: z.enum(['user', 'bot']),
  text: z.string(),
});

export const SermonContextualChatInputSchema = z.object({
  sermonTitle: z.string().describe("The title of the sermon being discussed."),
  sermonScriptures: z.array(z.string()).optional().describe("Key scripture references for the sermon. e.g. ['John 3:16', 'Psalm 23']"),
  sermonNotesContent: z.string().optional().describe("Concatenated user notes related to this sermon, providing personal reflections or key points taken by the user."),
  userMessage: z.string().describe("The current user message in the chat about the sermon."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("The history of the current sermon-specific chat session, most recent last. Does not include the current 'userMessage'."),
  userName: z.string().describe("The user's first name."),
});
export type SermonContextualChatInput = z.infer<typeof SermonContextualChatInputSchema>;

export const SermonContextualChatOutputSchema = z.object({
  response: z.string().describe("The chatbot's response in the sermon discussion."),
});
export type SermonContextualChatOutput = z.infer<typeof SermonContextualChatOutputSchema>;

export async function askSermonChatbot(input: SermonContextualChatInput): Promise<SermonContextualChatOutput> {
  return sermonContextualChatFlow(input);
}

const sermonContextualChatPrompt = ai.definePrompt({
  name: 'sermonContextualChatPrompt',
  input: {schema: SermonContextualChatInputSchema},
  output: {schema: SermonContextualChatOutputSchema},
  prompt: `You are "The Potter's Wisdom A.I.", an assistant helping {{userName}} discuss and reflect on a specific sermon.

Sermon Details:
Title: {{{sermonTitle}}}
{{#if sermonScriptures.length}}
Key Scriptures:
{{#each sermonScriptures}}
- {{{this}}}
{{/each}}
{{/if}}

{{#if sermonNotesContent}}
User's Notes on this Sermon:
{{{sermonNotesContent}}}
{{/if}}

Your goal is to facilitate a deeper understanding and reflection on this sermon. Engage with {{userName}} about its themes, scriptures, or their notes. Ask clarifying questions, offer insights related to the sermon's context, or suggest points for further reflection. Keep the conversation focused on THIS sermon.

Conversation History (this sermon chat):
{{#if chatHistory.length}}
{{#each chatHistory}}
{{this.sender}}: {{this.text}}
{{/each}}
{{else}}
No previous messages in this specific sermon chat. Start the discussion.
{{/if}}

User's current message: {{{userMessage}}}

Your thoughtful response to {{userName}} regarding the sermon:
`,
});

const sermonContextualChatFlow = ai.defineFlow(
  {
    name: 'sermonContextualChatFlow',
    inputSchema: SermonContextualChatInputSchema,
    outputSchema: SermonContextualChatOutputSchema,
  },
  async (input) => {
    const {output} = await sermonContextualChatPrompt(input);
    return output!;
  }
);
