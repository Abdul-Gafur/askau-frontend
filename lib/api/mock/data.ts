/**
 * Mock data for development and testing.
 *
 * DEVELOPMENT AND TESTING ONLY.
 * Never import this file from production code paths.
 */

import type { User } from "@/types/auth";
import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/chat";

export const MOCK_USER: User = {
  id: "usr-mock-001",
  email: "musimenta.marieh@africaunion.org",
  name: "Musimenta Marieh",
  displayName: "Musimenta Marieh",
  roles: ["user"],
  department: "Department of Information Technology",
  jobTitle: "Information Technology Officer",
  languagePreference: "en",
  createdAt: "2025-01-01T08:00:00Z",
  lastLoginAt: new Date().toISOString(),
};

export const MOCK_ADMIN_USER: User = {
  ...MOCK_USER,
  id: "usr-mock-admin-001",
  email: "phiwa@africaunion.org",
  name: "Phiwa",
  displayName: "Phiwa",
  roles: ["admin"],
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-001",
    userId: MOCK_USER.id,
    title: "Aspiration 6 of Agenda 2063",
    status: "active",
    messageCount: 4,
    lastMessagePreview: "Thank you — that clarifies what Aspiration 6 commits the Union to.",
    createdAt: "2026-08-20T09:30:00Z",
    updatedAt: "2026-08-20T10:15:00Z",
  },
  {
    id: "conv-002",
    userId: MOCK_USER.id,
    title: "Chairperson of the AU Commission",
    status: "active",
    messageCount: 2,
    lastMessagePreview: "Who is the current Chairperson of the AU Commission?",
    createdAt: "2026-08-18T14:00:00Z",
    updatedAt: "2026-08-18T14:22:00Z",
  },
  {
    id: "conv-003",
    userId: MOCK_USER.id,
    title: "Continental AI Strategy",
    status: "archived",
    messageCount: 6,
    lastMessagePreview:
      "The Continental AI Strategy was endorsed by the Executive Council in Accra in July 2024.",
    createdAt: "2026-07-15T11:00:00Z",
    updatedAt: "2026-07-15T12:30:00Z",
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "msg-001",
    conversationId: "conv-001",
    role: "user",
    content: "What is Aspiration 6 of Agenda 2063?",
    status: "complete",
    createdAt: "2026-08-20T09:30:00Z",
  },
  {
    id: "msg-002",
    conversationId: "conv-001",
    role: "assistant",
    content:
      'Aspiration 6 of Agenda 2063 calls for "An Africa, whose development is people-driven, relying on the potential of African people, especially its women and youth, and caring for children." It commits the Union to a more inclusive society in which all citizens take part in decision making, and in which no child, woman or man is left behind or excluded on the basis of gender, political affiliation, religion, ethnic affiliation, locality, age or other factors. Article 3 of the Protocol on Amendments to the Constitutive Act of the African Union gives the commitment binding form.',
    status: "complete",
    citationIds: ["cit-001"],
    createdAt: "2026-08-20T09:30:45Z",
  },
];
