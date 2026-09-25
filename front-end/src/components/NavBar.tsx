import { NavLink, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useAuth } from "../context/AuthContext";

export function NavBar() {
  const context = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    context.logout();
    navigate("/login");
  }
  return (
    <div className={styles.navBarContainer}>
      <nav className={styles.navBar}>
        <div className={styles.tabs}>
          {context.isAuthenticated && (
            <NavLink
              to="/bags"
              className={({ isActive }) =>
                isActive ? styles.tabActive : styles.tab
              }
            >
              Sacs
            </NavLink>
          )}
          {context.isAuthenticated && (
            <NavLink
              to="/items"
              end
              className={({ isActive }) =>
                isActive ? styles.tabActive : styles.tab
              }
            >
              Inventaire
            </NavLink>
          )}
        </div>
      </nav>
      {context.isAuthenticated && (
        <button className={styles.logoutButton} onClick={() => handleLogout()}>
          Déconnexion
        </button>
      )}
    </div>
  );
}
