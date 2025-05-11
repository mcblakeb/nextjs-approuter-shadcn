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

export type { CardGroup, CategoryGrouping, AIResponse };
