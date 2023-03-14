import Header from "../components/Header";
import { useEffect, useState } from "react";
export default function Tasks() {
    const [tasks, setTasks] = useState(null);

    async function refresh() {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/tasks/get`,
            {
                method: "GET",
                credentials: "include",
            }
        );
        let data = await response.json();
        setTasks(data);
    }

    useEffect(() => {
        refresh();
    }, []);

    function complete(e, id) {
        e.preventDefault();
        fetch(
            `${process.env.REACT_APP_BACKEND_URL}/tasks/complete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: id,
                test: "efdf"
              }),
              credentials: "include",
            }
          ).then((response) => refresh())
    }

    return (
        <main className="flex-grow">
            <Header />
            <div className="rounded overflow-hidden shadow-lg pt-24 container mx-auto justify-center">
            <h2 className="text-center text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight mb-12">Tasks</h2>
                {tasks ? <div className="grid grid-cols-3 md:grid-cols-4 gap-4 pb-5">
                    {tasks.map((task) => (
                        <div className="flex flex-col space-y-4 justify-between p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <div class="font-normal text-gray-700 dark:text-gray-400">
                                {task.content}
                            </div>
                            {!task.completed ?
                            <button onClick={(e) => complete(e, task.id)} className="rounded p-2 bg-blue-800 text-gray-200">
                                Complete
                            </button>
                            :
                            "done"
                            }
                        </div>
                    ))}
                </div>
                    :
                    <>
                        {/* <div>Sadness</div> */}
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                        <span className="sr-only">Loading...</span>
                    </>
                }

            </div>
            {/* <div>{tasks}</div> */}

        </main>
    );

}   