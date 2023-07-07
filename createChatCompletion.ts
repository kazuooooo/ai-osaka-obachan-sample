import { Message } from "./types.ts"

export const createChatCompletion = async (
  messages: Message[],
  functions: any[] | undefined = undefined
) => {
  const body = functions
    ? {
        model: "gpt-4-0613",
        messages,
        functions,
      }
    : {
        model: "gpt-4-0613",
        messages,
      }
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
    },
    body: JSON.stringify(body),
  })
  const data = await response.json()

  return data.choices[0].message
}
