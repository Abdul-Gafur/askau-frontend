/**
 * Frontend-only implementation of features/chat/lib/backend.ts.
 *
 * Used when NEXT_PUBLIC_USE_MOCK_API=true, so the interface runs with no
 * AskAU backend and no Entra tenant behind it. The real module delegates here
 * rather than this replacing it — see the dispatch at the top of backend.ts.
 *
 * The shapes returned are the ones backend.ts produces *after* mapping, not the
 * wire shapes: this stands in for the network call, so there is nothing to
 * parse. Answers are deliberately not all `grounded` — an interface that only
 * ever sees the happy path hides the states this product exists to show, so the
 * fixtures below include an `insufficient` answer and a `conflicting` one.
 *
 * The grounded fixtures are drawn from published African Union instruments —
 * Agenda 2063, the Constitutive Act protocol, the Malabo Convention, the
 * Continental AI Strategy — rather than from invented internal policy, so a
 * walkthrough of this interface quotes material a reader can go and verify.
 *
 * State lives in module scope, which means it survives client-side navigation
 * and resets on a full reload. That is the honest behaviour for a mock and
 * avoids pretending there is durable history when there is no database.
 */

import { env } from "@/config/environment";
import type { Message, Source } from "@/features/chat/types";

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** One unit of simulated work. Reads NEXT_PUBLIC_MOCK_LATENCY_MS. */
const TICK = Math.max(0, env.mockLatencyMs);

// ── fixtures ────────────────────────────────────────────────────────────────

/**
 * Source factory.
 *
 * Every field on `Source` is rendered somewhere on the card — classification
 * badge, department, page, version, effective date — so none of them can be
 * left off. A factory rather than ten literals keeps that obligation in one
 * place and keeps the fixtures below readable.
 *
 * The default classification is PUBLIC because most of what these fixtures
 * cite are published AU instruments. Where a source really is internal, the
 * fixture says so rather than inheriting a badge it has not earned.
 */
function source(
  id: string,
  title: string,
  section: string,
  fields: Partial<Source> & { department: string; docType: string; excerpt: string },
): Source {
  return {
    id,
    title,
    section,
    page: 1,
    version: "1.0",
    published: "2015-01-01",
    classification: "PUBLIC",
    status: "current",
    effectiveDate: "2015-01-01",
    hasAccess: true,
    accessUrl: null,
    ...fields,
  };
}

const AGENDA_2063_SOURCE = source(
  "src-agenda-2063-aspiration-6",
  "Agenda 2063: The Africa We Want",
  "Aspiration 6 — An Africa Whose Development is People-Driven",
  {
    page: 12,
    version: "Popular Version",
    published: "2015-09-01",
    effectiveDate: "2015-01-31",
    department: "Strategic Planning and Delivery",
    docType: "Continental Framework",
    accessUrl: "https://au.int/en/agenda2063/overview",
    excerpt:
      "An Africa, whose development is people-driven, relying on the potential of African people, especially its women and youth, and caring for children.",
  },
);

const CONSTITUTIVE_ACT_SOURCE = source(
  "src-constitutive-act-protocol-art-3",
  "Protocol on Amendments to the Constitutive Act of the African Union",
  "Article 3 — Objectives",
  {
    page: 4,
    version: "2003",
    published: "2003-07-11",
    effectiveDate: "2003-07-11",
    department: "Office of the Legal Counsel",
    docType: "Protocol",
    accessUrl: "https://au.int/en/treaties/protocol-amendments-constitutive-act-african-union",
    excerpt:
      "The Union shall ensure the effective participation of women in decision-making, particularly in the political, economic and socio-cultural areas.",
  },
);

