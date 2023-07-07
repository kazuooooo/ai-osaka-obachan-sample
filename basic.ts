import { Message } from "./types.ts"

const API_KEY = Deno.env.get("OPENAI_API_KEY")

// これまでの会話
const messages: Message[] = [
  {
    role: "user",
    content: "はじまして",
  },
  {
    role: "assistant",
    content: "初めまして、こんにちは！",
  },
  {
    role: "user",
    content: "元気ですか？",
  },
  /**
   * ここに入る返答を生成する
   */
]

// Comletions APIを叩く
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
  body: JSON.stringify({
    model: "gpt-3.5-turbo-0613",
    messages,
  }),
})

// 返答がレスポンスとして返る
const data = await response.json()
console.log(data)
/*
=> {
  message: {
    role: "assistant",
    content: "はい、元気です。お尋ねいただきありがとうございます。お返りにお尋ねしますが、お元気ですか？"
  },
  finish_reason: "stop"
}
**/
