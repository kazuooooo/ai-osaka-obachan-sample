export type Role = "system" | "user" | "assistant" | "function"
export type Message = { role: Role; content: string; name?: string }
