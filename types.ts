import { Card, Link, List, ImageCard } from "@prisma/client";

// export type ListWithCards = List & { cards: Card[]  };

export type ListWithCards = List & { 
  cards: (Card & { links: Link[]; images: ImageCard[] })[]; 
};

export type CardWithList = Card & {
  list: List;
  links: Link[];
  images: ImageCard[];
};

export type UserClerk = import("@clerk/backend").User | undefined;

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};
