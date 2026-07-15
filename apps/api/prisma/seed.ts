/* eslint-disable no-console */

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/generated/prisma/client';
import { NodePasswordHasher } from '../src/modules/identity/infrastructure/crypto/node-password-hasher';

const databaseUrl =
  process.env['DATABASE_URL'] ?? 'postgresql://wormarket:wormarket@localhost:5432/wormarket';

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });
const passwordHasher = new NodePasswordHasher();

const demoPassword = 'WormarketDemo123!';

const seedDimensions = [
  {
    slug: 'oraculo-norte',
    name: 'Oraculo Norte',
    description:
      'Dimension de bibliotecas vivas, decisiones no tomadas y mercados regidos por augurios.',
    currencyCode: 'AUR',
    currencyName: 'Aurora',
    exchangeRate: 1.2,
    shippingRules: 'Los envios deben declararse antes de que el destinatario los recuerde.',
    forbiddenObjects: ['recuerdos sellados', 'profecias autocumplidas'],
  },
  {
    slug: 'distrito-cronal',
    name: 'Distrito Cronal',
    description: 'Ciudad suspendida en bucles horarios donde el tiempo se compra por minutos.',
    currencyCode: 'MIN',
    currencyName: 'Minuto reversible',
    exchangeRate: 0.85,
    shippingRules: 'Los objetos deben estabilizarse durante siete minutos antes de cruzar.',
    forbiddenObjects: ['paradojas abiertas', 'relojes sin dueno'],
  },
  {
    slug: 'archivo-horizonte',
    name: 'Archivo Horizonte',
    description: 'Plano cartografico de lugares improbables, mapas futuros y rutas incompletas.',
    currencyCode: 'MAP',
    currencyName: 'Fragmento cartografico',
    exchangeRate: 1.5,
    shippingRules: 'Todo envio requiere una coordenada que aun no exista en origen.',
    forbiddenObjects: ['brujulas absolutas', 'mapas cerrados'],
  },
];

const seedUsers = [
  {
    username: 'lyra-oraculo',
    displayName: 'Lyra del Oraculo',
    bio: 'Tasadora de reliquias que recuerda futuros alternativos antes de cerrar una venta.',
    avatarUrl: '/images/demo/users/lyra-oraculo.png',
    homeDimensionSlug: 'oraculo-norte',
    reputation: 42,
    role: 'USER' as const,
    status: 'ACTIVE' as const,
  },
  {
    username: 'nadir-cronal',
    displayName: 'Nadir Cronal',
    bio: 'Coleccionista de minutos reversibles y especialista en entregas con desfase horario.',
    avatarUrl: '/images/demo/users/nadir-cronal.png',
    homeDimensionSlug: 'distrito-cronal',
    reputation: 31,
    role: 'USER' as const,
    status: 'ACTIVE' as const,
  },
  {
    username: 'io-horizonte',
    displayName: 'Io Horizonte',
    bio: 'Cartografa de rutas improbables y proveedora de mapas que aun no existen.',
    avatarUrl: '/images/demo/users/io-horizonte.png',
    homeDimensionSlug: 'archivo-horizonte',
    reputation: 27,
    role: 'MODERATOR' as const,
    status: 'ACTIVE' as const,
  },
  {
    username: 'vega-umbral',
    displayName: 'Vega Umbral',
    bio: 'Compradora de rarezas menores que prueba ofertas, favoritos y conversaciones cruzadas.',
    avatarUrl: '/images/demo/users/vega-umbral.png',
    homeDimensionSlug: 'archivo-horizonte',
    reputation: 18,
    role: 'USER' as const,
    status: 'ACTIVE' as const,
  },
  {
    username: 'zerodev',
    displayName: 'ZeroDev',
    bio: 'Administrador local de Wormarket para validar permisos, moderacion y supervision del mercado.',
    avatarUrl: '/images/demo/users/zerodev.png',
    homeDimensionSlug: 'distrito-cronal',
    reputation: 64,
    role: 'ADMIN' as const,
    status: 'ACTIVE' as const,
  },
  {
    username: 'braismoure',
    displayName: 'Brais Moure',
    bio: 'Usuario general de demostracion para recorrer el marketplace de extremo a extremo.',
    avatarUrl: '/images/demo/users/braismoure.png',
    homeDimensionSlug: 'oraculo-norte',
    reputation: 36,
    role: 'USER' as const,
    status: 'ACTIVE' as const,
  },
];

