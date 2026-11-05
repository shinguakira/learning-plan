import type { PostApiStrengthResponse, PutApiStrengthByIdData } from "@/api/generated"

export type Strength = PostApiStrengthResponse

export type StrengthDraft = PutApiStrengthByIdData["body"]
