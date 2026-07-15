const apiUrl = normalizeUrl(
  process.env.WORMARKET_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
);
const webUrl = normalizeUrl(process.env.WORMARKET_WEB_URL ?? 'http://localhost:3000');
const demoPassword = process.env.WORMARKET_DEMO_PASSWORD ?? 'WormarketDemo123!';

const demoUsers = {
  moderator: 'moderador@demo.wormarket.local',
  vendor: 'vendedor@demo.wormarket.local',
};

const checks = [];

function writeLine(message = '') {
  process.stdout.write(`${message}\n`);
}

function writeError(message = '') {
  process.stderr.write(`${message}\n`);
}

function normalizeUrl(value) {
  return value.replace(/\/+$/, '');
}

function check(name, run) {
  checks.push({ name, run });
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
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 240)}`);
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return text ? JSON.parse(text) : null;
  }

  return text;
}

async function login(email) {
  const session = await request('/identity/login', {
    body: JSON.stringify({ email, password: demoPassword }),
    method: 'POST',
  });

  assertObject(session, `Sesion de ${email}`);
  assert(
    typeof session.accessToken === 'string' && session.accessToken.length > 20,
    'Falta accessToken.',
  );
  assert(
    typeof session.refreshToken === 'string' && session.refreshToken.length > 20,
    'Falta refreshToken.',
  );
  assertObject(session.user, 'Usuario autenticado');

  return session;
}

function authHeaders(session) {
  return {
    Authorization: `Bearer ${session.accessToken}`,
  };
}

check('frontend /auth responde', async () => {
  const body = await request(`${webUrl}/auth`);
  assert(
    typeof body === 'string' && body.includes('Wormarket'),
    'La pagina /auth no parece Wormarket.',
  );
});

check('api /health responde', async () => {
  const health = await request('/health');
  assertObject(health, 'Health');
  assert(health.status === 'ok', 'Health no devuelve status ok.');
});

check('lecturas publicas usadas por frontend', async () => {
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
  assert(
    listings.some((listing) => listing.slug === 'brujula-de-decisiones-no-tomadas'),
    'Falta anuncio demo esperado.',
  );
  assertObject(detail, 'Detalle de anuncio');
  assert(detail.slug === 'brujula-de-decisiones-no-tomadas', 'El detalle devuelve otro slug.');
  assertObject(user, 'Perfil publico');
  assert(user.username === 'lyra-oraculo', 'El perfil publico devuelve otro usuario.');
  assertArray(reviews, 'Valoraciones publicas');
});

check('login y sesion Identity', async () => {
  const vendorSession = await login(demoUsers.vendor);
  const me = await request('/identity/me', {
    headers: authHeaders(vendorSession),
  });

  assertObject(me, 'Identity me');
  assertObject(me.user, 'Identity me user');
  assert(me.user.username === 'lyra-oraculo', 'Identity me no conserva el usuario vendedor.');
});

check('lecturas privadas de usuario autenticado', async () => {
  const vendorSession = await login(demoUsers.vendor);
  const headers = authHeaders(vendorSession);
  const [favorites, offers, transactions, notifications, unread, conversations] = await Promise.all(
    [
      request('/favorites', { headers }),
      request('/offers', { headers }),
      request('/transactions', { headers }),
      request('/notifications', { headers }),
      request('/notifications/unread-count', { headers }),
      request('/conversations', { headers }),
    ],
  );

  assertArray(favorites, 'Favorites');
  assertArray(offers, 'Offers');
  assertArray(transactions, 'Transactions');
  assertArray(notifications, 'Notifications');
  assertObject(unread, 'Unread count');
  assert(typeof unread.unreadCount === 'number', 'Unread count no contiene unreadCount numerico.');
  assertArray(conversations, 'Conversations');
});

check('lectura privada de moderacion', async () => {
  const moderatorSession = await login(demoUsers.moderator);
  const reports = await request('/moderation/reports', {
    headers: authHeaders(moderatorSession),
  });

  assertArray(reports, 'Moderation reports');
});

let failures = 0;

writeLine(`Smoke local Wormarket`);
writeLine(`API: ${apiUrl}`);
writeLine(`Web: ${webUrl}`);

for (const { name, run } of checks) {
  try {
    await run();
    writeLine(`OK  ${name}`);
  } catch (error) {
    failures += 1;
    writeError(`ERR ${name}`);
    writeError(error instanceof Error ? error.message : String(error));
  }
}

if (failures > 0) {
  writeError(`\nSmoke local fallido: ${failures} comprobacion(es) con error.`);
  process.exitCode = 1;
} else {
  writeLine('\nSmoke local correcto: frontend y backend responden con el seed demo.');
}
