import { z } from 'zod';

export const productSchema = z.object({
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