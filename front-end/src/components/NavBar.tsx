import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

export function NavBar() {
  return (
    <nav className={styles.navBar}>
      <NavLink
        to="/bags"
        className={({ isActive }) => (isActive ? styles.tabActive : styles.tab)}
      >
        Sacs
      </NavLink>
      <NavLink
        to="/items"
        end
        className={({ isActive }) => (isActive ? styles.tabActive : styles.tab)}
      >
        Inventaire
      </NavLink>
    </nav>
  );
}
