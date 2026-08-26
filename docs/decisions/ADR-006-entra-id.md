# ADR 006: Microsoft Entra ID Authentication

## Status
Accepted

## Context
The African Union Commission utilizes Microsoft enterprise services. AskAU must authenticate users against the organization's existing identity provider to ensure security, compliance, and single sign-on (SSO) convenience.

## Decision
We will use NextAuth.js configured with the Microsoft Entra ID (Azure AD) provider for all authentication.

## Consequences
- **Positive**: Seamless SSO for AU Commission staff.
- **Positive**: NextAuth.js handles the complex OAuth2/OIDC flows securely.
- **Negative**: Local development requires either a mock authentication provider or a dedicated development tenant in Entra ID.
