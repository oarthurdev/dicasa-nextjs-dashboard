import { useLocation } from "react-router-dom";

export function useCompanyIdFromPath(): string | null {
  const location = useLocation();
  const segments = location.pathname.split("/");
  return segments[1] || null;
}
