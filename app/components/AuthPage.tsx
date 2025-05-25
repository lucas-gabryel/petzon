"use client";
import { useTranslations } from "next-intl";

export default function AuthPage() {
  const t = useTranslations();

  return (
    <main className="flex-1 bg-purple-50 flex items-center justify-center px-4 py-10">
      <div className="border-2 border-purple-200 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8">
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-2xl font-bold text-purple-700 text-center">
            {t("auth.loginTab")}
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.email")}
              </label>
              <input
                type="email"
                className="mt-1 w-full border border-purple-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.password")}
              </label>
              <input
                type="password"
                className="mt-1 w-full border border-purple-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-md font-semibold transition"
            >
              {t("auth.loginBtn")}
            </button>
          </form>
        </div>

        <div className="flex flex-col justify-center space-y-6 border-t pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-8 border-purple-200">
          <h2 className="text-2xl font-bold text-purple-700 text-center">
            {t("auth.registerTab")}
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.name")}
              </label>
              <input
                type="text"
                className="mt-1 w-full border border-purple-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.email")}
              </label>
              <input
                type="email"
                className="mt-1 w-full border border-purple-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.password")}
              </label>
              <input
                type="password"
                className="mt-1 w-full border border-purple-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-md font-semibold transition"
            >
              {t("auth.registerBtn")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
