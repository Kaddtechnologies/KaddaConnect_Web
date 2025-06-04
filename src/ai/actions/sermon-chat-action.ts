'use server';

import { sermonContextualChatFlow } from '@/ai/flows/sermon-contextual-chat-flow';
import type { SermonContextualChatInput, SermonContextualChatOutput } from '@/ai/flows/sermon-contextual-chat-flow';

export async function askSermonChatbot(input: SermonContextualChatInput): Promise<SermonContextualChatOutput> {
  return sermonContextualChatFlow(input);
} 