'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import { Button, EmptyState, Skeleton } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import { ReportForm } from '../../moderation/components/report-form';
import { ReviewsPanel } from '../../reviews/components/reviews-panel';
import { usersClient, UsersApiError } from '../api/users-client';
import { formatReputation, roleLabels, statusLabels } from '../model/user-formatters';
import type { UserProfile } from '../model/user-types';

type UserProfilePageProps = {
  username?: string;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo cargar el perfil.';
}

function UserProfileSkeleton() {
  return (
    <section className="profile-page" aria-busy="true" aria-label="Cargando perfil">
      <Skeleton label="Cargando perfil" />
      <div className="profile-shell" aria-hidden="true">
        <Skeleton className="profile-avatar-skeleton" />
        <div className="profile-panel">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    </section>
  );
}

function ProfileAvatar({ profile }: { profile: UserProfile }) {
  if (!profile.avatarUrl) {
    return (
      <div
        className="profile-avatar-placeholder"
        aria-label={`Avatar pendiente de ${profile.displayName}`}
      >
        {profile.displayName.slice(0, 1).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      alt={`Avatar de ${profile.displayName}`}
      className="profile-avatar-image"
      height={192}
      sizes="192px"
      src={profile.avatarUrl}
      unoptimized
      width={192}
    />
  );
}

function ProfileFacts({ profile }: { profile: UserProfile }) {
  return (
    <dl className="profile-facts">
      <div>
        <dt>Dimension de origen</dt>
        <dd>{profile.homeDimension.name}</dd>
      </div>
      <div>
        <dt>Reputacion</dt>
        <dd>{formatReputation(profile.reputation)}</dd>
      </div>
      <div>
        <dt>Rol</dt>
        <dd>{roleLabels[profile.role]}</dd>
      </div>
      <div>
        <dt>Estado</dt>
        <dd>{statusLabels[profile.status]}</dd>
      </div>
    </dl>
  );
}

export function UserProfilePage({ username }: UserProfilePageProps) {
  const { session, user } = useAuth();
  const resolvedUsername = username ?? user?.username ?? session?.user.username;
  const isOwnProfile = !username;

  const profileQuery = useQuery({
    enabled: Boolean(resolvedUsername),
    queryFn: async () => {
      if (!resolvedUsername) {
        throw new UsersApiError('USERNAME_REQUIRED', 'No hay usuario para consultar.');
      }

      return usersClient.getByUsername(resolvedUsername);
    },
    queryKey: ['users', 'profile', resolvedUsername],
  });

  if (isOwnProfile && !resolvedUsername) {
    return (
      <section className="profile-page" aria-labelledby="profile-title">
        <div className="profile-intro">
          <p className="eyebrow">Area personal</p>
          <h1 id="profile-title">Perfil</h1>
        </div>
        <EmptyState
          action={{ children: 'Iniciar sesion', href: '/auth', variant: 'secondary' }}
          title="Necesitas una identidad dimensional"
        >
          Inicia sesion para revisar tu carta de vendedor, reputacion y dimension de origen.
        </EmptyState>
      </section>
    );
  }

  if (profileQuery.isPending) {
    return <UserProfileSkeleton />;
  }

  if (profileQuery.isError) {
    if (profileQuery.error instanceof UsersApiError && profileQuery.error.statusCode === 404) {
      return (
        <section className="profile-page">
          <EmptyState
            action={{ children: 'Volver al mercado', href: '/#explorar', variant: 'secondary' }}
            title="Perfil no encontrado"
          >
            Ese usuario no existe en el mercado local o cambio de identificador dimensional.
          </EmptyState>
        </section>
      );
    }

    return (
      <section className="profile-page">
        <div className="explorer-error" role="alert">
          <h1>No se pudo abrir el perfil</h1>
          <p>{getErrorMessage(profileQuery.error)}</p>
          <button
            className="wm-button wm-button-secondary"
            onClick={() => void profileQuery.refetch()}
          >
            Reintentar carga
          </button>
        </div>
      </section>
    );
  }

  const profile = profileQuery.data;

  return (
    <article className="profile-page" aria-labelledby="profile-title">
      <a className="listing-back-link" href="/#explorar">
        Volver al mercado
      </a>

      <div className="profile-shell">
        <aside className="profile-card" aria-label="Resumen del perfil">
          <ProfileAvatar profile={profile} />
          <p className="profile-username">@{profile.username}</p>
          {isOwnProfile ? <span className="profile-own-badge">Tu perfil</span> : null}
        </aside>

        <div className="profile-panel">
          <p className="eyebrow">{profile.homeDimension.name}</p>
          <h1 id="profile-title">{profile.displayName}</h1>
          <p className="profile-bio">{profile.bio}</p>

          <ProfileFacts profile={profile} />

          <div className="profile-actions" aria-label="Acciones del perfil">
            <Button href="/listings/new">Publicar objeto</Button>
            <Button href="/#explorar" variant="secondary">
              Explorar mercado
            </Button>
          </div>
        </div>
      </div>

      {!isOwnProfile ? (
        <ReportForm
          targetId={profile.username}
          targetLabel={`a ${profile.displayName}`}
          targetType="USER"
        />
      ) : null}

      <ReviewsPanel username={profile.username} />
    </article>
  );
}