const seedIdentityAccounts = [
  {
    username: 'lyra-oraculo',
    email: 'vendedor@demo.wormarket.local',
  },
  {
    username: 'nadir-cronal',
    email: 'comprador@demo.wormarket.local',
  },
  {
    username: 'vega-umbral',
    email: 'comprador2@demo.wormarket.local',
  },
  {
    username: 'io-horizonte',
    email: 'moderador@demo.wormarket.local',
  },
  {
    username: 'zerodev',
    email: 'zerodev@demo.wormarket.local',
  },
  {
    username: 'braismoure',
    email: 'braismoure@demo.wormarket.local',
  },
];

const seedListings = [
  {
    slug: 'brujula-de-decisiones-no-tomadas',
    sellerUsername: 'lyra-oraculo',
    dimensionSlug: 'oraculo-norte',
    title: 'Brujula de decisiones no tomadas',
    description:
      'Instrumento de bolsillo que apunta hacia la alternativa que casi elegiste. Ideal para viajeros indecisos y negociadores cautelosos.',
    price: 180,
    rarity: 'RARE' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/brujula-decisiones.png'],
  },
  {
    slug: 'reloj-de-siete-minutos-reversibles',
    sellerUsername: 'nadir-cronal',
    dimensionSlug: 'distrito-cronal',
    title: 'Reloj de siete minutos reversibles',
    description:
      'Reloj estabilizado que permite rebobinar siete minutos menores. No incluye licencia para paradojas mayores.',
    price: 320,
    rarity: 'EPIC' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/reloj-siete-minutos.png'],
  },
  {
    slug: 'mapa-de-lugares-que-aun-no-existen',
    sellerUsername: 'io-horizonte',
    dimensionSlug: 'archivo-horizonte',
    title: 'Mapa de lugares que aun no existen',
    description:
      'Mapa desplegable con rutas futuras, margenes cambiantes y advertencias para destinos que todavia no han ocurrido.',
    price: 260,
    rarity: 'LEGENDARY' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/mapa-lugares-futuros.png'],
  },
  {
    slug: 'puerta-portatil-hacia-otra-dimension',
    sellerUsername: 'vega-umbral',
    dimensionSlug: 'archivo-horizonte',
    title: 'Puerta portatil hacia otra dimension',
    description:
      'Umbral plegable con bisagras de laton y destino ajustable. Requiere declarar coordenadas antes de cruzar.',
    price: 540,
    rarity: 'LEGENDARY' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/puerta-portatil-dimension.png'],
  },
  {
    slug: 'recuerdo-perteneciente-a-otra-persona',
    sellerUsername: 'lyra-oraculo',
    dimensionSlug: 'oraculo-norte',
    title: 'Recuerdo perteneciente a otra persona',
    description:
      'Fragmento de memoria conservado en cristal de archivo. Incluye certificado de no pertenencia al comprador.',
    price: 145,
    rarity: 'FORBIDDEN' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/recuerdo-ajeno.png'],
  },
  {
    slug: 'planta-que-crece-cuando-alguien-miente',
    sellerUsername: 'braismoure',
    dimensionSlug: 'oraculo-norte',
    title: 'Planta que crece cuando alguien miente',
    description:
      'Especimen domestico que brota con cada mentira cercana. Muy util en negociaciones, algo incomoda en cenas familiares.',
    price: 95,
    rarity: 'RARE' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/planta-mentiras.png'],
  },
  {
    slug: 'piedra-con-gravedad-invertida',
    sellerUsername: 'nadir-cronal',
    dimensionSlug: 'distrito-cronal',
    title: 'Piedra con gravedad invertida',
    description:
      'Mineral estabilizado que cae hacia arriba si se suelta. Se entrega con soporte de seguridad y aviso de techo bajo.',
    price: 210,
    rarity: 'EPIC' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/piedra-gravedad-invertida.png'],
  },
  {
    slug: 'botella-que-contiene-una-tormenta',
    sellerUsername: 'io-horizonte',
    dimensionSlug: 'archivo-horizonte',
    title: 'Botella que contiene una tormenta',
    description:
      'Botella sellada con microclima inestable, relampagos diminutos y lluvia propia. No agitar cerca de mapas abiertos.',
    price: 230,
    rarity: 'EPIC' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/botella-tormenta.png'],
  },
  {
    slug: 'espejo-que-muestra-versiones-alternativas',
    sellerUsername: 'zerodev',
    dimensionSlug: 'distrito-cronal',
    title: 'Espejo que muestra versiones alternativas del usuario',
    description:
      'Espejo de sobremesa que revela decisiones paralelas del observador. Modo demo limitado a reflejos no vinculantes.',
    price: 390,
    rarity: 'LEGENDARY' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/espejo-versiones-alternativas.png'],
  },
  {
    slug: 'traductor-de-lenguas-desaparecidas',
    sellerUsername: 'braismoure',
    dimensionSlug: 'archivo-horizonte',
    title: 'Traductor de lenguas desaparecidas',
    description:
      'Dispositivo portatil para interpretar idiomas extintos, dialectos olvidados y susurros archivados fuera de catalogo.',
    price: 170,
    rarity: 'RARE' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/traductor-lenguas-desaparecidas.png'],
  },
  {
    slug: 'caja-de-ecos-prestados',
    sellerUsername: 'lyra-oraculo',
    dimensionSlug: 'oraculo-norte',
    title: 'Caja de ecos prestados',
    description:
      'Caja lacada que guarda voces de conversaciones que aun no han ocurrido. Perfecta para ensayar disculpas antes de necesitarlas.',
    price: 125,
    rarity: 'RARE' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/caja-ecos-prestados.png'],
  },
  {
    slug: 'lente-para-ver-caminos-descartados',
    sellerUsername: 'vega-umbral',
    dimensionSlug: 'archivo-horizonte',
    title: 'Lente para ver caminos descartados',
    description:
      'Monoculo de viaje que revela rutas que nadie eligio. Incluye funda con cierre antinostalgia.',
    price: 205,
    rarity: 'EPIC' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/lente-caminos-descartados.png'],
  },
  {
    slug: 'farol-que-ilumina-portales-cerrados',
    sellerUsername: 'nadir-cronal',
    dimensionSlug: 'distrito-cronal',
    title: 'Farol que ilumina portales cerrados',
    description:
      'Farol de bronce que marca bordes de portales apagados durante diez minutos. No abre puertas: evita tropezar con ellas.',
    price: 285,
    rarity: 'RARE' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/farol-portales-cerrados.png'],
  },
];

