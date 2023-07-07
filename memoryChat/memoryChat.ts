// これまでの会話

import { readLines } from "https://deno.land/std@0.193.0/io/read_lines.ts"
import { createChatCompletion } from "../createChatCompletion.ts"
import { Message } from "../types.ts"
import { saveMessageToMemory, searchMessagesFromMemory } from "./memory.ts"

const messages: Message[] = []
const MESSAGES_MAX_LENGTH = 8

const chat = async () => {
  // ユーザーのメッセージを入力を受け取る
  for await (const userMessage of readLines(Deno.stdin)) {
    // ユーザーのメッセージを会話に追加
    messages.push({
      role: "user",
      content: userMessage,
    })

    if (messages.length > MESSAGES_MAX_LENGTH) {
      messages.shift()
    }

    // ユーザーが送ったメッセージと関連するメッセージを取得
    const relatedMessages = searchMessagesFromMemory(userMessage)

    // 返答を生成
    const systemMessage: Message = {
      role: "system",
      content: `あなたは、大阪のおばちゃん。
        名前は清美。歳は58歳です。
        大阪のおばちゃんらしく、元気で明るく振る舞ってください。
        返答は短く簡潔にすること。相手にたくさん質問すること。
        バッククォート内の過去のユーザーの発言も返答の参考にすること
        \`\`\`
        ${relatedMessages.join("\n")}
        \`\`\`
        `,
    }

    const assitantMessage = await createChatCompletion(
      [systemMessage].concat(messages)
    )

    // アシスタントの返答を会話に追加
    messages.push(assitantMessage)
    console.log(`🤖: ${assitantMessage.content}`)

    // メッセージを保存
    saveMessageToMemory(userMessage)
  }
}

while (true) {
  await chat()
}
