/**
 * The seeded backend identities available in mock mode.
 *
 * DEVELOPMENT ONLY. Shared by the sign-in picker and the mock credentials
 * provider so the two cannot drift apart.
 *
 * `username` is not cosmetic: it is the lookup key into `.dev-tokens.json`,
 * which is generated from the backend seed, and the value the proxy at
 * app/api/[...path] uses to pick that person's bearer. `name` is only ever
 * displayed and can be changed freely; the key has to keep matching the seed.
 */
export const DEV_IDENTITIES = [
  {
    username: "staff.finance",
    name: "Musimenta Marieh",
    label: "sees confidential Finance material",
  },
  { username: "staff.hr", name: "Seka", label: "sees confidential HR material" },
  { username: "staff.legal", name: "Abdual", label: "Legal Counsel" },
  { username: "staff.peace", name: "Princess", label: "Peace and Security" },
  { username: "staff.dual", name: "Phiwa", label: "two departments — widest staff access" },
] satisfies { username: string; name: string; label: string }[];

/**
 * The person behind a seeded username, falling back to the username itself.
 *
 * The fallback matters: identities exist in the seed that the picker does not
 * list (admins, the executive office), and signing in as one of those should
 * show *something* rather than an empty greeting.
 */
export function devDisplayName(username: string): string {
  return DEV_IDENTITIES.find((identity) => identity.username === username)?.name ?? username;
}
