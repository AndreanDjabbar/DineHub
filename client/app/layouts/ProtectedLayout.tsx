import { VscLoading } from "react-icons/vsc";
import { Outlet, Navigate } from "react-router";
import { useUserStore, type UserStore } from "~/stores";

export default function ProtectedLayout() {
  const userData = useUserStore((state: UserStore) => state.userData);
  const isAuthLoading = useUserStore((state: UserStore) => state.isAuthLoading);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <VscLoading size={50} className="animate-spin text-red-600" />
        </div>
      </div>
    );
  }

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}