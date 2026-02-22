import Link from "next/link";
import GetDifferenceTimeLabel from "@/utils/GetDifferenceTimeLabel";
import { Clock } from "lucide-react";
import { type ConversationsData } from "@/types/ConversationsData";

export default function Sidebar({ conversations, curConversationId } : { conversations: ConversationsData[], curConversationId: string})
{
    return (
        <div className="w-2xl h-full bg-gray-900 border-r relative overflow-y-auto border-gray-700">
            {
                conversations.map((conversation) =>
                {
                    const otherUser = conversation.otherUser;
                    return (
                    <Link href={`/conversation/${conversation._id}?to=${otherUser?.clerk_id}&to_name=${otherUser?.name}`} key={conversation._id} 
                        className={`cursor-pointer hover:bg-gray-800 w-full flex-col h-auto ${curConversationId == conversation._id ? "bg-gray-800" : "bg-gray-900"} border-b border-gray-800 flex p-4 text-white/50`}>
                        
                        <div className="flex justify-between items-center w-full mb-1">
                            <h3 className="text-white font-semibold text-sm">
                                {otherUser?.name || "Unknown User"}
                            </h3>
                            <h2 className="text-xs flex gap-1 justify-start items-center">
                                <Clock size={14} />
                                {GetDifferenceTimeLabel(conversation._creationTime)}
                            </h2>
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <p className="text-sm text-white/60 truncate w-3/4">
                                { conversation?.latestMessage ? (conversation.latestMessage.deleted ? 'This message was deleted' : conversation.latestMessage.content) : "No Messages Available" }
                            </p>
                            {conversation.unreadCount > 0 && (
                                <div className="bg-red-600 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                                    {conversation.unreadCount}
                                </div>
                            )}
                        </div>
                    </Link>
                    )
                })
            }
        </div>
    );
}