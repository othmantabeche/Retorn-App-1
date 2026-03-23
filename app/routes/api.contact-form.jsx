/**
 * API endpoint para enviar formulario de contacto de patologías
 */

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Leer el body del request
    const body = await request.text();
    const formData = JSON.parse(body);
    
    console.log("📧 Enviando formulario de contacto:", formData);
    
    // Usar FormSubmit con la URL correcta para AJAX
    const response = await fetch(
      "https://formsubmit.co/ajax/info@retorn.com",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          _captcha: "false",
        }),
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      console.error("❌ Error de FormSubmit:", response.status, result);
      throw new Error(`FormSubmit error: ${response.status} - ${JSON.stringify(result)}`);
    }

    console.log("✅ Formulario enviado exitosamente:", result);
    
    return Response.json({ 
      success: true, 
      message: "Formulario enviado correctamente",
      data: result 
    });
    
  } catch (error) {
    console.error("❌ Error al enviar formulario:", error);
    return Response.json(
      { 
        success: false, 
        error: "Error al enviar el formulario",
        details: error.message 
      },
      { status: 500 }
    );
  }
};
