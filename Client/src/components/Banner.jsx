export default function Banner() {
  return (
    <section className="banner-card">
      <div className="banner-copy">
        <span className="eyebrow">Trending styles</span>
        <h2>Seasonal essentials for every wardrobe</h2>
        <p>Shop premium picks from top brands with fast delivery and easy returns.</p>
      </div>
      <div className="banner-action">
        <a href="/products" className="button button-primary">
          Explore products
        </a>
      </div>
    </section>
  );
}
