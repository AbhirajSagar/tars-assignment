export default function getDifferenceTimeLabel(timestamp: number)
{
    const date = new Date(timestamp);

    if (isToday(date))
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isSameYear(date))
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return date.toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'});
}

function isToday(date: Date)
{
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

function isSameYear(date: Date)
{
    const today = new Date();
    return date.getFullYear() === today.getFullYear();
}