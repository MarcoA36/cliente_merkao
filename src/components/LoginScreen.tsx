import { useState, type FormEvent } from "react";
import * as api from "../api";
import type { User } from "../types";

export function LoginScreen({ onLogin }: { onLogin: (token: string, user: User) => void }) {
  const [email, setEmail] = useState("admin@merkao.local");
  const [password, setPassword] = useState("Demo1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.login(email, password);
      if (response.user.role !== "ADMIN") {
        setError("Esta cuenta no tiene permisos de administrador.");
        return;
      }
      onLogin(response.token, response.user);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "No se pudo ingresar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginPage">
      <form className="loginPanel" onSubmit={handleSubmit}>
        <div className="brandBlock">
          <div className="brandMark">M</div>
          <div>
            <h1>Merkao CMS</h1>
            <p>Acceso administrador</p>
          </div>
        </div>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <div className="notice error">{error}</div> : null}
        <button className="primaryButton" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
