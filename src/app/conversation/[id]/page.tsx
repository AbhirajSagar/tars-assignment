"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useSearchParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import { useNow } from "@/hooks/useNow";
import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";

export default function Page() 
{
    const [message, setMessage] = useState<string>('');
    const [conversationVisible, setConversationVisible] = useState<boolean>(true);

    const now = useNow();
    const params = useParams();
    const { user } = useUser();
    const searchParams = useSearchParams();

    const id = params?.id as string;
    const to_user = searchParams.get("to") ?? "";
    const to_user_name = searchParams.get("to_name") ?? "Unknown";

    const conversations = useQuery(api.conversations.getMyConversations, user?.id ? { userId: user.id } : "skip");
    const messages = useQuery(api.messages.getMessagesByConversationId, { conversationid: id as Id<"conversations"> });

    const sendMessageMut = useMutation(api.messages.createNewMessage);
    const markReadMut = useMutation(api.messages.markAllMessagesRead);
    const deleteMessageMut = useMutation(api.messages.softDeleteMessage);
    const updateTypingStatusMut = useMutation(api.conversations.updateTypingStatus);

    useEffect(() => 
    {
        if (id && user?.id) 
            markReadMut({ conversationId: id as Id<"conversations">, from_clerk_id: user.id });
        
    }, [id, user?.id, messages?.length]);

    async function handleMessageSending() 
    {
        if (!message.trim()) return;
        await sendMessageMut
        ({
            content: message,
            conversationId: id as Id<"conversations">,
            from: user?.id ?? "",
            to: to_user
        });

        setMessage('');
    }

    async function handleMessageChange(val: string) 
    {
        setMessage(val);
        
        if (user?.id && id)
            updateTypingStatusMut({ conversationId: id as Id<"conversations">, clerk_id: user.id });
    }

    async function deleteMessage(messageId: Id<"messages">)
    {
        await deleteMessageMut({ messageId: messageId as Id<"messages"> });
    }

    if (!conversations) return null;

    const currentConversation = conversations.find(c => c._id === id);
    const isOtherUserTyping = currentConversation?.typing?.[to_user] ? (now - currentConversation.typing[to_user]) < 2000 : false;

    return (
        <div className="w-full h-[calc(100vh-4rem)] flex justify-center items-center">
            <Sidebar conversations={conversations} curConversationId={id}/>
            <div className={`w-full absolute md:static top-16 left-0 grow h-full bg-gray-900 ${conversationVisible ? "flex" : "hidden md:flex"}`}>
                <div className="w-full h-full flex flex-col justify-between relative">
                    <ChatHeader to_user_name={to_user_name} onBack={() => setConversationVisible(false)}/>
                    <MessageList messages={messages} currentUserId={user?.id} deleteMessage={deleteMessage} isOtherUserTyping={isOtherUserTyping}/>
                    <MessageInput message={message} onChange={handleMessageChange} onSend={handleMessageSending}/>
                </div>
            </div>
        </div>
    );
}
