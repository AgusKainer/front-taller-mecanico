import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { autosService } from "../services/api";
import "./HistorialCliente.css";

export default function HistorialCliente() {
  const navigate = useNavigate();
  const [patente, setPatente] = useState("");
  const [auto, setAuto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAuto(null);
    setSearched(true);

    try {
      if (!patente.trim()) {
        setError("Ingresa la patente de tu auto");
        setLoading(false);
        return;
      }

      const data = await autosService.getByPatente(patente);
      setAuto(data);
    } catch (err) {
      setError(`No se encontró auto con patente: ${patente}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="historial-container">
      <header className="historial-header">
        <div className="header-content">
          <h1>🚗 Historial de tu Auto</h1>
          <Link to="/" className="btn-login">
            ← Atrás
          </Link>
        </div>
      </header>

      <div className="historial-card">
        <form onSubmit={handleBuscar} className="buscar-form">
          <div className="form-group">
            <label htmlFor="patente">Ingresa tu Patente</label>
            <input
              id="patente"
              type="text"
              placeholder="Ej: ABC-123"
              value={patente}
              onChange={(e) => setPatente(e.target.value.toUpperCase())}
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {searched && !auto && !error && !loading && (
          <div className="no-data">No se encontraron resultados</div>
        )}

        {auto && (
          <div className="auto-info">
            <section className="info-section">
              <h2>📋 Información del Auto</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Patente</label>
                  <p>{auto.patente}</p>
                </div>
                <div className="info-item">
                  <label>Dueño</label>
                  <p>{auto.dueño}</p>
                </div>
                <div className="info-item">
                  <label>Marca</label>
                  <p>{auto.marca}</p>
                </div>
                <div className="info-item">
                  <label>Modelo</label>
                  <p>{auto.modelo}</p>
                </div>
                <div className="info-item">
                  <label>Año</label>
                  <p>{auto.año}</p>
                </div>
                <div className="info-item">
                  <label>Estado</label>
                  <p>
                    <span className={`status ${auto.estado}`}>
                      {auto.estado}
                    </span>
                  </p>
                </div>
              </div>
            </section>

            <section className="info-section">
              <h2>🔧 Mantenimiento</h2>
              <div className="maintenance-info">
                <div className="maintenance-item">
                  <label>KM Actuales</label>
                  <p className="km-value">{auto.kmActuales} km</p>
                </div>
                <div className="maintenance-item">
                  <label>Próximo Mantenimiento</label>
                  <p className="km-value">{auto.proximoMantenimiento} km</p>
                </div>
                <div className="maintenance-item">
                  <label>KM Faltantes</label>
                  <p
                    className={`km-faltantes ${
                      auto.kmActuales >= auto.proximoMantenimiento
                        ? "alert"
                        : ""
                    }`}
                  >
                    {auto.proximoMantenimiento - auto.kmActuales} km
                  </p>
                </div>
              </div>

              {auto.proximoMantenimiento - auto.kmActuales <= 1000 && (
                <div className="alert-box">
                  ⚠️ Tu auto está próximo a necesitar mantenimiento
                </div>
              )}
            </section>

            {auto.descripcionUltimaReparacion && (
              <section className="info-section">
                <h2>📝 Última Reparación</h2>
                <div className="repair-info">
                  <p>
                    <strong>Descripción:</strong>{" "}
                    {auto.descripcionUltimaReparacion}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(auto.fechaUltimaReparacion).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