const CHAIRPERSON_SOURCE = source(
  "src-auc-chairperson-profile",
  "African Union Commission — Office of the Chairperson",
  "Profile of the Chairperson",
  {
    page: 1,
    version: "2025.1",
    published: "2025-02-15",
    effectiveDate: "2025-02-15",
    department: "Bureau of the Chairperson",
    docType: "Leadership Profile",
    accessUrl: "https://au.int/en/commission",
    excerpt:
      "H.E. Mahmoud Ali Youssouf (Djibouti) is the former Minister of Foreign Affairs and International Cooperation and Government Spokesperson of the Republic of Djibouti, where he served since 2005.",
  },
);

const ASSEMBLY_ELECTION_SOURCE = source(
  "src-assembly-38-election",
  "38th Ordinary Session of the AU Assembly — Outcomes",
  "Election of the Chairperson of the Commission",
  {
    page: 3,
    version: "1.0",
    published: "2025-02-16",
    effectiveDate: "2025-02-16",
    department: "Office of the Legal Counsel",
    docType: "Assembly Decision",
    accessUrl: "https://au.int/en/assembly",
    excerpt:
      "The Assembly elected the Chairperson of the African Union Commission at its 38th Ordinary Session, held in Addis Ababa, Ethiopia, in February 2025, for a term of four years.",
  },
);

const MALABO_CONVENTION_SOURCE = source(
  "src-malabo-convention",
  "African Union Convention on Cyber Security and Personal Data Protection",
  "Preamble and Object of the Convention",
  {
    page: 1,
    version: "Treaty 0048",
    published: "2014-06-27",
    effectiveDate: "2023-06-08",
    department: "Infrastructure and Energy",
    docType: "Treaty",
    accessUrl:
      "https://au.int/sites/default/files/treaties/29560-treaty-0048_-_african_union_convention_on_cyber_security_and_personal_data_protection_e.pdf",
    excerpt:
      "This Convention establishes a credible framework for cybersecurity in Africa through organisation of electronic transactions, protection of personal data, promotion of cyber security, e-governance and combating cybercrime.",
  },
);

const MALABO_DATA_CHAPTER_SOURCE = source(
  "src-malabo-convention-ch-2",
  "African Union Convention on Cyber Security and Personal Data Protection",
  "Chapter II — Personal Data Protection",
  {
    page: 11,
    version: "Treaty 0048",
    published: "2014-06-27",
    effectiveDate: "2023-06-08",
    department: "Infrastructure and Energy",
    docType: "Treaty",
    accessUrl:
      "https://au.int/sites/default/files/treaties/29560-treaty-0048_-_african_union_convention_on_cyber_security_and_personal_data_protection_e.pdf",
    excerpt:
      "Each State Party shall establish a national personal data protection authority, and shall commit to establishing a legal framework grounded in consent, lawfulness, purpose limitation, accuracy, transparency, confidentiality and security of personal data.",
  },
);

const AI_STRATEGY_SOURCE = source(
  "src-continental-ai-strategy",
  "Continental Artificial Intelligence Strategy",
  "Vision and Scope",
  {
    page: 6,
    version: "1.0",
    published: "2024-08-09",
    effectiveDate: "2024-07-19",
    department: "Infrastructure and Energy",
    docType: "Continental Strategy",
    accessUrl: "https://au.int/en/documents/20240809/continental-artificial-intelligence-strategy",
    excerpt:
      "For Africa, AI is a strategic asset pivotal to achieving the aspirations of Agenda 2063 and the Sustainable Development Goals. The Strategy underscores an Africa-centric, development-focused approach promoting ethical, responsible and equitable practices.",
  },
);

const AI_ENDORSEMENT_SOURCE = source(
  "src-exec-council-45-ai",
  "Executive Council — 45th Ordinary Session, Accra",
  "Decision Endorsing the Continental AI Strategy",
  {
    page: 2,
    version: "1.0",
    published: "2024-07-19",
    effectiveDate: "2024-07-19",
    department: "Office of the Legal Counsel",
    docType: "Executive Council Decision",
    accessUrl: "https://au.int/en/decisions/executive-council",
    excerpt:
      "The Executive Council endorsed the Continental Artificial Intelligence Strategy at its 45th Ordinary Session, held in Accra, Ghana, on 18–19 July 2024.",
  },
);

