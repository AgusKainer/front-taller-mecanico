import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import { setAutos } from "../slices/autosSlice";
import { autosService } from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, admin } = useSelector((state) => state.auth);
  const { autos } = useSelector((state) => state.autos);
  const [autosMantenimiento, setAutosMantenimiento] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    cargarDatos();
  }, [token, navigate]);

  const cargarDatos = async () => {
    try {
      const todosAutos = await autosService.getAll();
      dispatch(setAutos(todosAutos));

      const autosConMantenimiento = await autosService.getAutosMantenimiento();
      setAutosMantenimiento(autosConMantenimiento);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

    const handleDelete = async (id) => {
      if (!window.confirm('¿Eliminar este auto? Esta acción no se puede deshacer.')) return;
      try {
        setLoading(true);
        await autosService.delete(id, token);
        await cargarDatos();
      } catch (err) {
        console.error('Error eliminando auto:', err);
      } finally {
        setLoading(false);
      }
    };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🔧 Dashboard - Taller Mecánico</h1>
          <div className="header-right">
            <span className="admin-info">👨‍🔧 {admin?.correo}</span>
            <button onClick={handleLogout} className="btn-logout">
              Salir
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button onClick={() => navigate("/registro-auto")} className="btn-nav">
          ➕ Registrar Auto
        </button>
        <button onClick={cargarDatos} className="btn-nav">
          🔄 Actualizar
        </button>
      </nav>

      <main className="dashboard-content">
        {/* Autos en Mantenimiento */}
        {autosMantenimiento.length > 0 && (
          <section className="alert-section">
            <h2>
              ⚠️ Autos que necesitan Mantenimiento ({autosMantenimiento.length})
            </h2>
            <div className="autos-grid">
              {autosMantenimiento.map((auto) => (
                <div key={auto.id} className="auto-card alert">
                  <h3>{auto.patente}</h3>
                  <p>
                    <strong>Dueño:</strong> {auto.dueño}
                  </p>
                  <p>
                    <strong>KM:</strong> {auto.kmActuales}
                  </p>
                  <p>
                    <strong>Próximo mantenimiento:</strong>{" "}
                    {auto.proximoMantenimiento}
                  </p>
                  <button
                    onClick={() => navigate(`/registro-auto?id=${auto.id}`)}
                    className="btn-secondary"
                  >
                    Registrar Reparación
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Todos los Autos */}
        <section className="autos-section">
          <h2>📋 Todos los Autos ({autos.length})</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : autos.length === 0 ? (
            <p className="no-data">No hay autos registrados</p>
          ) : (
            <div className="autos-grid">
              {autos.map((auto) => (
                <div key={auto.id} className="auto-card">
                  <h3>{auto.patente}</h3>
                  <p>
                    <strong>Dueño:</strong> {auto.dueño}
                  </p>
                  <p>
                    <strong>Marca:</strong> {auto.marca} {auto.modelo}
                  </p>
                  <p>
                    <strong>Año:</strong> {auto.año}
                  </p>
                  <p>
                    <strong>KM Actuales:</strong> {auto.kmActuales}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    <span className={`status ${auto.estado}`}>
                      {auto.estado}
                    </span>
                  </p>
                  {auto.descripcionUltimaReparacion && (
                    <p>
                      <strong>Última reparación:</strong>{" "}
                      {auto.descripcionUltimaReparacion}
                    </p>
                  )}
                  <button
                    onClick={() => navigate(`/registro-auto?id=${auto.id}`)}
                    className="btn-secondary"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(auto.id)}
                    className="btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
