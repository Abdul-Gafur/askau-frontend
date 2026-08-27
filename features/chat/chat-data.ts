/**
 * Chat Feature — Placeholder Data
 *
 * Returns typed placeholder values until the real API is ready.
 * All consumer components import from here instead of hardcoding inline.
 */

import type { Source, Conversation, Message } from "./types";

export const SAMPLE_SOURCES: Source[] = [
  {
    id: "s1",
    title: "Staff Leave Policy",
    section: "4.2 Annual Leave",
    page: 18,
    version: "3.1",
    published: "2026",
    classification: "INTERNAL",
    department: "Human Resources Division",
    docType: "Policy Document",
    effectiveDate: "1 Jan 2026",
    status: "Active",
    excerpt:
      "Employees are entitled to annual leave as prescribed in Schedule 1. Leave requests must be submitted through the approved leave management system not less than five (5) working days prior to the intended commencement date.",
  },
  {
    id: "s2",
    title: "Human Resources Procedures Manual",
    section: "7.1 Leave Administration",
    page: 42,
    version: "2.4",
    published: "2025",
    classification: "INTERNAL",
    department: "Human Resources Division",
    docType: "Procedures Manual",
    effectiveDate: "15 Mar 2025",
    status: "Active",
    excerpt:
      "The leave administration process requires the supervisor to review and approve or decline the application within two (2) working days of receipt.",
  },
  {
    id: "s3",
    title: "Leave Management Circular",
    section: "2 — Application Procedures",
    page: 3,
    version: "1.0",
    published: "2026",
    classification: "INTERNAL",
    department: "Office of the Director General",
    docType: "Administrative Circular",
    effectiveDate: "1 Apr 2026",
    status: "Active",
    excerpt:
      "With effect from 1 April 2026, all leave applications must be submitted exclusively through the integrated HR portal.",
  },
];

export const CONFLICTING_SOURCES: Source[] = [
  {
    id: "c1",
    title: "Staff Leave Policy (v2.8 — Superseded)",
    section: "4.2.1 Carry-Forward Limits",
    page: 19,
    version: "2.8",
    published: "2024",
    classification: "INTERNAL",
    department: "Human Resources Division",
    docType: "Policy Document",
    effectiveDate: "1 Jan 2024",
    status: "Superseded",
    excerpt:
      "Employees may carry forward up to 30 days of unused annual leave to the following calendar year.",
  },
  {
    id: "c2",
    title: "Staff Leave Policy (v3.1 — Current)",
    section: "4.2.1 Carry-Forward Limits",
    page: 20,
    version: "3.1",
    published: "2026",
    classification: "INTERNAL",
    department: "Human Resources Division",
    docType: "Policy Document",
    effectiveDate: "1 Jan 2026",
    status: "Active",
    excerpt:
      "Employees may carry forward up to 15 days of unused annual leave to the following calendar year.",
  },
];

export const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "Annual leave procedure",
    preview: "What is the procedure for requesting annual leave?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "c2",
    title: "Procurement approval thresholds",
    preview: "What are the procurement approval thresholds?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "c3",
    title: "Travel policy — international",
    preview: "What are the requirements for international travel approval?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26),
  },
  {
    id: "c4",
    title: "IT equipment request process",
    preview: "How do I request new IT equipment?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50),
  },
  {
    id: "c5",
    title: "Performance review cycle",
    preview: "When does the annual performance review cycle begin?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
  },
  {
    id: "c6",
    title: "Confidentiality agreement requirements",
    preview: "What are the requirements for staff confidentiality agreements?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
];

export const SAMPLE_MESSAGES: Message[] = [
  {
    id: "u1",
    role: "user",
    content: "What is the procedure for requesting annual leave?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: "a1",
    role: "assistant",
    content:
      "Employees should submit an annual leave request through the approved leave management system not less than five working days prior to the intended commencement date. The request must receive written supervisory approval before leave is taken. Supervisors are required to review and respond within two working days. All applications must be lodged through the integrated HR portal — paper-based submissions are no longer accepted.",
    timestamp: new Date(Date.now() - 1000 * 60 * 24),
    state: "grounded",
    groundingCount: 3,
    retrievedAt: new Date(Date.now() - 1000 * 60 * 24),
    sources: SAMPLE_SOURCES,
    feedback: null,
  },
];

export const SUGGESTED_PROMPTS = [
  "chat.suggestedPrompts.leavePolicy",
  "chat.suggestedPrompts.procurementProcess",
  "chat.suggestedPrompts.travelPolicy",
  "chat.suggestedPrompts.annualLeaveSteps",
] as const;

export const LOADING_STEP_KEYS = [
  "chat.loading.searching",
  "chat.loading.reviewing",
  "chat.loading.preparing",
] as const;
