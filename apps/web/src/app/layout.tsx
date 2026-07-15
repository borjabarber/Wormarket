import type { Metadata } from 'next';

import { AuthNavAction } from '../features/auth/components/auth-nav-action/auth-nav-action';
import { AppProviders } from '../features/auth/model/use-auth';
import { ThemeToggle } from '../shared/components';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wormarket',
  description: 'Marketplace interdimensional de objetos imposibles.',
};

const navigationItems = [
  { label: 'Explorar', href: '/#explorar' },
  { label: 'Favoritos', href: '/favorites' },
  { label: 'Ofertas', href: '/offers' },
  { label: 'Chat', href: '/conversations' },
  { label: 'Valoraciones', href: '/transactions' },
  { label: 'Perfil', href: '/profile' },
  { label: 'Notificaciones', href: '/notifications' },
  { label: 'Moderacion', href: '/moderation' },
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido principal
        </a>

        <AppProviders>
          <header className="site-header">
            <nav className="site-nav" aria-label="Navegacion principal">
              <a className="brand" href="/#inicio" aria-label="Wormarket, ir al inicio">
                <span className="brand-mark" aria-hidden="true">
                  W
                </span>
                <span>
                  <strong>Wormarket</strong>
                  <small>Mercado interdimensional</small>
                </span>
              </a>

              <form className="site-search" action="/#explorar" method="get" role="search">
                <label className="visually-hidden" htmlFor="site-search">
                  Buscar objetos imposibles
                </label>
                <input id="site-search" name="q" placeholder="Buscar objetos imposibles" />
                <button type="submit">Buscar</button>
              </form>

              <div className="nav-actions">
                <AuthNavAction />
                <ThemeToggle />
              </div>

              <div className="nav-groups">
                <ul className="nav-links" aria-label="Secciones de Wormarket">
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <a className="nav-link" href={item.href}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </header>

          <main id="contenido" className="site-main" tabIndex={-1}>
            {children}
          </main>
        </AppProviders>

        <footer className="site-footer">
          <div className="footer-inner">
            <p>Wormarket, mercado interdimensional de objetos imposibles.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