const seedFavorites = [
  {
    username: 'lyra-oraculo',
    listingSlug: 'reloj-de-siete-minutos-reversibles',
  },
  {
    username: 'nadir-cronal',
    listingSlug: 'mapa-de-lugares-que-aun-no-existen',
  },
  {
    username: 'io-horizonte',
    listingSlug: 'brujula-de-decisiones-no-tomadas',
  },
  {
    username: 'vega-umbral',
    listingSlug: 'reloj-de-siete-minutos-reversibles',
  },
  {
    username: 'braismoure',
    listingSlug: 'mapa-de-lugares-que-aun-no-existen',
  },
];

const seedOffers = [
  {
    id: 'seed-offer-nadir-brujula',
    buyerUsername: 'nadir-cronal',
    listingSlug: 'brujula-de-decisiones-no-tomadas',
    amount: 165,
    message: 'Puedo pagar en minutos reversibles estabilizados si aceptas entrega diferida.',
    status: 'ACCEPTED' as const,
  },
  {
    id: 'seed-offer-io-reloj',
    buyerUsername: 'io-horizonte',
    listingSlug: 'reloj-de-siete-minutos-reversibles',
    amount: 305,
    message: 'Incluyo un mapa incompleto como garantia cartografica.',
    status: 'PENDING' as const,
  },
  {
    id: 'seed-offer-lyra-mapa',
    buyerUsername: 'lyra-oraculo',
    listingSlug: 'mapa-de-lugares-que-aun-no-existen',
    amount: 250,
    message: 'Oferta valida antes de que el destino aparezca en la tercera margen.',
    status: 'PENDING' as const,
  },
  {
    id: 'seed-offer-vega-brujula',
    buyerUsername: 'vega-umbral',
    listingSlug: 'brujula-de-decisiones-no-tomadas',
    amount: 172,
    message: 'La necesito para comparar dos decisiones que todavia no han discutido entre si.',
    status: 'PENDING' as const,
  },
  {
    id: 'seed-offer-brais-reloj',
    buyerUsername: 'braismoure',
    listingSlug: 'reloj-de-siete-minutos-reversibles',
    amount: 315,
    message: 'Puedo cerrar la compra si el reloj trae instrucciones para no romper la demo.',
    status: 'PENDING' as const,
  },
];

