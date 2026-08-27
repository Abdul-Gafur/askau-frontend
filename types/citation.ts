import type { ID, ISODateTime } from "./common";

/**
 * Citation types for the AskAU application.
 *
 * Citations represent references to approved AU knowledge source documents
 * that ground AskAU responses. The frontend renders citations but never
 * has direct access to the underlying document store.
 *
 * SECURITY NOTE:
 * - Document access is authorized by the backend.
 * - The frontend must never attempt to construct direct document URLs.
 * - Citation access is controlled by the backend; the frontend renders
 *   only what the backend returns.
 */

/** Type of source document */
export type DocumentType =
  "policy" | "procedure" | "sop" | "guideline" | "manual" | "circular" | "faq" | "report" | "other";

/** A citation / source reference */
export interface Citation {
  id: ID;
  /** The message this citation belongs to */
  messageId: ID;
  /** Source document identifier */
  documentId: ID;
  /** Document title */
  title: string;
  /** Document type */
  documentType: DocumentType;
  /** Relevant excerpt from the source document */
  excerpt?: string;
  /** Page or section reference within the document */
  pageReference?: string;
  /** Backend-vended access URL (time-limited, authorized) */
  accessUrl?: string;
  /** Whether the current user has access to view the full document */
  hasAccess: boolean;
  /** Citation index within the response (1-based) */
  citationIndex: number;
  /** Document creation/publication date */
  documentDate?: ISODateTime;
  createdAt: ISODateTime;
}

/** Citation summary (lighter version for inline display) */
export interface CitationSummary {
  id: ID;
  title: string;
  documentType: DocumentType;
  citationIndex: number;
  hasAccess: boolean;
}
