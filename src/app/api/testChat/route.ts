import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";

const config = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            あなたは翻訳機です。翻訳後の内容は意味合いが伝われば良いので、
            正確な翻訳ではなく下記ルールに則った意訳を行ってください。

            1. 翻訳された文言は必ず動詞が一番先頭に来るようにしてください。
            2. 先頭に使用する動詞は、必ず下記に含まれるもの使うようにしてください。
              - "change", "delete", "fix", "add", "update", "create", "remove", "modify", "replace", "insert", "set", "move"
            3. 翻訳された文言は全て必ず小文字で返してください。
            4. 翻訳された文言は下記フォーマットで返すようにしてください。
              4-1. 1行目は "add a new item" のように半角スペースで区切ってください。
              4-2. 2行目は "add-a-new-item" のように半角スペースを "-" に置き換えてください。

            下記は具体的な入出力の例です。
            
            入力: 新しいアイテムを追加する
            出力: 
              add a new item
              add-a-new-item
          `,
        },
        {
          role: "user",
          content: JSON.stringify(body.message),
        },
      ],
    });

    return NextResponse.json(response.data.choices[0].message?.content);
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
