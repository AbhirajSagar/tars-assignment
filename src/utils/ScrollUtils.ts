import { RefObject } from "react";

function handleScroll(scrollContainerRef: RefObject<HTMLDivElement>)
{
    const isNearBottom = getDistanceFromBottom() < 50;
    if (isNearBottom) setShowScrollButton(false);
}

function getDistanceFromBottom(scrollContainerRef: RefObject<HTMLDivElement>)
{
    const container = scrollContainerRef.current;
    if (!container) return 0;

    const passedSection = container.scrollTop;
    const visibleSection = container.clientHeight;

    const currentPosition = passedSection + visibleSection;
    const distanceFromBottom = container.scrollHeight - currentPosition;

    return distanceFromBottom;
}

function scrollToBottom(scrollContainerRef: RefObject<HTMLDivElement)> 
{
    const container = scrollContainerRef.current;
    if (container) 
    {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        setShowScrollButton(false);
    }
};