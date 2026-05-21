import {defineField, defineType} from 'sanity'

export const albumCliente = defineType({
  name: 'albumCliente',
  title: 'Carpetas de Clientes',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Nombre de la carpeta',
      type: 'string',
      description: 'Ej: Boda Ana y Carlos',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cliente',
      title: 'Cliente',
      type: 'string',
    }),
    defineField({
      name: 'fechaEvento',
      title: 'Fecha del evento',
      type: 'date',
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          {title: 'Boda', value: 'boda'},
          {title: 'Fiesta', value: 'fiesta'},
          {title: 'Concierto', value: 'concierto'},
          {title: 'Evento corporativo', value: 'corporativo'},
          {title: 'Otro', value: 'otro'},
        ],
      },
      initialValue: 'otro',
    }),
    defineField({
      name: 'portada',
      title: 'Portada',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'medios',
      title: 'Fotos y videos',
      type: 'array',
      of: [
        {
          name: 'foto',
          title: 'Foto',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'video',
          title: 'Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
      ],
    }),
    defineField({
      name: 'publicado',
      title: 'Publicado en la web',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'cliente',
      media: 'portada',
    },
  },
})
