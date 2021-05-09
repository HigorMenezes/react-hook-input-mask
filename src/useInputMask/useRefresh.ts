import { useState, useCallback } from "react";

export const useRefresh = (): [Record<string, never>, () => void] => {
  const [refreshState, setRefreshState] = useState({});
  const refreshHandler = useCallback(() => setRefreshState({}), []);
  return [refreshState, refreshHandler];
};
