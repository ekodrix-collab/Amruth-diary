import Link from 'next/link'

export function FinalCTA() {
  return (
    <section style={{ background: '#0D4F4F', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(26,122,94,0.4) 0%, transparent 60%)'
      }} />

      <div className="container-page relative z-10" style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '24px' }}>🥛</span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px' }}>
          Fresh morning delivery starts here
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', maxWidth: '460px', margin: '0 auto 36px auto', lineHeight: 1.65 }}>
          Enjoy delicious farm-fresh milk delivered right to your doorstep before 7 AM. Skip or pause anytime.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/subscribe" id="final-cta-subscribe" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            height: '54px', padding: '0 36px', borderRadius: '999px',
            background: '#F59C1A', color: '#fff', fontWeight: 700, fontSize: '0.95rem',
            textDecoration: 'none', boxShadow: '0 4px 20px rgba(245,156,26,0.3)',
            transition: 'all 0.2s ease'
          }}>
            🥛 Start Subscription
          </Link>
          <a href="tel:+919048571147" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            height: '54px', padding: '0 32px', borderRadius: '999px',
            border: '1.5px solid rgba(255,255,255,0.25)', color: '#fff',
            fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}>
            📞 Call 90485 71147
          </a>
        </div>

        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '48px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Amruth Dairy · Padil, Mangalore
        </p>
      </div>
    </section>
  )
}