type SeedTransactionStatus = 'PENDING_DELIVERY' | 'COMPLETED';

const seedTransactions: Array<{
  id: string;
  offerId: string;
  status: SeedTransactionStatus;
  completedAt: Date | null;
}> = [
  {
    id: 'seed-transaction-nadir-brujula',
    offerId: 'seed-offer-nadir-brujula',
    status: 'COMPLETED' as const,
    completedAt: new Date('2026-07-09T10:30:00.000Z'),
  },
];

const seedReviews = [
  {
    id: 'seed-review-nadir-to-lyra-brujula',
    transactionId: 'seed-transaction-nadir-brujula',
    reviewerUsername: 'nadir-cronal',
    rating: 5,
    comment: 'La brujula llego estable y Lyra explico sus riesgos antes de cerrar el portal.',
  },
  {
    id: 'seed-review-lyra-to-nadir-brujula',
    transactionId: 'seed-transaction-nadir-brujula',
    reviewerUsername: 'lyra-oraculo',
    rating: 4,
    comment:
      'Nadir pago a tiempo, aunque los minutos reversibles dejaron un leve eco en la factura.',
  },
];

const seedNotifications = [
  {
    id: 'seed-notification-lyra-offer',
    username: 'lyra-oraculo',
    type: 'OFFER_RECEIVED' as const,
    title: 'Nueva oferta recibida',
    message: 'Nadir Cronal ha ofertado 165 AUR por "Brujula de decisiones no tomadas".',
    linkPath: '/listings/brujula-de-decisiones-no-tomadas',
    readAt: null,
  },
  {
    id: 'seed-notification-nadir-review',
    username: 'nadir-cronal',
    type: 'REVIEW_RECEIVED' as const,
    title: 'Nueva valoracion recibida',
    message:
      'Lyra del Oraculo te ha valorado con 4 estrellas por "Brujula de decisiones no tomadas".',
    linkPath: '/users/nadir-cronal/reviews',
    readAt: new Date('2026-07-09T11:20:00.000Z'),
  },
  {
    id: 'seed-notification-brais-offer',
    username: 'braismoure',
    type: 'OFFER_RECEIVED' as const,
    title: 'Demo lista para probar',
    message: 'Tu usuario general tiene favoritos, ofertas y rutas de prueba disponibles.',
    linkPath: '/favorites',
    readAt: null,
  },
];

const seedReports = [
  {
    id: 'seed-report-io-reloj',
    reporterUsername: 'io-horizonte',
    targetType: 'LISTING' as const,
    listingSlug: 'reloj-de-siete-minutos-reversibles',
    reportedUsername: null,
    reason: 'FORBIDDEN_OBJECT' as const,
    description:
      'El reloj podria generar paradojas menores si cruza sin estabilizacion cronal adicional.',
    status: 'PENDING' as const,
    resolution: null,
    resolvedByUsername: null,
    resolvedAt: null,
  },
  {
    id: 'seed-report-lyra-nadir',
    reporterUsername: 'lyra-oraculo',
    targetType: 'USER' as const,
    listingSlug: null,
    reportedUsername: 'nadir-cronal',
    reason: 'FRAUD' as const,
    description:
      'El comprador uso minutos reversibles con eco residual en una factura interdimensional.',
    status: 'DISMISSED' as const,
    resolution: 'Revisado por moderacion: no hubo fraude, solo desfase horario menor.',
    resolvedByUsername: 'io-horizonte',
    resolvedAt: new Date('2026-07-09T12:00:00.000Z'),
  },
];

