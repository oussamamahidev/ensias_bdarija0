import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
  const { question } = await request.json()

  try {
    // Try using a different Hugging Face model that's more accessible
    // This model is smaller and generally available to free accounts
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: question,
        options: { wait_for_model: true }, // This helps with cold starts
      }),
    })

    if (!response.ok) {
      console.error(`Hugging Face API error: ${response.status} ${response.statusText}`)
      // Fall back to mock implementation if Hugging Face fails
      return fallbackMockResponse(question)
    }

    const result = await response.json()
    let reply = ""

    // Handle different response formats from different models
    if (Array.isArray(result)) {
      reply = result[0].generated_text
    } else if (result.generated_text) {
      reply = result.generated_text
    } else if (result.answer) {
      reply = result.answer
    } else {
      console.log("Unexpected response format:", result)
      reply = JSON.stringify(result)
    }

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("AI API error:", error)
    // Fall back to mock implementation if there's an error
    return fallbackMockResponse(question)
  }
}

// Fallback mock response function
function fallbackMockResponse(question: string) {
  console.log("Using fallback mock response for:", question)

  // Create a more sophisticated mock response
  const mockResponses: any = {
    default: `I'd be happy to help with your question about "${question}". This is a mock response for testing purposes.`,
    programming: `Here's some code that might help with your programming question about "${question}":\n\n\`\`\`javascript\nfunction example() {\n  console.log("This is a mock code example");\n  return "It works!";\n}\n\`\`\`\n\nHope this helps!`,
    explanation: `The concept of "${question}" can be explained as follows:\n\n1. First, understand the basics\n2. Then, apply the principles\n3. Finally, practice regularly\n\nThis mock explanation should help you test your application.`,
  }

  // Choose a response type based on the question content
  let responseType = "default"
  if (question.toLowerCase().includes("code") || question.toLowerCase().includes("program")) {
    responseType = "programming"
  } else if (question.toLowerCase().includes("explain") || question.toLowerCase().includes("what is")) {
    responseType = "explanation"
  }

  return NextResponse.json({
    reply: mockResponses[responseType],
    note: "This is a fallback response because the AI service is currently unavailable.",
  })
}

