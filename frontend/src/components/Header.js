import { useAuth } from "../lib/auth.context";
import { Link, NavLink } from "react-router-dom";

const routes = [
  {
    name: "Journal",
    href: "/journal",
  },
  {
    name: "Emotions",
    href: "/emotions",
  },
  {
    name: "Tasks",
    href: "/tasks",
  },
];

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="bg-black shadow-lg fixed w-screen z-40 top-0">
      <div className="container mx-auto">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center">
            <img
              className="block h-8 w-auto"
              src="/img/mindful.svg"
              alt="Mindful Logo"
            />
          </Link>
          <div className="flex">
            <div className="flex space-x-4">
              {user && (
                <>
                  {routes.map((r) => (
                    <NavLink
                      key={r.name}
                      to={r.href}
                      className={({ isActive }) =>
                        [
                          "transition inline-flex items-center cursor-pointer px-1 pt-1 text-lg font-medium",
                          isActive
                            ? "text-blue-400"
                            : "border-transparent text-gray-200 hover:text-gray-500 relative inline-block text-left",
                        ]
                          .filter(Boolean)
                          .join(" ")
                      }
                    >
                      {r.name}
                    </NavLink>
                  ))}
                  <div className="transition inline-flex items-center cursor-pointer">
                    <div className="overflow-hidden relative w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-600 shadow shadow-slate-400">
                      <svg
                        className="absolute -left-1 w-12 h-12 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </>
              )}
              {!user && (
                <Link
                  to="/auth"
                  className="transition inline-flex items-center cursor-pointer px-1 pt-1 text-lg font-medium text-white"
                >
                  <div className="rounded-xl mx-auto bg-gradient-to-r p-[.2rem] from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]">
                    <div className="flex flex-col justify-between h-full bg-black text-white rounded-lg p-[.3rem] hover:bg-gray-600 transition">
                      Register/Login
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
