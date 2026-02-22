import { fetchMutation } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export default async function UpdateUserStatus(clerk_id: string) 
{
    const result = await fetchMutation(api.users.updateUserStatus, {clerk_id : clerk_id, current: Date.now() } );
    return result;
}