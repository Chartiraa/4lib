import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { getUserRole } from "../data/DBFunctions"; // Fonksiyonu import edin

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const [user, loading] = useAuthState(auth);
  const [userRole, setUserRole] = React.useState(null);
  const [roleLoading, setRoleLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true; // Bileşenin montaj durumunu izler

    const fetchUserRole = async () => {
      if (user) {
        setRoleLoading(true); // Kullanıcı varsa roleLoading'i başlat
        const role = await getUserRole(user.uid);
        if (isMounted) { // Bileşen monte edilmişse state güncellemesi yap
          setUserRole(role);
          setRoleLoading(false); // Rol yüklendiğinde loading'i false yap
        }
      } else {
        if (isMounted) {
          setRoleLoading(false); // Kullanıcı yoksa loading'i false yap
        }
      }
    };

    fetchUserRole();

    // Cleanup fonksiyonu ekleyin
    return () => {
      isMounted = false; // Cleanup: bileşen unmount olduğunda isMounted'ı false yap
    };
  }, [user]);

  if (loading || roleLoading) return <div>Loading...</div>;

  // Eğer kullanıcı oturum açmamışsa yönlendir
  if (!user) {
    return <Navigate to="/signin" />;
  }

  // Eğer gerekli rollerden birine sahip değilse yönlendir
  if (!userRole || (requiredRoles.length > 0 && !requiredRoles.includes(userRole))) {
    return <Navigate to="/" />;
  }

  return children; // Doğru bileşeni render edin
};

export default ProtectedRoute;