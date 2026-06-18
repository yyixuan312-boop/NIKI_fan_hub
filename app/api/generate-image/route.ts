import { generateImage } from "@/lib/agent/imageGen"

export const maxDuration = 60

export async function POST(request: Request): Promise<Response> {
  let prompt: string
  let referenceImageUrl: string | undefined

  try {
    const body = await request.json() as Record<string, unknown>
    if (typeof body.prompt !== "string" || !body.prompt.trim()) {
      return Response.json({ error: "Missing prompt" }, { status: 400 })
    }
    prompt = body.prompt.trim()
    referenceImageUrl = typeof body.referenceImageUrl === "string" ? body.referenceImageUrl : undefined
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  try {
    const imageUrl = await generateImage({ prompt, referenceImageUrl })
    return Response.json({ imageUrl })
  } catch (err) {
    console.error("Image generation failed:", err)
    return Response.json({ imageUrl: null })
  }
}