const DATA_POLICY_FRAMEWORK_SOURCE = source(
  "src-au-data-policy-framework",
  "African Union Data Policy Framework",
  "Section 3 — Principles for Data Governance",
  {
    page: 18,
    version: "1.0",
    published: "2022-02-05",
    effectiveDate: "2022-02-05",
    department: "Infrastructure and Energy",
    docType: "Policy Framework",
    accessUrl: "https://au.int/en/documents/20220728/au-data-policy-framework",
    excerpt:
      "A trusted data environment is the precondition for Africa's digital economy: data governance must be interoperable across Member States, rights-respecting, and oriented to value creation on the continent.",
  },
);

/**
 * An internal tracker, and the one CONFIDENTIAL fixture here.
 *
 * It exists so the classification badge and the `hasAccess: false` path stay
 * reachable — a walkthrough where every card is PUBLIC and openable never
 * shows what the product does with a source the reader cannot open.
 */
const RATIFICATION_TRACKER_SOURCE = source(
  "src-treaty-status-tracker",
  "AU Treaty Ratification Status Tracker",
  "Malabo Convention — Signatures, Ratifications and Accessions",
  {
    page: 7,
    version: "2023.2",
    published: "2023-07-01",
    effectiveDate: "2023-07-01",
    classification: "INTERNAL",
    department: "Office of the Legal Counsel",
    docType: "Status Report",
    hasAccess: false,
    excerpt:
      "Fifteen ratifications were deposited by May 2023, bringing the Convention into force on 8 June 2023. Deposits received after that date are recorded in the successive quarterly returns rather than in this table.",
  },
);

const TREATY_LIST_SOURCE = source(
  "src-oau-au-treaty-list",
  "List of OAU/AU Treaties, Conventions and Protocols",
  "Treaty 0048 — Status Entry",
  {
    page: 22,
    version: "2024.1",
    published: "2024-06-01",
    effectiveDate: "2024-06-01",
    status: "superseded",
    department: "Office of the Legal Counsel",
    docType: "Treaty Register",
    accessUrl: "https://au.int/en/treaties",
    excerpt:
      "Status entry for Treaty 0048, showing signature, ratification and accession counts as at the date of publication of this register.",
  },
);

/**
 * The canned answers, matched on keywords in the question.
 *
 * Written at the length a real grounded answer runs to — the layout has to
 * hold a few hundred words next to its source cards, and fixtures that were
 * two sentences long made the page look roomier than it will ever be in use.
 *
 * Written as Markdown, which AnswerText renders — lists, emphasis and
 * paragraphs all come through. Composed answers carry that formatting anyway,
 * so fixtures that avoided it were testing a case the real backend will not
 * send.
 *
 * `state` is chosen per answer rather than fixed, so every branch the message
 * renderer has is reachable. The four grounded entries are the ones the
 * welcome-screen suggestion chips ask for; the conflicting entry sits behind a
 * seeded conversation instead, so a walkthrough that follows the chips stays
 * on the grounded path unless it deliberately steps off it.
 *
 * Order matters — `find` takes the first match. The ratification entry is
 * first because its questions also mention the Malabo Convention, and it is
 * the more specific of the two.
 *
 * Each pattern also carries the French, Portuguese and Arabic keywords for the
 * same topic, because the suggestion chips are translated and an English-only
 * pattern sent every chip to the insufficient answer the moment the locale
 * changed. The answer bodies stay English — a mock does not translate — but
 * the routing at least survives the switch.
 */
