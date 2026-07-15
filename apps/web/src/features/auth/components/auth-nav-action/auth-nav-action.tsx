'use client';

import { useState } from 'react';

import { useAuth } from '../../model/use-auth';

export function AuthNavAction() {
  const { isAuthenticated, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout(): Promise<void> {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <a className="nav-action" href="/auth">
        Inicia sesion
      </a>
    );
  }

  return (
    <button
      className="nav-action nav-action-button"
      disabled={isLoggingOut}
      onClick={handleLogout}
      type="button"
    >
      {isLoggingOut ? 'Cerrando sesion...' : 'Cerrar sesion'}
    </button>
  );
}
