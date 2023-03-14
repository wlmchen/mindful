import { useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../lib/auth.context";

export default function Auth() {
  const [toggle, setToggle] = useState(false);
  const { loading, error, register, login, setError } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function formToggle() {
    if (loading) return;
    setError();
    setToggle(!toggle);
  }

  function handleSubmit(e) {
    e.preventDefault();
    toggle ? register(username, password) : login(username, password);
  }

  return (
    <main className="flex-grow">
      <Header />
      <div className="pt-28">
        <div className="max-w-md mx-auto">
          <div
            className="flex justify-between text-white cursor-pointer bg-gray-700 rounded-t-lg"
            onClick={formToggle}
          >
            <div
              className={`p-2 text-center flex-1 rounded-tl-lg transition ${
                toggle ? " bg-gray-800" : ""
              }`}
            >
              Register
            </div>
            <div
              className={`p-2 text-center flex-1 rounded-tr-lg transition ${
                !toggle ? " bg-gray-800" : ""
              }`}
            >
              Login
            </div>
          </div>
          <form
            className="space-y-4 md:space-y-6 bg-gray-800 p-8 rounded-b-lg"
            onSubmit={handleSubmit}
          >
            {/* Username */}
            <div>
              <label
                for="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="username"
                name="username"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {/* Password */}
            <div>
              <label
                for="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* Submit */}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className={`${
                  loading && "disabled "
                } w-full sm:w-auto py-2 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 text-white dark:disabled:text-indigo-400 text-sm font-semibold rounded-md shadow focus:outline-none cursor-pointer`}
              >
                {toggle ? "Register" : "Login"}
              </button>
            </div>
            {/* Errors */}
            <div className="flex items-center justify-center">{error}</div>
          </form>
        </div>
      </div>
    </main>
  );
}
