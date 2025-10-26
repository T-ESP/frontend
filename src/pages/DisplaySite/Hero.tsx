// src/pages/DisplaySite/Hero.tsx

export default function Hero() {
  return (
    <section className="hero-section">
      <nav className="hero-nav">
        <div className="logo">StockS</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#company">Company</a>
          <button className="nav-btn">Try Demo</button>
          <button className="nav-btn solid">Get Started</button>
        </div>
      </nav>

      <div className="hero-content">
        <div className="hero-left">
          <h1>
            Smarter Stock Management <br />
            with <span className="highlight">AI Precision</span>
          </h1>
          <p>
            Say goodbye to overstock, shortages, and guesswork. StockS gives you real-time insights and smart predictions to boost profits.
          </p>
          <button className="cta">Get Started Free</button>
        </div>

        <div className="hero-right">
          <img src="/your-hero-image.png" alt="3D AI Assistant Box" />
        </div>
      </div>
    </section>
  );
}
