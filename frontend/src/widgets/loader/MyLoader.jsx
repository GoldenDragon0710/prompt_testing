import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

export function MyLoader({ isloading }) {
  return (
    <div className="fixed left-0 top-0 z-10 h-full w-full bg-gray-200 opacity-30">
      <div className="flex h-full items-center justify-center">
        <ClipLoader
          color={"#020617"}
          loading={isloading}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
}

MyLoader.displayName = "/src/widgets/loader/MyLoader.jsx";

export default MyLoader;
