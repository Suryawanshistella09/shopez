import Navbar from './Navbar.jsx';

export default function PageLayout({ title, children }) {
  return (
    <>
      <Navbar />
      <section className="page-section">
        <div className="page-header">
          <h2>{title}</h2>
        </div>
        {children}
      </section>
    </>
  );
}
