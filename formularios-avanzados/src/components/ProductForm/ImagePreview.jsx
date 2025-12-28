import React, { useEffect, useState } from 'react';

const ImagePreview = ({ file, error }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Si no hay archivo (ej. reset del formulario), limpiamos el preview
    if (!file || file.length === 0) {
      setPreviewUrl(null);
      return;
    }

    // Creamos una URL temporal para el primer archivo seleccionado
    const objectUrl = URL.createObjectURL(file[0]);
    setPreviewUrl(objectUrl);

    // 🧹 IMPORTANTE: Limpieza de memoria
    // Revocamos la URL cuando el componente se desmonte o el archivo cambie
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!previewUrl && !error) {
    return (
      <div className="preview-placeholder">
        <span>No hay imagen seleccionada</span>
      </div>
    );
  }

  return (
    <div className={`preview-container ${error ? 'preview-error' : ''}`}>
      {previewUrl && (
        <img 
          src={previewUrl} 
          alt="Vista previa del producto" 
          className="img-preview-fluid"
        />
      )}
      {error && <p className="error-text-small">{error.message}</p>}
    </div>
  );
};

export default ImagePreview;