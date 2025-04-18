"use client";

import { useStoreContext } from "@/contexts/StoreContext";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { UserConfig, OperationsConfig } from "./components";
import { OPERATIONS } from "@/const/operations";
import { STORAGE_KEYS } from "@/const/storage";

const ComplexityConfig = dynamic(() => import("./components/complexity"), {
  ssr: false,
});

export const Configure = () => {
  const router = useRouter();
  const { user, complexity, operations } = useStoreContext();

  const [configPage, setConfigPage] = useState<number>(0);

  const [configUser, setConfigUser] = useState<string | null>(user);
  const [configComplexity, setConfigComplexity] = useState<number>(complexity);
  const [configOperations, setConfigOperations] =
    useState<OPERATIONS[]>(operations);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEYS.USER, configUser || "");
    localStorage.setItem(STORAGE_KEYS.COMPLEXITY, configComplexity.toString());
    localStorage.setItem(
      STORAGE_KEYS.OPERATIONS,
      JSON.stringify(configOperations)
    );

    router.push("/game");
  };

  const isBackBtnHidden = configPage === 0;
  const isNextBtnHidden = (configPage === 0 && !configUser) || configPage === 2;
  const isSaveBtnVisible =
    configPage === 2 && configUser && configOperations.length > 0;

  const areButtonsVisible =
    !isBackBtnHidden || !isNextBtnHidden || isSaveBtnVisible;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <h3 className="text-center text-lg font-medium mt-4">
        Configure your quiz
      </h3>

      <div className="flex-grow flex items-center justify-center overflow-auto p-4">
        {configPage === 0 && (
          <UserConfig configUser={configUser} setConfigUser={setConfigUser} />
        )}
        {configPage === 1 && (
          <ComplexityConfig
            configComplexity={configComplexity}
            setConfigComplexity={setConfigComplexity}
          />
        )}
        {configPage === 2 && (
          <OperationsConfig
            configOperations={configOperations}
            setConfigOperations={setConfigOperations}
          />
        )}
      </div>

      <div className="sticky bottom-0 bg-gray-800 border-t p-4 flex justify-between gap-4 shadow-lg">
        {areButtonsVisible ? (
          <>
            {!isBackBtnHidden && (
              <button
                onClick={() => setConfigPage((prev) => Math.max(prev - 1, 0))}
                className={`
            flex-1 py-2 px-4 rounded 
            ${
              configPage === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }
          `}
                disabled={configPage === 0}
              >
                Back
              </button>
            )}
            {!isNextBtnHidden && (
              <button
                onClick={() => setConfigPage((prev) => Math.min(prev + 1, 2))}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Next
              </button>
            )}
            {isSaveBtnVisible && (
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Save and Play
              </button>
            )}
          </>
        ) : (
          <div className="h-[40px] w-full"></div>
        )}
      </div>
    </div>
  );
};

export default Configure;
