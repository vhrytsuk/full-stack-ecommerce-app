import { getMe } from "@/features/auth/signIn/api/me";

export default async function ContactPage() {
  const user = await getMe();

  return <>HELLO {user?.email}</>;
}
