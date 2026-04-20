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
}

export type ClientId = keyof typeof CLIENTS
export type Client = (typeof CLIENTS)[ClientId]
