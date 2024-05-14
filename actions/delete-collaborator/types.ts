import { z } from "zod";
import { Card } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { DeleteCollaborator } from "./schema";

export type InputType=z.infer<typeof DeleteCollaborator>;

export type ReturnType=ActionState<InputType,Card>;
