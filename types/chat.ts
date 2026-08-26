import type { ID, ISODateTime } from "./common";

/**
 * Chat and message types for the AskAU application.
 *
 * These represent the frontend data model for chat interactions.
 * The backend is responsible for RAG, LLM calls, and all AI processing.
 * The frontend only sends questions and renders responses.
 */

/** Role of the message sender */
export type MessageRole = "user" | "assistant" | "system";

/** Message status during streaming / processing */
export type MessageStatus = "pending" | "streaming" | "complete" | "error";

/** User feedback on an assistant message */
export type MessageFeedback = "helpful" | "not_helpful" | null;

/** A single chat message */
export interface Message {
  id: ID;
  conversationId: ID;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  feedback?: MessageFeedback;
  /** Citation IDs referenced in this message */
  citationIds?: ID[];
  createdAt: ISODateTime;
  updatedAt?: ISODateTime;
}

/** Request to send a chat message */
export interface ChatRequest {
  conversationId?: ID;
  message: string;
  /** Locale for the response language hint */
  locale?: string;
}

/** Response from the chat endpoint */
export interface ChatResponse {
  conversationId: ID;
  messageId: ID;
  content: string;
  citationIds: ID[];
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  createdAt: ISODateTime;
}

/**
 * Feedback submission for a message.
 * Used to improve AskAU responses over time.
 */
export interface FeedbackRequest {
  messageId: ID;
  conversationId: ID;
  feedback: "helpful" | "not_helpful";
  comment?: string;
}

/**
 * Agent action types — for future Phase 2+ compatibility.
 * Not implemented in Phase 1. Defined here to establish the type boundary.
 *
 * @future Phase 2+
 */
export type AgentActionType =
  | "search_documents"
  | "retrieve_policy"
  | "create_request"
  | "submit_workflow"
  | "query_mis";

/**
 * Agent action — represents a tool call or enterprise system operation.
 * @future Phase 2+
 */
export interface AgentAction {
  id: ID;
  messageId: ID;
  type: AgentActionType;
  status: "pending" | "running" | "complete" | "failed" | "awaiting_approval";
  /** Human-readable description of the action */
  description: string;
  /** Whether human approval is required before execution */
  requiresApproval: boolean;
  result?: Record<string, unknown>;
  createdAt: ISODateTime;
  completedAt?: ISODateTime;
}
