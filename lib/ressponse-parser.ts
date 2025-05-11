'use server';

import { v4 as uuidv4 } from 'uuid';
import { updateCardsWithGrouping, createAIGeneratedCard } from './retro';
import { createDbConnection } from './database';

type CardGroup = {
  cardIds: number[];
  explanation: string;
};

type CategoryGrouping = {
  categoryId: number;
  groups: CardGroup[];
};

type AIResponse = {
  categoryGroupings: CategoryGrouping[];
  overallExplanation: string;
};

type AICardInput = {
  id: number;
  content: string;
  userId: number;
  categoryId: number;
  category: string;
  guid: string;
  likes?: number;
  likedBy?: number[];
  user: {
    id: number;
    name: string;
  };
};

export async function createAiCards(
  response: AIResponse,
  retroId: number,
  createdByUser: number
) {
  const db = await createDbConnection();
  const updatedCards = [];

  for (const categoryGrouping of response.categoryGroupings) {
    for (const group of categoryGrouping.groups) {
      // Only process groups with 2 or more cards
      if (group.cardIds.length < 2) {
        continue;
      }

      // Generate a unique grouping GUID for this group
      const groupingGuid = uuidv4();

      // Update existing cards with the grouping GUID
      const cardIds = group.cardIds;
      await updateCardsWithGrouping(cardIds, groupingGuid, db);

      // Create a new AI-generated card for the explanation
      await createAIGeneratedCard(
        {
          groupingGuid,
          content: group.explanation,
          categoryId: categoryGrouping.categoryId,
          userId: createdByUser,
          retroId,
        },
        db
      );

      // Add the updated cards to our result
      updatedCards.push(...cardIds);
    }
  }

  return {
    updatedCardIds: updatedCards,
    overallExplanation: response.overallExplanation,
  };
}

export type { CardGroup, CategoryGrouping, AIResponse, AICardInput };
