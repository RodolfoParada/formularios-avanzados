import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // Importamos z directamente aquí
import imageCompression from 'browser-image-compression';
import ImagePreview from './ImagePreview'; 
import './ProductForm.styles.css';

// --- SCHEMA DEFINIDO AQUÍ PARA EVITAR ERRORES DE RUTA ---
const productSchema = z.object({
  nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "Nombre demasiado largo"),
  precio: z.preprocess((val) => Number(val), 
    z.number({ invalid_type_error: "Debe ser un número" })
     .positive("El precio debe ser mayor a 0")),
  categoria: z.string().min(1, "Selecciona una categoría"),
  imagen: z.any()
    .refine((files) => files?.length > 0, "La imagen es obligatoria")
    .refine((files) => files?.[0]?.size <= 5000000, "Máximo 5MB")
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      "Solo JPG, PNG o WebP"
    ),
});

const ProductForm = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('idle');

  const { 
    register, 
    handleSubmit, 
    watch, 
    reset, 
    formState: { errors, isValid } 
  } = useForm({
    resolver: zodResolver(productSchema),
    mode: "onChange" 
  });

  const watchImagen = watch("imagen");

  const onSubmit = async (data) => {
    setStatus('loading');
    setUploadProgress(0);
    
    try {
      const imageFile = data.imagen[0];
      const compressedFile = await imageCompression(imageFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      });

      console.log("Archivo comprimido listo:", compressedFile.size / 1024, "KB");

      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(r => setTimeout(r, 100));
      }

      setStatus('success');
      
      setTimeout(() => {
        reset();
        setStatus('idle');
        setUploadProgress(0);
      }, 3000);

    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="form-card">
      <header>
        <h2>Crear Nuevo Producto</h2>
        <p>Completa los detalles para publicar</p>
      </header>
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        
        <div className={`form-group ${errors.nombre ? 'has-error' : ''}`}>
          <label htmlFor="nombre">Nombre del Producto</label>
          <input 
            id="nombre"
            {...register("nombre")} 
            placeholder="Ej. Auriculares Bluetooth Pro"
          />
          {errors.nombre && <span className="error-text">{errors.nombre.message}</span>}
        </div>

        <div className={`form-group ${errors.precio ? 'has-error' : ''}`}>
          <label htmlFor="precio">Precio (USD)</label>
          <input 
            id="precio"
            type="number" 
            step="0.01" 
            {...register("precio")} 
            placeholder="0.00"
          />
          {errors.precio && <span className="error-text">{errors.precio.message}</span>}
        </div>

        <div className={`form-group ${errors.categoria ? 'has-error' : ''}`}>
          <label htmlFor="categoria">Categoría</label>
          <select id="categoria" {...register("categoria")}>
            <option value="">Selecciona una categoría</option>
            <option value="electronica">Electrónica</option>
            <option value="hogar">Hogar</option>
            <option value="moda">Moda</option>
          </select>
          {errors.categoria && <span className="error-text">{errors.categoria.message}</span>}
        </div>

        <div className={`form-group ${errors.imagen ? 'has-error' : ''}`}>
          <label htmlFor="imagen">Imagen del Producto</label>
          <input 
            id="imagen"
            type="file" 
            accept="image/jpeg, image/png, image/webp"
            {...register("imagen")} 
          />
          <ImagePreview file={watchImagen} error={errors.imagen} />
        </div>

        {status === 'loading' && (
          <div className="progress-container">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <span className="progress-text">{uploadProgress}%</span>
          </div>
        )}

        <button 
          type="submit" 
          className={`btn-submit ${status}`} 
          disabled={status === 'loading' || !isValid}
        >
          {status === 'loading' ? 'Procesando...' : 'Publicar Producto'}
        </button>

        {status === 'success' && <div className="alert-success">✅ ¡Éxito! Producto creado.</div>}
        {status === 'error' && <div className="alert-error">❌ Error en el servidor.</div>}
      </form>
    </div>
  );
};

export default ProductForm;