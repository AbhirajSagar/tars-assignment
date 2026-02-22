import {mutation, query} from './_generated/server'
import {v} from 'convex/values'

export const getMessagesByConversationId = query
({
    args: {conversationid: v.id('conversations')},
    handler: async(ctx, args)=>
    {
        const messages = ctx.db
        .query('messages')
        .filter((q) => q.eq(q.field('conversationId'), args.conversationid))
        .collect();
        
        return messages;
    }
})

export const markAllMessagesRead = mutation
({
    args: { conversationId: v.id('conversations'), from_clerk_id: v.string() },
    handler: async (ctx, args) => 
    {
        const unreadMessages = await ctx.db.query('messages')
            .filter
            (
                (q) => q.and
                (
                    q.eq(q.field('conversationId'), args.conversationId), 
                    q.neq(q.field('from'), args.from_clerk_id),
                    q.neq(q.field('read'), true)
                )
            )
            .collect();

        const patchPromises = unreadMessages.map((msg) => ctx.db.patch(msg._id, { read: true }));
        await Promise.all(patchPromises);
    }
});

export const getUnreadMessageCount = query
({
    args: {conversationId: v.id('conversations'), from_clerk_id: v.string() },
    handler: async(ctx, args) =>
    {
        const messages = await ctx.db
        .query('messages')
        .filter((q) => q.and(q.eq(q.field('conversationId'), args.conversationId), q.eq(q.field('read'), false), q.neq(q.field('from'), args.from_clerk_id)))
        .collect();

        return messages.length;
    }
})

export const getLatestMessage = query
({
    args: {conversationid: v.id('conversations')},
    handler: async(ctx, args) =>
    {
        const messages = await ctx.db
        .query('messages')
        .filter((q) => q.eq(q.field('conversationId'), args.conversationid))
        .order('desc')
        .first();

        return messages;
    }
})

export const softDeleteMessage = mutation
({
    args: {messageId: v.id('messages')},
    handler: async(ctx, args) =>
    {
        const message = await ctx.db.get(args.messageId);
        if (!message) return;

        if (message.deleted) return;
        await ctx.db.patch(args.messageId, { deleted: true });
    }
})

export const createNewMessage = mutation
({
    args: {
        content: v.string(),
        from: v.string(),
        to: v.string(),
        conversationId: v.id('conversations'),
    },
    handler: async(ctx, args)=>
    {
        const newMessage = await ctx.db.insert('messages',
        {
            content: args.content,
            from: args.from,
            to: args.to,
            conversationId: args.conversationId,
            read: false,
            deleted: false
        });

        // Need to clear the is typing status when message is sent
        const conversation = await ctx.db.get(args.conversationId);
        if (conversation && conversation.typing) 
        {
            const typing = { ...conversation.typing };
            delete typing[args.from];
            await ctx.db.patch(args.conversationId, { typing });
        }

        return newMessage;
    }
})