const ANSWERS: {
  match: RegExp;
  content: string;
  state: Message["state"];
  sources: Source[];
  conflictingSources?: Source[];
  conflictSummary?: string;
}[] = [
  {
    match: /ratif|accession|state parties|how many (member )?(states|countries)|in force/i,
    state: "conflicting",
    sources: [RATIFICATION_TRACKER_SOURCE, TREATY_LIST_SOURCE],
    conflictingSources: [RATIFICATION_TRACKER_SOURCE, TREATY_LIST_SOURCE],
    conflictSummary:
      "Two approved documents give different ratification counts for the Malabo Convention, and they were published a year apart.",
    content: `I can give you the entry-into-force date confidently. I am flagging the ratification count rather than quoting one.

On entry into force, the position is settled: the Convention required **fifteen ratifications**, the fifteenth was deposited in May 2023, and the Convention entered into force on **8 June 2023** — almost nine years after its adoption in Malabo in June 2014.

On the count of State Parties, the two documents I retrieved disagree. The internal status tracker records the position as at July 2023 and says later deposits are carried in the quarterly returns rather than in its own table. The published treaty register gives a different figure as at June 2024, and is itself marked superseded.

I am not going to reconcile them into a single number. A ratification tally moves as states deposit instruments, so a figure quoted without its as-at date is misleading rather than merely stale — and neither of these documents is current today.

What I would do instead is take the count from the live treaty status page on au.int, which is republished as deposits are received, and treat both documents above as evidence of the trajectory rather than of the present total. Note also that the internal tracker is classified Internal and is not one you can open directly.`,
  },
  {
    match:
      /aspiration|aspiração|agenda ?20-?63|people-driven|the africa we want|constitutive act|gender|women|youth|inclusiv|طموح|أجندة/i,
    state: "grounded",
    sources: [AGENDA_2063_SOURCE, CONSTITUTIVE_ACT_SOURCE],
    content: `**Aspiration 6 — gender equality and development.**

Aspiration 6 of Agenda 2063 calls for *"An Africa, whose development is people-driven, relying on the potential of African people, especially its women and youth, and caring for children."*

Agenda 2063 therefore requires that we live in a more inclusive society where all citizens are actively involved in decision making in all aspects, and where no child, woman or man is left behind or excluded on the basis of gender, political affiliation, religion, ethnic affiliation, locality, age or other factors.

What that commits the Union to, in practice:

- **Full gender equality in all spheres of life** — parity in political, economic and social participation, not equality stated in aggregate while senior levels remain unbalanced.
- **Engaged and empowered youth and children** — young people treated as the source of the continent's development potential rather than as its beneficiaries, with the rights of the child protected as a distinct obligation.
- **Elimination of violence and discrimination against women and girls**, including harmful practices, as a condition of the aspiration rather than an adjunct to it.

The commitment is not confined to Agenda 2063 itself. Article 3 of the Protocol on Amendments to the Constitutive Act of the African Union recognises the critical role of women in promoting inclusive development, and obliges the Union to ensure their effective participation in decision-making across the political, economic and socio-cultural areas.

The two provisions read together are what give Aspiration 6 legal footing: Agenda 2063 sets the ambition, and the Constitutive Act protocol makes participation an obligation of the Union rather than an aspiration of it.`,
  },
  {
    match:
      /chairperson|chairman|chairwoman|youssouf|head of the commission|leads the commission|auc leadership|président de la commission|presidente da comissão|رئيس|مفوضية/i,
    state: "grounded",
    sources: [CHAIRPERSON_SOURCE, ASSEMBLY_ELECTION_SOURCE],
    content: `**H.E. Mahmoud Ali Youssouf** of Djibouti is the current Chairperson of the African Union Commission.

He was elected by the Assembly at its **38th Ordinary Session**, held in Addis Ababa in February 2025, for a term of four years.

Before taking office he was Minister of Foreign Affairs and International Cooperation and Government Spokesperson of the Republic of Djibouti, a post he held from 2005. In that role he led the implementation of Djibouti's foreign policy and managed its international relations, agreements and cooperation with states and international organisations.

His earlier service:

- **2001–2005** — Minister Delegate for International Cooperation at the Ministry of Foreign Affairs and International Cooperation.
- **1997–2001** — Plenipotentiary and Extraordinary Ambassador of the Republic of Djibouti.

The Chairperson is the Commission's chief executive and legal representative, accountable to the Executive Council. The office is distinct from the Chairperson of the Union itself, which rotates annually among Heads of State and Government — a distinction worth keeping in view, because the two titles are frequently conflated in reporting.

The profile above is maintained by the Bureau of the Chairperson; the election itself is recorded in the outcomes of the 38th Ordinary Session.`,
  },
  {
    match:
      /cyber|malabo|personal data|data protection|convention on cyber|cybersécurité|cibersegurança|données à caractère personnel|dados pessoais|السيبراني|اتفاقية/i,
    state: "grounded",
    sources: [MALABO_CONVENTION_SOURCE, MALABO_DATA_CHAPTER_SOURCE],
    content: `The **African Union Convention on Cyber Security and Personal Data Protection** — commonly called the **Malabo Convention** — is the continent's binding treaty on cybersecurity and data protection.

It was adopted on **27 June 2014** at the 23rd Ordinary Session of the Assembly in Malabo, Equatorial Guinea, and entered into force on **8 June 2023**, once the fifteenth ratification had been deposited.

The Convention rests on three chapters:

- **Electronic transactions** — a legal basis for e-commerce and electronic contracting, with obligations on advertising, on the security of transactions, and on the liability of service providers.
- **Personal data protection** — each State Party establishes a national data protection authority and a legal framework built on consent, lawfulness, purpose limitation, accuracy, transparency, confidentiality and security. Data subjects are given rights of information, access, objection and rectification.
- **Cyber security and cybercrime** — State Parties adopt national cybersecurity policies and criminalise offences against computer systems and computerised data, content offences, and offences committed by means of information and communication technologies.

What makes it significant is its status rather than only its content: it is the first and so far the only binding continental instrument in this field, which means a State Party's national data protection law is measured against it rather than against a purely domestic standard.

The authoritative text is Treaty 0048, available in full on au.int:

https://au.int/sites/default/files/treaties/29560-treaty-0048_-_african_union_convention_on_cyber_security_and_personal_data_protection_e.pdf`,
  },
  {
    match:
      /artificial intelligence|\bai\b|machine learning|algorithm|emerging tech|intelligence artificielle|inteligência artificial|الذكاء الاصطناعي/i,
    state: "grounded",
    sources: [AI_STRATEGY_SOURCE, AI_ENDORSEMENT_SOURCE, DATA_POLICY_FRAMEWORK_SOURCE],
    content: `The **Continental Artificial Intelligence Strategy** is the AU framework that guides AI on the continent.

It was endorsed by the **Executive Council** at its **45th Ordinary Session in Accra, Ghana, on 18–19 July 2024**, and published on 9 August 2024.

Artificial intelligence is more than a technological leap; it is a transformative force reshaping our world. With far-reaching impacts across economics, society and geopolitics, AI is driving revolutionary changes in healthcare, agriculture, finance and education.

For Africa, AI is a strategic asset pivotal to achieving the aspirations of **Agenda 2063** and the **Sustainable Development Goals**. It promises to ignite new industries, fuel innovation and create high-value jobs, while preserving and advancing African culture and integration.

What the Strategy asks of Member States:

- **Unified national approaches** — national AI strategies that align with the continental framework rather than diverging from it, so that AI-driven change is navigated together.
- **An Africa-centric, development-focused approach** — ethical, responsible and equitable practice, with African priorities and African data setting the agenda.
- **Stronger regional and global cooperation**, positioning Africa as a leader in inclusive and responsible AI development rather than as a market for systems built elsewhere.

The Strategy does not stand alone. It builds on the **AU Data Policy Framework** (2022) for data governance and interoperability, and on the Malabo Convention for the data protection obligations that any AI deployment handling personal data inherits.

The full document is on au.int:

https://au.int/en/documents/20240809/continental-artificial-intelligence-strategy`,
  },
];

