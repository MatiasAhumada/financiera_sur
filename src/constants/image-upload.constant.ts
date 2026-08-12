export const IMAGE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  MAX_PIXEL_COUNT: 40_000_000,
  MAX_IMAGES_PER_PRODUCT: 8,
  MAX_WIDTH: 2_000,
  MAX_HEIGHT: 2_000,
  QUALITY: 84,
  FALLBACK_QUALITY: 76,
  EFFORT: 5,
  OUTPUT_FORMAT: "webp",
  CONTENT_TYPE: "image/webp",
  KEY_PREFIX: "products",
} as const;
export const IMAGE_UPLOAD_MESSAGES = {
  REQUIRED_CONFIGURATION: "La configuración de almacenamiento no está disponible.",
  INVALID_FILE: "El archivo de imagen no es válido.",
  FILE_TOO_LARGE: "La imagen supera el tamaño máximo permitido.",
  TOO_MANY_IMAGES: "El producto supera la cantidad máxima de imágenes.",
  INVALID_IMAGE: "No se pudo procesar la imagen.",
} as const;
