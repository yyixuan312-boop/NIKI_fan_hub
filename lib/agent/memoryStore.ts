export const RIKI_PROFILE = {
  name: {
    legal: "Nishimura Riki",
    fanUsed: ["NIKI", "니키", "ニキ"],
    nameNote: "Fan-made content always uses NIKI / 니키 / ニキ — never 'RIKI'. Use one of these three forms whenever a name appears in a design.",
  },
  features: ["sharp jawline", "monolid eyes", "lean build", "167cm"],
  aesthetics: ["clean", "cold", "dark academia", "monochrome"],
  colors: ["black", "white", "deep navy", "charcoal grey"],
  eras: ["BORDER: DAY ONE", "DIMENSION", "DARK BLOOD", "ORANGE BLOOD"],
} as const

export const BADGE_SPECS = {
  standardSizes: ["44mm", "58mm", "75mm"],
  finish: ["glossy", "matte", "holographic"],
  printNote: "300dpi minimum, CMYK color space, 3mm bleed",
} as const

export const RIKITO_DOLL_FEATURES = {
  facialFeatures: {
    eyes: "narrow almond-shaped monolid eyes, slightly droopy outer corners, sharp and intense",
    lips: "drawn with only 2-3 simple round arc lines in pale pink — NO M-shape, NO Cupid's bow, NO corners, NO mouth corners visible. Upper lip: one simple smooth round arc in pale pink. Lower lip: one slightly fuller smooth round arc below in pale pink. Both arcs are plain gentle curves, nothing angular. No shading, no highlights, no detailed lip edges. In plush/doll style: 2-3 pale pink embroidery thread round arcs only, no corner stitches. In chibi illustration: same plain smooth arcs. Result should look soft, minimal, and cute — never exaggerated, never dark.",
    nose: "straight bridge, soft tip",
    distinguishingMarks: [
      "mole under LEFT eye (crucial for recognition, especially in animal/object dolls)",
      "mole on chin",
    ],
    blush: "soft cheek blush marks in fan art/chibi representation",
    note: "when no hair to rely on (animal/object dolls), the mole under left eye + thick lips are the PRIMARY recognition features — always include both",
  },
  humanoidDoll: {
    description: "chibi figure based on real Riki appearance, hair is the main design anchor",
    hairVariants: [
      "black hair: straight, side-swept or slightly messy — references stage/performance looks (p1, p2 style)",
      "platinum blonde / white blonde: fluffy, voluminous — references airport/casual looks (p3, p4 style)",
      "textured spiky blonde: disheveled, high-energy — references variety/live looks (p5, p6 style)",
    ],
    genderVariants: [
      "male default: standard chibi proportions",
      "female version (女娃): same face features, styled with feminine outfit/hair accessories — popular among fans",
    ],
    mustInclude: [
      "mole under left eye",
      "mole on chin",
      "full lips",
      "narrow eyes",
    ],
  },
  animalAndObjectDolls: {
    note: "when doing animal or object type, hair is absent — facial moles and lip shape become CRITICAL identity markers",
    popularTypes: [
      {
        type: "leopard (豹子塑)",
        shape: "leopard body/head form",
        faceNote: "keep narrow eyes + mole under left eye + thick lips on the face panel",
      },
      {
        type: "beagle dog (比格塑)",
        shape: "beagle dog with floppy ears",
        faceNote: "droopy eyes matching beagle expression + both moles preserved",
      },
      {
        type: "dumpling (饺子塑)",
        shape: "half-moon dumpling body shape",
        faceNote: "tiny face on dumpling surface, mole under left eye is key identifier",
      },
      {
        type: "steamed bun / baozi (包子塑)",
        shape: "round puffy bao body — the whole character body IS the bun shape, with a pleated top",
        faceNote: "simple face drawn directly on the bun surface: narrow eyes, thick lips, mole under left eye. Add tiny stubby arms and legs. Do NOT draw a human character holding a bun — the CHARACTER IS the bun.",
      },
      {
        type: "monkey (猴子塑)",
        shape: "round monkey head + small body",
        faceNote: "narrow eyes + full lips + moles on simplified round face",
      },
      {
        type: "duck (鸭子塑)",
        shape: "duck body, beak optional or stylized as lips",
        faceNote: "mole under left eye on duck face, thick lip shape suggested",
      },
      {
        type: "octopus (章鱼塑)",
        shape: "round head with tentacle body",
        faceNote: "face on round head, always include left eye mole + full lips",
      },
    ],
  },
  physicalSpecs: {
    sizes: ["10cm (keychain/mini)", "15cm (standard)", "20cm (large)"],
    material: "short plush or minky fabric, PP cotton fill, embroidered face",
    faceMethod: "embroidery preferred (not printed) — moles must be embroidered as small satin stitch dots",
    artRequirement: "front-facing flat illustration, 300dpi, clean lineart, transparent background",
    expressionVariants: "recommend designing both open-eye and sleepy/closed-eye versions",
  },
} as const

export const BADGE_STYLE_SPECS = {
  requiredElements: [
    "subject: idol portrait or chibi illustration as center focus",
    "text: idol name included somewhere in the design — use NIKI, 니키, or ニキ (never 'RIKI')",
    "motif: at least one decorative element matching the user's chosen theme",
    "border: a defined edge or frame around the circular badge",
  ],
  userMustDescribe: [
    "visual style (e.g. chibi cartoon / real photo / watercolor / y2k)",
    "color theme or mood (e.g. all pink / dark academia / pastel blue)",
    "concept or theme (e.g. cafe, angel, summer, black cat)",
    "any specific outfit or era to reference",
  ],
  printSpecs: {
    sizes: ["44mm", "58mm", "75mm"],
    finish: ["glossy", "matte", "holographic"],
    resolution: "300dpi, CMYK, 3mm bleed",
  },
  imagePromptBase:
    "kpop idol badge design, circular composition, centered subject, decorative border, clean edges suitable for print, white background",
} as const

export const STICKER_SPECS = {
  styles: [
    "kpop-collage: real photo cutouts mixed with kawaii illustrations, polaroid frames, scattered layout",
    "chibi-cartoon: simplified cute character version, big head small body, pastel colors",
    "aesthetic-board: unified color theme, cherry blossoms / stars / hearts as decorative elements",
    "y2k-glitter: holographic stickers, pixel stars, retro gadgets, neon outlines",
  ],
  mustInclude: [
    "member name: use NIKI (English), 니키 (Korean), or ニキ (Japanese) — never 'RIKI'",
    "album title or song lyric as text element",
    "at least 3 decorative motifs (stars, hearts, flowers, etc)",
    "polaroid or frame element",
    "unified color palette (max 3 colors)",
  ],
  printSpecs: {
    size: "standard sheet 140x100mm or A5",
    finish: ["glossy", "holographic", "matte"],
    cutType: "die-cut (cut around shape) or kiss-cut (cut to backing)",
    resolution: "300dpi minimum, RGB for digital proof",
  },
  imagePromptStyle:
    "flat illustration, kpop fanart style, clean lineart, pastel palette, cute chibi proportions, white background, sticker sheet layout",
} as const
