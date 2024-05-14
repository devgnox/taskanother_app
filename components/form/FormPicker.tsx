"use client";
import { defaultImages } from "@/constants/images";
import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import FormErrors from "./FormErrors";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useOrganization, useUser } from "@clerk/nextjs";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[]> | undefined;
}

const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();
  const [images, setImages] = useState<Array<Record<string, any>>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const { user } = useUser();
  const { organization: org } = useOrganization();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });

        if (result && result.response) {
          const fetchedImages = result.response as Array<Record<string, any>>;
          setImages(fetchedImages);
        } else {
          toast.error('Failed to fetch Images. Please Reload');
        }
      } catch (error) {
        
        setImages([defaultImages]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleUploadOwnImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let files: FileList | null = e?.currentTarget?.files;
    if (!files) return toast.error("couldn't upload image");
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "dlxrvlud");

    fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setImages([
          ...images,
          {
            id: data.asset_id,
            links: { html: null },
            urls: { thumb: data.url, full: data.url },
            user: { name: `${user?.firstName}, ${org?.name}` },
            alt_description: "background",
          },
        ]);
        setSelectedImageId(data.asset_id);
      });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-sky-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <p className="text-neutral-700 font-semibold text-xs mb-2">
        Select a background for your board
      </p>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images?.map((img) => (
          <div
            key={img.id}
            className={cn(
              "aspect-video relative transition group hover:opacity-75 bg-muted shadow-sm cursor-pointer",
              pending && "opacity-50 hover:opacity-100 cursor-auto"
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(img.id);
            }}
          >
            <input
              type="radio"
              name={id}
              id={id}
              className="hidden"
              defaultChecked={selectedImageId === img.id}
              disabled={pending}
              defaultValue={`${img.id}|${img.urls.thumb}|${img.urls.full}|${img.links.html}|${img.user.name}`}
            />
            <Image
              src={img.urls.thumb}
              alt={img.alt_description}
              fill
              className="object-cover rounded-sm"
            />
            {selectedImageId === img.id && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            {img.links.html === null ? (
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:no-underline p-1 bg-black/50">
                {img.user.name}
              </div>
            ) : (
              <Link
                href={img.links.html}
                target="_blank"
                className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:no-underline p-1 bg-black/50"
              >
                {img.user.name}
              </Link>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-right font-semibold text-neutral-600 mb-1">
        Upload your own
      </p>
      <Input id="imageUploader" type="file" onChange={handleUploadOwnImage}/>
      <FormErrors id="imageUploader" errors={errors} />
      <FormErrors id="image" errors={errors} />
    </div>
  );
};

export default FormPicker;
