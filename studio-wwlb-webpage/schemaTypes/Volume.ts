// studio-wwlb-webpage/schemaTypes/volume.ts
export default {
  name: 'volume',
  title: 'Volúmenes de la Novela',
  type: 'document',
  fields: [
    {
      name: 'volumeId',
      title: 'ID (Ej: vol-1)',
      type: 'string',
    },
    {
      name: 'number',
      title: 'Número (Ej: Volumen 1)',
      type: 'string',
    },
    {
      name: 'tag',
      title: 'Etiqueta / Tag (Ej: 🟢 VOLUMEN 1)',
      type: 'string',
    },
    {
      name: 'title',
      title: 'Título del Volumen',
      type: 'string',
    },
    {
      name: 'premise',
      title: 'Premisa',
      type: 'text',
    },
    {
      name: 'conflict',
      title: 'Conflicto',
      type: 'text',
    },
    {
      name: 'climax',
      title: 'Clímax',
      type: 'text',
    },
    // 👇 AGREGA ESTE CAMPO PARA EL TEXTO EXTENSO
    {
      name: 'content',
      title: 'Contenido / Historia Extensa',
      type: 'text',
    },
  ],
}