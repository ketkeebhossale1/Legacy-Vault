export default function Terms() {
  return (
    <article className="fade-in-up">
      <h1 className="text-3xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Terms of Service
      </h1>
      <p className="text-xs text-slate-400 mb-8">Last updated: July 2026</p>
      <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
        <p>
          By using Legacy Vault you agree to use the service lawfully and to keep nominee and account information accurate.
          The product is provided for digital legacy planning and does not replace legal advice.
        </p>
        <h2 className="text-lg font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Acceptable use</h2>
        <p>
          You may not attempt to circumvent encryption, verification, or cooling-window protections, or use the service to store
          unlawful content.
        </p>
        <h2 className="text-lg font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Demo accounts</h2>
        <p>
          Guest and demo sessions store data locally in your browser for demonstration purposes and may be cleared when you sign out.
        </p>
        <h2 className="text-lg font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Liability</h2>
        <p>
          Legacy Vault provides tools for encrypted storage and controlled release. You remain responsible for nominee selection,
          key-share custody, and keeping your vault contents current.
        </p>
      </div>
    </article>
  )
}
