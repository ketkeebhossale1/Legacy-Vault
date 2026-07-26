import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const uploadDir = path.join(__dirname, '../uploads/certificates')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ts     = Date.now()
    const userId = req.user?.id || 'unknown'
    const ext    = path.extname(file.originalname).toLowerCase()
    cb(null, `cert_${userId}_${ts}${ext}`)
  },
})

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF, JPG, PNG, or WEBP files are accepted as health certificates'), false)
  }
}

export const uploadCertificate = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).single('certificate')
