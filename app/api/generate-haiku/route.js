import { NextResponse } from "next/server"

export async function POST(req) {
  // Get the JSON body from the request
  const { prompt } = await req.json()

  // Validate prompt
  if (!prompt || prompt.length === 0) {
    return NextResponse.json({ message: "Prompt is required" }, { status: 400 })
  }

  try {
    // Call the OpenAI API to generate a haiku
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Write a haiku based on the following 3-word prompt: ${prompt}`
          }
        ],
        max_tokens: 60,
        temperature: 0.7
      })
    })

    // Parse the response from OpenAI
    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({ haiku: data.choices[0].message.content.trim() }, { status: 200 })
    } else {
      console.error("OpenAI API Error:", data)
      return NextResponse.json({ message: data.error.message || "Error generating haiku" }, { status: response.status })
    }
  } catch (error) {
    console.error("Error generating haiku:", error)
    return NextResponse.json({ message: "Error generating haiku" }, { status: 500 })
  }
}
