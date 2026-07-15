const baseUrl = (process.env.PUBLIC_BASE_URL ?? 'https://wormarket.vercel.app').replace(
  /\/+$/u,
  '',
);

const checks = [
  { path: '/api/health', expectedStatus: 200 },
  { path: '/api/health/live', expectedStatus: 200 },
  { path: '/api/health/ready', expectedStatus: 200 },
];

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

for (const check of checks) {
  const url = `${baseUrl}${check.path}`;
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
    },
  });
  const body = await readJson(response);

  if (response.status !== check.expectedStatus) {
    throw new Error(
      `${check.path} returned ${response.status}; expected ${check.expectedStatus}. Body: ${JSON.stringify(body)}`,
    );
  }

  if (!body || body.status !== 'ok' || body.service !== 'wormarket-api') {
    throw new Error(`${check.path} returned an invalid health payload: ${JSON.stringify(body)}`);
  }

  if (!body.checks || body.checks.api !== 'ok') {
    throw new Error(`${check.path} did not report API health correctly: ${JSON.stringify(body)}`);
  }

  if (check.path.endsWith('/ready') && body.checks.database !== 'ok') {
    throw new Error(`${check.path} did not report database readiness: ${JSON.stringify(body)}`);
  }

  process.stdout.write(`${check.path}: ok\n`);
}
