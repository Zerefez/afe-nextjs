import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  // Redirect authenticated users to their respective dashboards
  if (session) {
    const accountType = session.user.accountType?.toLowerCase();
    if (accountType === 'manager') {
      redirect('/manager/dashboard');
    } else if (accountType === 'personaltrainer') {
      redirect('/trainer/dashboard');
    } else if (accountType === 'client') {
      redirect('/client/dashboard');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <main className="flex flex-col items-center gap-12 p-8 max-w-3xl text-center">
        <div className="space-y-6">
          <h1 className="text-[56px] font-semibold text-black dark:text-white tracking-tight leading-none">
            Fitness
          </h1>
          <p className="text-[19px] text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            Professional workout program management for trainers and clients
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/login">
            <button className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity text-[15px]">
              Sign In
            </button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="p-8 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl">
            <h3 className="font-semibold text-[17px] mb-3 text-black dark:text-white">For Trainers</h3>
            <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed">
              Create and manage custom workout programs for your clients
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl">
            <h3 className="font-semibold text-[17px] mb-3 text-black dark:text-white">For Clients</h3>
            <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed">
              Access your personalized workout programs anytime, anywhere
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl">
            <h3 className="font-semibold text-[17px] mb-3 text-black dark:text-white">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed">
              Monitor exercises, sets, reps, and timing for optimal results
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
