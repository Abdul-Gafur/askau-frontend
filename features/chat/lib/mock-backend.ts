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
    version: "2023.1",
    published: "2023-01-01",
    classification: "INTERNAL",
    status: "current",
    effectiveDate: "2023-01-01",
    hasAccess: true,
    accessUrl: null,
    ...fields,
  };
}

const LEAVE_SOURCE = source(
  "src-staff-rules-6-1",
  "AU Commission Staff Rules and Regulations",
  "Rule 6.1 — Annual Leave",
  {
    page: 48,
    version: "2023.2",
    published: "2023-06-30",
    effectiveDate: "2023-07-01",
    department: "Human Resources",
    docType: "Staff Regulation",
    excerpt:
      "Permanent staff members shall be entitled to thirty (30) working days of annual leave per calendar year, accruing at two and one-half (2.5) days for each completed month of service.",
  },
);

const CARRYOVER_SOURCE = source(
  "src-hr-circular-2024-04",
  "HR Circular 2024/04 — Leave Carry-Over",
  "Paragraph 3",
  {
    page: 2,
    version: "1.0",
    published: "2024-02-12",
    effectiveDate: "2024-03-01",
    department: "Human Resources",
    docType: "Circular",
    excerpt:
      "Not more than sixty (60) days of accrued annual leave may be carried into the following calendar year. Balances above that ceiling lapse on 31 December.",
  },
);

const SICK_LEAVE_SOURCE = source(
  "src-staff-rules-6-4",
  "AU Commission Staff Rules and Regulations",
  "Rule 6.4 — Sick Leave",
  {
    page: 53,
    version: "2023.2",
    published: "2023-06-30",
    effectiveDate: "2023-07-01",
    department: "Human Resources",
    docType: "Staff Regulation",
    excerpt:
      "Certified sick leave shall not be charged against annual leave. Absence exceeding three consecutive working days requires a medical certificate from a recognised practitioner.",
  },
);

const PROCUREMENT_SOURCE = source(
  "src-procurement-manual-4",
  "AU Procurement Manual",
  "Chapter 4 — Approval Thresholds",
  {
    page: 61,
    version: "2022.1",
    published: "2022-11-15",
    effectiveDate: "2023-01-01",
    classification: "CONFIDENTIAL",
    department: "Finance",
    docType: "Manual",
    excerpt:
      "Procurements above USD 100,000 require the endorsement of the Tender Board. Below that threshold, departmental authorisation is sufficient provided three written quotations are on file.",
  },
);

const PROCUREMENT_WAIVER_SOURCE = source(
  "src-procurement-manual-7",
  "AU Procurement Manual",
  "Chapter 7 — Single-Source and Waivers",
  {
    page: 94,
    version: "2022.1",
    published: "2022-11-15",
    effectiveDate: "2023-01-01",
    classification: "CONFIDENTIAL",
    department: "Finance",
    docType: "Manual",
    excerpt:
      "Single-source award requires written justification approved by the Head of Procurement, and is limited to proprietary goods, emergency response, or continuity of an existing installation.",
  },
);

const TRAVEL_SOURCE = source(
  "src-travel-policy-annex-ii",
  "AU Staff Travel Policy",
  "Annex II — Daily Subsistence Allowance",
  {
    page: 23,
    version: "2021.3",
    published: "2021-09-01",
    effectiveDate: "2021-10-01",
    status: "superseded",
    department: "Finance",
    docType: "Policy",
    hasAccess: false,
    excerpt:
      "Daily Subsistence Allowance is payable at the rate applicable to the duty station, as published annually by the International Civil Service Commission.",
  },
);

const TRAVEL_AUTH_SOURCE = source(
  "src-travel-policy-3",
  "AU Staff Travel Policy",
  "Section 3 — Authorisation of Duty Travel",
  {
    page: 8,
    version: "2021.3",
    published: "2021-09-01",
    effectiveDate: "2021-10-01",
    department: "Finance",
    docType: "Policy",
    excerpt:
      "No duty travel shall commence before a Travel Authorisation is approved. Requests are submitted not less than ten (10) working days before departure.",
  },
);

const MEDICAL_SOURCE = source(
  "src-medical-scheme-2",
  "AU Staff Medical Insurance Scheme Rules",
  "Section 2 — Coverage and Dependants",
  {
    page: 14,
    version: "2024.1",
    published: "2024-01-08",
    effectiveDate: "2024-02-01",
    department: "Human Resources",
    docType: "Scheme Rules",
    excerpt:
      "Cover extends to the staff member, one spouse, and dependent children up to the age of twenty-five (25) where enrolled in full-time education. Contribution is shared at 75 per cent Commission and 25 per cent staff member.",
  },
);

