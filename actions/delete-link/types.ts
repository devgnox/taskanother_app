import { z } from "zod";
import { Link } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { DeleteLink } from "./schema";

export type InputType=z.infer<typeof DeleteLink>;

export type ReturnType=ActionState<InputType,Link>;
