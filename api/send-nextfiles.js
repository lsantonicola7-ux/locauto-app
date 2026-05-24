// api/send-nextfiles.js
// Vercel Serverless Function — drop this file in the /api folder

import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body
    const id = String(body.contractId || '').trim()

    if (!id) {
      return res.status(400).json({ error: 'Contract ID missing' })
    }

    // Create SMTP transporter using Vercel env vars
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || 'true') === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const attachments = []

    // PDF attachment — pdfBase64 is a data URI: "data:image/jpeg;base64,..."
    if (body.pdfBase64) {
      const base64Data = body.pdfBase64.split(',').pop()
      attachments.push({
        filename:    `anagrafica_${id}.pdf`,
        content:     base64Data,
        encoding:    'base64',
        contentType: 'application/pdf',
      })
    }

    // Photo attachments
    ;(body.photos || []).forEach((p, i) => {
      if (!p?.data) return
      const ext = (p.type || 'image/jpeg').split('/')[1] || 'jpg'
      attachments.push({
        filename:    `documento_${i + 1}_${id}.${ext}`,
        content:     p.data.split(',').pop(),
        encoding:    'base64',
        contentType: p.type || 'image/jpeg',
      })
    })

    const mailOptions = {
      from:        process.env.MAIL_FROM || process.env.SMTP_USER,
      to:          (process.env.MAIL_TO || 'nextfiles@locautorent.it').trim(),
      subject:     id,
      text:        '',
      html:        '<div></div>',
      attachments,
    }

    // Try sending — retry once on failure
    try {
      await transporter.sendMail(mailOptions)
    } catch (firstError) {
      console.error('First SMTP attempt failed:', firstError)
      await new Promise(r => setTimeout(r, 900))
      await transporter.sendMail(mailOptions)
    }

    return res.status(200).json({ ok: true })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message || 'Email send error' })
  }
}
