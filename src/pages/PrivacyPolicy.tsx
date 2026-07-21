export default function PrivacyPolicy() {
  return (
    <article className="fade-in-up prose-like">
      <h1 className="text-3xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Privacy Policy
      </h1>
      <p className="text-xs text-slate-400 mb-8">Last updated: July 2026</p>
      <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
        <p>
          Legacy Vault is designed so that your most sensitive information stays encrypted and inaccessible without multi-party verification.
          This policy explains what we collect in the product experience and how it is used.
        </p>
        <h2 className="text-lg font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Data we store</h2>
        <p>
          Account profile details (name, email), vault metadata, encrypted asset payloads, nominee assignments, and immutable audit events.
          Decryption material is split across nominee key shares and is never held in full by Legacy Vault alone.
        </p>
        <h2 className="text-lg font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>How we use data</h2>
        <p>
          To operate the vault, send security alerts, support verification workflows, and improve product reliability.
          We do not sell personal data.
        </p>
        <h2 className="text-lg font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your controls</h2>
        <p>
          You may update profile information, revoke nominee access, and export your digital will at any time while authenticated.
        </p>
      </div>
    </article>
  )
}