const INSUFFICIENT: { content: string; state: Message["state"] } = {
  state: "insufficient",
  content: `I could not find approved AU material that answers this.

That is a statement about the knowledge base rather than about the policy. There are three ordinary reasons for it: the relevant document may not have been added yet, it may sit outside what your access allows, or the question may fall to a body other than the Commission to answer.

I am not going to compose an answer from unapproved sources or from general knowledge. An answer that reads as authoritative but is not traceable to an approved document is the failure mode this system is built to avoid — you would have no way to tell it apart from a grounded one.

What tends to work: narrow the question to the instrument you think governs it, or name the department whose material it would sit in, and I will retrieve against that directly. If you believe the document exists and should be reachable, your knowledge administrator can confirm whether it has been added and whether your access covers it.`,
};

function answerFor(question: string) {
  return ANSWERS.find((a) => a.match.test(question)) ?? null;
}

// ── in-memory store ─────────────────────────────────────────────────────────

type StoredConversation = {
  id: string;
  title: string | null;
  messages: Message[];
  updatedAt: Date;
};

let counter = 0;
const nextId = (prefix: string) => `${prefix}-${++counter}-${Date.now().toString(36)}`;

const store = new Map<string, StoredConversation>();

const HOUR = 60 * 60 * 1000;

/**
 * The seeded history, newest first.
 *
 * Note that only the entries `IS_SEEDED` below picks out are actually loaded —
 * the rest are kept here so the fuller history is one edit away rather than
 * something to rewrite. The notes on spread and follow-ups apply whenever more
 * than one is switched back on.
 *
 * Spread across hours, days and weeks rather than bunched into one afternoon:
 * the recents list is the main thing this data exists to fill, and a list where
 * every entry carries the same timestamp does not show how it behaves once it
 * has been lived in. `question` is matched against ANSWERS the same way a live
 * question is, so a seeded transcript and a fresh one render identically.
 *
 * `followUp` adds a second turn. Some conversations having two exchanges and
 * others one is what keeps the transcripts from looking generated.
 */
