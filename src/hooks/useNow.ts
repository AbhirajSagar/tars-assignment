import { useState, useEffect } from "react";

export function useNow(updateInterval: number = 1000)
{
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => 
    {
        const intervalId = setInterval(() => setNow(Date.now()), updateInterval);
        return () => clearInterval(intervalId);

    }, [updateInterval]);

    return now;
}