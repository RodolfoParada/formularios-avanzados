// Task 3: Estados de Carga y Feedback Visual (8 minutos)
// Implementación de estados visuales que guíen al usuario durante interacciones.

// 🔄 Estados de Formulario Completo
// Máquina de estados de formulario:

const FORM_STATES = {
  IDLE: 'idle',       // Formulario listo para usar
  VALIDATING: 'validating', // Validando campos en tiempo real
  SUBMITTING: 'submitting', // Enviando datos al servidor
  SUCCESS: 'success', // Envío exitoso
  ERROR: 'error'      // Error en envío
};
// Implementación con hooks:

function useFormState() {
  const [state, setState] = useState(FORM_STATES.IDLE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (submitFn) => {
    setState(FORM_STATES.SUBMITTING);
    setIsSubmitting(true);

    try {
      await submitFn();
      setState(FORM_STATES.SUCCESS);
      setErrors({});
    } catch (error) {
      setState(FORM_STATES.ERROR);
      setErrors(error.response?.data?.errors || { general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { state, errors, isSubmitting, submit };
}
// Concepto clave: Los estados visuales reducen la incertidumbre del usuario durante operaciones asíncronas.

// 🎭 Optimistic UI Pattern
// Actualizar UI inmediatamente, luego confirmar con servidor:

const handleLike = async (postId) => {
  // 1. Actualizar UI inmediatamente (optimistic)
  setPosts(prev => prev.map(post =>
    post.id === postId
      ? { ...post, likes: post.likes + 1, likedByMe: true }
      : post
  ));

  try {
    // 2. Enviar al servidor
    await api.likePost(postId);
  } catch (error) {
    // 3. Revertir si hay error
    setPosts(prev => prev.map(post =>
      post.id === postId
      ? { ...post, likes: post.likes - 1, likedByMe: false }
      : post
    ));
    showError('No se pudo dar like. Intenta de nuevo.');
  }
};
// Concepto clave: Optimistic UI hace que la aplicación se sienta instantánea mientras maneja errores graceful.