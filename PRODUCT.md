# PRODUCT.md
# Riki Nishimura — Fan Info Hub

---

## Product Positioning

The go-to English-language reference site for Riki Nishimura (ENHYPEN) fans.
An aggregation + index site — it does not host copyrighted content.
Every piece of media shows a preview thumbnail + attribution + outbound link back to the original source.
Manually curated by the site owner. No login, no user submissions.

**Target user:** English-speaking ENE fans (global), age 16–28, active on Twitter/X, YouTube, Weverse.
**Core pain:** No English hub specifically for Riki. Fan art, group orders, and video archives are scattered with no central index.

---

## Core User Journey

1. User lands on **Home** → sees hero section with Riki's name, background video, and quick nav
2. User browses **Videos** → sees thumbnail grid → clicks card → opens YouTube in new tab
3. User visits **Fan Creatives** → browses fan art and group orders → clicks card → goes to original post
4. User reads **Profile** → learns about Riki's background, facts, units
5. User explores **Timeline** → scrolls milestones from debut to now
6. User views **Gallery** → sees low-res official press photos → clicks → goes to source

---

## MVP Core Features

| Feature | Notes |
|---|---|
| Home — hero section | Full-screen video bg, staggered headline, stat blocks, navbar |
| Profile page | Static bio, facts, units — manually written |
| Timeline | Key milestones debut → now, sourced and dated |
| Video archive | YouTube thumbnail → outbound link, no embed |
| Fan creatives index | Fan art + dolls/group orders, curated, attributed |
| Gallery | Low-res official press photos, credited to HYBE/BELIFT LAB |

---

## Feature Blacklist (Never Build)

| Feature | Reason |
|---|---|
| Video embed / iframe | Copyright risk |
| Fan submission / upload form | Moderation cost, liability |
| Guestbook / comments | Replaced by creatives index |
| User login / accounts | Out of scope |
| Voting / chart integration | Platform rule violation risk |
| SNS live feed aggregation | Requires API keys, v2 only |
| Multi-language (i18n) | Complexity too high for MVP |
| Database / backend API | Not needed for MVP |

---

## Acceptance Criteria

A page or feature is considered **done** when all of the following pass:

- [ ] `npm run build` — zero errors
- [ ] `npx tsc --noEmit` — zero TypeScript errors
- [ ] Renders correctly at 375px (mobile) and 1280px (desktop)
- [ ] All external links open in new tab with `rel="noopener noreferrer"`
- [ ] Fan creative cards display: artist handle + platform badge + source link
- [ ] Video cards display: YouTube thumbnail + title + channel + date (no embed)
- [ ] Gallery items display: image + credit text + source URL
- [ ] Footer contains takedown/contact email
- [ ] No hardcoded content in JSX — all from `/data/*.json`
- [ ] All text rendered lowercase
- [ ] Lighthouse mobile performance score ≥ 80