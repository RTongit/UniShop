import React from "react";

const EditLoader = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      <div className="size-14 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

      <h2 className="mt-6 text-xl font-semibold text-gray-900">
        Updating your item...
      </h2>

      <p className="mt-2 text-center text-sm text-gray-500">
        Saving your changes and updating your listing.
        <br />
        Please wait...
      </p>
    </div>
  );
};

export default EditLoader;
