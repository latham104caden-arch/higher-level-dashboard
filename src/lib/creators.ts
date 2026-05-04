export interface Creator {
  id: string
  name: string
  handle: string           // display name / @handle
  password: string
  clientId: string         // which client their content is for
  accountId: string        // Meta ad account ID
  nameTag: string          // tag in ad name — e.g. "[BEN]" — any ad containing this is theirs
  ratePerVideo: number     // what they're paid per delivered video ($)
  bonusPerPurchase: number // bonus per attributed purchase ($)
  niche: string            // e.g. 'Health & Wellness'
  joinedDate: string       // ISO date
}

export const CREATORS: Record<string, Creator> = {
  ben: {
    id: 'ben',
    name: 'Ben',
    handle: '@ben_ugc',
    password: process.env.BEN_PASSWORD || 'BenCreator2026',
    clientId: 'hydra',
    accountId: 'act_1185800722983394',
    nameTag: '[BEN]',
    ratePerVideo: 150,
    bonusPerPurchase: 3,
    niche: 'Health & Wellness',
    joinedDate: '2025-01-01',
  },
  sav: {
    id: 'sav',
    name: 'Sav',
    handle: '@sav_ugc',
    password: process.env.SAV_PASSWORD || 'SavCreator2026',
    clientId: 'hydra',
    accountId: 'act_1185800722983394',
    nameTag: '[SAV]',
    ratePerVideo: 150,
    bonusPerPurchase: 3,
    niche: 'Health & Wellness',
    joinedDate: '2025-01-01',
  },
  kk: {
    id: 'kk',
    name: 'KK',
    handle: '@kk_ugc',
    password: process.env.KK_PASSWORD || 'KKCreator2026',
    clientId: 'hydra',
    accountId: 'act_1185800722983394',
    nameTag: '[KK]',
    ratePerVideo: 150,
    bonusPerPurchase: 3,
    niche: 'Health & Wellness',
    joinedDate: '2026-05-04',
  },
}

export type CreatorId = keyof typeof CREATORS
export type CreatorEntry = (typeof CREATORS)[CreatorId]
