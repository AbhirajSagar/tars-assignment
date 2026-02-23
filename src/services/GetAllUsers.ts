import { api } from "../../convex/_generated/api";
import { clerkClient } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";

export default async function GetAllUsers() 
{
    const fetchedUsers = await fetchQuery(api.users.getAllUsers);
    const client = await clerkClient();

    const clerkUsers = await client.users.getUserList({ userId: fetchedUsers.map(u => u.clerk_id) });
    const usersWithPics = fetchedUsers.map(u => 
    {
        const cUser = clerkUsers.data.find(c => c.id === u.clerk_id);
        return { ...u, profileImageUrl: cUser?.imageUrl || null};
    });

    return usersWithPics;
}