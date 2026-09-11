// Curated M2M vocabulary snapshot for the static compiler. This is intentionally
// attributable and replaceable; a future vault connector can refresh it without
// changing the generic campaign schema.
export const LIBRARY_META = {
  source: 'JWR-TheOne · 07-projects/m2m-group/brief/BRAND.md + ENGAGEMENT.md',
  reviewed: '2026-09-11',
  status: 'Curated snapshot; verify against the canonical M2M vault before external use.'
};

export const LIBRARIES = {
  businessUnits: ['M2M One AU', 'M2M Connectivity', 'M2M One NZ', 'Group'],
  audiences: [
    'Operations and field teams',
    'Fleet and logistics teams',
    'Utilities and metering teams',
    'Mining and remote industrial teams',
    'Agriculture and agtech teams',
    'OEM and product teams',
    'System integrators and channel partners',
    'Environmental and remote monitoring teams'
  ],
  roles: [
    'Marketing leader',
    'Product manager',
    'Embedded systems engineer',
    'Solution architect',
    'Operations leader',
    'Fleet or asset manager',
    'IT or network manager',
    'Procurement or commercial owner',
    'System integrator or partner'
  ],
  verticals: [
    'Fleet, transport and logistics',
    'Utilities and metering',
    'Mining and resources',
    'Agriculture and agtech',
    'Environmental monitoring',
    'Industrial automation',
    'Security and field safety',
    'Asset tracking and monitoring',
    'OEM, developer and platform',
    'Service provider and channel partner'
  ],
  objectiveTypes: [
    'Create qualified pipeline',
    'Generate sales-accepted leads',
    'Launch or reposition an offer',
    'Educate a technical market',
    'Drive an assessment or consultation',
    'Increase adoption or expansion',
    'Support a partner or channel motion'
  ],
  commercialObjectiveTypes: [
    'Create qualified pipeline',
    'Generate sales-accepted leads',
    'Increase adoption or expansion',
    'Support a partner or channel motion',
    'Influence revenue or bookings',
    'Protect or expand existing accounts'
  ],
  marketingObjectiveTypes: [
    'Create qualified pipeline',
    'Launch or reposition an offer',
    'Educate a technical market',
    'Drive an assessment or consultation',
    'Increase adoption or expansion',
    'Support a partner or channel motion'
  ],
  communicationsObjectiveTypes: [
    'Educate a technical market',
    'Make the problem visible',
    'Establish proof and credibility',
    'Differentiate the offer',
    'Reduce perceived risk',
    'Earn a clear next step'
  ],
  kpis: [
    'Sales-accepted leads',
    'Qualified opportunities',
    'Pipeline influenced',
    'Revenue or bookings',
    'Assessment or consultation requests',
    'Landing-page conversion rate',
    'Email or nurture progression',
    'LinkedIn document completion',
    'Cost per qualified lead',
    'Lead response time'
  ]
};
