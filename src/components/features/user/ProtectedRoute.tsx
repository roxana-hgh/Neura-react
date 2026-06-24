import { Navigate } from "react-router-dom";
import { useSession } from "../../../lib/auth-client";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>; // or your spinner component
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;