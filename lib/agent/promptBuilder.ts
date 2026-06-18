import type { AgentIntent } from "@/lib/types"
import { RIKI_PROFILE, BADGE_STYLE_SPECS, RIKITO_DOLL_FEATURES, STICKER_SPECS } from "@/lib/agent/memoryStore"

function profileBlock(): string {
  return [
    `Subject: Nishimura Riki (ENHYPEN)`,
    `Fan name: ${RIKI_PROFILE.name.fanUsed.join(" / ")} — ${RIKI_PROFILE.name.nameNote}`,
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
    const f = RIKITO_DOLL_FEATURES
    const animalTypes = f.animalAndObjectDolls.popularTypes
      .map((t) => `${t.type} (${t.shape}) — ${t.faceNote}`)
      .join(" | ")
    return [
      `Craft type: 棉花娃娃 (cotton doll / plush figure)`,
      ``,
      `## Facial Recognition Features (CRITICAL)`,
      `Eyes: ${f.facialFeatures.eyes}`,
      `Lips: ${f.facialFeatures.lips}`,
      `Distinguishing marks: ${f.facialFeatures.distinguishingMarks.join(" + ")}`,
      `Recognition note: ${f.facialFeatures.note}`,
      ``,
      `## Humanoid Doll`,
      `${f.humanoidDoll.description}`,
      `Hair variants: ${f.humanoidDoll.hairVariants.join(" | ")}`,
      `Gender variants: ${f.humanoidDoll.genderVariants.join(" | ")}`,
      `Must include: ${f.humanoidDoll.mustInclude.join(", ")}`,
      ``,
      `## Animal / Object Dolls`,
      `Note: ${f.animalAndObjectDolls.note}`,
      `Popular types: ${animalTypes}`,
      ``,
      `## Physical Specs`,
      `Sizes: ${f.physicalSpecs.sizes.join(" / ")}`,
      `Material: ${f.physicalSpecs.material}`,
      `Face method: ${f.physicalSpecs.faceMethod}`,
      `Art requirement: ${f.physicalSpecs.artRequirement}`,
      `Expression variants: ${f.physicalSpecs.expressionVariants}`,
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

const ILLUSTRATION_STYLE_ANCHOR = [
  `## Global Style Rule (OVERRIDES ALL OTHER STYLE DECISIONS)`,
  `ALL character art — across every product type — must be illustrated / animated style.`,
  `NEVER generate photorealistic renders, real-person likeness photos, or photo-editing composites.`,
  ``,
  `Two allowed character modes (choose based on user request):`,
  `1. Humanoid: 2D illustration or chibi anime character — stylized, flat or semi-flat shading, graphic-novel-clean lines`,
  `2. Animal / creature: cute animal character design — the subject's personality traits transferred to an animal form`,
  ``,
  `Forbidden in ALL outputs:`,
  `- Photorealistic skin, hair, or fabric rendering`,
  `- Real-person face compositing or photo manipulation`,
  `- 3D-rendered CGI portraits`,
  `- Hyperrealistic lighting (subsurface scattering, volumetric rays on faces)`,
  ``,
  `Add to every image prompt: "2D illustrated style, NOT photorealistic, graphic art, clean stylized linework"`,
].join("\n")

const BACKGROUND_COLOR_RULES = [
  `## Background Color Selection`,
  `Do NOT default to white or any single fixed color. Analyze the user's concept theme and choose a background that complements it:`,
  `- cute/pastel concept → soft muted tones (dusty pink, powder blue, sage green)`,
  `- dark/cool concept → deep charcoal, navy, or near-black`,
  `- warm/vintage concept → warm beige, amber, burnt orange tones`,
  `- y2k/bright concept → saturated jewel tones, hot pink, electric blue`,
  `- nature/seasonal concept → earthy greens, cherry blossom pink, autumn rust`,
  `Add to every image prompt: "background color: [your auto-selected color based on concept], avoid plain white"`,
].join("\n")

const COLOR_CONTRAST_RULES = [
  `## Color Contrast (APPLIES TO ALL PRODUCTS)`,
  `Keep overall color contrast LOW — muted, soft, harmonious. Never use stark blacks next to pure whites as dominant tones.`,
  `Prefer: desaturated or pastel palettes, analogous color schemes, toned-down shading.`,
  `Add to every image prompt: "low contrast palette, soft muted tones, gentle color harmony, no harsh color clashes"`,
].join("\n")

const DOLL_CUTENESS_RULES = [
  `## Doll Cuteness Rules (CRITICAL — dolls only)`,
  `PRIMARY PRINCIPLE: The doll MUST look cute (可爱). It may be "ugly-cute" (丑萌) but must NEVER look scary, uncanny, or unsettling.`,
  ``,
  `Mandatory proportions:`,
  `- Head-to-body ratio: oversized head (head roughly equal to or larger than the body) — classic chibi/plush toy proportions`,
  `- Body: small, stubby, rounded — limbs are short and chubby`,
  `- Overall silhouette: round and soft, like a real cotton plush doll`,
  ``,
  `Forbidden traits (will make result scary):`,
  `- Realistic or hyper-detailed skin textures`,
  `- Naturalistic body proportions (normal head-to-body ratio)`,
  `- Exaggerated or oversized lips rendered realistically`,
  `- Uncanny-valley eyes (too realistic or too large on a small face)`,
  `- Deep shadows, dramatic lighting, or high-contrast rendering`,
  ``,
  ``,
  `## Animal / Object Character Rule (CRITICAL — applies to ALL X塑 types)`,
  `When the user requests any animal or object shaped character (X塑: 包子塑, 饺子塑, 猴子塑, 鸭子塑, 豹子塑, etc.), the CHARACTER BODY IS THAT ANIMAL/OBJECT SHAPE.`,
  `- The whole silhouette = the animal or object form (e.g. a round monkey, a duck body, a dumpling shape)`,
  `- PRIMARY GOAL: eyes and mouth must resemble Riki — narrow monolid eyes, notably thick full lips, mole under left eye`,
  `- A simple kawaii face is drawn DIRECTLY ON the animal/object — these facial features are the ONLY required resemblance`,
  `- Tiny stubby limbs may be added but are secondary`,
  `- NEVER draw a human/chibi character holding or standing next to the animal/object`,
  `- NEVER add a realistic human body — the animal/object shape IS the whole body`,
  `- Add to every such prompt: "[X] body shape, character IS a [X], face drawn directly on body, narrow eyes, thick lips, mole under left eye"`,
  ``,
  `## Hair Rule for Animal / Object Forms`,
  `Animal and object dolls do NOT wear human hairstyles. A duck, dumpling, or bear shape with a full black human hairdo looks wrong and ugly.`,
  `- Default: NO hair. The animal/object silhouette speaks for itself.`,
  `- Exception: if the subject's hairstyle has a very distinctive shape (e.g. a sharp comma bang, a signature curtain-part), suggest it with ONE small minimalist curve or swoosh line drawn lightly on the head — do not render full hair volume or color blocks.`,
  `- Add to animal/object doll prompts: "no human hairstyle on animal form, at most a single small suggestive hair curve if hairstyle is iconic, clean scalp silhouette otherwise"`,
  ``,
  `Add to every doll image prompt: "chibi plush doll style, oversized round head, small chubby body, soft embroidered-fabric look, adorable and non-threatening, kawaii aesthetic, matte flat lighting, low contrast soft palette"`,
].join("\n")

const FACIAL_FEATURES_MANDATORY = [
  `## Mandatory Facial Features (ALL Character Designs)`,
  `Include this in every image generation prompt, verbatim:`,
  `"character must have: elongated narrow monolid eyes, lips drawn as 2–3 simple soft curved lines in light pink only — NO mouth corners, NO lip outlines, NO dark color, upper lip one gentle M-curve in pale pink, lower lip one slightly fuller pale pink curve below, soft and pouty not exaggerated. Short compact face shape. One small mole below the outer corner of the LEFT eye only. One small subtle mole slightly left of center on the chin — NOT centered, NOT large. Exactly 2 moles total. No other moles. Natural eyebrows, not emphasized."`,
  ``,
  `For animal/object dolls, additionally include:`,
  `"even in [animal/object] form, preserve: narrow slit eyes, soft pale pink lip lines (2–3 curves, no corners), mole under left eye, small chin mole slightly left of center"`,
].join("\n")

const OUTPUT_FORMAT = [
  ``,
  `## Output Format`,
  `Always respond with exactly one section:`,
  ``,
  `### Image Generation Prompt`,
  `A single-paragraph prompt optimized for image generation models. Include subject description, style, lighting, color palette, and technical modifiers.`,
  `Apply the background color selection rules and mandatory facial features rules above.`,
  `Wrap the most critical visual keywords in **bold** (e.g. **chibi style**, **mole under left eye**, **circular badge**) so readers can scan key features at a glance. Bold 6–10 terms maximum.`,
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

  sections.push(``, ILLUSTRATION_STYLE_ANCHOR)
  sections.push(``, BACKGROUND_COLOR_RULES)
  sections.push(``, COLOR_CONTRAST_RULES)
  if (productType === "doll") {
    sections.push(``, DOLL_CUTENESS_RULES)
  }
  sections.push(``, FACIAL_FEATURES_MANDATORY)
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

  sections.push(``, ILLUSTRATION_STYLE_ANCHOR)
  sections.push(``, BACKGROUND_COLOR_RULES)
  sections.push(``, COLOR_CONTRAST_RULES)
  if (intent === "doll") {
    sections.push(``, DOLL_CUTENESS_RULES)
  }
  sections.push(``, FACIAL_FEATURES_MANDATORY)
  sections.push(OUTPUT_FORMAT)
  return sections.join("\n")
}
