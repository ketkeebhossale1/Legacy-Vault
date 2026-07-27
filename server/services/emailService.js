import nodemailer from 'nodemailer'
import PDFDocument from 'pdfkit'

const PLACEHOLDER = /^your-/i

function isSmtpConfigured() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  return user && pass && !PLACEHOLDER.test(user) && !PLACEHOLDER.test(pass)
}

function generateWillPdf(willText) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 60, size: 'A4' })
    const chunks = []
    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Header
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#1a8f8f').text('Legacy Vault', { align: 'center' })
    doc.moveDown(0.3)
    doc.fontSize(13).font('Helvetica').fillColor('#334155').text('Digital Will Document', { align: 'center' })
    doc.moveDown(0.3)
    doc.fontSize(9).fillColor('#94a3b8').text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, { align: 'center' })
    doc.moveDown(1)

    // Divider
    doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor('#1a8f8f').lineWidth(0.5).stroke()
    doc.moveDown(1)

    // Will body
    doc.fontSize(10).font('Courier').fillColor('#1f2933').text(willText, { lineGap: 4, paragraphGap: 6 })

    // Footer
    doc.moveDown(2)
    doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor('#e2e8f0').lineWidth(0.5).stroke()
    doc.moveDown(0.5)
    doc.fontSize(8).font('Helvetica').fillColor('#94a3b8').text('This document was generated through Legacy Vault — a digital estate planning platform.', { align: 'center' })

    doc.end()
  })
}

export async function sendWillToAdvocate(toEmail, willText) {
  console.log(`\n[Legacy Vault] Sending digital will to advocate: ${toEmail}`)
  console.log(`[Legacy Vault] SMTP configured: ${isSmtpConfigured()}`)
  console.log(`[Legacy Vault] SMTP_USER: ${process.env.SMTP_USER}`)
  console.log(`[Legacy Vault] SMTP_HOST: ${process.env.SMTP_HOST}\n`)

  if (!isSmtpConfigured()) {
    console.log('[Legacy Vault] SMTP not configured — skipping email send')
    return
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  try {
    const pdfBuffer = await generateWillPdf(willText)

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Legacy Vault" <no-reply@legacyvault.app>',
      to: toEmail,
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
        {
          filename: 'LegacyVault_DigitalWill.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })
    console.log(`[Legacy Vault] Will email sent successfully. MessageId: ${info.messageId}`)
  } catch (err) {
    console.error('[Legacy Vault] Failed to send will to advocate:', err.message)
    console.error('[Legacy Vault] Full SMTP error:', err)
  }
}

export async function sendPasswordResetEmail(toEmail, resetUrl) {
  // Always log the link — useful in development and as a fallback
  console.log(`\n[Legacy Vault] Password reset link for ${toEmail}:\n${resetUrl}\n`)

  if (!isSmtpConfigured()) return // No real SMTP configured — link is in the console above

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Legacy Vault" <no-reply@legacyvault.app>',
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
            If you didn't request this, you can safely ignore this email.<br/>
            This link will expire in 1 hour.
          </p>
        </div>
      `,
    })
  } catch (err) {
    // Log the SMTP error but never let it crash the request
    console.error('[Legacy Vault] Failed to send reset email:', err.message)
  }
}
