import { useState, useEffect } from "react";

export type UseInputRefSetupProps = {
  inputRef: HTMLInputElement | null;
};

export const useInputRefSetup = ({ inputRef }: UseInputRefSetupProps): void => {
  const [isReady, setReady] = useState(inputRef !== null);

  useEffect(() => {
    if (!isReady) {
      setReady(true);
    }
  }, []);
};