const SEEDS: {
  id: string;
  title: string;
  hoursAgo: number;
  question: string;
  followUp?: string;
}[] = [
  {
    id: "conv-seed-aspiration-6",
    title: "Aspiration 6 of Agenda 2063",
    hoursAgo: 0.4,
    question: "What is Aspiration 6 of Agenda 2063?",
    followUp: "How does the Constitutive Act support the participation of women?",
  },
  {
    id: "conv-seed-chairperson",
    title: "Current Chairperson of the Commission",
    hoursAgo: 3,
    question: "Who is the current Chairperson of the AU Commission?",
  },
  {
    id: "conv-seed-malabo",
    title: "AU Convention on Cyber Security",
    hoursAgo: 7,
    question:
      "What is the African Union Convention on Cyber Security and Personal Data Protection?",
    followUp: "What does the Convention require on personal data protection?",
  },
  {
    id: "conv-seed-ai-strategy",
    title: "Continental AI Strategy",
    hoursAgo: 27,
    question: "Which AU framework guides artificial intelligence on the continent?",
  },
  {
    id: "conv-seed-agenda-2063-youth",
    title: "Youth and children under Agenda 2063",
    hoursAgo: 52,
    question: "What does Agenda 2063 commit to on women and youth?",
  },
  {
    id: "conv-seed-data-policy",
    title: "Data governance and AI",
    hoursAgo: 74,
    question: "How does the AI strategy relate to the AU Data Policy Framework?",
  },
  // Deliberately not grounded. The ratification question resolves to the
  // conflicting answer and the two below resolve to the insufficient one:
  // "the approved documents disagree" and "I could not find approved material
  // for this" are states the recents list should contain, and they are only
  // honest if some questions genuinely land there.
  {
    id: "conv-seed-ratification",
    title: "Malabo Convention ratification status",
    hoursAgo: 148,
    question: "How many member states have ratified the Malabo Convention?",
  },
  {
    id: "conv-seed-summit-venue",
    title: "Venue of the next Ordinary Session",
    hoursAgo: 220,
    question: "Where will the next Ordinary Session of the Assembly be held?",
  },
  {
    id: "conv-seed-budget",
    title: "Member State contribution scale",
    hoursAgo: 390,
    question: "What is the scale of assessment for Member State contributions?",
  },
];

