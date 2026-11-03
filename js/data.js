// CICOD Self-Service Portal Data Catalog
window.CICOD_PORTAL_DATA = {
  tenant: {
    name: 'CICOD Enterprise Hub',
    code: 'CICOD-HQ',
    tagline: 'Fast. Seamless. Transparent',
    description: 'Our organization has deployed fully digital self-service operations, enabling seamless request submission, tracking, and collaboration anytime, anywhere, without physical visits.',
    supportEmail: 'support@cicod.com',
    supportPhone: '+234 (0) 1 888 2426',
    address: 'Plot 7, Block 3, Babatunde Layout, Lagos & Oyo, Nigeria',
    platform: 'Powered by CICOD Enterprise Cloud Platform'
  },
  
  categories: [
    { id: 'all', name: 'All Services', count: 18 },
    { id: 'care', name: 'Customer Inquiries & Care', count: 5 },
    { id: 'tech', name: 'Technical Support & Ops', count: 4 },
    { id: 'finance', name: 'Billing & Invoicing', count: 3 },
    { id: 'ops', name: 'Merchant & Product Operations', count: 3 },
    { id: 'vendor', name: 'Vendor & B2B Procurement', count: 3 }
  ],

  services: [
    {
      id: 'srv-1',
      catId: 'care',
      title: 'Customer Inquiry & Service Request',
      dept: 'Customer Operations',
      sla: '24h SLA',
      badge: 'High Volume',
      desc: 'Submit general enquiries, service activation requests, or account assistance to our customer care team.'
    },
    {
      id: 'srv-2',
      catId: 'care',
      title: 'Formal Customer Complaint',
      dept: 'Quality & Escalations',
      sla: '12h SLA',
      badge: 'Escalated',
      desc: 'File a formal service complaint. Monitored directly by Quality Assurance for rapid resolution.'
    },
    {
      id: 'srv-3',
      catId: 'care',
      title: 'Service Commendation & Feedback',
      dept: 'Customer Experience',
      sla: '48h SLA',
      badge: 'Feedback',
      desc: 'Share positive feedback, staff commendations, or strategic suggestions to improve our services.'
    },
    {
      id: 'srv-4',
      catId: 'tech',
      title: 'API Integration & Webhook Support',
      dept: 'Developer Solutions',
      sla: '8h SLA',
      badge: 'Technical',
      desc: 'Request technical assistance for CICOD APIs, Collections Gateway integrations, or webhook issues.'
    },
    {
      id: 'srv-5',
      catId: 'tech',
      title: 'System Bug & Outage Incident Report',
      dept: 'Engineering & DevOps',
      sla: '4h SLA',
      badge: 'Priority 1',
      desc: 'Report unexpected software errors, application crashes, or service degradation to our engineering team.'
    },
    {
      id: 'srv-6',
      catId: 'tech',
      title: 'User Role & Access Re-activation',
      dept: 'IT Security & Access',
      sla: '12h SLA',
      badge: 'Security',
      desc: 'Request password resets, SSO token clearance, or multi-factor authentication re-sync.'
    },
    {
      id: 'srv-7',
      catId: 'finance',
      title: 'Billing Dispute & Chargeback Inquiry',
      dept: 'Finance & Accounts',
      sla: '24h SLA',
      badge: 'Finance',
      desc: 'Dispute an invoice line item, request payment reconciliation, or inquire about duplicate charges.'
    },
    {
      id: 'srv-8',
      catId: 'finance',
      title: 'Tax Invoice & Official Receipt Request',
      dept: 'Finance & Accounts',
      sla: '12h SLA',
      badge: 'Finance',
      desc: 'Request electronic withholding tax certificates, stamped VAT receipts, or statement of account.'
    },
    {
      id: 'srv-9',
      catId: 'ops',
      title: 'Merchant Onboarding & Storefront Setup',
      dept: 'Merchant Operations',
      sla: '24h SLA',
      badge: 'Onboarding',
      desc: 'Request guided assistance for setting up merchant storefronts, product catalogs, and payout accounts.'
    },
    {
      id: 'srv-10',
      catId: 'ops',
      title: 'Inventory & Dispatch Order Escalation',
      dept: 'Fulfillment Logistics',
      sla: '6h SLA',
      badge: 'Logistics',
      desc: 'Report delivery delays, damaged shipment manifests, or warehouse stock discrepancies.'
    },
    {
      id: 'srv-11',
      catId: 'vendor',
      title: 'Vendor Registration & KYC Submission',
      dept: 'Procurement & Legal',
      sla: '72h SLA',
      badge: 'Vendor',
      desc: 'Submit corporate documentation, tax clearances, and banking details to become an accredited vendor.'
    },
    {
      id: 'srv-12',
      catId: 'vendor',
      title: 'Request for Proposal (RFP) Bid Submission',
      dept: 'Tender & Procurement',
      sla: '48h SLA',
      badge: 'Tenders',
      desc: 'Upload commercial bid proposals, technical architecture documents, and procurement fee receipts.'
    }
  ],

  demoTracking: {
    'CICOD-SR-2026-8812': {
      id: 'CICOD-SR-2026-8812',
      email: 'oladeji.toriola@crowninteractive.com',
      service: 'Formal Customer Complaint',
      title: 'Webhook synchronization delay on payment settlement',
      dept: 'Developer Solutions & Ops',
      officer: 'Toriola Oladeji (Senior Lead)',
      status: 'IN PROGRESS',
      submittedDate: 'Nov 02, 2026 · 10:15 AM',
      slaTarget: 'Target Resolution: Within 6 Hours (On Track)',
      timeline: [
        {
          title: 'Request Submitted Online',
          time: 'Nov 02, 2026 · 10:15 AM',
          status: 'done',
          note: 'Request received with 2 attachments. Tracking ID generated and SMS dispatched to customer.'
        },
        {
          title: 'Automated Triaged & Routing',
          time: 'Nov 02, 2026 · 10:45 AM',
          status: 'done',
          note: 'Classified under Developer Solutions queue in CICOD ECMS with High Priority flag.'
        },
        {
          title: 'Technical Investigation & Log Review',
          time: 'Nov 03, 2026 · 09:30 AM',
          status: 'current',
          note: 'Engineering has verified the webhook payload retry queue. Patch deployed to staging for test.'
        },
        {
          title: 'Customer Resolution & Closure',
          time: 'Pending Verification',
          status: 'pending',
          note: 'Customer will receive confirmation email and post-incident resolution report.'
        }
      ]
    }
  },

  demoStaff: {
    'toriola_8842': {
      surname: 'Toriola',
      staffId: '8842',
      fullName: 'Toriola Oladeji',
      designation: 'Head of Enterprise Architecture & Solutions',
      dept: 'Product Engineering & ECMS Solutions',
      status: 'VERIFIED ACTIVE',
      email: 'toriola.oladeji@crowninteractive.com',
      phone: '+234 807 447 5933',
      location: 'Lagos Head Office',
      issuedDate: 'Jan 2024 - Active Credential'
    },
    'okon_4456': {
      surname: 'Okon',
      staffId: '4456',
      fullName: 'Joy Okon',
      designation: 'Senior Client Operations Specialist',
      dept: 'Customer Care & Partner Support',
      status: 'VERIFIED ACTIVE',
      email: 'joy.okon@cicod.com',
      phone: '+234 814 217 3712',
      location: 'Corporate Support Centre',
      issuedDate: 'Mar 2024 - Active Credential'
    }
  },

  b2bOrganizations: [
    { name: 'Crown Interactive Global', industry: 'Cloud & Workflow Solutions', location: 'Lagos, Nigeria', status: 'Connected', code: 'CI-GLB' },
    { name: 'Apex Financial Services', industry: 'Banking & Merchant Collections', location: 'Abuja, Nigeria', status: 'Connected', code: 'APX-FIN' },
    { name: 'OmniRetail Logistics', industry: 'Supply Chain & Warehousing', location: 'Ibadan, Nigeria', status: 'Connected', code: 'OMN-LOG' },
    { name: 'Prime Health Consortium', industry: 'Healthcare Systems', location: 'Lagos, Nigeria', status: 'Available', code: 'PRM-HLT' },
    { name: 'Westfield Energy & Utilities', industry: 'Power & Infrastructure', location: 'Port Harcourt, Nigeria', status: 'Available', code: 'WST-NRG' },
    { name: 'Standard Capital Partners', industry: 'Investment & Asset Management', location: 'London / Lagos', status: 'Available', code: 'STD-CAP' },
    { name: 'Horizon Telecom Networks', industry: 'Telecommunications', location: 'Abuja, Nigeria', status: 'Connect Pending', code: 'HRZ-TEL' }
  ]
};