const RECRUITMENT_SOURCE = source(
  "src-recruitment-policy-5",
  "AU Recruitment and Selection Policy",
  "Section 5 — Geographical and Gender Balance",
  {
    page: 19,
    version: "2023.1",
    published: "2023-03-20",
    effectiveDate: "2023-04-01",
    department: "Human Resources",
    docType: "Policy",
    excerpt:
      "Selection shall observe equitable geographical distribution across the five regions and the Commission's commitment to gender parity at every grade.",
  },
);

const INFOSEC_SOURCE = source(
  "src-infosec-policy-6",
  "AU Information Security Policy",
  "Section 6 — Information Classification and Handling",
  {
    page: 27,
    version: "2024.2",
    published: "2024-05-14",
    effectiveDate: "2024-06-01",
    classification: "CONFIDENTIAL",
    department: "Information Management",
    docType: "Policy",
    excerpt:
      "Information is classified Public, Internal, Confidential, or Highly Restricted. Confidential and above must not be transmitted through personal accounts or unmanaged devices.",
  },
);

const APPRAISAL_SOURCE = source(
  "src-performance-framework-3",
  "AU Performance Management Framework",
  "Section 3 — The Annual Cycle",
  {
    page: 11,
    version: "2023.4",
    published: "2023-10-02",
    effectiveDate: "2024-01-01",
    department: "Human Resources",
    docType: "Framework",
    excerpt:
      "The cycle runs to the calendar year, with objectives agreed by 31 January, a documented mid-year review in July, and final appraisal submitted by 31 January of the following year.",
  },
);

