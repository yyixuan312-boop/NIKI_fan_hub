import type { AgentIntent } from "@/lib/types"
import { RIKI_PROFILE, BADGE_STYLE_SPECS, DOLL_SPECS, STICKER_SPECS } from "@/lib/agent/memoryStore"

function profileBlock(): string {
  return [
    `Subject: Riki Nishimura (ENHYPEN)`,
    `Physical features: ${RIKI_PROFILE.features.join(", ")}`,
    `Aesthetic profile: ${RIKI_PROFILE.aesthetics.join(", ")}`,
    `Signature colors: ${RIKI_PROFILE.colors.join(", ")}`,
    `Eras available: ${RIKI_PROFILE.eras.join(", ")}`,
  ].join("\n")
}

function craftBlock(productType: string): string {
  if (productType === "badge") {
    return [
      `Craft type: 吧唧 (acrylic badge / pin)`,
      `Required elements: ${BADGE_STYLE_SPECS.requiredElements.join(" | ")}`,
      `User must describe: ${BADGE_STYLE_SPECS.userMustDescribe.join(", ")}`,
      `Print specs: sizes ${BADGE_STYLE_SPECS.printSpecs.sizes.join("/")} — finish ${BADGE_STYLE_SPECS.printSpecs.finish.join("/")} — ${BADGE_STYLE_SPECS.printSpecs.resolution}`,
      `Image prompt base: ${BADGE_STYLE_SPECS.imagePromptBase}`,
    ].join("\n")
  }
  if (productType === "doll") {
    return [
      `Craft type: 棉花娃娃 (cotton doll)`,
      `Standard size: ${DOLL_SPECS.standardSize}`,
      `Material: ${DOLL_SPECS.material}`,
      `Art style note: ${DOLL_SPECS.artNote}`,
    ].join("\n")
  }
  if (productType === "sticker") {
    return [
      `Craft type: sticker sheet`,
      `Available styles: ${STICKER_SPECS.styles.join(" | ")}`,
      `Must include: ${STICKER_SPECS.mustInclude.join(", ")}`,
      `Print specs: ${STICKER_SPECS.printSpecs.size}, finish options: ${STICKER_SPECS.printSpecs.finish.join("/")}`,
      `Cut type: ${STICKER_SPECS.printSpecs.cutType}`,
      `Resolution: ${STICKER_SPECS.printSpecs.resolution}`,
      `Image prompt style: ${STICKER_SPECS.imagePromptStyle}`,
    ].join("\n")
  }
  return ""
}

const OUTPUT_FORMAT = [
  ``,
  `## Output Format`,
  `Always respond with exactly two sections:`,
  ``,
  `### Design Brief`,
  `A structured description of the design concept (composition, mood, colors, era reference, key visual elements). 3–5 bullet points.`,
  ``,
  `### Image Generation Prompt`,
  `A single-paragraph prompt optimized for image generation models. Include subject description, style, lighting, color palette, and technical modifiers.`,
].join("\n")

export function buildSystemPrompt(productType: string): string {
  const craft = craftBlock(productType)

  const sections = [
    `You are a fan creative design assistant specializing in K-pop merchandise.`,
    ``,
    `## Subject Profile`,
    profileBlock(),
  ]

  if (craft) {
    sections.push(``, `## Craft Specifications`, craft)
  }

  sections.push(OUTPUT_FORMAT)
  return sections.join("\n")
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

  sections.push(OUTPUT_FORMAT)
  return sections.join("\n")
}
