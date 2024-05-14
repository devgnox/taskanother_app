"use client";

import { Skeleton } from "@/components/ui/skeleton";
import LinkAttachment from "./LinkAttachment";

import { PaperclipIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import ImageAttachment from "./ImageAttachment";
import { ImageCard, Link as LinkType } from "@prisma/client";
import CardLinkItem from "./CardLinkItem";
import CardImageItem from "./CardImageItem";

interface ICardAttachmentProps {
  cardId: string;
  links?: LinkType[];
  images?: ImageCard[];
}

const CardAttachment = ({ cardId, links, images }: ICardAttachmentProps) => {
  return (
    <div className="flex items-start gap-x-3 ">
      <div className="w-auto">
        <PaperclipIcon className="w-5 h-5 mr-2 text-neutral-700" />
      </div>
      <div className="w-full">
        <div className="flex justify-between items-start mb-2 w-full md:w-[90%]">
        <p className="font-semibold text-neutral-700 ">Attachments</p>
          <div className="flex gap-1">
            <LinkAttachment cardId={cardId} />
            <ImageAttachment cardId={cardId} />
          </div>
        </div>
        {links?.length === 0 && images?.length === 0 ? (
          <div className="py-2 px-3 bg-neutral-100 text-sm">No attachments</div>
        ) : (
          <>
          {links!==undefined && links?.length>0 && ( <div className="min-h-[50px] text-sm font-medium py-3 rounded-md mb-1 flex flex-col gap-1">
              {links?.map((link) => (
                <CardLinkItem
                  id={link.id}
                  cardId={cardId}
                  source={link.source}
                  url={link.url}
                  key={link.id}
                />
              ))}
            </div>)}
           {images!==undefined && images?.length>0 && (<div className="min-h-[78px] py-3 rounded-md mb-1 flex gap-2 flex-wrap">
              {/* images */}
              {images?.map((img, idx) => (
                <CardImageItem index={idx} key={img.url} title={img.title} id={img.id} cardId={cardId} url={img.url} />
              ))}
            </div>)}
           
          </>
        )}
      </div>
    </div>
  );
};

CardAttachment.Skeleton = function CardAttachmentSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};

export default CardAttachment;
