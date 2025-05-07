'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Card {
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
}

interface CardGroup {
  cardIds: number[];
  explanation: string;
}

interface CategoryGrouping {
  categoryId: number;
  groups: CardGroup[];
}

interface GroupingResponse {
  categoryGroupings: CategoryGrouping[];
  overallExplanation: string;
}

export async function getCardsGroupingAiResponse(
  cards: Card[]
): Promise<GroupingResponse> {
  if (cards.length === 0) {
    return {
      categoryGroupings: [],
      overallExplanation: 'No cards to group',
    };
  }

  const prompt = `You are an expert at analyzing software development team retrospectives. Your task is to identify patterns and group similar cards that discuss related technical, process, or team issues. Look for common themes like:

  - Technical issues (e.g., database performance, API integration problems, deployment challenges)
  - Process improvements (e.g., sprint planning, code review practices, testing strategies)
  - Team communication (e.g., cross-team collaboration, documentation gaps, knowledge sharing)
  - Infrastructure concerns (e.g., CI/CD pipeline issues, environment setup, monitoring)
  - Code quality (e.g., technical debt, refactoring needs, architecture decisions)

  For example, if multiple cards mention:
  - "Database queries are slow" and "Need to optimize SQL indexes" → These cards indicate database performance issues.
  - "Missing documentation for API endpoints" and "New team members struggle to understand the system" → The cards indicate a lack of documentation and knowledge sharing.
  - "Deployment takes too long" and "CI pipeline is unreliable" → Infrastructure issues.

  Lighthearted cards like "I'm grateful for..." or "What went well...", "Had Fun", "Dave did a good job" should not be grouped together.

  Analyze the following retro cards and group them by similarity. If there are no clear similarities, keep them as individual groups.

  Cards:
  ${cards
    .map(
      (card) =>
        `- ID: ${card.id}, Category: ${card.categoryId}, Content: ${card.content}`
    )
    .join('\n')}

  Respond with a JSON object in this format:
  {
    "categoryGroupings": [
      {
        "categoryId": number,
        "groups": [
          {
            "cardIds": [array of card IDs],
            "explanation": "explanation of why these cards are grouped together, focusing on the specific technical or team aspects they share"
          }
        ]
      }
    ],
    "overallExplanation": "A short summary of the overall groupings for the entire software retrospective."
  }`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a specialized assistant that analyzes software development team retrospectives. You excel at identifying patterns in technical issues, process improvements, and team dynamics. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in GPT response');
    }

    const response = JSON.parse(content) as GroupingResponse;
    return response;
  } catch (error) {
    console.error('Error grouping cards:', error);
    return {
      categoryGroupings: cards.map((card) => ({
        categoryId: card.categoryId,
        groups: [
          {
            cardIds: [card.id],
            explanation: 'Error occurred during grouping',
          },
        ],
      })),
      overallExplanation: 'Error occurred during grouping process',
    };
  }
}
