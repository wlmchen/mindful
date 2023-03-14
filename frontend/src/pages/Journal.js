import Header from "../components/Header";
import { useState } from "react";

const Journal = (props) => {
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    (async function () {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/journal/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: entry,
          }),
          credentials: "include",
        }
      );
      const data = await response.json();
      setLoading(false);
      setEntry("");
    })();
  }

  return (
    <main className="flex-grow bg-black">
      <Header />
      <div className="pt-16">
        <form
          onSubmit={handleSubmit}
          className="mt-16 max-w-xl flex flex-col mx-auto gap-y-5 "
        >
          <textarea
            id="message"
            rows="6"
            className="block p-2.5 w-full bg-black text-white border rounded-xl outline-0"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          ></textarea>
          {!loading ? (
            <button
              className="text-white mx-auto py-2 px-4 border border-green-300 rounded hover:bg-green-900 transition"
              type="submit"
            >
              Submit
            </button>
          ) : (
            <button
              className="text-white mx-auto py-2 px-4 border border-green-300 rounded hover:bg-green-900 transition cursor-progress"
              type="submit"
            >
              Saving...
            </button>
          )}
        </form>
      </div>
    </main>
  );
};
export default Journal;
