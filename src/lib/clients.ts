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
  },
  randlebrothers: {
    id: 'randlebrothers',
    name: 'Randle Brothers Seed & Spray',
    accountId: 'act_606173706603182',
    type: 'local',
    color: '#FF6B47',
    metric: 'CPL',
    conversionType: 'lead',
    website: 'randlebrothers.com',
    password: process.env.RANDLEBROTHERS_PASSWORD || 'RandleBros',
  },
}

export type ClientId = keyof typeof CLIENTS
export type Client = (typeof CLIENTS)[ClientId]