/**
 * Which of the seeds above are actually loaded.
 *
 * The walkthrough deliberately starts with almost no history. Every seeded
 * conversation is one the presenter no longer gets to ask live, and a recents
 * list already holding the four demo answers gives the session away before the
 * first question is typed.
 *
 * One entry is kept rather than none, because an empty list reads as a failed
 * fetch rather than as a new account — and the one kept is deliberately *not*
 * one of the four demo questions, so nothing is spoiled. It is the conflicting
 * answer, which means the one piece of visible history also demonstrates what
 * the product does when approved documents disagree.
 *
 * To restore the full seeded history, change this to `() => true`. To start
 * with a completely empty sidebar, change it to `() => false`.
 */
const IS_SEEDED = (entry: { id: string }) => entry.id === "conv-seed-ratification";

/** One seeded exchange: the question, then the answer ANSWERS gives for it. */
function seededTurns(question: string, at: number, index: number): Message[] {
  const match = answerFor(question);
  return [
    {
      id: `m-seed-${index}-q`,
      role: "user",
      content: question,
      timestamp: new Date(at),
    },
    {
      id: `m-seed-${index}-a`,
      role: "assistant",
      content: match?.content ?? INSUFFICIENT.content,
      timestamp: new Date(at),
      state: match?.state ?? INSUFFICIENT.state,
      sources: match?.sources ?? [],
      conflictingSources: match?.conflictingSources ?? [],
      groundingCount: match?.sources.length ?? 0,
      retrievedAt: new Date(at),
      feedback: null,
    },
  ];
}

/**
 * Seeded so the sidebar is not empty on first load.
 *
 * An empty history reads as a broken fetch rather than as a new account, and
 * the recents list is one of the things worth being able to look at.
 */
function seed() {
  if (store.size > 0) return;
  SEEDS.filter(IS_SEEDED).forEach((entry, index) => {
    const at = Date.now() - entry.hoursAgo * HOUR;
    const messages = seededTurns(entry.question, at, index);
    if (entry.followUp) {
      // Half an hour after the first exchange, so the transcript reads as one
      // sitting rather than two unrelated visits.
      messages.push(...seededTurns(entry.followUp, at + 0.5 * HOUR, index + 100));
    }
    store.set(entry.id, {
      id: entry.id,
      title: entry.title,
      messages,
      updatedAt: new Date(entry.followUp ? at + 0.5 * HOUR : at),
    });
  });
}

/** First line of the opening question, used as the recents label. */
function titleFrom(question: string) {
  const trimmed = question.trim().replace(/\s+/g, " ");
  return trimmed.length > 48 ? `${trimmed.slice(0, 47)}…` : trimmed;
}

// ── the backend surface ─────────────────────────────────────────────────────

export async function createConversation(): Promise<string> {
  seed();
  await pause(TICK / 4);
  const id = nextId("conv");
  store.set(id, { id, title: null, messages: [], updatedAt: new Date() });
  return id;
}

function buildAnswer(conversationId: string, content: string): Message {
  const match = answerFor(content);
  const conversation = store.get(conversationId);

  if (conversation) {
    conversation.messages.push({
      id: nextId("m"),
      role: "user",
      content,
      timestamp: new Date(),
    });
    conversation.title ??= titleFrom(content);
    conversation.updatedAt = new Date();
  }

  const message: Message = {
    id: nextId("m"),
    role: "assistant",
    content: match?.content ?? INSUFFICIENT.content,
    timestamp: new Date(),
    state: match?.state ?? INSUFFICIENT.state,
    sources: match?.sources ?? [],
    conflictingSources: match?.conflictingSources ?? [],
    groundingCount: match?.sources.length ?? 0,
    retrievedAt: new Date(),
    feedback: null,
  };

  conversation?.messages.push(message);
  return message;
}

