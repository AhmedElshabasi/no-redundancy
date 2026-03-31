export type TeamRow = {
  id: string
  name: string
  invite_code: string
  /** Set when loaded from `team_members` (protected layout). */
  role?: 'owner' | 'member'
}
