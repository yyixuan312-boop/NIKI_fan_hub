export const RIKI_PROFILE = {
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

export const DOLL_SPECS = {
  standardSize: "20cm",
  material: "PP cotton fill, fleece fabric",
  artNote: "flat design, front-facing, simplified facial features",
} as const

export const BADGE_STYLE_SPECS = {
  requiredElements: [
    "subject: idol portrait or chibi illustration as center focus",
    "text: idol name or nickname included somewhere in the design",
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
    "member name in english or japanese",
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
