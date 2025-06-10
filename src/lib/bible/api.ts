
import type { BibleChapterResponseAPI, BibleVerseAPI } from '@/types';

const BIBLE_API_BASE_URL = 'https://bible-api.com';

/**
 * Fetches a chapter or a specific verse/range from the KJV Bible.
 * @param book The name of the book (e.g., "Genesis", "John").
 * @param chapter The chapter number.
 * @param verse Optional. The specific verse number to fetch.
 * @param endVerse Optional. If fetching a range, the end verse number.
 * @returns A Promise resolving to the API response.
 */
export async function fetchKJVPassage(
  book: string,
  chapter: number,
  verse?: number,
  endVerse?: number
): Promise<BibleChapterResponseAPI> {
  let passageQuery = `${book} ${chapter}`;
  if (verse) {
    passageQuery += `:${verse}`;
    if (endVerse && endVerse > verse) {
      passageQuery += `-${endVerse}`;
    }
  }

  const url = `${BIBLE_API_BASE_URL}/${encodeURIComponent(passageQuery)}?translation=kjv&verse_numbers=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Network response was not ok and error details could not be parsed." }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    const data: BibleChapterResponseAPI = await response.json();
    // The API sometimes returns verse numbers as part of the text. 
    // We might want to clean this up or ensure the verse_numbers=true parameter works as expected.
    // For now, we assume the 'verses' array contains individual verse objects.
    return data;
  } catch (error) {
    console.error("Error fetching KJV passage:", error);
    throw error; // Re-throw to be handled by the caller
  }
}

/**
 * Fetches the text of a specific verse or range for AI explanation.
 * This ensures the AI gets the exact KJV text.
 */
export async function fetchVerseTextForAI(reference: string): Promise<string> {
    const url = `${BIBLE_API_BASE_URL}/${encodeURIComponent(reference)}?translation=kjv`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Failed to fetch verse text." }));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: BibleChapterResponseAPI = await response.json();
        return data.text.trim(); // The API returns the concatenated text of the verses in the 'text' field
    } catch (error) {
        console.error("Error fetching verse text for AI:", error);
        throw error;
    }
}
