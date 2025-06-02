
'use server';
/**
 * @fileOverview A Genkit flow and tool for searching sermons.
 *
 * - searchSermonsTool - A Genkit tool to find sermons based on query, topics, or speaker.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { placeholderSermons } from '@/lib/placeholder-data';
import type { Sermon, SermonSummaryForTool } from '@/types';

// Input schema for the sermon search tool
const SermonSearchInputSchema = z.object({
  query: z.string().optional().describe("Keywords from title, summary, or general topic to search for in sermons."),
  topics: z.array(z.string()).optional().describe("Specific sermon topics to filter by (e.g., ['Faith', 'Grace'])."),
  speaker: z.string().optional().describe("Name of the sermon speaker to filter by."),
  limit: z.number().optional().default(3).describe("Maximum number of sermons to return."),
});
export type SermonSearchInput = z.infer<typeof SermonSearchInputSchema>;

// Output schema for the sermon search tool
const SermonSummarySchema = z.object({
    id: z.string(),
    title: z.string(),
    speaker: z.string(),
    date: z.string(),
    summary: z.string().optional(),
    topics: z.array(z.string()).optional(),
});

const SermonSearchResultsSchema = z.object({
  foundSermons: z.array(SermonSummarySchema).describe("A list of sermons matching the query. Includes title, speaker, date, a brief summary, and topics."),
});
export type SermonSearchResults = z.infer<typeof SermonSearchResultsSchema>;


export const searchSermonsTool = ai.defineTool(
  {
    name: 'searchSermonsTool',
    description: 'Searches the church sermon archive based on keywords, topics, or speaker. Returns a list of matching sermons with their title, speaker, date, summary, and topics.',
    inputSchema: SermonSearchInputSchema,
    outputSchema: SermonSearchResultsSchema,
  },
  async (input: SermonSearchInput): Promise<SermonSearchResults> => {
    let filteredSermons: Sermon[] = [...placeholderSermons];

    if (input.query) {
      const lowerQuery = input.query.toLowerCase();
      filteredSermons = filteredSermons.filter(sermon =>
        sermon.title.toLowerCase().includes(lowerQuery) ||
        (sermon.summary && sermon.summary.toLowerCase().includes(lowerQuery)) ||
        (sermon.speaker && sermon.speaker.toLowerCase().includes(lowerQuery)) || // Also check speaker in general query
        (sermon.topics && sermon.topics.some(topic => topic.toLowerCase().includes(lowerQuery))) ||
        (sermon.scriptureReferences && sermon.scriptureReferences.some(ref => ref.toLowerCase().includes(lowerQuery)))
      );
    }

    if (input.topics && input.topics.length > 0) {
      filteredSermons = filteredSermons.filter(sermon =>
        input.topics!.every(searchTopic =>
          sermon.topics?.some(sermonTopic => sermonTopic.toLowerCase() === searchTopic.toLowerCase())
        )
      );
    }

    if (input.speaker) {
      const lowerSpeaker = input.speaker.toLowerCase();
      filteredSermons = filteredSermons.filter(sermon =>
        sermon.speaker.toLowerCase().includes(lowerSpeaker)
      );
    }

    const sermonSummaries: SermonSummaryForTool[] = filteredSermons
        .slice(0, input.limit)
        .map(s => ({
            id: s.id,
            title: s.title,
            speaker: s.speaker,
            date: s.date,
            summary: s.summary,
            topics: s.topics
        }));

    return { foundSermons: sermonSummaries };
  }
);

// Example of how a flow could use this, though for now the tool is directly used by another flow.
// const findRelevantSermonsFlow = ai.defineFlow(
//   {
//     name: 'findRelevantSermonsFlow',
//     inputSchema: SermonSearchInputSchema,
//     outputSchema: SermonSearchResultsSchema,
//   },
//   async (input) => {
//     // In a more complex scenario, this flow might do more pre/post processing
//     // or call multiple tools. For now, it directly uses the searchSermonsTool concept.
//     return searchSermonsTool(input);
//   }
// );

// export async function findSermons(input: SermonSearchInput): Promise<SermonSearchResults> {
//   return findRelevantSermonsFlow(input);
// }
