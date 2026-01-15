const API_URL = "http://localhost:3000/api";

export const authService = {
  register: async (correo, contraseña, tallerName) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contraseña, tallerName }),
    });
    return res.json();
  },

  login: async (correo, contraseña) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contraseña }),
    });
    return res.json();
  },
};

export const autosService = {
  getAll: async () => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await fetch(`${API_URL}/autos`, { headers });
    if (!res.ok)
      throw new Error((await res.json()).error || "Error fetching autos");
    return res.json();
  },

  getByPatente: async (patente) => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_URL}/autos/patente/${patente}`, { headers });
    if (!res.ok) throw new Error("Auto no encontrado");
    return res.json();
  },

  getById: async (id) => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_URL}/autos/id/${id}`, { headers });
    if (!res.ok) throw new Error("Auto no encontrado");
    return res.json();
  },

  create: async (datos, token) => {
    const res = await fetch(`${API_URL}/autos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });
    return res.json();
  },

  update: async (id, datos, token) => {
    const res = await fetch(`${API_URL}/autos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });
    return res.json();
  },

  updateMantenimiento: async (id, kmActuales, reparacion, token) => {
    const res = await fetch(`${API_URL}/autos/${id}/mantenimiento`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ kmActuales, reparacion }),
    });
    return res.json();
  },

  getAutosMantenimiento: async () => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await fetch(`${API_URL}/autos/mantenimiento/necesario/todos`, {
      headers,
    });
    if (!res.ok)
      throw new Error(
        (await res.json()).error || "Error fetching autos mantenimiento"
      );
    return res.json();
  },

  delete: async (id, token) => {
    const res = await fetch(`${API_URL}/autos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },
};
