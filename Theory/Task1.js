// Task 1: Principios de UX en Formularios (8 minutos)
// Comprensión de por qué los formularios son críticos para la experiencia de usuario.

// 🎯 ¿Por qué los Formularios son Críticos para UX?
// Los formularios son el punto de conversión más importante de cualquier aplicación web:

// Estadísticas impactantes:

// 80% de usuarios abandonan formularios con problemas de UX
// Mejor UX = +300% conversión según Nielsen Norman Group
// Formularios son el puente entre usuario y aplicación
// Problemas comunes de UX en formularios:

// Validación tardía: Solo al enviar (submit)
// Mensajes de error confusos: "Campo requerido" sin contexto
// Campos obligatorios no claros: Sin indicadores visuales
// Feedback visual insuficiente: Estados no diferenciados
// Estados de carga invisibles: Usuario no sabe qué pasa
// Concepto clave: Los formularios deben guiar al usuario hacia el éxito, no castigarlo por errores.

// 🎨 Principios de Formulario Efectivo
// 1. Validación en Tiempo Real (Inline Validation)

// ❌ Mal: Validación solo al enviar
const handleSubmit = (e) => {
  e.preventDefault();
  const errors = validateAllFields(formData);
  setErrors(errors); // Usuario ve todos los errores a la vez
};

// ✅ Bien: Validación instantánea por campo
const validateEmail = (email) => {
  if (!email) return 'El email es requerido';
  if (!email.includes('@')) return 'Formato de email inválido';
  return null;
};

const handleEmailChange = (e) => {
  const error = validateEmail(e.target.value);
  setFieldErrors(prev => ({ ...prev, email: error }));
};
// 2. Mensajes de Error Contextuales y Accionables

// ❌ Mal: Genérico
error: "Campo requerido"

// ✅ Bien: Específico y útil
error: "Por favor ingresa tu nombre completo para continuar con el registro"

// ❌ Mal: Técnico
error: "El campo debe tener entre 8 y 20 caracteres"

// ✅ Bien: Humano
error: "La contraseña debe tener al menos 8 caracteres para mayor seguridad"
// Concepto clave: Los mensajes de error deben explicar qué hacer, no solo qué está mal.