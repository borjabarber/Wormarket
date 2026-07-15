/* eslint-disable no-console */

import pg from 'pg';

const { Client } = pg;

function resolveDatabaseUrl() {
  return process.env.DATABASE_URL ?? 'postgresql://wormarket:wormarket@localhost:5432/wormarket';
}

function buildPatterns(runId) {
  if (runId) {
    return {
      userPattern: `comprador-e2e-${runId}`,
      displayNamePattern: `Comprador E2E ${runId}`,
      listingTitlePattern: `Objeto e2e ${runId}`,
      listingSlugPattern: `objeto-e2e-${runId}`,
      descriptionPattern: `%${runId}%`,
      textPattern: `%${runId}%`,
    };
  }

  return {
    descriptionPattern: '%end-to-end%',
    displayNamePattern: '%E2E%',
    listingSlugPattern: '%e2e%',
    listingTitlePattern: '%e2e%',
    textPattern: '%e2e%',
    userPattern: '%e2e%',
  };
}

async function countRows(client, tableName) {
  const result = await client.query(`SELECT count(*)::int AS count FROM ${tableName}`);

  return result.rows[0]?.count ?? 0;
}

async function deleteRows(client, tableName, sql) {
  const result = await client.query(sql);

  return {
    count: result.rowCount ?? 0,
    table: tableName,
  };
}

export async function cleanupE2eArtifacts({ runId } = {}) {
  const client = new Client({ connectionString: resolveDatabaseUrl() });
  const patterns = buildPatterns(runId);

  await client.connect();

  try {
    await client.query('BEGIN');
    await client.query(
      `
      CREATE TEMP TABLE cleanup_e2e_users ON COMMIT DROP AS
      SELECT id
      FROM users
      WHERE username ILIKE $1
        OR "displayName" ILIKE $2
        OR bio ILIKE '%e2e%'
      `,
      [patterns.userPattern, patterns.displayNamePattern],
    );
    await client.query(
      `
      CREATE TEMP TABLE cleanup_e2e_listings ON COMMIT DROP AS
      SELECT id
      FROM listings
      WHERE title ILIKE $1
        OR slug ILIKE $2
        OR description ILIKE $3
      `,
      [patterns.listingTitlePattern, patterns.listingSlugPattern, patterns.descriptionPattern],
    );
    await client.query(
      `
      CREATE TEMP TABLE cleanup_e2e_offers ON COMMIT DROP AS
      SELECT id
      FROM offers
      WHERE "buyerId" IN (SELECT id FROM cleanup_e2e_users)
         OR "listingId" IN (SELECT id FROM cleanup_e2e_listings)
         OR message ILIKE $1
      `,
      [patterns.textPattern],
    );
    await client.query(
      `
      CREATE TEMP TABLE cleanup_e2e_transactions ON COMMIT DROP AS
      SELECT id
      FROM transactions
      WHERE "buyerId" IN (SELECT id FROM cleanup_e2e_users)
         OR "listingId" IN (SELECT id FROM cleanup_e2e_listings)
         OR "offerId" IN (SELECT id FROM cleanup_e2e_offers)
      `,
    );
    await client.query(
      `
      CREATE TEMP TABLE cleanup_e2e_conversations ON COMMIT DROP AS
      SELECT id
      FROM conversations
      WHERE "buyerId" IN (SELECT id FROM cleanup_e2e_users)
         OR "listingId" IN (SELECT id FROM cleanup_e2e_listings)
      `,
    );

    const detected = {
      conversations: await countRows(client, 'cleanup_e2e_conversations'),
      listings: await countRows(client, 'cleanup_e2e_listings'),
      offers: await countRows(client, 'cleanup_e2e_offers'),
      transactions: await countRows(client, 'cleanup_e2e_transactions'),
      users: await countRows(client, 'cleanup_e2e_users'),
    };

    const deleted = [];

    deleted.push(
      await deleteRows(
        client,
        'reports',
        `
        DELETE FROM reports
        WHERE "reporterId" IN (SELECT id FROM cleanup_e2e_users)
           OR "reportedUserId" IN (SELECT id FROM cleanup_e2e_users)
           OR "listingId" IN (SELECT id FROM cleanup_e2e_listings)
        `,
      ),
    );
    deleted.push(
      await deleteRows(
        client,
        'notifications',
        `
        DELETE FROM notifications
        WHERE "userId" IN (SELECT id FROM cleanup_e2e_users)
           OR title ILIKE '%e2e%'
           OR message ILIKE '%e2e%'
           OR "linkPath" ILIKE '%e2e%'
        `,
      ),
    );
    deleted.push(
      await deleteRows(
        client,
        'reviews',
        `
        DELETE FROM reviews
        WHERE "reviewerId" IN (SELECT id FROM cleanup_e2e_users)
           OR "revieweeId" IN (SELECT id FROM cleanup_e2e_users)
           OR "transactionId" IN (SELECT id FROM cleanup_e2e_transactions)
           OR comment ILIKE '%e2e%'
        `,
      ),
    );
    deleted.push(
      await deleteRows(
        client,
        'messages',
        `
        DELETE FROM messages
        WHERE "conversationId" IN (SELECT id FROM cleanup_e2e_conversations)
           OR "senderId" IN (SELECT id FROM cleanup_e2e_users)
        `,
      ),
    );
    deleted.push(
      await deleteRows(
        client,
        'conversations',
        'DELETE FROM conversations WHERE id IN (SELECT id FROM cleanup_e2e_conversations)',
      ),
    );
    deleted.push(
      await deleteRows(
        client,
        'transactions',
        'DELETE FROM transactions WHERE id IN (SELECT id FROM cleanup_e2e_transactions)',
      ),
    );
    deleted.push(
      await deleteRows(
        client,
        'offers',
        'DELETE FROM offers WHERE id IN (SELECT id FROM cleanup_e2e_offers)',
      ),
    );
    deleted.push(
      await deleteRows(
        client,
        'favorites',
        `
        DELETE FROM favorites
        WHERE "userId" IN (SELECT id FROM cleanup_e2e_users)
           OR "listingId" IN (SELECT id FROM cleanup_e2e_listings)
        `,
      ),
    );
    deleted.push(
      await deleteRows(
        client,
        'identity_accounts',
        'DELETE FROM identity_accounts WHERE "userId" IN (SELECT id FROM cleanup_e2e_users)',
      ),
    );
    deleted.push(
      await deleteRows(
        client,
        'listings',
        'DELETE FROM listings WHERE id IN (SELECT id FROM cleanup_e2e_listings)',
      ),
    );
    deleted.push(
      await deleteRows(
        client,
        'users',
        'DELETE FROM users WHERE id IN (SELECT id FROM cleanup_e2e_users)',
      ),
    );

    await client.query('COMMIT');

    return {
      deleted,
      detected,
      scope: runId ? `run ${runId}` : 'all local e2e artifacts',
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

function printSummary(result) {
  console.log(`Limpieza e2e local (${result.scope})`);
  console.log(`Detectados: ${JSON.stringify(result.detected)}`);

  for (const item of result.deleted) {
    console.log(`- ${item.table}: ${item.count}`);
  }
}

if (import.meta.url === `file:///${process.argv[1]?.replaceAll('\\', '/')}`) {
  const runId = process.argv[2];

  cleanupE2eArtifacts({ runId })
    .then(printSummary)
    .catch((error) => {
      console.error('No se pudieron limpiar los artefactos e2e locales.');
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
