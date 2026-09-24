import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styles from "./AuthForm.module.css";

export function LoginPage() {
  const context = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  async function handleLogin(email: string, password: string) {
    const success = await context.login({ email, password });
    if (success) {
      navigate("/bags");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Connexion</h1>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className={styles.input}
              type="email"
              value={email}
              placeholder="email@exemple.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-password">
              Mot de passe
            </label>
            <input
              id="login-password"
              className={styles.input}
              type="password"
              value={password}
              placeholder="Mot de passe"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          className={styles.submitButton}
          disabled={context.loading || email === "" || password === ""}
          onClick={() => handleLogin(email, password)}
        >
          Connexion
        </button>
        {context.error && <p className={styles.errorMessage}>{context.error}</p>}
        <div className={styles.switchLine}>
          Pas encore de compte ?{" "}
          <Link className={styles.switchLink} to="/register">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
