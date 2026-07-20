import { getMe } from "@/features/auth/signIn/api/me";
import { logOutAction } from "@/features/auth/logOut/api/logOut";

export default async function ContactPage() {
  const user = await getMe();

  return (
    <>
      HELLO {user?.email}
      <form action={logOutAction}>
        <button type='submit'>{"Log Out"}</button>
      </form>
    </>
  );
}
