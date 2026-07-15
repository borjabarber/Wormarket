/* eslint-disable no-console */

import { cleanupE2eArtifacts } from './local-e2e-cleanup.mjs';

const apiUrl = normalizeUrl(
  process.env.WORMARKET_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
);
const webUrl = normalizeUrl(process.env.WORMARKET_WEB_URL ?? 'http://localhost:3000');
const demoPassword = process.env.WORMARKET_DEMO_PASSWORD ?? 'WormarketDemo123!';
const e2ePassword = process.env.WORMARKET_E2E_PASSWORD ?? 'WormarketE2E123!';
const runId = createRunId();

const vendorCredentials = {
  email: process.env.WORMARKET_E2E_VENDOR_EMAIL ?? 'vendedor@demo.wormarket.local',
  password: demoPassword,
};

const buyerRegistration = {
  bio: 'Cuenta local creada automaticamente para validar el flujo e2e de Wormarket.',
  displayName: `Comprador E2E ${runId}`,
  email: `comprador-e2e-${runId}@demo.wormarket.local`,
  homeDimensionSlug: 'oraculo-norte',
  password: e2ePassword,
  username: `comprador-e2e-${runId}`,
};

function normalizeUrl(value) {
  return value.replace(/\/+$/, '');
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

async function verifyWebIsReachable() {
  const home = await request(`${webUrl}/`);
  const auth = await request(`${webUrl}/auth`);

  assert(typeof home === 'string' && home.includes('Wormarket'), 'La home no responde Wormarket.');
  assert(
    typeof home === 'string' && home.includes('Explorar objetos'),
    'La home no muestra la accion de explorar.',
  );
  assert(
    typeof auth === 'string' && auth.includes('Iniciar sesion'),
    'La pagina /auth no muestra el flujo de acceso.',
  );
}

async function registerBuyer() {
  const session = await request('/identity/register', {
    body: JSON.stringify(buyerRegistration),
    method: 'POST',
  });

  assertValidSession(session, 'Sesion de comprador registrado');
  assert(
    session.user.username === buyerRegistration.username,
    'El registro devuelve otro usuario.',
  );

  return session;
}

async function createListing(vendorSession) {
  const listingTitle = `Objeto e2e ${runId}`;
  const listing = await request('/listings', {
    body: JSON.stringify({
      description:
        'Objeto imposible creado por la prueba end-to-end local para validar publicacion y compra.',
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
  const [listings, detail] = await Promise.all([
    request('/listings'),
    request(`/listings/${listing.slug}`),
  ]);

  assertArray(listings, 'Listado de anuncios');
  assert(
    listings.some((item) => item.slug === listing.slug),
    'El anuncio creado no aparece en el listado publico.',
  );
  assertObject(detail, 'Detalle del anuncio creado');
  assert(detail.slug === listing.slug, 'El detalle del anuncio no conserva el slug.');
}

async function createAndAcceptOffer({ buyerSession, listing, vendorSession }) {
  const offer = await request('/offers', {
    body: JSON.stringify({
      amount: 233,
      listingSlug: listing.slug,
      message: 'Oferta e2e para validar el flujo completo local.',
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
  assert(
    transaction.offerId === acceptedOffer.id,
    'La transaccion no apunta a la oferta aceptada.',
  );

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
      comment: 'Valoracion e2e generada durante el flujo local completo.',
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

  return review;
}

async function run() {
  console.log('E2E local Wormarket');
  console.log(`API: ${apiUrl}`);
  console.log(`Web: ${webUrl}`);
  console.log(`Run id: ${runId}`);

  await verifyWebIsReachable();
  console.log('OK  web local disponible');

  const vendorSession = await login(vendorCredentials);
  console.log('OK  login vendedor demo');

  const buyerSession = await registerBuyer();
  console.log('OK  registro comprador e2e');

  const listing = await createListing(vendorSession);
  console.log('OK  publicacion de anuncio');

  await verifyListingIsSearchable(listing);
  console.log('OK  busqueda y detalle de anuncio');

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

  console.log('\nE2E local correcto: flujo principal validado de extremo a extremo.');
}

try {
  await run();
} catch (error) {
  console.error('\nE2E local fallido.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  try {
    const result = await cleanupE2eArtifacts({ runId });

    console.log(`OK  limpieza de artefactos e2e (${result.scope})`);
  } catch (error) {
    console.error('\nNo se pudieron limpiar los artefactos e2e locales.');
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
