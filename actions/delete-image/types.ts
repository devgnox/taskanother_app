import { z } from "zod";
import { ImageCard, } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { DeleteImage } from "./schema";

export type InputType=z.infer<typeof DeleteImage>;

export type ReturnType=ActionState<InputType,ImageCard>;
