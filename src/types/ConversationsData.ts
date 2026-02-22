import { Id } from "../../convex/_generated/dataModel"

export type ConversationsData =
{ 
    latestMessage: {
        _id: Id<"messages">;
        _creationTime: number;
        content: string;
        from: string;
        to: string;
        conversationId: Id<"conversations">;
    } | null,
    _id: Id<"conversations">, 
    _creationTime: number,
    users: string[],
    typing?: Record<string, number>,
    unreadCount: number,
    otherUser: {
        _id: Id<"users">;
        _creationTime: number;
        clerk_id: string;
        name: string;
        email: string;
        lastSeen: number;
    } | null
}