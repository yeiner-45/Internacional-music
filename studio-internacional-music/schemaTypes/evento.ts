import {defineField, defineType} from 'sanity'

export const evento = defineType({
  name: 'evento',
  title: 'Galería de Eventos',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título del Trabajo',
      type: 'string',
      description: 'Ej: Boda en el Hotel Tequendama',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          {title: 'DJ & Sonido', value: 'dj'},
          {title: 'Show en Vivo', value: 'show'},
          {title: 'Fotografía', value: 'fotografia'},
          {title: 'Producción de Video', value: 'video'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagenPrincipal',
      title: 'Subir Foto',
      type: 'image',
      options: {
        hotspot: true, // Esto permite al cliente centrar la cara de la gente en la miniatura
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fechaEvento',
      title: 'Fecha del Servicio',
      type: 'date',
    }),
  ],
})