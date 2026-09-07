/**
 * Chat Feature — Domain Types
 *
 * All types live here and are imported by chat feature components.
 * Shared types (e.g. Source) that are used across features belong in
 * a common location — for now they are co-located here and re-exported.
 */

export type ClassLevel = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "HIGHLY_RESTRICTED";

export type MessageState = "grounded" | "insufficient" | "outdated" | "conflicting" | "error";

export type AppView = "welcome" | "conversation" | "loading";

export type FeedbackType = "helpful" | "not-helpful";

export type NotHelpfulReason =
  "incorrect" | "irrelevant" | "missing-source" | "outdated" | "other" | null;

export interface Source {
  id: string;
  title: string;
  section: string;
  page: number;
  version: string;
  published: string;
  classification: ClassLevel;
  department: string;
  docType: string;
  effectiveDate: string;
  status: string;
  excerpt: string;
  /**
   * Whether this reader may open the document itself.
   *
   * Grounding and opening are separate permissions: a source can support an
   * answer the reader is not allowed to open. Without this the card cannot
   * mark the difference, so an unopenable source looks identical to an
   * openable one until the click fails.
   */
  hasAccess?: boolean;
  /**
   * Backend-vended link to the authoritative original. Never constructed here:
   * AskAU redirects to the source repository rather than serving the file, so
   * it does not become the system of record — and the redirect is audited.
   */
  accessUrl?: string | null;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  state?: MessageState;
  sources?: Source[];
  groundingCount?: number;
  retrievedAt?: Date;
  feedback?: FeedbackType | null;
  notHelpfulReason?: NotHelpfulReason;
  conflictingSources?: Source[];
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
}
