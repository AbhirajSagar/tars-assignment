import { SendIcon } from "lucide-react";

interface MessageInputProps 
{
    message: string;
    onChange: (value: string) => void;
    onSend: () => void;
}

export default function MessageInput({ message, onChange, onSend }: MessageInputProps) 
{
    return (
        <div className="flex flex-col gap-1 bottom-3 w-full p-2">
            <div className="flex h-12 gap-1 w-full">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSend()}
                    placeholder="Enter your message...."
                    className="focus:outline-0 focus:bg-gray-700 px-5 w-full h-full bg-gray-800 rounded-l-md"
                />
                <SendIcon
                    onClick={onSend}
                    fill="white"
                    className="h-12 cursor-pointer hover:bg-gray-700 w-12 p-2 bg-gray-800 rounded-r-md"
                />
            </div>
        </div>
    );
}
