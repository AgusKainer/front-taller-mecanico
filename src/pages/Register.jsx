import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setAdmin } from "../slices/authSlice";
import { authService } from "../services/api";
import "./Auth.css";

export default function Register() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [tallerName, setTallerName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (contraseña !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!tallerName.trim()) {
      setError("El nombre de la empresa es requerido");
      return;
    }

    setLoading(true);

    try {
      const data = await authService.register(correo, contraseña, tallerName);
      if (data.error) {
        setError(data.error);
      } else {
        // Después de registrar, hacer login automático
        const loginData = await authService.login(correo, contraseña);
        dispatch(setToken(loginData.token));
        dispatch(setAdmin(loginData.admin));
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🔧 Taller Mecánico</h1>
        <h2>Registro de Mecánico</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="correo">Correo</label>
            <input
              id="correo"
              type="email"
              placeholder="tu@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contraseña">Contraseña</label>
            <input
              id="contraseña"
              type="password"
              placeholder="••••••••"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmar">Confirmar Contraseña</label>
            <input
              id="confirmar"
              type="password"
              placeholder="••••••••"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tallerName">Nombre de tu Empresa/Taller</label>
            <input
              id="tallerName"
              type="text"
              placeholder="Mi Taller Mecánico"
              value={tallerName}
              onChange={(e) => setTallerName(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
