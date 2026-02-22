import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Header()
{
    return (
        <header className="flex justify-between items-center p-4 gap-2 h-16 bg-gray-900 border-b-1 border-gray-700">
            <Logo/>
            <Authentication/>
        </header>
    )
}

function Logo()
{
    return (
        <div>
            <h1 className="text-xl sm:text-2xl font-bold font-outfit text-indigo-600">
                CONVEX 
                <span className='text-white/70 text-sm'> Chat</span>
            </h1>
        </div>
    );
}

function Authentication()
{
    return (
        <div className='flex gap-2'>
            <SignedOut>
                <SignInButton>
                    <button className="bg-indigo-700 hover:bg-indigo-400 text-white rounded-lg font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        Sign In
                    </button>
                </SignInButton>
                <SignUpButton>
                    <button className="bg-indigo-700 hover:bg-indigo-400 text-white rounded-lg font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        Sign Up
                    </button>
                </SignUpButton>
            </SignedOut>
            
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    );  
}