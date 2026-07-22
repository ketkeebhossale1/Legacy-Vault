export interface Nominee {
  id: number | string
  firstName: string
  lastName: string
  email: string
  address: string
  assetName: string
  assetPercentage: number
  isActive?: boolean
}

export const mockNominees: Nominee[] = [
  {
    id: 'n1',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.s@gmail.com',
    address: '12 Residency Road, Bengaluru',
    assetName: 'HDFC Bank Account',
    assetPercentage: 40,
  },
  {
    id: 'n2',
    firstName: 'Arjun',
    lastName: 'Sharma',
    email: 'arjun.sharma@outlook.com',
    address: '12 Residency Road, Bengaluru',
    assetName: 'LIC Policy',
    assetPercentage: 35,
  },
  {
    id: 'n3',
    firstName: 'Kavya',
    lastName: 'Sharma',
    email: 'kavya1997@gmail.com',
    address: '88 Indiranagar, Bengaluru',
    assetName: 'Google Drive Archive',
    assetPercentage: 25,
  },
]

export const auditLog = [
  { ts: '2026-07-18 09:14', event: 'Vault viewed', actor: 'Vault owner' },
  { ts: '2026-07-18 09:12', event: 'Nominee updated: Priya Sharma', actor: 'Vault owner' },
  { ts: '2026-07-15 14:30', event: 'Nominee added: Kavya Sharma', actor: 'Vault owner' },
  { ts: '2026-07-10 11:05', event: 'Digital Will shared with advocate', actor: 'Vault owner' },
  { ts: '2026-06-22 17:44', event: 'Digital Will saved', actor: 'Vault owner' },
  { ts: '2026-05-30 08:19', event: 'Vault created', actor: 'Vault owner' },
]

export const WILL_STORAGE_KEY = 'legacy-vault-digital-will'
export const NOMINEES_STORAGE_KEY = 'legacy-vault-nominees'
