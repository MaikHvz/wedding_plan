/**
 * Datos demo de cada plantilla del catálogo (plan.md §11).
 * Contenido ficticio y fotografías de ejemplo para que la demo "parezca una
 * boda real" y genere deseo. Las imágenes usan picsum.photos (licencia
 * compatible: ver `LICENSES.md`).
 */

export interface TemplateDemo {
  title: string;
  partner1: string;
  partner2: string;
  eventDate: string;
  eventTime: string;
  locationName: string;
  locationAddress: string;
  mapsUrl: string;
  driveUrl: string;
  /** Datos por tipo de sección (los que consume el renderer). */
  data: Record<string, Record<string, unknown>>;
}

const DEMOS: Record<string, TemplateDemo> = {
  elegance: {
    title: "Elegance · Alta Costura",
    partner1: "Andrea",
    partner2: "Sebastián",
    eventDate: "2027-03-20",
    eventTime: "18:30",
    locationName: "Hacienda Los Robles",
    locationAddress: "Camino a Lampa 4500, Santiago",
    mapsUrl: "https://www.google.com/maps/place",
    driveUrl: "https://drive.google.com",
    data: {
      hero: {
        subtitle: "Una noche de alta costura y amor eterno",
        partner1: "Andrea",
        partner2: "Sebastián",
        image: "https://images.unsplash.com/photo-1768586471676-6af1d219e99e?auto=format&fit=crop&w=1920&q=85",
      },
      couple: {
        name1: "Andrea",
        name2: "Sebastián",
        image1: "https://images.unsplash.com/photo-1513262834354-6b2bca9b5b8d?auto=format&fit=crop&w=800&q=85",
        image2: "https://images.unsplash.com/photo-1719410876441-48357b53e6fd?auto=format&fit=crop&w=800&q=85",
        description:
          "Nos conocimos en un viaje a la Patagonia y desde entonces supimos que queríamos compartir toda la vida con elegancia y complicidad.",
      },
      story: {
        title: "Nuestra historia",
        image: "https://images.unsplash.com/photo-1774545272426-264af5db8d01?auto=format&fit=crop&w=1200&q=85",
        content:
          "Empezó con un café que duró ocho horas.\n\nLuego vinieron los viajes, las grandes decisiones y ese primer aniversario que no queríamos que terminara.\n\nHoy estamos felices de invitarte a celebrar la noche más importante de nuestras vidas.",
      },
      gallery: {
        images: [
          "https://images.unsplash.com/photo-1708569176850-9de9aa6b179b?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1712314947761-a8d718bd8c32?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1727425383452-2be55354f06e?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1727424831565-7ce0c8ab0610?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1727420517799-19be7ad1ed83?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1719786624838-b5d9a9e3f378?auto=format&fit=crop&w=800&q=85",
        ],
      },
      event: {
        title: "Ceremonia & Gala",
        date: "20 de marzo de 2027",
        time: "18:30 hrs",
        place: "Hacienda Los Robles",
        address: "Camino a Lampa 4500, Santiago",
      },
      location: {
        place: "Hacienda Los Robles",
        address: "Camino a Lampa 4500, Santiago",
        mapsUrl: "https://www.google.com/maps/place",
      },
      drive: {
        text: "Comparte tus fotos de la boda en nuestro álbum privado de Google Drive.",
      },
      dresscode: {
        title: "Código de vestimenta",
        code: "Alta costura · Formal",
        description:
          "Acompáñanos en gala. Vestidos largos, trajes oscuros y los detalles dorados que definen esta noche.",
        colors: ["#b98a5e", "#f5f0e8", "#3d3a36"],
      },
      footer: {
        text: "Con todo nuestro amor, Andrea & Sebastián",
      },
    },
  },
  boho: {
    title: "Boho · Alma Botánica",
    partner1: "Emilia",
    partner2: "Joaquín",
    eventDate: "2027-11-27",
    eventTime: "16:00",
    locationName: "Jardines de La Florida",
    locationAddress: "Camino El Albaricoque 1200, Santiago",
    mapsUrl: "https://www.google.com/maps/place",
    driveUrl: "https://drive.google.com",
    data: {
      hero: {
        subtitle: "Bajo la luz dorada del atardecer y el encanto floral",
        partner1: "Emilia",
        partner2: "Joaquín",
        image: "https://images.unsplash.com/photo-1576694667642-6f289dd54187?auto=format&fit=crop&w=1920&q=85",
      },
      couple: {
        name1: "Emilia",
        name2: "Joaquín",
        image1: "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?auto=format&fit=crop&w=800&q=85",
        image2: "https://images.unsplash.com/photo-1556302482-70b6e670e6b7?auto=format&fit=crop&w=800&q=85",
        description:
          "Ella cultiva flores silvestres y diseña joyas; él tuesta café de especialidad. Juntos construyeron un rincón cálido donde florece cada proyecto.",
      },
      story: {
        title: "De semilla a flor",
        image: "https://images.unsplash.com/photo-1608326670856-e3b41eecb106?auto=format&fit=crop&w=1200&q=85",
        content:
          "Nos encontramos en un mercado botánico un domingo de primavera.\n\nCompartimos nuestra pasión por la naturaleza, las caminatas entre montañas y la sencillez de los pequeños momentos.\n\nEl día de nuestro matrimonio celebraremos la vida al aire libre con todos ustedes.",
      },
      gallery: {
        images: [
          "https://images.unsplash.com/photo-1565038930214-09566ed2149b?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1574715244460-d1102b48b932?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1605101417781-b069480f938a?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1649615644662-5f33602a08c2?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1614526261139-1e5ebbd5086c?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1624137924753-2bf0d5f9c469?auto=format&fit=crop&w=800&q=85",
        ],
      },
      event: {
        title: "Ceremonia al Aire Libre",
        date: "27 de noviembre de 2027",
        time: "16:00 hrs",
        place: "Jardines de La Florida",
        address: "Camino El Albaricoque 1200, Santiago",
      },
      location: {
        place: "Jardines de La Florida",
        address: "Camino El Albaricoque 1200, Santiago",
        mapsUrl: "https://www.google.com/maps/place",
      },
      drive: {
        text: "Guarda en nuestro álbum los momentos del jardín y el atardecer.",
      },
      dresscode: {
        title: "Código de vestimenta",
        code: "Elegante boho",
        description:
          "Telas ligeras, tonos tierra y coronas de flores. Mujeres con vestidos vaporosos y hombres de lino.",
        colors: ["#c9a87c", "#7a5636", "#f3eadb"],
      },
      footer: {
        text: "Emilia & Joaquín — con amor, del jardín a la vida",
      },
    },
  },
  urbana: {
    title: "Urbana · Metropolitan Noir",
    partner1: "Carla",
    partner2: "Diego",
    eventDate: "2027-02-06",
    eventTime: "19:00",
    locationName: "Terraza Central Skyline",
    locationAddress: "Av. Providencia 980, Santiago",
    mapsUrl: "https://www.google.com/maps/place",
    driveUrl: "https://drive.google.com",
    data: {
      hero: {
        subtitle: "Vanguardia, arquitectura y amor cosmopolita",
        partner1: "Carla",
        partner2: "Diego",
        image: "https://images.unsplash.com/photo-1536113906904-15bfc5b63fc9?auto=format&fit=crop&w=1920&q=85",
      },
      couple: {
        name1: "Carla",
        name2: "Diego",
        image1: "https://images.unsplash.com/photo-1476836349418-180f91b52141?auto=format&fit=crop&w=800&q=85",
        image2: "https://images.unsplash.com/photo-1622979581361-23296b7b3ad2?auto=format&fit=crop&w=800&q=85",
        description:
          "Arquitectura, luces de ciudad, estética moderna y una complicidad que rompe esquemas.",
      },
      story: {
        title: "Nuestra sintonía",
        image: "https://images.unsplash.com/photo-1646380911461-ddd77cd2d448?auto=format&fit=crop&w=1200&q=85",
        content:
          "Nos conocimos entre galerías de arte y terrazas urbanas.\n\nSin filtros, con música en vivo y una conversación que nunca quiso apagarse.\n\nCelebramos en el corazón de la metrópoli.",
      },
      gallery: {
        images: [
          "https://images.unsplash.com/photo-1603214924133-5c2c78471b73?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1580824456266-c578703e13da?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1498159371869-3fd1c4c3d632?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1578317767641-c2a23b16b814?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1710587385487-63c0a4a06ff3?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1606490208247-b65be3d94cd1?auto=format&fit=crop&w=800&q=85",
        ],
      },
      event: {
        title: "Party & Rooftop Celebration",
        date: "6 de febrero de 2027",
        time: "19:00 hrs",
        place: "Terraza Central Skyline",
        address: "Av. Providencia 980, Santiago",
      },
      location: {
        place: "Terraza Central Skyline",
        address: "Av. Providencia 980, Santiago",
        mapsUrl: "https://www.google.com/maps/place",
      },
      drive: {
        text: "Sube tus fotos de la fiesta urbana en nuestra nube.",
      },
      dresscode: {
        title: "Código de vestimenta",
        code: "Vanguardia metropolitana",
        description:
          "Negro, blanco y acentos metálicos. Cocktail de noche: sofisticado, contemporáneo y atrevido.",
        colors: ["#1a1a1a", "#f4f4f4", "#c0c0c0"],
      },
      footer: {
        text: "Carla & Diego — Metropolis Edition",
      },
    },
  },
  clasica: {
    title: "Clásica · Imperial & Solemne",
    partner1: "Sofía",
    partner2: "Benjamín",
    eventDate: "2027-05-22",
    eventTime: "20:00",
    locationName: "Gran Palacio Imperial",
    locationAddress: "Av. del Mar 5000, Viña del Mar",
    mapsUrl: "https://www.google.com/maps/place",
    driveUrl: "https://drive.google.com",
    data: {
      hero: {
        subtitle: "La solemnidad de un amor que trasciende el tiempo",
        partner1: "Sofía",
        partner2: "Benjamín",
        image: "https://images.unsplash.com/photo-1723832347953-83c28e2d4dd2?auto=format&fit=crop&w=1920&q=85",
      },
      couple: {
        name1: "Sofía",
        name2: "Benjamín",
        image1: "https://images.unsplash.com/photo-1596457221755-b96bc3a6df18?auto=format&fit=crop&w=800&q=85",
        image2: "https://images.unsplash.com/photo-1588436199517-f2b12041a7cc?auto=format&fit=crop&w=800&q=85",
        description:
          "Dos almas unidas por la tradición, el respeto y una promesa eterna bajo los acordes del vals.",
      },
      story: {
        title: "Un amor de siempre",
        image: "https://images.unsplash.com/photo-1571753217197-b28b8f889b7a?auto=format&fit=crop&w=1200&q=85",
        content:
          "Se conocieron en una recepción solemne. Bastó una mirada y un primer baile para saber que su destino estaba sellado.\n\nHoy sellan esa promesa ante sus seres más queridos en una velada imperial.",
      },
      gallery: {
        images: [
          "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1525441273400-056e9c7517b3?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1670529776180-60e4132ab90c?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1492175742197-ed20dc5a6bed?auto=format&fit=crop&w=800&q=85",
        ],
      },
      event: {
        title: "Recepción & Gran Baile",
        date: "22 de mayo de 2027",
        time: "20:00 hrs",
        place: "Gran Palacio Imperial",
        address: "Av. del Mar 5000, Viña del Mar",
      },
      location: {
        place: "Gran Palacio Imperial",
        address: "Av. del Mar 5000, Viña del Mar",
        mapsUrl: "https://www.google.com/maps/place",
      },
      drive: {
        text: "Comparte las fotografías de esta gran noche en nuestro archivo conmemorativo.",
      },
      dresscode: {
        title: "Código de vestimenta",
        code: "Gran gala · Etiqueta",
        description:
          "Vestidos de gala, esmoquin y corbatas negras. Una velada imperial requiere lo mejor de cada quien.",
        colors: ["#8d1b1b", "#1b1b1b", "#e7d9b8"],
      },
      footer: {
        text: "Sofía & Benjamín — con solemne gratitud y distinción",
      },
    },
  },
  costa: {
    title: "Costa · Riviera Mediterránea",
    partner1: "Valentina",
    partner2: "Matías",
    eventDate: "2027-10-16",
    eventTime: "17:00",
    locationName: "Mirador Acantilados del Mar",
    locationAddress: "Ruta Costera km 18, Zapallar",
    mapsUrl: "https://www.google.com/maps/place",
    driveUrl: "https://drive.google.com",
    data: {
      hero: {
        subtitle: "El sonido de las olas, brisa marina y amor eterno",
        partner1: "Valentina",
        partner2: "Matías",
        image: "https://images.unsplash.com/photo-1519307212971-dd9561667ffb?auto=format&fit=crop&w=1920&q=85",
      },
      couple: {
        name1: "Valentina",
        name2: "Matías",
        image1: "https://images.unsplash.com/photo-1599142296733-1c1f2073e6de?auto=format&fit=crop&w=800&q=85",
        image2: "https://images.unsplash.com/photo-1556381255-0aaad4453d4d?auto=format&fit=crop&w=800&q=85",
        description:
          "Amantes del océano y los atardeceres infinitos. Encontraron en la costa el refugio perfecto para soñar juntos.",
      },
      story: {
        title: "Brisa de mar",
        image: "https://images.unsplash.com/photo-1606495185824-688328ed7871?auto=format&fit=crop&w=1200&q=85",
        content:
          "Caminando descalzos por la arena bajo un atardecer de verano nos prometimos amor incondicional.\n\nHoy reunimos a quienes más queremos frente a la inmensidad del mar para dar el sí.",
      },
      gallery: {
        images: [
          "https://images.unsplash.com/photo-1605985687770-2e2e82c9b5f1?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1755795652039-c95221cc55fa?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1515232389446-a17ce9ca7434?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1533120921505-7f40f5237ee1?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1562826772-be179f321470?auto=format&fit=crop&w=800&q=85",
          "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=85",
        ],
      },
      event: {
        title: "Celebración Frente al Mar",
        date: "16 de octubre de 2027",
        time: "17:00 hrs",
        place: "Mirador Acantilados del Mar",
        address: "Ruta Costera km 18, Zapallar",
      },
      location: {
        place: "Mirador Acantilados del Mar",
        address: "Ruta Costera km 18, Zapallar",
        mapsUrl: "https://www.google.com/maps/place",
      },
      drive: {
        text: "¿Nos fotografiaste junto al mar? Sube tus fotos a nuestro álbum.",
      },
      dresscode: {
        title: "Código de vestimenta",
        code: "Elegante playero",
        description:
          "Lino claro, pasteles y brisa marina. Zapatos cómodos para caminar sobre la arena al atardecer.",
        colors: ["#a8c8d8", "#f4ede0", "#7a9bb5"],
      },
      footer: {
        text: "Valentina & Matías — con la brisa y todo nuestro cariño",
      },
    },
  },
};

/** Devuelve los datos demo de una plantilla por slug, o null. */
export function getTemplateDemo(slug: string): TemplateDemo | null {
  return DEMOS[slug] ?? null;
}

/** Datos demo de todas las plantillas (por slug). */
export function getAllTemplateDemos(): Record<string, TemplateDemo> {
  return DEMOS;
}