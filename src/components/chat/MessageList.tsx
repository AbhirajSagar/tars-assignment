import { useRef, useEffect, useState } from "react";
import { MessageCircle, ArrowDown, Trash } from "lucide-react";
import GetDifferenceTimeLabel from "@/utils/GetDifferenceTimeLabel";
import { Id } from "../../../convex/_generated/dataModel";

interface Message 
{
    _id: Id<"messages">;
    content: string;
    from: string;
    _creationTime: number;
    deleted: boolean;
}

interface MessageListProps 
{
    messages: Message[] | undefined;
    currentUserId: string | undefined;
    deleteMessage: (messageId: Id<"messages">) => void;
    isOtherUserTyping: boolean;
}

export default function MessageList({ messages, deleteMessage, currentUserId, isOtherUserTyping }: MessageListProps) 
{
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const prevMessagesLength = useRef<number>(0);
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

    useEffect(() => 
    {
        if (!messages || !scrollContainerRef.current) return;

        const container = scrollContainerRef.current;

        if (prevMessagesLength.current === 0 && messages.length > 0) 
            container.scrollTop = container.scrollHeight;
        else if (messages.length > prevMessagesLength.current) 
        {
            const isScrolledUp = container.scrollHeight - container.scrollTop - container.clientHeight > 100;

            if (isScrolledUp)
                setShowScrollButton(true);
            else
            {
                container.scrollTop = container.scrollHeight;
                setShowScrollButton(false);
            }
        }

        prevMessagesLength.current = messages.length;

    }, [messages]);

    function handleScroll()
    {
        const container = scrollContainerRef.current;
        if (!container) return;

        const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        if (isAtBottom) setShowScrollButton(false);
    };

    function scrollToBottom()
    {
        const container = scrollContainerRef.current;
        if (!container) return;

        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        setShowScrollButton(false);
    };

    return (
        <div className="flex-1 w-full relative min-h-0">
            <div className="w-full h-full flex gap-4 flex-col overflow-y-scroll pb-4" ref={scrollContainerRef} onScroll={handleScroll}>
                {messages?.length === 0 ? <NoConversations /> : <Messages deleteMessage={deleteMessage} messages={messages} currentUserId={currentUserId} />}
                {isOtherUserTyping && <TypingBubbles />}
            </div>
            {showScrollButton && <ScrollButton scrollToBottom={scrollToBottom} />}
        </div>
    );
}

function ScrollButton({scrollToBottom}: { scrollToBottom: () => void})
{
    return (
        <button onClick={scrollToBottom} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all z-10">
            <ArrowDown size={16} />
            <span className="text-sm font-medium">New Messages</span>
        </button>
    )
}

function NoConversations()
{
    return (
        <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
            <MessageCircle fill="white" size={75} />
            <p className="text-2xl font-semibold">
                No Conversations Yet !
            </p>
        </div>
    );
}

function TypingBubbles()
{
    return (
        <div className={`w-full min-h-12 flex justify-center flex-col px-3 items-start`}>
            <div className="bg-gray-800 flex justify-center gap-1 items-center p-3 rounded">
                <div className="bg-white rounded-full w-3 animate-bounce delay-0 h-3"></div>
                <div className="bg-white rounded-full w-3 animate-bounce delay-200 h-3"></div>
                <div className="bg-white rounded-full w-3 animate-bounce delay-400 h-3"></div>
            </div>
        </div>
    )
}

function MessageItem({ message, deleteMessage, currentUserId }: { message: Message, deleteMessage: (id: Id<"messages">) => void, currentUserId: string | undefined }) 
{
    const isMe = message.from === currentUserId;

    return (
        <div className={`w-full flex flex-col px-3 ${isMe ? "items-end" : "items-start"}`}>
            <div className="flex items-end gap-2">
                {!message.deleted && isMe && 
                (
                    <Trash 
                        onClick={() => deleteMessage(message._id)} 
                        className="bg-gray-800 cursor-pointer hover:bg-gray-950 text-white/50 p-3 box-border h-12 w-12 rounded shrink-0"
                    />
                )}
                
                <p className={`${isMe ? "bg-indigo-900" : "bg-gray-800"} p-3 max-w-xs wrap-break-word whitespace-pre-wrap rounded`}>
                    {message.deleted ? 'This message was deleted' : message.content}
                </p>
                
            </div>

            <p className="text-xs text-white/30 mt-1">
                {GetDifferenceTimeLabel(message._creationTime)}
            </p>
        </div>
    );
}

function Messages({ messages, deleteMessage, currentUserId }: { messages: Message[] | undefined, deleteMessage: (messageId: Id<"messages">) => void, currentUserId: string | undefined }) 
{
    if (!messages) return null;

    return (
        <>
            {messages.map((message) => 
            (
                <MessageItem 
                    key={message._id} 
                    message={message} 
                    deleteMessage={deleteMessage} 
                    currentUserId={currentUserId} 
                />
            ))}
        </>
    );
}