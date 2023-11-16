import { useState, useEffect } from "react";
import axios from "axios";

const Privacidad = ({  }) => {
  // Lee el estado de la cuenta desde el estado local o establece el valor predeterminado como "publico"
  const [estadoCuenta, setEstadoCuenta] = useState(
    localStorage.getItem("estadoCuenta") || "publico"
  );
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();

  const handleEstadoCuentaChange = async () => {
    const confirmacion = window.confirm(
      "¿Estás seguro de cambiar el estado actual de tu cuenta?"
    );

    if (confirmacion) {
      try {
        setLoading(true);
        console.log("Token:", token);

        const response = await axios.put(
          "http://localhost:5000/api/privacidad",
          {
            estadoCuenta,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        console.log("Respuesta del servidor:", response);

        setMessage({
          type: "success",
          text: response.data.message,
        });

        // Actualiza el estado local
        localStorage.setItem("estadoCuenta", estadoCuenta);
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data.message || "Error desconocido",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessage(null);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <section className="mod-perfil">
      <h3 className="titulo-perfil">Privacidad de Cuenta</h3>

      {message && (
        <p className={message.type === "success" ? "success" : "error"}>
          {message.text}
        </p>
      )}

      <p className="texto-perfil">Selecciona el estado de tu cuenta:</p>
      <div>
        <label className="texto-perfil">
          <input
            type="radio"
            value="publico"
            checked={estadoCuenta === "publico"}
            onChange={() => setEstadoCuenta("publico")}
          />
          Público
        </label>
        <label className="texto-perfil">
          <input
            type="radio"
            value="privado"
            checked={estadoCuenta === "privado"}
            onChange={() => setEstadoCuenta("privado")}
          />
          Privado
        </label>
      </div>
      <button
        className="enlace-perfil"
        onClick={handleEstadoCuentaChange}
        disabled={loading}
      >
        {loading ? "Cargando..." : "Cambiar Estado de Cuenta"}
      </button>
    </section>
    
  );
};
export default Privacidad;
