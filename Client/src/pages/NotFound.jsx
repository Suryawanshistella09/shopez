import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page-section not-found-page">
      <div className="not-found-card">
        <h1>404</h1>
        <p>We couldn't find the page you're looking for.</p>
        <Link to="/" className="button button-primary">
          Return Home
        </Link>
      </div>
    </section>
  );
}
