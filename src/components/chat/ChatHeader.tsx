import { CircleChevronLeft } from "lucide-react";

interface ChatHeaderProps 
{
    to_user_name: string;
    onBack: () => void;
}

export default function ChatHeader({ to_user_name, onBack }: ChatHeaderProps) 
{
    return (
        <div className="w-full bg-gray-800 h-12 mb-4 flex gap-1 justify-start items-center p-1">
            <button onClick={onBack} className="flex md:hidden justify-center items-center px-2 h-full rounded text-white/70">
                <CircleChevronLeft />
            </button>
            <p className="h-full ml-1 flex items-center font-semibold text-xl text-white/70">
                {to_user_name}
            </p>
        </div>
    );
}