const seedConversations = [
  {
    id: 'seed-conversation-nadir-brujula',
    listingSlug: 'brujula-de-decisiones-no-tomadas',
    buyerUsername: 'nadir-cronal',
    messages: [
      {
        id: 'seed-message-nadir-brujula-1',
        senderUsername: 'nadir-cronal',
        content:
          '¿La brujula sigue apuntando a decisiones no tomadas despues de una tormenta cronal?',
        readAt: new Date('2026-07-09T10:10:00.000Z'),
      },
      {
        id: 'seed-message-nadir-brujula-2',
        senderUsername: 'lyra-oraculo',
        content: 'Si, pero conviene no mirarla durante futuros alternativos demasiado recientes.',
        readAt: null,
      },
    ],
  },
  {
    id: 'seed-conversation-io-reloj',
    listingSlug: 'reloj-de-siete-minutos-reversibles',
    buyerUsername: 'io-horizonte',
    messages: [
      {
        id: 'seed-message-io-reloj-1',
        senderUsername: 'io-horizonte',
        content:
          'Necesito confirmar si el reloj incluye instrucciones para evitar paradojas menores.',
        readAt: null,
      },
    ],
  },
  {
    id: 'seed-conversation-brais-reloj',
    listingSlug: 'reloj-de-siete-minutos-reversibles',
    buyerUsername: 'braismoure',
    messages: [
      {
        id: 'seed-message-brais-reloj-1',
        senderUsername: 'braismoure',
        content: 'Quiero probar el flujo completo: oferta, chat y valoracion cuando proceda.',
        readAt: null,
      },
    ],
  },
];

