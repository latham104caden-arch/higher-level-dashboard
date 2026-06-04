export type ClientStatus = 'active' | 'inactive'

export const CLIENTS = {
  hydra: {
    id: 'hydra',
    name: 'Hydra Hydration',
    accountId: 'act_1185800722983394',
    type: 'ecommerce',
    color: '#00C2FF',
    metric: 'ROAS',
    conversionType: 'purchase',
    website: 'thehydrashop.com',
    password: process.env.HYDRA_PASSWORD || 'Hydra2026',
    status: 'active' as ClientStatus,
  },
  shinebright: {
    id: 'shinebright',
    name: 'Shine Bright Window Cleaning',
    accountId: 'act_1412625432400929',
    type: 'local',
    color: '#FFB800',
    metric: 'CPL',
    conversionType: 'lead',
    website: 'shinebrightokc.com',
    password: process.env.SHINEBRIGHT_PASSWORD || 'ShineBright2026',
    status: 'active' as ClientStatus,
  },
  randlebrothers: {
    id: 'randlebrothers',
    name: 'Randle Brothers Pressure Washing',
    accountId: 'act_1016501707405384',
    type: 'local',
    color: '#FF6B47',
    metric: 'CPL',
    conversionType: 'lead',
    website: 'randlebrothers.com',
    password: process.env.RANDLEBROTHERS_PASSWORD || 'RandleBros',
    status: 'active' as ClientStatus,
  },
  greenhorizon: {
    id: 'greenhorizon',
    name: 'Green Horizon Irrigation',
    accountId: 'act_945577351529586',
    type: 'local',
    color: '#4ADE80',
    metric: 'CPL',
    conversionType: 'lead',
    website: '',
    password: process.env.GREENHORIZON_PASSWORD || 'GreenHorizon2026',
    status: 'inactive' as ClientStatus,
  },
}

export type ClientId = keyof typeof CLIENTS
export type Client = (typeof CLIENTS)[ClientId]

export function getActiveClients(): Client[] {
  return Object.values(CLIENTS).filter(c => c.status === 'active')
}

export function getInactiveClients(): Client[] {
  return Object.values(CLIENTS).filter(c => c.status === 'inactive')
}
