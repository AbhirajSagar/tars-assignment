import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
{
    conversations: defineTable(
    {
        users: v.array(v.string()),
        typing: v.optional(v.record(v.string(), v.number()))
    }),
    messages: defineTable(
    {
        content: v.string(),
        from: v.string(),
        to: v.string(),
        read: v.boolean(),
        conversationId: v.id("conversations"),
    }),
    users: defineTable(
    {
        clerk_id: v.string(),
        name: v.string(),
        email: v.string(),
        lastSeen: v.number()
    })
});