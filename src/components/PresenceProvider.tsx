'use client';

import { useEffect } from "react";
import UpdateUserStatus from "@/services/UpdateUserStatus";

export default function PresenceProvider({userId} : {userId: string})
{
    useEffect(() => 
    {
        const interval = setInterval(() => UpdateUserStatus(userId), 3000);
        return () => clearInterval(interval);
    })

    return null;
}