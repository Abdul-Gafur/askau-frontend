import type { ID, ISODateTime } from "./common";

/**
 * Conversation types for the AskAU application.
 */

/** Conversation state */
export type ConversationStatus = "active" | "archived" | "deleted";

/** A chat conversation */
export interface Conversation {
  id: ID;
  userId: ID;
  title: string;
  status: ConversationStatus;
  /** Number of messages in the conversation */
  messageCount: number;
  /** Preview of the last message */
  lastMessagePreview?: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** Request to create a new conversation */
export interface CreateConversationRequest {
  title?: string;
}

/** Request to update a conversation */
export interface UpdateConversationRequest {
  title?: string;
  status?: ConversationStatus;
}
