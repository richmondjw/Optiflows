// Brand plugin contract: strategy stays in the generic core; these values are
// identity, market, voice, CTA and approval metadata only.
export const BRANDS = {
  'm2m-connectivity': {
    name: 'M2M Connectivity', entity: 'M2M Connectivity AU', market: 'Australia',
    logo: 'assets/m2m-connectivity-logo.svg', tone: 'Technical, practical, direct',
    cta: 'Talk to an IoT specialist', url: 'Confirm campaign destination',
    palette: '#0b6f73', pluginVersion: '1.0'
  },
  'm2m-one-au': {
    name: 'M2M One Australia', entity: 'M2M One AU', market: 'Australia',
    logo: 'assets/m2m-one-logo.png', tone: 'Local, helpful, clear',
    cta: 'Get connected', url: 'https://m2mone.com.au',
    palette: '#0b6f73', pluginVersion: '1.0'
  },
  'm2m-one-nz': {
    name: 'M2M One New Zealand', entity: 'M2M One NZ', market: 'New Zealand',
    logo: 'assets/m2m-one-logo.png', tone: 'Local, helpful, clear',
    cta: 'Get connected', url: 'Confirm NZ campaign destination',
    palette: '#0b6f73', pluginVersion: '1.0'
  },
  semtech: {
    name: 'Semtech', entity: 'Semtech', market: 'Global', logo: null,
    tone: 'Engineering-led, confident, evidence-first', cta: 'Explore the technology',
    url: 'https://www.semtech.com', palette: '#172a54', pluginVersion: '1.0'
  }
};
