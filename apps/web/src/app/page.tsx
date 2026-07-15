import { ListingsExplorer } from '../features/listings/components/listings-explorer';
import { Button } from '../shared/components';

export default function HomePage() {
  return (
    <>
      <section id="inicio" className="home-banner" aria-labelledby="home-banner-title">
        <div className="home-banner-copy">
          <p className="eyebrow">Vende sin perder la dimension</p>
          <h1 id="home-banner-title">Dale una segunda vida a tus objetos imposibles</h1>
          <p>
            Publica reliquias, encuentra rarezas y negocia con otros viajeros desde un mercado
            claro, cercano y facil de recorrer.
          </p>
          <div className="hero-actions" aria-label="Acciones destacadas">
            <Button href="#explorar">Explorar objetos</Button>
            <Button href="/listings/new" variant="secondary">
              Vende un objeto
            </Button>
          </div>
        </div>
      </section>

      <section id="explorar" className="content-section" aria-labelledby="explore-title">
        <div className="section-heading">
          <p className="eyebrow">Explorar</p>
          <h2 id="explore-title">Anuncios disponibles</h2>
          <p>
            Busca objetos, filtra por dimension, rareza y estado, y encuentra piezas imposibles
            listas para cambiar de manos.
          </p>
        </div>

        <ListingsExplorer />
      </section>
    </>
  );
}
