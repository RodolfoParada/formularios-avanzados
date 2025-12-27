// Task 2: Estrategias de Validación Robusta (7 minutos)
// Implementación de validación en múltiples capas para máxima confiabilidad.

// 🛡️ Capas de Validación
// 1. Validación Frontend (UX)

// Inmediata, no bloqueante
// Feedback visual instantáneo
// Previene requests innecesarios
// Mejora experiencia de usuario
// 2. Validación Backend (Seguridad)

// Autoridad final de validación
// Protección contra manipulación
// Sanitización de datos
// Seguridad como prioridad
// 3. Validación de Negocio

// Reglas específicas del dominio
// Lógica de aplicación compleja
// Constraints de base de datos
// Validaciones interdependientes
// Concepto clave: Cada capa tiene un propósito diferente - UX, seguridad y lógica de negocio.

// 📋 Patrones de Validación Moderna
// Schema-Based Validation con Zod:

import { z } from 'zod';

// Schema reutilizable y tipado
const userSchema = z.object({
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),

  email: z.string()
    .email("Formato de email inválido")
    .min(1, "El email es requerido"),

  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),

  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

// Uso en componente
const validateForm = (data) => {
  try {
    userSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach(err => {
      errors[err.path[0]] = err.message;
    });
    return { isValid: false, errors };
  }
};
// Concepto clave: Los schemas permiten validación declarativa, reutilizable y tipada.