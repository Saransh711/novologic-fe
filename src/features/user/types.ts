/**
 * Shape of the authenticated user's profile surfaced in the UI.
 *
 * This mirrors the fields a future `User` GraphQL type is expected to expose.
 * Keeping it here (rather than in the generated layer) makes the eventual swap
 * to a generated type a single import change — the consuming UI is unaffected.
 */
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}
