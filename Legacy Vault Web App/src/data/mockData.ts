export type Sensitivity = 'high' | 'medium' | 'low'
export type Category = 'Banking' | 'Insurance' | 'Cloud Storage' | 'Social Media' | 'Crypto' | 'Other'

export interface Asset {
  id: string
  name: string
  category: Category
  sensitivity: Sensitivity
  notes: string
  username?: string
  lastUpdated: string
}

export interface Nominee {
  id: string
  name: string
  relation: string
  email: string
  keyShare: string
  confirmed: boolean
}

export const mockAssets: Asset[] = [
  { id: 'a1', name: 'HDFC Bank Account', category: 'Banking', sensitivity: 'high', notes: 'Primary savings + salary account. Branch: Koramangala. Account no ending 4421.', username: 'raj.sharma@hdfc', lastUpdated: '2025-11-15' },
  { id: 'a2', name: 'LIC Policy', category: 'Insurance', sensitivity: 'high', notes: 'Policy no LIC-2024-881-9A. Nominee already updated to Mother. Maturity 2038.', lastUpdated: '2025-10-02' },
  { id: 'a3', name: 'Google Drive / Photos', category: 'Cloud Storage', sensitivity: 'medium', notes: 'Personal archive, ~60 GB. Share read-only with Priya. Delete business folder.', username: 'raj.personal@gmail.com', lastUpdated: '2025-12-01' },
  { id: 'a4', name: 'Instagram', category: 'Social Media', sensitivity: 'low', notes: "Memorialize or delete — I'd prefer delete. Recovery email is the Gmail above.", username: '@raj.frames', lastUpdated: '2025-09-18' },
  { id: 'a5', name: 'Coinbase Wallet', category: 'Crypto', sensitivity: 'high', notes: 'Hardware wallet seed phrase is in the physical safe. ~0.4 BTC, 2.1 ETH.', lastUpdated: '2025-11-28' },
  { id: 'a6', name: 'AWS Account', category: 'Cloud Storage', sensitivity: 'medium', notes: 'Personal projects. Cancel all running instances. Root email: raj.dev@proton.me', username: 'raj.dev@proton.me', lastUpdated: '2025-08-10' },
]

export const mockNominees: Nominee[] = [
  { id: 'n1', name: 'Priya Sharma', relation: 'Mother', email: 'priya.s@gmail.com', keyShare: 'Share A', confirmed: true },
  { id: 'n2', name: 'Arjun Sharma', relation: 'Father', email: 'arjun.sharma@outlook.com', keyShare: 'Share B', confirmed: true },
  { id: 'n3', name: 'Kavya Sharma', relation: 'Sister', email: 'kavya1997@gmail.com', keyShare: 'Share C', confirmed: false },
]

export const initialPermissions: Record<string, Record<string, boolean>> = {
  a1: { n1: true, n2: true, n3: false },
  a2: { n1: true, n2: true, n3: false },
  a3: { n1: true, n2: false, n3: true },
  a4: { n1: false, n2: false, n3: false },
  a5: { n1: true, n2: true, n3: false },
  a6: { n1: false, n2: false, n3: true },
}

export const auditLog = [
  { ts: '2026-07-18 09:14', event: 'Vault viewed', actor: 'Raj Sharma (owner)' },
  { ts: '2026-07-18 09:12', event: 'Permission toggled: Instagram → Kavya (revoked)', actor: 'Raj Sharma (owner)' },
  { ts: '2026-07-15 14:30', event: 'New asset added: Coinbase Wallet', actor: 'Raj Sharma (owner)' },
  { ts: '2026-07-10 11:05', event: 'Nominee confirmed: Arjun Sharma', actor: 'Arjun Sharma (nominee)' },
  { ts: '2026-06-22 17:44', event: 'Digital Will generated', actor: 'Raj Sharma (owner)' },
  { ts: '2026-05-30 08:19', event: 'Vault created', actor: 'Raj Sharma (owner)' },
]
