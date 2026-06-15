import type { AgentIntent } from "@/lib/types"
import { RIKITO_PROFILE, BADGE_SPECS, DOLL_SPECS } from "@/lib/agent/memoryStore"

function profileBlock(): string {
  return [
    `Subject: Rikito Nishimura (ENHYPEN)`,
    `Physical features: ${RIKITO_PROFILE.features.join(", ")}`,
    `Aesthetic profile: ${RIKITO_PROFILE.aesthetics.join(", ")}`,
    `Signature colors: ${RIKITO_PROFILE.colors.join(", ")}`,
    `Eras available: ${RIKITO_PROFILE.eras.join(", ")}`,
  ].join("\n")
}

function craftBlock(intent: AgentIntent): string {
  if (intent === "badge") {
    return [
      `Craft type: 吧唧 (acrylic badge / pin)`,
      `Standard sizes: ${BADGE_SPECS.standardSizes.join(", ")}`,
      `Finish options: ${BADGE_SPECS.finish.join(", ")}`,
      `Print requirements: ${BADGE_SPECS.printNote}`,
    ].join("\n")
  }
  if (intent === "doll") {
    return [
      `Craft type: 棉花娃娃 (cotton doll)`,
      `Standard size: ${DOLL_SPECS.standardSize}`,
      `Material: ${DOLL_SPECS.material}`,
      `Art style note: ${DOLL_SPECS.artNote}`,
    ].join("\n")
  }
  return ""
}

export function buildPrompt(intent: AgentIntent, userInput: string): string {
  const craft = craftBlock(intent)

  const sections = [
    `You are a fan creative design assistant specializing in K-pop merchandise.`,
    ``,
    `## Subject Profile`,
    profileBlock(),
    ``,
    `## Task`,
    `Intent: ${intent}`,
    `User request: "${userInput}"`,
  ]

  if (craft) {
    sections.push(``, `## Craft Specifications`, craft)
  }

  sections.push(
    ``,
    `## Output Format`,
    `Respond with exactly two sections:`,
    ``,
    `### Design Brief`,
    `A structured description of the design concept (composition, mood, colors, era reference, key visual elements). 3–5 bullet points.`,
    ``,
    `### Image Generation Prompt`,
    `A single-paragraph prompt optimized for image generation models. Include subject description, style, lighting, color palette, and technical modifiers.`,
  )

  return sections.join("\n")
}
