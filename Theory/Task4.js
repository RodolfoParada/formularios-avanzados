// Task 4: Subida de Archivos y Optimización (7 minutos)
// Implementación de subida de archivos con optimización y validación.

// 📁 Estrategias de Upload Moderno
// Validación de archivos en frontend:

const validateFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!file) return 'Archivo requerido';

  if (file.size > maxSize) {
    return 'El archivo no puede superar 5MB';
  }

  if (!allowedTypes.includes(file.type)) {
    return 'Solo se permiten imágenes JPG, PNG o WebP';
  }

  return null; // Válido
};
// Upload con progreso y preview:

function useFileUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setProgress(0);

    try {
      const response = await axios.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } finally {
      setUploading(false);
    }
  };

  const createPreview = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  return { uploadFile, progress, uploading, preview, createPreview };
}
// Concepto clave: La subida de archivos debe incluir validación, preview y feedback de progreso.

// 🖼️ Optimización de Imágenes
// Compresión antes de upload:

const compressImage = async (file, maxWidth = 1920) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo aspect ratio
      const ratio = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Dibujar imagen comprimida
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convertir a blob con compresión
      canvas.toBlob(resolve, 'image/jpeg', 0.8); // 80% calidad
    };

    img.src = URL.createObjectURL(file);
  });
};
// Concepto clave: Optimizar imágenes reduce tiempo de carga y ancho de banda sin perder calidad perceptible.