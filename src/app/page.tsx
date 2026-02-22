import UsersListPage from "@/components/UsersListPage";
import GetAllUsers from "@/services/GetAllUsers";
import { type UserData } from "@/types/UserData";
import { currentUser } from "@clerk/nextjs/server";
import {RedirectToSignIn} from "@clerk/nextjs";
import CreateUserIfNotExists from "@/services/CreateUserIfNotExists";

export default async function Home()
{
  const user = await currentUser();
  const userId = user?.id;
  
  if(!userId) return <RedirectToSignIn/>;

  const userData: UserData = 
  {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0].emailAddress,
    lastSeen: new Date(),
    profileImageUrl: user.imageUrl
  }

  await CreateUserIfNotExists(userData);

  const users = await GetAllUsers();
  const data = users
  .filter((user) => user.clerk_id !== userId)
  .map((user) =>
  {
    const userData: UserData = 
    {
      id: user.clerk_id,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1],
      email: user.email,
      lastSeen: new Date(user.lastSeen),
      profileImageUrl: user.profileImageUrl
    }

    return userData;
  });

  return <UsersListPage users={data} curUserId={userId}/>;
}