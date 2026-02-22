'use client';

import { useState } from "react";
import { UserData } from "@/types/UserData";
import { CircleQuestionMarkIcon, MessageCircle, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useConvex } from "convex/react";
import { api } from '../../convex/_generated/api';
import PresenceProvider from "./PresenceProvider";

export default function UsersListPage({ users, curUserId } : { users: UserData[], curUserId: string })
{
    const [search, setSearch] = useState<string>('');
    const [now] = useState(() => Date.now())
    const [filteredUsers] = useState(users.filter(user =>
    (
        user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )));

    const createConversationMut = useMutation(api.conversations.createNewConversation);
    const convex = useConvex();
    const router = useRouter();

    function updateSearch(e: React.ChangeEvent<HTMLInputElement>)
    {
        setSearch(e.target.value);
    }

    async function createConversation(user_id: string, user_name: string)
    {
        const conversation = await createConversationMut({ userids: [user_id, curUserId].sort() });
        router.push(`/conversation/${conversation}?to=${user_id}&to_name=${user_name}`);
    }

    async function openLastConversation(user_id: string, user_name: string)
    {
        const conversation = await convex.query
        (
            api.conversations.getLatestConversation,
            { users: [user_id, curUserId].sort() }
        );

        if(conversation)
        router.push(`/conversation/${conversation._id}?to=${user_id}&to_name=${user_name}`);
        else alert('No Conversations Found, Create New Chat Instead')
    }

    function isUserOnline(lastSeen: Date)
    {
        // user will be considered online when lastSeen is updated maximum within 1 minute
        return now - lastSeen.getTime() < 1 * 60 * 1000;
    }

    return (
        <div className="w-full h-[calc(100vh-4rem)] bg-gray-900 p-4 sm:p-8">
            <PresenceProvider userId={curUserId}/>
            <SearchBar search={search} updateSearch={updateSearch}/>
            <div className="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ResultArea 
                    filteredUsers={filteredUsers}
                    search={search}
                    createConversation={createConversation}
                    openLastConversation={openLastConversation}
                    isUserOnline={isUserOnline}
                />
            </div>
        </div>
    )
}

function ResultArea({filteredUsers, search, createConversation, openLastConversation, isUserOnline} : {filteredUsers: UserData[], search: string, createConversation: (id: string, name: string) => void, openLastConversation: (id: string, name: string) => void, isUserOnline: (lastSeen: Date) => boolean})
{
    if(filteredUsers.length == 0) return <NoUsers/>
    
    function Name({user}: {user: UserData})
    {
        return (
            <h2>
                <HighlightedText text={user.firstName || ''} term={search} className=""/>
                {' '}
                <HighlightedText text={user.lastName || ''} term={search} className=""/>
            </h2>
        )
    }

    return  ( 
        filteredUsers.map((user) => 
        (
            <div key={user.id} className="w-full relative cursor-pointer shadow-xl outline-gray-700 duration-150 rounded-lg mb-2 bg-gray-800 px-4 py-3">
                <div className="mb-5 flex justify-center items-center flex-col">
                    <img alt="Profile Picture" src={user.profileImageUrl} className="w-25 h-25 rounded-full mb-2"/>
                    <Name user={user}/>
                    <HighlightedText text={user.email} term={search} className='text-sm text-white/50 text-center w-full'/>
                </div>
                <div className="w-full flex justify-center items-center gap-1">
                    <div onClick={() => openLastConversation(user.id, user.firstName ?? 'Unknown')} className="w-max grow bg-gray-900 hover:bg-gray-700 flex justify-center items-center gap-2 p-2 rounded-md">
                        <MessageCircle  
                            size={20} 
                        />
                        <p className="text-xs">Open Conversations</p>
                    </div>
                    
                    <div onClick={() => createConversation(user.id, user.firstName ?? 'Unknown')} className="w-max grow bg-gray-900 hover:bg-gray-700 flex justify-center items-center gap-2 p-2 rounded-md">
                        <PlusCircle  
                            size={20} 
                        />
                        <p className="text-xs">New Chat</p>
                    </div>
                    {isUserOnline(user.lastSeen) && <Online/>}
                </div>
            </div>
        ))
    );
}

function NoUsers()
{
    return (
        <div className="w-full px-4 h-full rounded-lg flex justify-center items-center flex-col py-6 bg-gray-800">
            <CircleQuestionMarkIcon fill="grey" size={75} className="mb-2"/>
            <h2 className="font-semibold">No Users Found</h2>
        </div>
    );
}

function Online()
{
    return <h2 className="absolute top-4 right-5 bg-green-500 px-2 rounded-full text-gray-900">Online</h2>
}

function HighlightedText({ text, term, className }: { text: string; term: string, className: string })
{
    if (!term) return <span className={className}>{text}</span>;

    const index = text.toLowerCase().indexOf(term.toLocaleLowerCase());
    if (index === -1) return <span>{text}</span>;

    const before = text.slice(0, index);
    const match = text.slice(index, index + term.length);
    const after = text.slice(index + term.length);

    return (
        <span className={className}>
            {before}
            <mark className="bg-indigo-500 text-white">{match}</mark>
            {after}
        </span>
    );
}

function SearchBar({search, updateSearch} : {search: string, updateSearch: (e: React.ChangeEvent<HTMLInputElement>) => void})
{
    return (
        <div className="w-full mb-4 max-w-3xl mx-auto">
            <input 
                type="text" 
                placeholder="Search users..." 
                value={search}
                onChange={updateSearch}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
        </div>
    )
}