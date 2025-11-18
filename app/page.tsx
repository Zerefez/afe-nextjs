import { getSession } from "@/shared/lib/auth";
import { getAccountTypeRoute } from "@/modules/auth";
import { redirect } from "next/navigation";
import LoginPage from "./login/page";

export default async function Home() {
  const session = await getSession();

  // Redirect authenticated users to their respective dashboards
  if (session) {
    redirect(getAccountTypeRoute(session.user.accountType));
  }

  return (
    <>
    <h1 className="text-[34px] font-semibold text-center mt-10 text-[var(--color-text-primary)] tracking-tight">Fitness Tracker</h1>
    <LoginPage />
    </>
  );
}
