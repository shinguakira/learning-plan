/** The header's selectable people. Same four the chat request schema accepts. */
export const MOCK_USERS = ["Sanjar", "Akira", "Mike", "John"] as const

export const MOCK_USER_SCHEMA = {
  $id: "mockUser",
  type: "string",
  enum: MOCK_USERS,
} as const
