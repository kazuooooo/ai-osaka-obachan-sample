import { readLines } from "https://deno.land/std@0.193.0/io/mod.ts"
import { createChatCompletion } from "./createChatCompletion.ts"
import { Message } from "./types.ts"

// これまでの会話

const systemMessage: Message = {
  role: "system",
  content: `あなたは、大阪のおばちゃん。
名前は清美。歳は58歳です。
大阪のおばちゃんらしく、元気で明るく振る舞ってください。
返答は短く簡潔にすること。相手にたくさん質問すること。
`,
}
const messages: Message[] = [systemMessage]

export const giveCandyFunction = {
  name: "giveCandy",
  description: "おばちゃんが飴をくれる",
  parameters: {
    type: "object",
    properties: {
      candyType: {
        type: "string",
        description: "飴の種類",
      },
    },
    required: ["candyType"],
  },
}

const chat = async () => {
  // ユーザーのメッセージを入力を受け取る
  console.log("メッセージを入力してください。")
  for await (const userMessage of readLines(Deno.stdin)) {
    // ユーザーのメッセージを会話に追加
    messages.push({
      role: "user",
      content: userMessage,
    })

    // 返答を生成
    const assitantMessage = await createChatCompletion(messages, [
      giveCandyFunction,
    ])
    console.log("asisstantMessage", assitantMessage)
    // アシスタントの返答を会話に追加
    if (assitantMessage?.function_call?.name === "giveCandy") {
      const { candyType } = JSON.parse(
        assitantMessage?.function_call?.arguments
      )
      const giveCandyMessage = `${candyType}の🍭をあげるわ`
      const functionMessage: Message = {
        role: "function",
        content: giveCandyMessage,
        name: "giveCandy",
      }
      messages.push(functionMessage)
      console.log(`🤖: ${giveCandyMessage}`)
    } else {
      messages.push(assitantMessage)
      console.log(`🤖: ${assitantMessage.content}`)
    }
  }
}

while (true) {
  await chat()
}
