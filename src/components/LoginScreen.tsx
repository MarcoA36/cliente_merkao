import { useState, type FormEvent } from "react";
import * as api from "../api";
import type { User } from "../types";
import * as ui from "../uiStyles";

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
    <div className={ui.loginPage}>
      <form className={ui.loginPanel} onSubmit={handleSubmit}>
        <div className={ui.brandBlockCompact}>
          <div className={ui.brandMark}>M</div>
          <div>
            <h1 className={ui.brandTitle}>Merkao CMS</h1>
            <p className={ui.brandSubtitle}>Acceso administrador</p>
          </div>
        </div>
        <label className={ui.fieldLabel}>
          Email
          <input className={ui.fieldInput} value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className={ui.fieldLabel}>
          Password
          <input className={ui.fieldInput} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <div className={ui.cn(ui.inlineNotice, ui.noticeError)}>{error}</div> : null}
        <button className={ui.primaryButton} disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
