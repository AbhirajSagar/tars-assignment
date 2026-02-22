import { mutation, query } from './_generated/server';
import { v } from "convex/values";

export const getMyConversations = query
({
  args: { userId: v.string() },
  handler: async (ctx, args) => 
  {
    const conversations = await ctx.db.query("conversations").collect();
    const myConversations = conversations.filter((c) => c.users.includes(args.userId));

    const promisesArr = myConversations.map(async (conversation) => 
    {
      const latestMessage = await ctx.db.query("messages")
        .filter((q) => q.eq(q.field("conversationId"), conversation._id))
        .order("desc")
        .first();

      const unreadMessages = await ctx.db.query("messages")
      .filter((q) =>
        q.and
        (
          q.eq(q.field("conversationId"), conversation._id),
          q.eq(q.field("read"), false),
          q.neq(q.field("from"), args.userId)
        )
      ).collect();
      
      const unreadCount = unreadMessages.length;
      const otherUserId = conversation.users.find((id) => id !== args.userId);
      const otherUser = otherUserId ? await ctx.db.query("users").filter((q) => q.eq(q.field("clerk_id"), otherUserId)).first() : null;

      return { ...conversation, latestMessage, unreadCount, otherUser };
    });

    const results = await Promise.all(promisesArr);
    return results;
  },
});

export const getConversationsWithLatestMessage = query
({
    args: { userids: v.array(v.string()) },
    handler: async (ctx, args) =>
    {
        const conversations = await ctx.db
        .query("conversations")
        .filter(q => q.eq(q.field("users"), args.userids))
        .collect();

        const results = await Promise.all
        (
          conversations.map(async (conversation) =>
          {
            const latestMessage = await ctx.db.query("messages")
            .filter(q => q.eq(q.field("conversationId"), conversation._id))
            .order("desc")
            .first();

            return { ...conversation, latestMessage};
          })
        );

        return results;
    }
});

export const getLatestConversation = query
({
    args: {users : v.array(v.string())},
    handler: async (ctx, args) =>
    {
      const conversation = await ctx.db
      .query("conversations")
      .filter(q => q.eq(q.field("users"), args.users))
      .order("desc")
      .first();

      return conversation;
    }
})

export const updateTypingStatus = mutation
({
  args: { conversationId: v.id("conversations"), clerk_id: v.string() },
  handler: async (ctx, args) =>
  {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return;

    const typing = conversation.typing || {};
    typing[args.clerk_id] = Date.now();

    await ctx.db.patch(args.conversationId, { typing });
  }
})

export const createNewConversation = mutation
({
  args: { userids: v.array(v.string()) },
  handler: async (ctx, args) =>
  {
    const newConversation = await ctx.db.insert("conversations", 
    {
      users: args.userids,
    });

    return newConversation;
  }
})