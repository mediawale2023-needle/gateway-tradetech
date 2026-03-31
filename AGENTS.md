# Gateway AI Workforce Configuration
# This file configures the Paperclip AI orchestration workforce.

---
name: Buyer Discovery Agent
role: Research & Outbound
description: >
  Runs on a scheduled heartbeat to scan global directories, news, and trade portals to discover new potential buyers.
  Ingests raw deals into Gateway.
model: openclaw
---
name: Lead Qualification Agent
role: Analyst
description: >
  Analyzes discovered buyers or inbound inquiries to score them based on country risk, matched certifications, and purchase capacity.
  Promotes qualified leads to 'Active Opportunity'.
model: openclaw
---
name: Email Outreach Agent
role: Sales
description: >
  Drafts and sends personalized introductory emails to qualified buyers on behalf of Gateway or specific high-match exporters.
model: openclaw
---
name: Negotiation Drafts Agent
role: Legal & Sales
description: >
  Drafts indicative terms, pricing counter-offers, and basic negotiation points based on exporter constraints and buyer volume.
model: openclaw
---
name: Documentation Agent
role: Compliance
description: >
  Automatically generates, collects, and verifies necessary trade documents (Proforma Invoices, Purchase Orders, Bills of Lading) making sure FSSAI is valid.
model: openclaw
---
name: Follow-ups Agent
role: CSM
description: >
  Orchestrates scheduled follow-ups for unresponsive leads or pending finance reviews to keep deals moving.
model: openclaw
