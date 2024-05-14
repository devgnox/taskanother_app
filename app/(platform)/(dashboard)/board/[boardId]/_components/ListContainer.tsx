"use client";
import React, { useEffect, useState } from "react";
import { ListWithCards } from "@/types";
import ListForm from "./ListForm";
import ListItem from "./ListItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface IListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

const ListContainer = ({ boardId, data }: IListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);
  const { execute: executeOrderList } = useAction(updateListOrder, {
    onSuccess:()=>{
      toast.success('Updated')
    },
    onError:(error)=>{
      toast.error(error);
    }
  });
  const { execute: executeOrderCard } = useAction(updateCardOrder, {
    onSuccess:()=>{
      toast.success('Updated')
    },
    onError:(error)=>{
      toast.error(error);
    }
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;
    if (!destination) {
      return;
    }

    //drop in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    //user moves list
    if (type === "list") {
      const items = reOrder(orderedData, source.index, destination.index).map(
        (item, idx) => ({ ...item, order: idx })
      );
      setOrderedData(items);
      executeOrderList({items, boardId})
    }

    //user moves card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );

      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) return;

      //check if card exist
      if (!sourceList.cards) {
        sourceList.cards = [];
      }
      if (!destList.cards) {
        destList.cards = [];
      }

      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reOrder(
          sourceList.cards,
          source.index,
          destination.index
        );
        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });
        sourceList.cards = reorderedCards;
        setOrderedData(newOrderedData);
        executeOrderCard({ boardId, items:reorderedCards})
        //trigger server
        //user moves card to another list
      } else {
        //remove card
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        //assign new listId to the moved card
        movedCard.listId = destination.droppableId;
        //ass card to dest list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        //update order of each card on dest list
        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });
        setOrderedData(newOrderedData);
        executeOrderCard({ boardId, items:destList.cards})

      }
    }
  };

  function reOrder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" direction="horizontal" type="list">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, idx) => {
              return <ListItem key={list.id} index={idx} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
