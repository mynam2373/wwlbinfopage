import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'vru32lc4', // El ID de tu proyecto que figuraba en la consola
  dataset: 'production',
  useCdn: true, // 'true' para descargas ultrarrápidas de texto
  apiVersion: '2024-01-01',
});