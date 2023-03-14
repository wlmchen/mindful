import { useEffect, useState } from "react";
import Header from "../components/Header";
import Plot from "react-plotly.js";

export default function Emotions() {
  const [recent, setRecent] = useState(null);
  const [plot, setPlot] = useState(null);

  useEffect(() => {
    (async function () {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/emotions/recent`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      let data = await response.json();
      const mode = data.pop()[1];
      const res = {
        data: data,
        mode: mode,
      };
      setRecent(res);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/emotions/plot`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      setPlot(data);
    })();
  }, []);

  return (
    <main className="flex-grow">
      <Header />
      <div className="min-h-screen pt-28 container mx-auto">
        <div className="flex flex-wrap items-start justify-center text-white space-x-4">
          {/* Emotions */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <span className="text-xl pb-8">Emotional Changes</span>
            <div
              className={`flex flex-col rounded border border-green-500 p-4 w-full space-y-3`}
            >
              {recent && recent.data ? (
                recent.data.map((e) => (
                  <div key={e[0]} className="flex">
                    <div className="">
                      {e[0].charAt(0).toUpperCase() + e[0].slice(1)}{" "}&nbsp;
                    </div>
                    {recent.mode == "change" && (
                      <div>
                        {e[1] < 0 ? (
                          <div>({(100 * e[1]).toFixed(2)}%)</div>
                        ) : (
                          <div>(+{(100 * e[1]).toFixed(2)}%)</div>
                        )}
                      </div>
                    )}
                    <div></div>
                  </div>
                ))
              ) : (
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
              )}
            </div>
          </div>
          {/* Emotional Progress */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <span className="text-xl pb-8">Emotional Progress</span>
            {!plot ? (
              <div className="animate-pulse flex justify-center items-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                <svg
                  className="w-12 h-12 text-gray-200"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                </svg>
              </div>
            ) : (
              <Plot data={plot.data} layout={plot.layout} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