/**
 * The canned answers, matched on keywords in the question.
 *
 * Written at the length a real grounded answer runs to — the layout has to
 * hold a few hundred words next to its source cards, and fixtures that were
 * two sentences long made the page look roomier than it will ever be in use.
 *
 * Paragraphs are separated by blank lines and enumerated points are prefixed
 * with a bullet character. There is no markdown here: AIMessage renders
 * `content` as text, so asterisks would show up literally.
 *
 * `state` is chosen per answer rather than fixed, so every branch the message
 * renderer has is reachable from the suggestion chips on the welcome screen.
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
    match: /leave|annual|vacation|holiday|time off/i,
    state: "grounded",
    sources: [LEAVE_SOURCE, CARRYOVER_SOURCE, SICK_LEAVE_SOURCE],
    content: `Permanent staff of the AU Commission are entitled to 30 working days of annual leave per calendar year. Entitlement accrues at 2.5 days for each completed month of service, so a staff member joining mid-year accrues pro rata rather than receiving the full allowance on appointment.

On carry-over, the ceiling is 60 days. Any balance above that lapses on 31 December and is not compensated, which in practice means a staff member holding a large balance should plan its use across two cycles rather than one.

The approval route is:

• Submit the request through your immediate supervisor, who confirms operational cover for the period.
• Human Resources records the absence against your entitlement before the leave is taken.
• Leave taken without a recorded authorisation is treated as unauthorised absence, not as annual leave.

Two interactions are worth knowing. Certified sick leave is not charged against annual leave, but an absence longer than three consecutive working days needs a medical certificate from a recognised practitioner. Official AU holidays falling inside a leave period are also not counted against the entitlement.

The governing provisions are Staff Rule 6.1 for entitlement and accrual, HR Circular 2024/04 for the carry-over ceiling, and Staff Rule 6.4 for the sick-leave interaction. Where a fixed-term or short-term contract sets different terms, the contract prevails over the general rule, so check yours if you are not on a permanent appointment.`,
  },
  {
    match: /procure|tender|purchas|supplier|quotation|vendor/i,
    state: "grounded",
    sources: [PROCUREMENT_SOURCE, PROCUREMENT_WAIVER_SOURCE],
    content: `Approval depends on the value of the procurement, and the threshold changes who authorises it rather than what the process requires.

• Up to USD 100,000 — departmental authorisation is sufficient, provided three written quotations are on file.
• Above USD 100,000 — the Tender Board must endorse the award before any commitment is made.

The requirement for three written quotations applies at every value. It is the approving authority that moves at the threshold, not the evidence you have to produce, and an award file without the quotations is incomplete regardless of how small the purchase was.

Single-source award is possible but narrow. It requires written justification approved by the Head of Procurement, and is confined to proprietary goods with no substitute, emergency response, or continuity of an existing installation where a change of supplier would strand prior investment. Urgency created by late planning is not treated as an emergency.

Splitting a requirement into several smaller orders to stay under the threshold is expressly treated as circumvention, and the aggregate value governs which authority applies.

Practical sequence: confirm the budget line, define the specification before approaching the market, obtain the three quotations, then route for the authority that matches the aggregate value. The relevant provisions are Chapter 4 of the Procurement Manual for thresholds and Chapter 7 for single-source and waivers. Both are classified Confidential, so do not circulate extracts outside the approval chain.`,
  },
  {
    match: /travel|dsa|subsistence|per diem|allowance|mission/i,
    state: "conflicting",
    sources: [TRAVEL_SOURCE, TRAVEL_AUTH_SOURCE],
    conflictingSources: [TRAVEL_SOURCE],
    conflictSummary:
      "The only travel policy version available to you is marked superseded — its allowance table may no longer be in force.",
    content: `I can answer the authorisation half of this confidently, and I am flagging the allowance half rather than answering it.

On authorisation, no duty travel may begin before a Travel Authorisation is approved. Requests are submitted not less than ten working days before departure, and travel undertaken without an approved authorisation is not reimbursable — the exposure sits with the traveller, not the department.

On Daily Subsistence Allowance, the policy sets the rate by duty station, at the figure published annually by the International Civil Service Commission, with the allowance covering accommodation, meals, and incidental expenses. Where accommodation is provided in kind, the applicable portion is deducted rather than paid.

Here is the difficulty. The only version of the travel policy available to me is marked superseded, so the rate table it points to may no longer be the one in force. I am not going to quote you a figure from it: a stale DSA rate produces an expense claim that is rejected after the travel has already been taken, which is worse than not having a number now.

What I would do instead is confirm the current Annex II with Finance before relying on any figure, and note that the authorisation timeline above is unaffected by the version question — you can start that part immediately.`,
  },
  {
    match: /medical|health|insurance|dependant|dependent/i,
    state: "grounded",
    sources: [MEDICAL_SOURCE],
    content: `The Staff Medical Insurance Scheme covers the staff member, one spouse, and dependent children up to the age of 25 where the child is enrolled in full-time education. Beyond that age, or where full-time enrolment ends, cover lapses and the dependant must be removed from the scheme.

Contributions are shared, at 75 per cent from the Commission and 25 per cent from the staff member, deducted at source monthly.

On enrolment and changes:

• Enrolment is at appointment, and a dependant added later requires supporting documentation — a marriage certificate, birth certificate, or proof of enrolment as applicable.
• A change in dependant status must be reported within 30 days. Late notification can mean recovery of contributions paid on an ineligible dependant.
• Cover continues during approved leave, including maternity and certified sick leave.

The scheme is separate from the Commission's liability for service-incurred injury, which is handled under its own provisions rather than through the insurer, so a work-related injury should not be routed as an ordinary medical claim.

The governing text is the Staff Medical Insurance Scheme Rules, Section 2, effective February 2024. Claim procedure, reimbursement rates, and the provider network sit in Sections 4 and 5, which I have not quoted here — ask if you need those and I will retrieve them.`,
  },
  {
    match: /recruit|vacan|selection|hiring|candidate|shortlist/i,
    state: "grounded",
    sources: [RECRUITMENT_SOURCE],
    content: `Selection is governed by the Recruitment and Selection Policy, and two requirements sit above the ordinary merit assessment.

The first is equitable geographical distribution across the five regions. The second is the Commission's commitment to gender parity at every grade, not only in aggregate — a department can meet parity overall while remaining unbalanced at senior grades, and the policy treats that as non-compliance.

The sequence for a vacancy is:

• The post is classified and the vacancy announcement cleared by Human Resources before publication.
• Applications are screened against the published eligibility criteria only. Criteria not stated in the announcement cannot be introduced at screening.
• A panel conducts the assessment, and its composition must itself reflect gender and regional balance.
• The recommendation is documented with the reasons for the ranking, which is what makes the decision reviewable afterwards.

Internal candidates have no automatic preference, but where two candidates are assessed as substantially equal, the balance requirements above are applied as the deciding factor rather than seniority.

The provision quoted is Section 5, effective April 2023. Note that the policy sets the framework and the specific regional targets are issued separately each cycle, so the current numerical targets are not in this document — if you need those, they come from Human Resources rather than from the policy itself.`,
  },
  {
    match: /security|confidential|classif|data|password|device|email/i,
    state: "grounded",
    sources: [INFOSEC_SOURCE],
    content: `The Information Security Policy sets four classifications, and the handling obligation follows the classification rather than the document type.

• Public — cleared for release outside the Commission.
• Internal — for staff, but not for external circulation.
• Confidential — restricted to those with a demonstrated need, and must not be transmitted through personal accounts or unmanaged devices.
• Highly Restricted — access is individually authorised and logged.

The prohibition at Confidential and above is the one most often breached in practice. Forwarding a Confidential attachment to a personal address to work on it at home is a reportable incident, even where there is no onward disclosure and no harm results.

Some consequences worth being explicit about:

• Classification is inherited. An extract from a Confidential document is Confidential, and a summary carrying the same substance does not become Internal by being shorter.
• Storage on unmanaged cloud services is not permitted at Confidential and above, including services the staff member pays for personally.
• Suspected exposure is reported immediately, and reporting promptly is treated as mitigation rather than as fault.

This is Section 6 of the policy, effective June 2024. The document is itself classified Confidential, so the text above should stay within the Commission. Incident reporting procedure and the approved device list are in Sections 8 and 9.`,
  },
  {
    match: /appraisal|performance|objectiv|review|evaluat/i,
    state: "grounded",
    sources: [APPRAISAL_SOURCE],
    content: `The performance cycle runs to the calendar year and has three fixed points.

• Objectives agreed by 31 January, between the staff member and the supervisor.
• A documented mid-year review in July.
• Final appraisal submitted by 31 January of the following year.

The mid-year review is the part most often skipped, and skipping it has a specific consequence: an objective cannot be assessed as unmet at final appraisal if it was never raised at mid-year. The framework treats the review as the point at which a supervisor is obliged to give notice that performance is off track.

Objectives are expected to be specific and measurable, and the framework is explicit that a rating must be supported by evidence recorded during the cycle rather than assembled at the end of it.

Where a staff member disagrees with a final rating, the disagreement is recorded on the appraisal itself and there is a defined route to a review by the next supervisory level. A rating cannot be changed unilaterally after submission without that route being followed.

For staff who changed post mid-cycle, the supervisor for the longer part of the year completes the appraisal, drawing on written input from the other.

This is Section 3 of the Performance Management Framework, effective January 2024. The rating scale and its definitions are in Section 4.`,
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
    id: "conv-seed-leave",
    title: "Annual leave entitlement",
    hoursAgo: 0.4,
    question: "What is the official leave policy?",
    followUp: "Does certified sick leave come off my annual leave balance?",
  },
  {
    id: "conv-seed-procurement",
    title: "Procurement approval thresholds",
    hoursAgo: 3,
    question: "What is the procurement approval process?",
    followUp: "When is a single-source award allowed?",
  },
  {
    id: "conv-seed-infosec",
    title: "Handling confidential documents",
    hoursAgo: 7,
    question: "Can I email a confidential document to my personal address?",
  },
  {
    id: "conv-seed-travel",
    title: "DSA rates for duty travel",
    hoursAgo: 27,
    question: "What are the DSA rates for duty travel?",
  },
  {
    id: "conv-seed-medical",
    title: "Medical scheme dependants",
    hoursAgo: 32,
    question: "Who is covered as a dependant under the medical insurance scheme?",
  },
  {
    id: "conv-seed-appraisal",
    title: "Performance appraisal timeline",
    hoursAgo: 52,
    question: "When are performance objectives and appraisals due?",
    followUp: "What happens if the mid-year review was never held?",
  },
  {
    id: "conv-seed-recruitment",
    title: "Regional and gender balance in selection",
    hoursAgo: 74,
    question: "How do geographical and gender balance affect candidate selection?",
  },
  {
    id: "conv-seed-relocation",
    title: "Relocation grant on reassignment",
    hoursAgo: 148,
    question:
      "What relocation grant applies when a staff member is reassigned to another duty station?",
  },
  {
    id: "conv-seed-travel-auth",
    title: "Travel authorisation lead time",
    hoursAgo: 220,
    question: "How far ahead must a travel authorisation be submitted?",
  },
  {
    id: "conv-seed-security-incident",
    title: "Reporting a suspected data exposure",
    hoursAgo: 390,
    question: "How do I report a suspected exposure of confidential information?",
  },
  {
    id: "conv-seed-pension",
    title: "Pension contribution rate",
    hoursAgo: 810,
    question: "What is the current staff pension contribution rate?",
  },
];

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
  SEEDS.forEach((entry, index) => {
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
