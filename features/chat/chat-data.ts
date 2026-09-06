/**
 * Chat Feature — Placeholder Data
 *
 * Returns typed placeholder values until the real API is ready.
 * All consumer components import from here instead of hardcoding inline.
 *
 * Drawn from published African Union instruments — Agenda 2063, the Malabo
 * Convention, the Continental AI Strategy — so that placeholder content in a
 * walkthrough quotes material a reader can go and verify. The live chat
 * fixtures in features/chat/lib/mock-backend.ts cover the same ground; keep
 * the two in step when either changes.
 */

import type { Source, Conversation, Message } from "./types";

export const SAMPLE_SOURCES: Source[] = [
  {
    id: "s1",
    title: "Agenda 2063: The Africa We Want",
    section: "Aspiration 6 — An Africa Whose Development is People-Driven",
    page: 12,
    version: "Popular Version",
    published: "2015",
    classification: "PUBLIC",
    department: "Strategic Planning and Delivery",
    docType: "Continental Framework",
    effectiveDate: "31 Jan 2015",
    status: "Active",
    excerpt:
      "An Africa, whose development is people-driven, relying on the potential of African people, especially its women and youth, and caring for children.",
  },
  {
    id: "s2",
    title: "Protocol on Amendments to the Constitutive Act of the African Union",
    section: "Article 3 — Objectives",
    page: 4,
    version: "2003",
    published: "2003",
    classification: "PUBLIC",
    department: "Office of the Legal Counsel",
    docType: "Protocol",
    effectiveDate: "11 Jul 2003",
    status: "Active",
    excerpt:
      "The Union shall ensure the effective participation of women in decision-making, particularly in the political, economic and socio-cultural areas.",
  },
  {
    id: "s3",
    title: "First Ten-Year Implementation Plan",
    section: "Goal 17 — Full Gender Equality in All Spheres of Life",
    page: 76,
    version: "1.0",
    published: "2015",
    classification: "PUBLIC",
    department: "Strategic Planning and Delivery",
    docType: "Implementation Plan",
    effectiveDate: "1 Jan 2014",
    status: "Active",
    excerpt:
      "Member States commit to parity in political, economic and social participation, with progress reported against indicators disaggregated by sex and by age.",
  },
];

export const CONFLICTING_SOURCES: Source[] = [
  {
    id: "c1",
    title: "AU Treaty Ratification Status Tracker (Jul 2023)",
    section: "Malabo Convention — Ratifications and Accessions",
    page: 7,
    version: "2023.2",
    published: "2023",
    classification: "INTERNAL",
    department: "Office of the Legal Counsel",
    docType: "Status Report",
    effectiveDate: "1 Jul 2023",
    status: "Superseded",
    excerpt:
      "Fifteen ratifications were deposited by May 2023, bringing the Convention into force on 8 June 2023. Later deposits are recorded in the quarterly returns.",
  },
  {
    id: "c2",
    title: "List of OAU/AU Treaties, Conventions and Protocols (Jun 2024)",
    section: "Treaty 0048 — Status Entry",
    page: 22,
    version: "2024.1",
    published: "2024",
    classification: "PUBLIC",
    department: "Office of the Legal Counsel",
    docType: "Treaty Register",
    effectiveDate: "1 Jun 2024",
    status: "Superseded",
    excerpt:
      "Status entry for Treaty 0048, showing signature, ratification and accession counts as at the date of publication of this register.",
  },
];

/**
 * Backs the /conversations page.
 *
 * Held to a single entry for the walkthrough, for the same reason the seeded
 * chat history is: anything listed here is a question the presenter no longer
 * gets to ask live. The one kept is deliberately not one of the four demo
 * questions. Keep this in step with `IS_SEEDED` in
 * features/chat/lib/mock-backend.ts, which does the same job for the sidebar.
 */
export const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "Malabo Convention ratification status",
    preview: "How many member states have ratified the Malabo Convention?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
  },
];

export const SAMPLE_MESSAGES: Message[] = [
  {
    id: "u1",
    role: "user",
    content: "What is Aspiration 6 of Agenda 2063?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: "a1",
    role: "assistant",
    content:
      "Aspiration 6 of Agenda 2063 calls for “An Africa, whose development is people-driven, relying on the potential of African people, especially its women and youth, and caring for children.” Agenda 2063 therefore requires a more inclusive society where all citizens are actively involved in decision making, and where no child, woman or man is left behind or excluded on the basis of gender, political affiliation, religion, ethnic affiliation, locality, age or other factors. Article 3 of the Protocol on Amendments to the Constitutive Act of the African Union carries the same commitment into binding form, obliging the Union to ensure the effective participation of women in decision-making.",
    timestamp: new Date(Date.now() - 1000 * 60 * 24),
    state: "grounded",
    groundingCount: 3,
    retrievedAt: new Date(Date.now() - 1000 * 60 * 24),
    sources: SAMPLE_SOURCES,
    feedback: null,
  },
];

export const SUGGESTED_PROMPTS = [
  "chat.suggestedPrompts.aspiration6",
  "chat.suggestedPrompts.chairperson",
  "chat.suggestedPrompts.cyberConvention",
  "chat.suggestedPrompts.aiStrategy",
] as const;

export const LOADING_STEP_KEYS = [
  "chat.loading.searching",
  "chat.loading.reviewing",
  "chat.loading.preparing",
] as const;
