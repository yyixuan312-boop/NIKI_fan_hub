interface GenerateImageOptions {
  prompt: string
  referenceImageUrl?: string
}

export async function generateImage({ prompt }: GenerateImageOptions): Promise<string> {
  const encoded = encodeURIComponent(prompt)
  return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&model=flux&seed=${Date.now()}`
}
