import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { ListingError } from '../../application/errors/listing-error';
import type { Listing } from '../../domain/entities/listing';
import type {
  CreateListingInput,
  ListingRepository,
  UpdateListingInput,
} from '../../domain/repositories/listing.repository';
import { PrismaListingMapper } from './prisma-listing.mapper';

const listingInclude = {
  seller: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
  dimension: {
    select: {
      id: true,
      slug: true,
      name: true,
    },
  },
};

@Injectable()
export class PrismaListingRepository implements ListingRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findAll(): Promise<Listing[]> {
    const listings = await this.prisma.listing.findMany({
      where: {
        status: {
          not: 'BLOCKED',
        },
      },
      include: listingInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return listings.map((listing) => PrismaListingMapper.toDomain(listing));
  }

  async findBySlug(slug: string): Promise<Listing | null> {
    const listing = await this.prisma.listing.findFirst({
      where: {
        slug,
        status: {
          not: 'BLOCKED',
        },
      },
      include: listingInclude,
    });

    return listing ? PrismaListingMapper.toDomain(listing) : null;
  }

  async create(input: CreateListingInput): Promise<Listing> {
    const [seller, dimension] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: input.sellerId,
        },
        select: {
          id: true,
          status: true,
        },
      }),
      this.prisma.dimension.findUnique({
        where: {
          slug: input.dimensionSlug,
        },
        select: {
          id: true,
          currencyCode: true,
        },
      }),
    ]);

    if (!seller) {
      throw new ListingError('SELLER_NOT_FOUND', 'El vendedor no existe.', 404);
    }

    if (seller.status === 'BLOCKED') {
      throw new ListingError(
        'USER_BLOCKED',
        'No puedes publicar objetos mientras tu cuenta esta bloqueada.',
        403,
      );
    }

    if (!dimension) {
      throw new ListingError('DIMENSION_NOT_FOUND', 'La dimension no existe.', 404);
    }

    const listing = await this.prisma.listing.create({
      data: {
        slug: this.createSlug(input.title),
        sellerId: seller.id,
        dimensionId: dimension.id,
        title: input.title,
        description: input.description,
        price: input.price,
        currencyCode: dimension.currencyCode,
        rarity: input.rarity,
        imageUrls: input.imageUrls,
      },
      include: listingInclude,
    });

    return PrismaListingMapper.toDomain(listing);
  }

  async update(slug: string, input: UpdateListingInput): Promise<Listing> {
    const listing = await this.prisma.listing.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        sellerId: true,
        status: true,
      },
    });

    if (!listing || listing.status === 'BLOCKED') {
      throw new ListingError('LISTING_NOT_FOUND', 'El anuncio no existe.', 404);
    }

    if (listing.sellerId !== input.sellerId) {
      throw new ListingError(
        'LISTING_FORBIDDEN',
        'Solo el vendedor puede editar este anuncio.',
        403,
      );
    }

    if (listing.status !== 'PUBLISHED' && listing.status !== 'DRAFT') {
      throw new ListingError('LISTING_NOT_EDITABLE', 'Este anuncio ya no puede editarse.', 409);
    }

    const [seller, dimension] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: input.sellerId,
        },
        select: {
          id: true,
          status: true,
        },
      }),
      this.prisma.dimension.findUnique({
        where: {
          slug: input.dimensionSlug,
        },
        select: {
          id: true,
          currencyCode: true,
        },
      }),
    ]);

    if (!seller) {
      throw new ListingError('SELLER_NOT_FOUND', 'El vendedor no existe.', 404);
    }

    if (seller.status === 'BLOCKED') {
      throw new ListingError(
        'USER_BLOCKED',
        'No puedes editar objetos mientras tu cuenta esta bloqueada.',
        403,
      );
    }

    if (!dimension) {
      throw new ListingError('DIMENSION_NOT_FOUND', 'La dimension no existe.', 404);
    }

    const updatedListing = await this.prisma.listing.update({
      where: {
        id: listing.id,
      },
      data: {
        dimensionId: dimension.id,
        title: input.title,
        description: input.description,
        price: input.price,
        currencyCode: dimension.currencyCode,
        rarity: input.rarity,
        imageUrls: input.imageUrls,
      },
      include: listingInclude,
    });

    return PrismaListingMapper.toDomain(updatedListing);
  }

  private createSlug(title: string): string {
    const baseSlug = title
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
    const fallbackSlug = baseSlug || 'objeto-imposible';

    return `${fallbackSlug}-${Date.now().toString(36)}`;
  }
}
