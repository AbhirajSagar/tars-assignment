import {mutation, query} from './_generated/server'
import {v} from 'convex/values'

export const getAllUsers = query
({
    args: {},
    handler: async (ctx)=>
    {
        const users = await ctx.db.query('users').collect();
        return users;
    }
})

export const getUserById = query
({
    args: { clerk_id: v.string() },
    handler: async (ctx, args)=>
    {
        const user = await ctx.db.query('users')
        .filter((q) => q.eq(q.field('clerk_id'), args.clerk_id))
        .collect();

        return user;
    }
})

export const createUser = mutation
({
    args: 
    {
        clerk_id: v.string(),
        name: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args)=>
    {
        const newUser = await ctx.db.insert('users',
        {
            clerk_id: args.clerk_id,
            name: args.name,
            email: args.email,
            lastSeen: Date.now()
        });

        return newUser;
    }
})

export const updateUserStatus = mutation
({
    args: {clerk_id: v.string(), current: v.number()},
    handler: async(ctx, args)=>
    {
        const user = await ctx.db.query('users').filter((q) => q.eq(q.field('clerk_id'), args.clerk_id)).collect();
        const updatedUser = ctx.db.patch('users', user[0]._id, {lastSeen: args.current});
        return updatedUser;
    }
})