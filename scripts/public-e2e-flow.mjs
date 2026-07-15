/* eslint-disable no-console */

import { existsSync, readFileSync } from 'node:fs';

import { cleanupE2eArtifacts } from './local-e2e-cleanup.mjs';

const envFilePath = '.env.supabase.local';
const apiUrl = normalizeUrl(process.env.WORMARKET_API_URL ?? 'https://wormarket.vercel.app/api');
const webUrl = normalizeUrl(process.env.WORMARKET_WEB_URL ?? 'https://wormarket.vercel.app');
const demoPassword = process.env.WORMARKET_DEMO_PASSWORD ?? 'WormarketDemo123!';
const e2ePassword = process.env.WORMARKET_E2E_PASSWORD ?? 'WormarketE2E123!';
const runId = createRunId();
let cleanupEnabled = false;

const vendorCredentials = {
  email: process.env.WORMARKET_E2E_VENDOR_EMAIL ?? 'vendedor@demo.wormarket.local',
  password: demoPassword,
};

const buyerRegistration = {
  bio: 'Cuenta e2e publica creada automaticamente para validar el despliegue de Wormarket.',
  displayName: `Comprador E2E ${runId}`,
  email: `comprador-e2e-${runId}@demo.wormarket.local`,
  homeDimensionSlug: 'oraculo-norte',
  password: e2ePassword,
  username: `comprador-e2e-${runId}`,
};

function normalizeUrl(value) {
  return value.replace(/\/+$/u, '');
}

function createRunId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertObject(value, name) {
  assert(
    value !== null && typeof value === 'object' && !Array.isArray(value),
    `${name} no es objeto.`,
  );
}

function assertArray(value, name) {
  assert(Array.isArray(value), `${name} no es array.`);
}

