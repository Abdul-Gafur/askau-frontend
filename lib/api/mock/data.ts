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
  email: "staff.member@africaunion.org",
  name: "Staff Member",
  displayName: "Staff Member",
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
  email: "admin@africaunion.org",
  name: "Admin User",
  displayName: "Admin User",
  roles: ["admin"],
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-001",
    userId: MOCK_USER.id,
    title: "HR Leave Policy Questions",
    status: "active",
    messageCount: 4,
    lastMessagePreview: "Thank you, that clarifies the annual leave policy.",
    createdAt: "2025-08-20T09:30:00Z",
    updatedAt: "2025-08-20T10:15:00Z",
  },
  {
    id: "conv-002",
    userId: MOCK_USER.id,
    title: "Procurement Procedures",
    status: "active",
    messageCount: 2,
    lastMessagePreview: "What is the threshold for direct procurement?",
    createdAt: "2025-08-18T14:00:00Z",
    updatedAt: "2025-08-18T14:22:00Z",
  },
  {
    id: "conv-003",
    userId: MOCK_USER.id,
    title: "Travel Allowance Rates",
    status: "archived",
    messageCount: 6,
    lastMessagePreview: "The DSA rates are specified in Annex II of the travel policy.",
    createdAt: "2025-07-15T11:00:00Z",
    updatedAt: "2025-07-15T12:30:00Z",
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "msg-001",
    conversationId: "conv-001",
    role: "user",
    content: "What is the AU Commission annual leave policy?",
    status: "complete",
    createdAt: "2025-08-20T09:30:00Z",
  },
  {
    id: "msg-002",
    conversationId: "conv-001",
    role: "assistant",
    content:
      "According to the AU Commission Staff Rules and Regulations, permanent staff are entitled to 30 working days of annual leave per year. Leave accrues at 2.5 days per month of service. Unused leave may be carried forward up to a maximum of 60 days. Please refer to Staff Rule 6.1 for complete details.",
    status: "complete",
    citationIds: ["cit-001"],
    createdAt: "2025-08-20T09:30:45Z",
  },
];
