import { useToken } from "../context/TokenContext";

export const useAuthGuard = () => {
  const { token } = useToken();
  const isAuthenticated = !!token;
  return isAuthenticated;
};