export async function askInConversation(conversationId: string, content: string): Promise<Message> {
  seed();
  await pause(TICK);
  return buildAnswer(conversationId, content);
}

export async function sendFeedback(
  messageId: string,
  helpful: boolean,
  _reason?: string | null,
): Promise<void> {
  await pause(TICK / 4);
  for (const conversation of store.values()) {
    const message = conversation.messages.find((m) => m.id === messageId);
    if (message) {
      message.feedback = helpful ? "helpful" : "not-helpful";
      return;
    }
  }
}

export async function loadConversation(id: string): Promise<Message[]> {
  seed();
  await pause(TICK / 2);
  const conversation = store.get(id);
  if (!conversation) throw new Error("That conversation could not be found.");
  return conversation.messages;
}

export async function listConversations(): Promise<
  { id: string; title: string; preview: string; timestamp: Date }[]
> {
  seed();
  await pause(TICK / 2);
  return [...store.values()]
    .filter((c) => c.messages.length > 0)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map((c) => ({
      id: c.id,
      title: c.title ?? "Untitled",
      preview: c.messages[c.messages.length - 1]?.content.slice(0, 120) ?? "",
      timestamp: c.updatedAt,
    }));
}

/** Removes every stored conversation. Backs the settings "delete history" action. */
export function clearConversations(): number {
  const removed = [...store.values()].filter((c) => c.messages.length > 0).length;
  store.clear();
  return removed;
}

/** Word-boundary groups, at most STREAM_CHUNKS of them. See streamInConversation. */
const STREAM_CHUNKS = 24;

function chunkForStreaming(content: string): string[] {
  const words = content.split(/(\s+)/).filter(Boolean);
  if (words.length <= STREAM_CHUNKS) return words;
  const per = Math.ceil(words.length / STREAM_CHUNKS);
  const groups: string[] = [];
  for (let i = 0; i < words.length; i += per) groups.push(words.slice(i, i + per).join(""));
  return groups;
}

/**
 * The staged emission the real SSE endpoint produces, on a timer.
 *
 * Ordering matters and is copied from the server: the three stages first, then
 * sources *before* the answer text — the reader is meant to see the provenance
 * while the answer is being written, not after — then tokens, then `done`.
 * Emitted in a bounded number of groups rather than one word at a time. A
 * per-word loop needs one timer per word, and a browser throttles timers to
 * roughly one per second in a hidden tab — which turned a 1.5s answer into a
 * two-minute one that looked like a hang. `chunkForStreaming` keeps the count
 * fixed so the pacing does not depend on the length of the answer.
 */
export async function streamInConversation(
  conversationId: string,
  content: string,
  handlers: {
    onStage?: (index: number, name: string) => void;
    onToken?: (text: string) => void;
    onSources?: (sources: Source[]) => void;
    onConflict?: (summary: string) => void;
    onDone?: (message: Message) => void;
    onError?: (message: string) => void;
  },
): Promise<void> {
  seed();
  try {
    const stages = ["understanding", "retrieving", "composing"];
    for (const [index, stage] of stages.entries()) {
      handlers.onStage?.(index, stage);
      await pause(TICK / 2);
    }

    const match = answerFor(content);
    const message = buildAnswer(conversationId, content);

    handlers.onSources?.(message.sources ?? []);
    if (match?.conflictSummary) handlers.onConflict?.(match.conflictSummary);
    await pause(TICK / 3);

    for (const chunk of chunkForStreaming(message.content)) {
      handlers.onToken?.(chunk);
      await pause(TICK / 16);
    }

    handlers.onDone?.(message);
  } catch {
    handlers.onError?.("The answer could not be completed.");
  }
}
