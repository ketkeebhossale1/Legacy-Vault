import PDFDocument from 'pdfkit'

function isBrevoConfigured() {
  return !!process.env.BREVO_API_KEY
}

function generateWillPdf(willText) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 60, size: 'A4' })
    const chunks = []
    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    doc.fontSize(18).font('Helvetica-Bold').fillColor('#1a8f8f').text('Legacy Vault', { align: 'center' })
    doc.moveDown(0.3)
    doc.fontSize(13).font('Helvetica').fillColor('#334155').text('Digital Will Document', { align: 'center' })
    doc.moveDown(0.3)
    doc.fontSize(9).fillColor('#94a3b8').text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, { align: 'center' })
    doc.moveDown(1)
    doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor('#1a8f8f').lineWidth(0.5).stroke()
    doc.moveDown(1)
    doc.fontSize(10).font('Courier').fillColor('#1f2933').text(willText, { lineGap: 4, paragraphGap: 6 })
    doc.moveDown(2)
    doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor('#e2e8f0').lineWidth(0.5).stroke()
    doc.moveDown(0.5)
    doc.fontSize(8).font('Helvetica').fillColor('#94a3b8').text('This document was generated through Legacy Vault — a digital estate planning platform.', { align: 'center' })
    doc.end()
  })
}

async function sendViaBrevo({ to, subject, html, attachments = [] }) {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER || 'noreply@legacyvault.app'
  const payload = {
    sender: { name: 'Legacy Vault', email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    ...(attachments.length > 0 && {
      attachment: attachments.map(a => ({ name: a.filename, content: a.content }))
    }),
  }
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}

export async function sendWillToAdvocate(advocateEmail, willText, ownerEmail) {
  console.log(`[Legacy Vault] Sending digital will to advocate: ${advocateEmail}`)

  if (!isBrevoConfigured()) {
    console.log('[Legacy Vault] BREVO_API_KEY not configured — skipping email send')
    return
  }

  try {
    const pdfBuffer = await generateWillPdf(willText)
    const pdfBase64 = pdfBuffer.toString('base64')

    await sendViaBrevo({
      to: advocateEmail,
      subject: 'Digital Will Document — Legacy Vault',
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #334155;">
          <h2 style="color: #1a8f8f; font-size: 20px; margin-bottom: 8px;">Legacy Vault</h2>
          <p style="font-size: 14px; line-height: 1.6;">
            Your client has shared their digital will with you via Legacy Vault.
            Please find the will attached as a PDF document.
          </p>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">
            This document was generated and shared through Legacy Vault — a digital estate planning platform.
          </p>
        </div>
      `,
      attachments: [
        { filename: 'LegacyVault_DigitalWill.pdf', content: pdfBase64 },
      ],
    })
    console.log(`[Legacy Vault] Will email sent successfully via Brevo to ${advocateEmail}`)
  } catch (err) {
    console.error('[Legacy Vault] Failed to send will to advocate:', err.message)
  }
}

export async function sendPasswordResetEmail(toEmail, resetUrl) {
  console.log(`[Legacy Vault] Password reset link for ${toEmail}:\n${resetUrl}`)

  if (!isBrevoConfigured()) return

  try {
    await sendViaBrevo({
      to: toEmail,
      subject: 'Reset your Legacy Vault password',
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #334155;">
          <h2 style="color: #1a8f8f; font-size: 22px; margin-bottom: 8px;">Legacy Vault</h2>
          <p style="font-size: 15px; line-height: 1.6;">
            You requested a password reset for your Legacy Vault account.<br/>
            Click the button below to set a new password. The link expires in <strong>1 hour</strong>.
          </p>
          <a href="${resetUrl}"
            style="display:inline-block; margin: 24px 0; padding: 12px 28px; background: #1a8f8f; color: #fff;
                   text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
            Reset Password
          </a>
          <p style="font-size: 12px; color: #94a3b8;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('[Legacy Vault] Failed to send reset email:', err.message)
  }
}
