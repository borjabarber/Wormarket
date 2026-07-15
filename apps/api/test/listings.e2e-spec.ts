import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  AuthTokenPayload,
  TokenKind,
  TokenService,
} from '../src/modules/identity/application/ports/token-service';
import { TOKEN_SERVICE } from '../src/modules/identity/application/ports/token-service';
import { Listing } from '../src/modules/listings/domain/entities/listing';
import type {
  CreateListingInput,
  ListingRepository,
  UpdateListingInput,
} from '../src/modules/listings/domain/repositories/listing.repository';
import { LISTING_REPOSITORY } from '../src/modules/listings/domain/repositories/listing.repository';
import { CreateListingUseCase } from '../src/modules/listings/application/use-cases/create-listing.use-case';
import { GetListingUseCase } from '../src/modules/listings/application/use-cases/get-listing.use-case';
import { ListListingsUseCase } from '../src/modules/listings/application/use-cases/list-listings.use-case';
import { UpdateListingUseCase } from '../src/modules/listings/application/use-cases/update-listing.use-case';
import { ListingsController } from '../src/modules/listings/presentation/listings.controller';

const tokenPayload: AuthTokenPayload = {
  kind: 'access',
  role: 'USER',
  sub: 'seller-1',
  username: 'lyra-oraculo',
};

function createListing(overrides: Partial<CreateListingInput> = {}): Listing {
  const now = new Date('2026-07-14T00:00:00.000Z');

  return Listing.create({
    id: overrides.sellerId ? `listing-${overrides.sellerId}` : 'listing-1',
    slug: 'brujula-de-decisiones-no-tomadas',
    seller: {
      id: overrides.sellerId ?? 'seller-1',
      username: 'lyra-oraculo',
      displayName: 'Lyra del Oraculo',
    },
    dimension: {
      id: 'dimension-1',
      slug: overrides.dimensionSlug ?? 'oraculo-norte',
      name: 'Oraculo Norte',
    },
    title: overrides.title ?? 'Brujula de decisiones no tomadas',
    description:
      overrides.description ?? 'Instrumento de bolsillo que apunta hacia alternativas improbables.',
    price: overrides.price ?? 180,
    currencyCode: 'AUR',
    rarity: overrides.rarity ?? 'RARE',
    status: 'PUBLISHED',
    imageUrls: overrides.imageUrls ?? [],
    createdAt: now,
    updatedAt: now,
  });
}

function createRepository(): ListingRepository {
  const listings = [createListing()];

  return {
    findAll: vi.fn(async () => listings),
    findBySlug: vi.fn(async (slug: string) => {
      return listings.find((listing) => listing.slug === slug) ?? null;
    }),
    create: vi.fn(async (input: CreateListingInput) => {
      const listing = createListing(input);
      listings.push(listing);

      return listing;
    }),
    update: vi.fn(async (_slug: string, input: UpdateListingInput) => createListing(input)),
  };
}

function createTokenService(): TokenService {
  return {
    hashRefreshToken: () => 'refresh-token-hash',
    issueAccessToken: () => 'access-token',
    issueRefreshToken: () => 'refresh-token',
    verify: vi.fn((_token: string, expectedKind: TokenKind) => ({
      ...tokenPayload,
      kind: expectedKind,
    })),
  };
}

describe('Listings integration', () => {
  let app: INestApplication;
  let repository: ListingRepository;

  beforeAll(async () => {
    repository = createRepository();

    const moduleRef = await Test.createTestingModule({
      controllers: [ListingsController],
      providers: [
        ListListingsUseCase,
        GetListingUseCase,
        CreateListingUseCase,
        UpdateListingUseCase,
        {
          provide: LISTING_REPOSITORY,
          useValue: repository,
        },
        {
          provide: TOKEN_SERVICE,
          useValue: createTokenService(),
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('lists published objects through the HTTP controller and use case', async () => {
    const response = await request(app.getHttpServer()).get('/listings').expect(200);

    expect(response.body).toEqual([
      expect.objectContaining({
        slug: 'brujula-de-decisiones-no-tomadas',
        title: 'Brujula de decisiones no tomadas',
        status: 'PUBLISHED',
      }),
    ]);
    expect(repository.findAll).toHaveBeenCalledOnce();
  });

  it('creates a listing with the authenticated seller id', async () => {
    const response = await request(app.getHttpServer())
      .post('/listings')
      .set('Authorization', 'Bearer access-token')
      .send({
        description: 'Objeto portable con un borde que vibra cuando mira a otra dimension.',
        dimensionSlug: 'oraculo-norte',
        imageUrls: ['/images/demo/puerta-portatil-dimension.png'],
        price: 315,
        rarity: 'EPIC',
        title: 'Puerta portatil hacia otra dimension',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        dimension: expect.objectContaining({
          slug: 'oraculo-norte',
        }),
        price: {
          amount: 315,
          currencyCode: 'AUR',
        },
        rarity: 'EPIC',
        seller: expect.objectContaining({
          id: 'seller-1',
        }),
        title: 'Puerta portatil hacia otra dimension',
      }),
    );
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        sellerId: 'seller-1',
        title: 'Puerta portatil hacia otra dimension',
      }),
    );
  });

  it('rejects private listing creation without a bearer token', async () => {
    const response = await request(app.getHttpServer()).post('/listings').send({}).expect(401);

    expect(response.body).toEqual({
      code: 'INVALID_AUTHORIZATION_HEADER',
      message: 'La cabecera de autorizacion no es valida.',
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects malformed listing creation bodies', async () => {
    const response = await request(app.getHttpServer())
      .post('/listings')
      .set('Authorization', 'Bearer access-token')
      .send({
        dimensionSlug: 'oraculo-norte',
        imageUrls: [],
        price: '315',
        rarity: 'EPIC',
        title: 'Puerta portatil hacia otra dimension',
      })
      .expect(400);

    expect(response.body).toEqual({
      code: 'INVALID_LISTING_BODY',
      message: 'La solicitud no es valida.',
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('maps missing listings to a Spanish not found response', async () => {
    const response = await request(app.getHttpServer()).get('/listings/no-existe').expect(404);

    expect(response.body).toEqual({
      code: 'LISTING_NOT_FOUND',
      message: 'El anuncio no existe.',
    });
  });
});
