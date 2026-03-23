import { useState } from "react";

/**
 * Mapeo de IDs de preguntas a sus textos legibles
 */
const QUESTION_LABELS = {
  q1: "¿Qué pelud@ tienes?",
  q2: "Nombre del pelud@",
  "q2b": "Fecha de nacimiento",
  q3_perro: "Tamaño del perro",
  q3_gato: "Edad del gato",
  q4_perro: "Edad del perro",
  q4_gato_gatito: "Meses del gatito",
  q5_perro: "Nivel de actividad (adultos)",
  q5_gato: "Peso ideal (kg)",
  q6_perro: "Peso ideal (kg)",
  q6_gato: "¿Está castrado?",
  q7_perro: "Premios o snacks al día",
  q7_gato: "Patologías (gato)",
  q7_gato_otros: "Otras patologías (gato)",
  q8_perro: "¿Está castrado?",
  q8_gato: "Tipo de alimentación",
  q9_perro: "Patologías (perro)",
  q9_perro_otros: "Otras patologías (perro)",
  q10_perro: "Tipo de alimentación",
  q11_perro: "Preferencia de receta",
};

/**
 * Formulario de contacto para usuarios con patologías
 * Envía los datos del cuestionario + contacto mediante FormSubmit
 */
export default function PathologyContactForm({ answers, onBack }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Mapear nombres de FormSubmit a estado local
    const fieldMap = {
      'Nombre': 'nombre',
      'Email': 'email',
      'Teléfono': 'telefono'
    };
    
    const stateField = fieldMap[name] || name;
    
    setFormData((prev) => ({
      ...prev,
      [stateField]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Recopilar todos los datos del formulario
      const formDataToSend = {
        _subject: "🏥 Nueva consulta - Mascota con patologías",
        _captcha: "false",
        _template: "box",
        Nombre: formData.nombre,
        Email: formData.email,
        Teléfono: formData.telefono,
      };

      // Agregar todas las respuestas del cuestionario
      Object.entries(answers).forEach(([key, value]) => {
        const questionLabel = QUESTION_LABELS[key] || key;
        let formattedValue = value;

        if (Array.isArray(value)) {
          formattedValue = value.join(", ");
        }

        if (key === "q2b" && value) {
          try {
            const date = new Date(value);
            formattedValue = date.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          } catch (e) {
            formattedValue = value;
          }
        }

        formDataToSend[questionLabel] = formattedValue || "Sin respuesta";
      });

      console.log("📧 Enviando formulario a FormSubmit...", formDataToSend);

      // Enviar directamente a FormSubmit usando su AJAX endpoint
      const response = await fetch("https://formsubmit.co/ajax/info@retorn.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      console.log("📬 Respuesta del servidor:", response.status);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Resultado:", result);

      // FormSubmit devuelve { success: "true" } como string
      if (result.success === "true" || result.success === true) {
        console.log("🎉 Formulario enviado exitosamente");
        setIsSubmitted(true);
      } else {
        throw new Error(result.message || "Error en el envío");
      }
    } catch (error) {
      console.error("❌ Error al enviar formulario:", error);
      alert(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo o contacta directamente a info@retorn.com"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.nombre.trim().length >= 2 &&
      formData.email.includes("@") &&
      formData.telefono.trim().length >= 9
    );
  };

  if (isSubmitted) {
    return (
      <div className="pathology-contact-success">
        <div className="logo-icon">
          <img src="https://retorn.com/cdn/shop/files/logo-retorn-web.png?v=1614287274&width=110" alt="Logo Retorn" />
        </div>
        <h2 className="success-title">¡Gracias por tu confianza!</h2>
        <p className="success-message">
          Hemos recibido tu solicitud. Nuestro equipo de nutricionistas veterinarios 
          evaluará el caso de tu peludo de forma personalizada.
        </p>
        <p className="success-message">
          Te contactaremos en las próximas <strong>24-48 horas</strong> para ofrecerte 
          la mejor recomendación adaptada a sus necesidades específicas.
        </p>
        <div className="success-actions">
          <button className="btn-back-success" onClick={onBack}>
            ← Volver al cuestionario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pathology-contact-container">
      <div className="pathology-contact-header">
        <h2 className="pathology-title">Evaluación Personalizada</h2>
        <p className="pathology-subtitle">
          Hemos detectado que tu peludo tiene condiciones de salud que requieren 
          atención especial. Nuestro equipo de expertos evaluará su caso de forma 
          personalizada para recomendarte la mejor alimentación.
        </p>
      </div>

      <div className="pathology-benefits">
        <div className="benefit-item">
          <span className="benefit-icon">👨‍⚕️</span>
          <span className="benefit-text">Evaluación personalizada</span>
        </div>
        <div className="benefit-item">
          <span className="benefit-icon">⏱️</span>
          <span className="benefit-text">Respuesta en 24-48 horas</span>
        </div>
      </div>

      <form 
        className="pathology-contact-form"
        onSubmit={handleSubmit}
      >
        {/* FormSubmit configuration */}
        <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        
        <h3 className="form-title">Déjanos tus datos de contacto</h3>
        
        <div className="form-group">
          <label htmlFor="nombre" className="form-label">
            Nombre completo *
          </label>
          <input
            type="text"
            id="nombre"
            name="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="form-input"
            placeholder="Tu nombre"
            required
            minLength={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="Email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono" className="form-label">
            Teléfono *
          </label>
          <input
            type="tel"
            id="telefono"
            name="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-input"
            placeholder="600 123 456"
            required
            minLength={9}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            ← Volver
          </button>
          
          <button
            type="submit"
            className="btn-primary"
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Solicitar evaluación →"}
          </button>
        </div>
        
        <p className="form-note">
          * Al enviar este formulario, aceptas que te contactemos para evaluar 
          las necesidades nutricionales de tu mascota.
        </p>
      </form>
    </div>
  );
}