function loadSupabaseEnvForCleanup() {
  if (!existsSync(envFilePath)) {
    throw new Error(`Falta ${envFilePath}; no se puede limpiar el flujo e2e publico.`);
  }

  const content = readFileSync(envFilePath, 'utf8');

  for (const line of content.split(/\r?\n/u)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts
      .join('=')
      .trim()
      .replace(/^["']|["']$/gu, '');

    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }

  if (!process.env.DATABASE_URL?.includes('supabase')) {
    throw new Error('DATABASE_URL de limpieza no apunta a Supabase.');
  }

  cleanupEnabled = true;
}

async function request(pathOrUrl, options = {}) {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${apiUrl}${pathOrUrl}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 300)}`);
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return text ? JSON.parse(text) : null;
  }

  return text;
}

async function login(credentials) {
  const session = await request('/identity/login', {
    body: JSON.stringify(credentials),
    method: 'POST',
  });

  assertValidSession(session, `Sesion de ${credentials.email}`);

  return session;
}

function assertValidSession(session, name) {
  assertObject(session, name);
  assert(typeof session.accessToken === 'string', `${name} no incluye accessToken.`);
  assert(typeof session.refreshToken === 'string', `${name} no incluye refreshToken.`);
  assertObject(session.user, `${name} user`);
}

function authHeaders(session) {
  return {
    Authorization: `Bearer ${session.accessToken}`,
  };
}

async function verifyPublicSurface() {
  const [home, auth, health, readiness] = await Promise.all([
    request(`${webUrl}/`),
    request(`${webUrl}/auth`),
    request('/health'),
    request('/health/ready'),
  ]);

  assert(typeof home === 'string' && home.includes('Wormarket'), 'La home no responde Wormarket.');
  assert(
    typeof home === 'string' && home.includes('Explorar objetos'),
    'La home no muestra la accion de explorar.',
  );
  assert(
    typeof auth === 'string' && auth.includes('Iniciar sesion'),
    'La pagina /auth no muestra el flujo de acceso.',
  );
  assertObject(health, 'Health');
  assert(health.status === 'ok', 'Health publico no devuelve ok.');
  assertObject(readiness, 'Readiness');
  assert(readiness.checks?.database === 'ok', 'Readiness no confirma PostgreSQL.');
}

async function verifyPublicReads() {
  const [dimensions, listings, detail, user, reviews] = await Promise.all([
    request('/dimensions'),
    request('/listings'),
    request('/listings/brujula-de-decisiones-no-tomadas'),
    request('/users/lyra-oraculo'),
    request('/users/lyra-oraculo/reviews'),
  ]);

  assertArray(dimensions, 'Dimensions');
  assert(dimensions.length > 0, 'No hay dimensiones de seed.');
  assertArray(listings, 'Listings');
  assert(listings.length >= 13, 'El catalogo publico no tiene el seed esperado.');
  assert(
    listings.some((listing) => listing.slug === 'brujula-de-decisiones-no-tomadas'),
    'Falta anuncio demo esperado.',
  );
  assertObject(detail, 'Detalle de anuncio');
  assert(detail.slug === 'brujula-de-decisiones-no-tomadas', 'Detalle publico incorrecto.');
  assertObject(user, 'Perfil publico');
  assert(user.username === 'lyra-oraculo', 'Perfil publico incorrecto.');
  assertArray(reviews, 'Valoraciones publicas');
}

async function registerBuyer() {
  const session = await request('/identity/register', {
    body: JSON.stringify(buyerRegistration),
    method: 'POST',
  });

  assertValidSession(session, 'Sesion de comprador registrado');
  assert(session.user.username === buyerRegistration.username, 'Registro devuelve otro usuario.');

  return session;
}

async function verifyFavorites(buyerSession) {
  const listingSlug = 'brujula-de-decisiones-no-tomadas';
  const favorite = await request(`/favorites/${listingSlug}`, {
    headers: authHeaders(buyerSession),
    method: 'POST',
  });
  const favorites = await request('/favorites', {
    headers: authHeaders(buyerSession),
  });

  assertObject(favorite, 'Favorito creado');
  assertArray(favorites, 'Favoritos');
  assert(
    favorites.some((item) => item.listing.slug === listingSlug),
    'El favorito creado no aparece en la lista privada.',
  );

  await request(`/favorites/${listingSlug}`, {
    headers: authHeaders(buyerSession),
    method: 'DELETE',
  });
}

async function createListing(vendorSession) {
  const listingTitle = `Objeto e2e ${runId}`;
  const listing = await request('/listings', {
    body: JSON.stringify({
      description:
        'Objeto imposible creado por la prueba end-to-end local para validar publicacion y compra en despliegue publico.',
      dimensionSlug: buyerRegistration.homeDimensionSlug,
      imageUrls: ['/images/demo/brujula-decisiones.png'],
      price: 241,
      rarity: 'RARE',
      title: listingTitle,
    }),
    headers: authHeaders(vendorSession),
    method: 'POST',
  });

  assertObject(listing, 'Anuncio creado');
  assert(typeof listing.slug === 'string' && listing.slug.length > 0, 'El anuncio no tiene slug.');
  assert(listing.title === listingTitle, 'El anuncio creado devuelve otro titulo.');

  return listing;
}

async function verifyListingIsSearchable(listing) {
  const [listings, detail, page] = await Promise.all([
    request('/listings'),
    request(`/listings/${listing.slug}`),
    request(`${webUrl}/listings/${listing.slug}`),
  ]);

  assertArray(listings, 'Listado de anuncios');
  assert(
    listings.some((item) => item.slug === listing.slug),
    'El anuncio creado no aparece en el listado publico.',
  );
  assertObject(detail, 'Detalle del anuncio creado');
  assert(detail.slug === listing.slug, 'El detalle del anuncio no conserva el slug.');
  assert(typeof page === 'string' && page.includes('Wormarket'), 'La pagina de detalle no carga.');
}

async function createConversationAndMessage({ buyerSession, listing }) {
  const conversation = await request('/conversations', {
    body: JSON.stringify({
      listingSlug: listing.slug,
    }),
    headers: authHeaders(buyerSession),
    method: 'POST',
  });

  assertObject(conversation, 'Conversacion creada');

  const message = await request(`/conversations/${conversation.id}/messages`, {
    body: JSON.stringify({
      content: `Mensaje e2e publico ${runId}`,
    }),
    headers: authHeaders(buyerSession),
    method: 'POST',
  });
  const messages = await request(`/conversations/${conversation.id}/messages`, {
    headers: authHeaders(buyerSession),
  });

  assertObject(message, 'Mensaje creado');
  assertArray(messages, 'Mensajes');
  assert(
    messages.some((item) => item.id === message.id),
    'El mensaje no aparece en el hilo.',
  );

  return conversation;
}

async function createAndAcceptOffer({ buyerSession, listing, vendorSession }) {
  const offer = await request('/offers', {
    body: JSON.stringify({
      amount: 233,
      listingSlug: listing.slug,
      message: `Oferta e2e publica ${runId}`,
    }),
    headers: authHeaders(buyerSession),
    method: 'POST',
  });

  assertObject(offer, 'Oferta creada');
  assert(offer.status === 'PENDING', 'La oferta no queda pendiente al crearse.');

  const acceptedOffer = await request(`/offers/${offer.id}/accept`, {
    headers: authHeaders(vendorSession),
    method: 'POST',
  });

  assertObject(acceptedOffer, 'Oferta aceptada');
  assert(acceptedOffer.status === 'ACCEPTED', 'La oferta no queda aceptada.');

  return acceptedOffer;
}

async function createAndCompleteTransaction({ acceptedOffer, buyerSession, vendorSession }) {
  const transaction = await request(`/transactions/from-offer/${acceptedOffer.id}`, {
    headers: authHeaders(vendorSession),
    method: 'POST',
  });

  assertObject(transaction, 'Transaccion creada');
  assert(transaction.offerId === acceptedOffer.id, 'La transaccion no apunta a la oferta.');

  const completedTransaction = await request(`/transactions/${transaction.id}/complete`, {
    headers: authHeaders(buyerSession),
    method: 'POST',
  });

  assertObject(completedTransaction, 'Transaccion completada');
  assert(completedTransaction.status === 'COMPLETED', 'La transaccion no queda completada.');

  return completedTransaction;
}

async function createReview({ buyerSession, transaction, vendorSession }) {
  const review = await request('/reviews', {
    body: JSON.stringify({
      comment: `Valoracion e2e publica ${runId}`,
      rating: 5,
      transactionId: transaction.id,
    }),
    headers: authHeaders(buyerSession),
    method: 'POST',
  });

  assertObject(review, 'Valoracion creada');
  assert(review.rating === 5, 'La valoracion no conserva la puntuacion.');

  const vendorProfile = await request('/identity/me', {
    headers: authHeaders(vendorSession),
  });
  const vendorReviews = await request(`/users/${vendorProfile.user.username}/reviews`);

  assertArray(vendorReviews, 'Valoraciones publicas del vendedor');
  assert(
    vendorReviews.some((item) => item.id === review.id),
    'La valoracion creada no aparece en el perfil publico del vendedor.',
  );
}

async function verifyNotificationsAndModeration({ buyerSession, vendorSession }) {
  const [notifications, unread, reports] = await Promise.all([
    request('/notifications', { headers: authHeaders(vendorSession) }),
    request('/notifications/unread-count', { headers: authHeaders(vendorSession) }),
    request('/moderation/reports', { headers: authHeaders(buyerSession) }).catch((error) => error),
  ]);

  assertArray(notifications, 'Notificaciones');
  assertObject(unread, 'Unread count');
  assert(typeof unread.unreadCount === 'number', 'Unread count no contiene numero.');
  assert(
    reports instanceof Error && reports.message.startsWith('403'),
    'Moderacion no bloquea a usuarios sin rol.',
  );
}

async function run() {
  console.log('E2E publico Wormarket');
  console.log(`API: ${apiUrl}`);
  console.log(`Web: ${webUrl}`);
  console.log(`Run id: ${runId}`);

  loadSupabaseEnvForCleanup();

  await verifyPublicSurface();
  console.log('OK  superficie publica y health checks');

  await verifyPublicReads();
  console.log('OK  lecturas publicas y seed demo');

  const vendorSession = await login(vendorCredentials);
  console.log('OK  login vendedor demo');

  const buyerSession = await registerBuyer();
  console.log('OK  registro comprador e2e publico');

  await verifyFavorites(buyerSession);
  console.log('OK  favoritos autenticados');

  const listing = await createListing(vendorSession);
  console.log('OK  publicacion de anuncio');

  await verifyListingIsSearchable(listing);
  console.log('OK  busqueda y detalle de anuncio');

  await createConversationAndMessage({ buyerSession, listing });
  console.log('OK  conversacion y mensaje REST');

  const acceptedOffer = await createAndAcceptOffer({
    buyerSession,
    listing,
    vendorSession,
  });
  console.log('OK  oferta y aceptacion');

  const transaction = await createAndCompleteTransaction({
    acceptedOffer,
    buyerSession,
    vendorSession,
  });
  console.log('OK  transaccion completada');

  await createReview({
    buyerSession,
    transaction,
    vendorSession,
  });
  console.log('OK  valoracion publicada');

  await verifyNotificationsAndModeration({ buyerSession, vendorSession });
  console.log('OK  notificaciones y autorizacion de moderacion');

  console.log('\nE2E publico correcto: flujo principal validado de extremo a extremo.');
}

try {
  await run();
} catch (error) {
  console.error('\nE2E publico fallido.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  try {
    if (!cleanupEnabled) {
      console.error('\nNo se pudieron limpiar los artefactos e2e publicos.');
      console.error('La limpieza no esta habilitada porque no se cargo DATABASE_URL de Supabase.');
      process.exitCode = 1;
    } else {
      const result = await cleanupE2eArtifacts({ runId });

      console.log(`OK  limpieza de artefactos e2e (${result.scope})`);
    }
  } catch (error) {
    console.error('\nNo se pudieron limpiar los artefactos e2e publicos.');
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
