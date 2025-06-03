
'use server';
/**
 * @fileOverview Flows for managing long-term user memory with a vector database (Pinecone).
 *
 * IMPORTANT: This file requires the '@pinecone-database/pinecone' package.
 * Ensure the following environment variables are set in your Genkit execution environment:
 * - PINECONE_API_KEY: Your Pinecone API key.
 * - PINECONE_INDEX_URL: Your Pinecone index URL (e.g., "https://your-index-name-projectid.svc.environment.pinecone.io").
 *   This is typically used with Pinecone serverless or newer SDK versions.
 *
 * The Pinecone index should be configured with a vector dimension matching the
 * embedding model used (e.g., 768 for 'googleai/text-embedding-004').
 *
 * - retrieveUserMemoryFromDB - Retrieves relevant long-term memory for a user.
 * - storeUserMemoryInDB - Stores a new piece of information about a user.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Pinecone } from '@pinecone-database/pinecone';
import type { Index } from '@pinecone-database/pinecone';

// --- Schemas ---

const RetrieveUserMemoryInputSchema = z.object({
  userId: z.string().describe("The unique identifier for the user."),
  currentQuery: z.string().describe("The user's current message or query to find relevant context for."),
  limit: z.number().optional().default(3).describe("Maximum number of relevant memory snippets to retrieve."),
});
export type RetrieveUserMemoryInput = z.infer<typeof RetrieveUserMemoryInputSchema>;

const RetrievedMemorySnippetSchema = z.object({
  id: z.string(),
  text: z.string(),
  score: z.number().optional(), // Similarity score from vector search
  metadata: z.record(z.any()).optional(),
});

const RetrieveUserMemoryOutputSchema = z.object({
  retrievedContext: z.string().describe("A consolidated string of relevant past interactions or notes about the user, formatted for LLM consumption."),
  debugSnippets: z.array(RetrievedMemorySnippetSchema).optional().describe("For debugging: the actual snippets retrieved."),
});
export type RetrieveUserMemoryOutput = z.infer<typeof RetrieveUserMemoryOutputSchema>;

const StoreUserMemorySnippetInputSchema = z.object({
  userId: z.string().describe("The unique identifier for the user."),
  textSnippet: z.string().describe("A piece of text (e.g., a key point from a conversation, a user preference) to be embedded and stored."),
  metadata: z.record(z.any()).optional().describe("Optional metadata to store alongside the vector (e.g., timestamp, source chat ID, interaction type)."),
});
export type StoreUserMemorySnippetInput = z.infer<typeof StoreUserMemorySnippetInputSchema>;

const StoreUserMemorySnippetOutputSchema = z.object({
  success: z.boolean(),
  snippetId: z.string().optional().describe("ID of the stored snippet in the vector database, if applicable."),
  error: z.string().optional(),
});
export type StoreUserMemorySnippetOutput = z.infer<typeof StoreUserMemorySnippetOutputSchema>;


// --- Pinecone Client Initialization ---
let pinecone: Pinecone | null = null;
let pineconeIndex: Index | null = null;

async function getPineconeIndex(): Promise<Index> {
  if (pineconeIndex) return pineconeIndex;

  const apiKey = process.env.PINECONE_API_KEY;
  const indexUrl = process.env.PINECONE_INDEX_URL;

  if (!apiKey) {
    throw new Error("PINECONE_API_KEY environment variable not set.");
  }
  if (!indexUrl) {
    throw new Error("PINECONE_INDEX_URL environment variable not set. This should be the full URL to your Pinecone index.");
  }

  if (!pinecone) {
    pinecone = new Pinecone({ apiKey });
  }
  
  // The index name is part of the URL, e.g., https://<index_name>-<project_id>.svc.<environment>.pinecone.io
  // We'll extract it or assume the SDK handles the full URL appropriately.
  // For recent SDK versions, you typically just use the client with the index name.
  // However, if indexUrl is the full host, connecting might differ.
  // For SDK v2.x and later, a common pattern if you have separate name and environment:
  // pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME!);
  // If PINECONE_INDEX_URL IS the full host for serverless, the SDK might handle it directly or require parsing.
  // For simplicity, let's assume the `indexUrl` is enough for the SDK to target the index,
  // or you might need to adjust this part based on your specific Pinecone setup (serverless vs. pod-based).
  // A common approach with serverless indexes is to pass the index name derived from the URL.
  // Let's assume the index name can be derived or is the first part of the hostname.
  // This part is a bit tricky without knowing the exact format of PINECONE_INDEX_URL from Google Secrets
  // and the specific Pinecone deployment type.
  // For now, a robust way is to just initialize the client and select the index by its name.
  // The user will need to ensure PINECONE_INDEX_URL implies the index name if they use the full URL for the SDK
  // or provide a separate PINECONE_INDEX_NAME. Let's use PINECONE_INDEX_NAME for clarity.
  
  const indexName = process.env.PINECONE_INDEX_NAME;
  if (!indexName) {
      console.warn("PINECONE_INDEX_NAME environment variable not set. Attempting to use PINECONE_INDEX_URL for index selection, which might not be directly supported by all SDK versions/index types. Consider setting PINECONE_INDEX_NAME.")
      // Attempt to derive index name from URL (this is a guess and might not be robust)
      // e.g. https://my-index-.... -> my-index
      try {
        const url = new URL(indexUrl);
        const derivedName = url.hostname.split('.')[0].split('-')[0]; // Highly dependent on URL structure
        if (derivedName) {
          console.log(`Derived index name: ${derivedName}`);
          pineconeIndex = pinecone.index(derivedName);
        } else {
          throw new Error("Could not derive index name from PINECONE_INDEX_URL. Please set PINECONE_INDEX_NAME.");
        }
      } catch (e) {
         throw new Error("PINECONE_INDEX_URL is not a valid URL or PINECONE_INDEX_NAME is missing. Please set PINECONE_INDEX_NAME.");
      }
  } else {
      pineconeIndex = pinecone.index(indexName);
  }


  if (!pineconeIndex) {
    throw new Error("Failed to initialize Pinecone index. Check your PINECONE_INDEX_NAME and PINECONE_API_KEY.");
  }
  
  console.log("Pinecone index connection established.");
  return pineconeIndex;
}


// --- Flows ---

export const retrieveUserMemory = ai.defineFlow(
  {
    name: 'retrieveUserMemoryPinecone',
    inputSchema: RetrieveUserMemoryInputSchema,
    outputSchema: RetrieveUserMemoryOutputSchema,
  },
  async (input) => {
    console.log(`Retrieving memory for user ${input.userId} based on query: "${input.currentQuery}"`);

    try {
      const index = await getPineconeIndex();
      
      const {embedding} = await ai.embedText({
        text: input.currentQuery,
        // Genkit will use the default embedder specified in genkit.ts ('googleai/text-embedding-004')
      });

      const queryResponse = await index.query({
        vector: embedding,
        topK: input.limit || 3,
        filter: { userId: input.userId }, // Assumes 'userId' is stored in metadata
        includeMetadata: true,
        includeValues: false, // We don't need the vectors themselves back
      });
      
      const snippets = queryResponse.matches?.map(match => {
        const metadata = match.metadata as Record<string, any> | undefined;
        return {
          id: match.id,
          text: metadata?.textSnippet as string || "Error: textSnippet not found in metadata",
          score: match.score,
          metadata: metadata,
        };
      }) || [];
      
      if (snippets.length === 0) {
        console.log("No relevant snippets found in Pinecone for this query and user.");
      }

      const retrievedContext = snippets
        .map(snippet => `- ${snippet.text} (similarity: ${snippet.score?.toFixed(2) || 'N/A'})`)
        .join("\n");
      
      return { 
        retrievedContext: retrievedContext || "No specific long-term context found for this query.",
        debugSnippets: snippets 
      };

    } catch (error: any) {
      console.error("Error retrieving user memory from Pinecone:", error);
      // Consider if this should throw or return an error state to the LLM
      return { 
        retrievedContext: `SYSTEM_NOTE: Error accessing long-term memory: ${error.message || "Unknown error"}. Proceeding without it.`,
        debugSnippets: []
      };
    }
  }
);

export const storeUserMemorySnippet = ai.defineFlow(
  {
    name: 'storeUserMemorySnippetPinecone',
    inputSchema: StoreUserMemorySnippetInputSchema,
    outputSchema: StoreUserMemorySnippetOutputSchema,
  },
  async (input) => {
    console.log(`Storing memory snippet for user ${input.userId}: "${input.textSnippet.substring(0,100)}..."`);

    try {
      const index = await getPineconeIndex();
      
      const {embedding} = await ai.embedText({
        text: input.textSnippet,
      });

      // Generate a unique ID for the vector. Consider if a more deterministic ID is needed.
      const snippetId = `user-${input.userId}-mem-${Date.now()}-${Math.random().toString(36).substring(2,9)}`;
      
      await index.upsert([{
        id: snippetId,
        values: embedding,
        metadata: {
          userId: input.userId,
          textSnippet: input.textSnippet, // Store the original text for retrieval and context building
          createdAt: new Date().toISOString(),
          ...input.metadata, // Include any other metadata passed
        },
      }]);
      
      console.log(`Successfully stored snippet ${snippetId} to Pinecone.`);
      return { success: true, snippetId: snippetId };

    } catch (error: any) {
      console.error("Error storing user memory snippet to Pinecone:", error);
      return { success: false, error: error.message || "Unknown error" };
    }
  }
);


// Exported wrapper functions for client-side usage or other flows
export async function retrieveUserMemoryFromDB(input: RetrieveUserMemoryInput): Promise<RetrieveUserMemoryOutput> {
  return retrieveUserMemory(input);
}

export async function storeUserMemoryInDB(input: StoreUserMemorySnippetInput): Promise<StoreUserMemorySnippetOutput> {
  return storeUserMemorySnippet(input);
}
