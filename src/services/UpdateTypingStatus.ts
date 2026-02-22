import { fetchMutation } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default async function UpdateTypingStatus(conversationId: Id<"conversations">, clerk_id: string) 
{
    const result = await fetchMutation(api.conversations.updateTypingStatus, {conversationId, clerk_id});
    return result;
}