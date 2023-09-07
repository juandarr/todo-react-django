import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const AppFlex = function () {
  return (
    <div className="flex h-96 flex-wrap justify-around gap-2.5 border-4 border-yellow-500 text-gray-800">
      <div className="w-1/3 flex-grow bg-green-500 p-6">Here</div>
      <div className="w-1/3 bg-red-500 p-6">We</div>
      <div className="w-1/3 bg-blue-500 p-6">Go</div>
      <div className="w-1/3 bg-violet-500 p-6">We</div>
      <div className="w-1/3 bg-cyan-500 p-6">Go</div>
    </div>
  );
};

const AppGrid = function () {
  return (
    <div className="grid grid-cols-6 grid-rows-6 font-mono font-bold text-gray-800">
      <div className="z-10 col-span-3 row-span-2 m-1 flex items-center justify-center bg-green-500 p-6 text-xl">
        Box 1
      </div>
      <div className="col-span-2 row-span-3 m-1 flex rotate-12 items-center justify-center bg-red-500 p-6 text-xl">
        Box 2
      </div>
      <div className="z-10 m-1 flex items-center justify-center bg-blue-500 p-6 text-xl">
        Box 3
      </div>
      <div className="m-1 flex items-center justify-center bg-violet-500 p-6 text-xl">
        Box 4
      </div>
      <div className="col-span-5  row-span-3 m-1 flex items-center justify-center bg-cyan-500 p-6 text-xl">
        Box 5
      </div>
    </div>
  );
};

const container = createRoot(document.getElementById("root"));
container.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
