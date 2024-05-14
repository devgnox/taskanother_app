import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./schema";
import { Card } from "@prisma/client";

export type InputType = z.infer<typeof UpdateCardOrder>;

export type ReturnType = ActionState<InputType, Card[]>;
