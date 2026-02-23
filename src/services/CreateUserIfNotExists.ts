import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { UserData } from "@/types/UserData";

export default async function CreateUserIfNotExists(user: UserData) 
{
    const fetchedUser = await fetchQuery(api.users.getUserById, { clerk_id: user.id });
    if(fetchedUser.length > 0) return fetchedUser;

    const createdUser = await fetchMutation(api.users.createUser, 
    {
        clerk_id: user.id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
    });
    
    return createdUser;
}