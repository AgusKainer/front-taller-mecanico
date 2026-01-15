import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { autosService } from "../services/api";
import "./RegistroAuto.css";

export default function RegistroAuto() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useSelector((state) => state.auth);
  const autoId = searchParams.get("id");

  const [isEdit, setIsEdit] = useState(!!autoId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    patente: "",
    dueño: "",
    correo: "",
    marca: "",
    modelo: "",
    año: new Date().getFullYear(),
    kmActuales: 0,
    proximoMantenimiento: 5000,
    reparacion: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (isEdit && autoId) {
      cargarAuto();
    }
  }, [isEdit, autoId]);

  const cargarAuto = async () => {
    try {
      setLoading(true);
      const res = await autosService.getById(autoId);
      // la respuesta puede venir con { mensaje, auto } o directamente el auto
      const data = res.auto || res;
      setFormData((prev) => ({
        ...prev,
        patente: data.patente || "",
        dueño: data.dueño || "",
        correo: data.correo || "",
        marca: data.marca || "",
        modelo: data.modelo || "",
        año: data.año || new Date().getFullYear(),
        kmActuales: data.kmActuales || 0,
        proximoMantenimiento: data.proximoMantenimiento || 5000,
      }));
    } catch (err) {
      setError("Error cargando auto");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "año" ||
        name === "kmActuales" ||
        name === "proximoMantenimiento"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isEdit && autoId) {
        // Actualizar
        const { reparacion, ...datosAuto } = formData;
        if (reparacion) {
          const result = await autosService.updateMantenimiento(
            autoId,
            formData.kmActuales,
            reparacion,
            token
          );
          if (result.error) {
            setError(result.error);
          } else {
            setSuccess("Auto actualizado correctamente");
            setTimeout(() => navigate("/dashboard"), 1500);
          }
        } else {
          const result = await autosService.update(autoId, datosAuto, token);
          if (result.error) {
            setError(result.error);
          } else {
            setSuccess("Auto actualizado correctamente");
            setTimeout(() => navigate("/dashboard"), 1500);
          }
        }
      } else {
        // Crear nuevo
        const { reparacion, ...datosAuto } = formData;
        const result = await autosService.create(datosAuto, token);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess("Auto registrado correctamente");
          setFormData({
            patente: "",
            dueño: "",
            marca: "",
            modelo: "",
            año: new Date().getFullYear(),
            kmActuales: 0,
            proximoMantenimiento: 5000,
            reparacion: "",
          });
          setTimeout(() => navigate("/dashboard"), 1500);
        }
      }
    } catch (err) {
      setError("Error procesando solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <header className="registro-header">
        <button onClick={() => navigate("/dashboard")} className="btn-back">
          ← Volver
        </button>
        <h1>{isEdit ? "✏️ Editar Auto" : "➕ Registrar Auto"}</h1>
      </header>

      <div className="registro-card">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="patente">Patente *</label>
              <input
                id="patente"
                name="patente"
                type="text"
                placeholder="ABC-123"
                value={formData.patente}
                onChange={handleChange}
                disabled={isEdit}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueño">Dueño *</label>
              <input
                id="dueño"
                name="dueño"
                type="text"
                placeholder="Juan Pérez"
                value={formData.dueño}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="correo">Correo del dueño</label>
              <input
                id="correo"
                name="correo"
                type="email"
                placeholder="juan@example.com"
                value={formData.correo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="marca">Marca *</label>
              <input
                id="marca"
                name="marca"
                type="text"
                placeholder="Toyota"
                value={formData.marca}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="modelo">Modelo *</label>
              <input
                id="modelo"
                name="modelo"
                type="text"
                placeholder="Corolla"
                value={formData.modelo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="año">Año</label>
              <input
                id="año"
                name="año"
                type="number"
                value={formData.año}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="kmActuales">KM Actuales</label>
              <input
                id="kmActuales"
                name="kmActuales"
                type="number"
                value={formData.kmActuales}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="proximoMantenimiento">
                Próximo Mantenimiento (KM)
              </label>
              <input
                id="proximoMantenimiento"
                name="proximoMantenimiento"
                type="number"
                value={formData.proximoMantenimiento}
                onChange={handleChange}
              />
            </div>

            {isEdit && (
              <div className="form-group full">
                <label htmlFor="reparacion">Descripción de Reparación</label>
                <textarea
                  id="reparacion"
                  name="reparacion"
                  placeholder="Describe la reparación realizada..."
                  value={formData.reparacion}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Guardando..." : isEdit ? "Actualizar" : "Registrar"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
