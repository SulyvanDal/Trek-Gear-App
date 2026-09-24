import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styles from "./AuthForm.module.css";

export function RegisterPage() {
  const context = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  async function handleRegister(email: string, password: string) {
    const success = await context.register({
      email: email,
      password: password,
    });
    if (success) {
      navigate("/bags");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Créer un compte</h1>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              className={styles.input}
              type="email"
              placeholder="email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-password">
              Mot de passe
            </label>
            <input
              id="register-password"
              className={styles.input}
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          className={styles.submitButton}
          disabled={context.loading || email === "" || password === ""}
          onClick={() => handleRegister(email, password)}
        >
          Créer mon compte
        </button>
        {context.error && <p className={styles.errorMessage}>{context.error}</p>}
        <div className={styles.switchLine}>
          Déjà un compte ?{" "}
          <Link className={styles.switchLink} to="/login">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
