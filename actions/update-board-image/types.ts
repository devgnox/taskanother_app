import { z } from "zod";
import { Board } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { UpdateBoardImage } from "./schema";

export type InputType=z.infer<typeof UpdateBoardImage>;

export type ReturnType=ActionState<InputType,Board>;