async function main(): Promise<void> {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;

  for (const dimension of seedDimensions) {
    await prisma.dimension.upsert({
      where: {
        slug: dimension.slug,
      },
      update: dimension,
      create: dimension,
    });
  }

  for (const user of seedUsers) {
    const homeDimension = await prisma.dimension.findUnique({
      where: {
        slug: user.homeDimensionSlug,
      },
    });

    if (!homeDimension) {
      throw new Error(`Seed dimension not found for user ${user.username}.`);
    }

    await prisma.user.upsert({
      where: {
        username: user.username,
      },
      update: {
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        homeDimensionId: homeDimension.id,
        reputation: user.reputation,
        role: user.role,
        status: user.status,
      },
      create: {
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        homeDimensionId: homeDimension.id,
        reputation: user.reputation,
        role: user.role,
        status: user.status,
      },
    });
  }

  for (const account of seedIdentityAccounts) {
    const user = await prisma.user.findUnique({
      where: {
        username: account.username,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error(`Seed user not found for identity account ${account.email}.`);
    }

    const passwordHash = passwordHasher.hash(demoPassword);

    await prisma.identityAccount.upsert({
      where: {
        userId: user.id,
      },
      update: {
        email: account.email,
        passwordHash,
        refreshTokenHash: null,
      },
      create: {
        email: account.email,
        passwordHash,
        refreshTokenHash: null,
        userId: user.id,
      },
    });
  }

  for (const listing of seedListings) {
    const [seller, dimension] = await Promise.all([
      prisma.user.findUnique({
        where: {
          username: listing.sellerUsername,
        },
      }),
      prisma.dimension.findUnique({
        where: {
          slug: listing.dimensionSlug,
        },
      }),
    ]);

    if (!seller) {
      throw new Error(`Seed seller not found for listing ${listing.slug}.`);
    }

    if (!dimension) {
      throw new Error(`Seed dimension not found for listing ${listing.slug}.`);
    }

    await prisma.listing.upsert({
      where: {
        slug: listing.slug,
      },
      update: {
        sellerId: seller.id,
        dimensionId: dimension.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        currencyCode: dimension.currencyCode,
        rarity: listing.rarity,
        status: listing.status,
        imageUrls: listing.imageUrls,
      },
      create: {
        slug: listing.slug,
        sellerId: seller.id,
        dimensionId: dimension.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        currencyCode: dimension.currencyCode,
        rarity: listing.rarity,
        status: listing.status,
        imageUrls: listing.imageUrls,
      },
    });
  }

  for (const favorite of seedFavorites) {
    const [user, listing] = await Promise.all([
      prisma.user.findUnique({
        where: {
          username: favorite.username,
        },
      }),
      prisma.listing.findUnique({
        where: {
          slug: favorite.listingSlug,
        },
      }),
    ]);

    if (!user) {
      throw new Error(`Seed user not found for favorite ${favorite.username}.`);
    }

    if (!listing) {
      throw new Error(`Seed listing not found for favorite ${favorite.listingSlug}.`);
    }

    await prisma.favorite.upsert({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId: listing.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        listingId: listing.id,
      },
    });
  }

  for (const offer of seedOffers) {
    const [buyer, listing] = await Promise.all([
      prisma.user.findUnique({
        where: {
          username: offer.buyerUsername,
        },
      }),
      prisma.listing.findUnique({
        where: {
          slug: offer.listingSlug,
        },
      }),
    ]);

    if (!buyer) {
      throw new Error(`Seed buyer not found for offer ${offer.id}.`);
    }

    if (!listing) {
      throw new Error(`Seed listing not found for offer ${offer.id}.`);
    }

    await prisma.offer.upsert({
      where: {
        id: offer.id,
      },
      update: {
        buyerId: buyer.id,
        listingId: listing.id,
        amount: offer.amount,
        currencyCode: listing.currencyCode,
        message: offer.message,
        status: offer.status,
      },
      create: {
        id: offer.id,
        buyerId: buyer.id,
        listingId: listing.id,
        amount: offer.amount,
        currencyCode: listing.currencyCode,
        message: offer.message,
        status: offer.status,
      },
    });
  }

  for (const transaction of seedTransactions) {
    const offer = await prisma.offer.findUnique({
      where: {
        id: transaction.offerId,
      },
      include: {
        listing: {
          select: {
            id: true,
            sellerId: true,
          },
        },
      },
    });

    if (!offer) {
      throw new Error(`Seed offer not found for transaction ${transaction.id}.`);
    }

    await prisma.$transaction([
      prisma.listing.update({
        where: {
          id: offer.listingId,
        },
        data: {
          status: transaction.status === 'COMPLETED' ? 'SOLD' : 'RESERVED',
        },
      }),
      prisma.transaction.upsert({
        where: {
          id: transaction.id,
        },
        update: {
          offerId: offer.id,
          listingId: offer.listingId,
          buyerId: offer.buyerId,
          sellerId: offer.listing.sellerId,
          amount: offer.amount,
          currencyCode: offer.currencyCode,
          status: transaction.status,
          completedAt: transaction.completedAt,
        },
        create: {
          id: transaction.id,
          offerId: offer.id,
          listingId: offer.listingId,
          buyerId: offer.buyerId,
          sellerId: offer.listing.sellerId,
          amount: offer.amount,
          currencyCode: offer.currencyCode,
          status: transaction.status,
          completedAt: transaction.completedAt,
        },
      }),
    ]);
  }

  for (const conversation of seedConversations) {
    const [buyer, listing] = await Promise.all([
      prisma.user.findUnique({
        where: {
          username: conversation.buyerUsername,
        },
      }),
      prisma.listing.findUnique({
        where: {
          slug: conversation.listingSlug,
        },
      }),
    ]);

    if (!buyer) {
      throw new Error(`Seed buyer not found for conversation ${conversation.id}.`);
    }

    if (!listing) {
      throw new Error(`Seed listing not found for conversation ${conversation.id}.`);
    }

    const seededConversation = await prisma.conversation.upsert({
      where: {
        id: conversation.id,
      },
      update: {
        listingId: listing.id,
        buyerId: buyer.id,
        sellerId: listing.sellerId,
      },
      create: {
        id: conversation.id,
        listingId: listing.id,
        buyerId: buyer.id,
        sellerId: listing.sellerId,
      },
    });

    for (const message of conversation.messages) {
      const sender = await prisma.user.findUnique({
        where: {
          username: message.senderUsername,
        },
      });

      if (!sender) {
        throw new Error(`Seed sender not found for message ${message.id}.`);
      }

      await prisma.message.upsert({
        where: {
          id: message.id,
        },
        update: {
          conversationId: seededConversation.id,
          senderId: sender.id,
          content: message.content,
          readAt: message.readAt,
        },
        create: {
          id: message.id,
          conversationId: seededConversation.id,
          senderId: sender.id,
          content: message.content,
          readAt: message.readAt,
        },
      });
    }
  }

  for (const review of seedReviews) {
    const [transaction, reviewer] = await Promise.all([
      prisma.transaction.findUnique({
        where: {
          id: review.transactionId,
        },
        select: {
          id: true,
          buyerId: true,
          sellerId: true,
          status: true,
        },
      }),
      prisma.user.findUnique({
        where: {
          username: review.reviewerUsername,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!transaction) {
      throw new Error(`Seed transaction not found for review ${review.id}.`);
    }

    if (!reviewer) {
      throw new Error(`Seed reviewer not found for review ${review.id}.`);
    }

    if (transaction.status !== 'COMPLETED') {
      throw new Error(`Seed transaction must be completed for review ${review.id}.`);
    }

    const revieweeId =
      reviewer.id === transaction.buyerId ? transaction.sellerId : transaction.buyerId;

    if (revieweeId === reviewer.id) {
      throw new Error(`Seed reviewer cannot review themselves for review ${review.id}.`);
    }

    await prisma.review.upsert({
      where: {
        id: review.id,
      },
      update: {
        transactionId: transaction.id,
        reviewerId: reviewer.id,
        revieweeId,
        rating: review.rating,
        comment: review.comment,
      },
      create: {
        id: review.id,
        transactionId: transaction.id,
        reviewerId: reviewer.id,
        revieweeId,
        rating: review.rating,
        comment: review.comment,
      },
    });
  }

  const reviewedUserIds = new Set<string>();

  for (const review of seedReviews) {
    const seededReview = await prisma.review.findUnique({
      where: {
        id: review.id,
      },
      select: {
        revieweeId: true,
      },
    });

    if (seededReview) {
      reviewedUserIds.add(seededReview.revieweeId);
    }
  }

  for (const reviewedUserId of reviewedUserIds) {
    const aggregate = await prisma.review.aggregate({
      where: {
        revieweeId: reviewedUserId,
      },
      _avg: {
        rating: true,
      },
    });

    await prisma.user.update({
      where: {
        id: reviewedUserId,
      },
      data: {
        reputation: Math.round((aggregate._avg.rating ?? 0) * 20),
      },
    });
  }

  for (const notification of seedNotifications) {
    const user = await prisma.user.findUnique({
      where: {
        username: notification.username,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error(`Seed user not found for notification ${notification.id}.`);
    }

    await prisma.notification.upsert({
      where: {
        id: notification.id,
      },
      update: {
        userId: user.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        linkPath: notification.linkPath,
        readAt: notification.readAt,
      },
      create: {
        id: notification.id,
        userId: user.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        linkPath: notification.linkPath,
        readAt: notification.readAt,
      },
    });
  }

  for (const report of seedReports) {
    const [reporter, listing, reportedUser, resolvedBy] = await Promise.all([
      prisma.user.findUnique({
        where: {
          username: report.reporterUsername,
        },
        select: {
          id: true,
        },
      }),
      report.listingSlug
        ? prisma.listing.findUnique({
            where: {
              slug: report.listingSlug,
            },
            select: {
              id: true,
            },
          })
        : Promise.resolve(null),
      report.reportedUsername
        ? prisma.user.findUnique({
            where: {
              username: report.reportedUsername,
            },
            select: {
              id: true,
            },
          })
        : Promise.resolve(null),
      report.resolvedByUsername
        ? prisma.user.findUnique({
            where: {
              username: report.resolvedByUsername,
            },
            select: {
              id: true,
            },
          })
        : Promise.resolve(null),
    ]);

    if (!reporter) {
      throw new Error(`Seed reporter not found for report ${report.id}.`);
    }

    if (report.targetType === 'LISTING' && !listing) {
      throw new Error(`Seed listing not found for report ${report.id}.`);
    }

    if (report.targetType === 'USER' && !reportedUser) {
      throw new Error(`Seed reported user not found for report ${report.id}.`);
    }

    if (report.resolvedByUsername && !resolvedBy) {
      throw new Error(`Seed resolver not found for report ${report.id}.`);
    }

    await prisma.report.upsert({
      where: {
        id: report.id,
      },
      update: {
        reporterId: reporter.id,
        targetType: report.targetType,
        listingId: listing?.id ?? null,
        reportedUserId: reportedUser?.id ?? null,
        reason: report.reason,
        description: report.description,
        status: report.status,
        resolution: report.resolution,
        resolvedById: resolvedBy?.id ?? null,
        resolvedAt: report.resolvedAt,
      },
      create: {
        id: report.id,
        reporterId: reporter.id,
        targetType: report.targetType,
        listingId: listing?.id ?? null,
        reportedUserId: reportedUser?.id ?? null,
        reason: report.reason,
        description: report.description,
        status: report.status,
        resolution: report.resolution,
        resolvedById: resolvedBy?.id ?? null,
        resolvedAt: report.resolvedAt,
      },
    });
  }

  console.log(
    `Wormarket seed completed: ${seedDimensions.length} dimensions, ${seedUsers.length} users, ${seedListings.length} listings, ${seedFavorites.length} favorites, ${seedOffers.length} offers, ${seedTransactions.length} transactions, ${seedConversations.length} conversations, ${seedReviews.length} reviews, ${seedNotifications.length} notifications and ${seedReports.length} reports available.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error('Wormarket seed failed.');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
