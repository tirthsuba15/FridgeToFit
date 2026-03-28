# FridgeToFit Design System — MASTER.md

## CSS Variables
--green-deep: #2D6A4F
--green-mid: #52B788
--cream: #FEFAE0
--warm: #D4A373
--brown: #A0522D

## Typography
- Headings: Playfair Display (Google Fonts)
- Body: DM Sans (Google Fonts)
- Import in index.css:
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');

## Background
- Base: #FEFAE0
- Overlay: botanical SVG leaf texture (see BotanicalBackground component)
- SVG code:
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" opacity="0.07">
    <path d="M200,20 Q300,100 200,200 Q100,100 200,20Z" fill="#2D6A4F"/>
    <path d="M200,20 Q220,110 200,200 Q180,110 200,20Z" fill="#52B788"/>
    <path d="M100,60 Q200,80 200,200 Q80,160 100,60Z" fill="#2D6A4F" opacity="0.5"/>
    <path d="M300,60 Q200,80 200,200 Q320,160 300,60Z" fill="#2D6A4F" opacity="0.5"/>
    <line x1="200" y1="20" x2="200" y2="200" stroke="#52B788" strokeWidth="1"/>
    <line x1="200" y1="80" x2="150" y2="130" stroke="#52B788" strokeWidth="0.8"/>
    <line x1="200" y1="80" x2="250" y2="130" stroke="#52B788" strokeWidth="0.8"/>
    <line x1="200" y1="120" x2="160" y2="160" stroke="#52B788" strokeWidth="0.6"/>
    <line x1="200" y1="120" x2="240" y2="160" stroke="#52B788" strokeWidth="0.6"/>
  </svg>

## Component Specs

### Button
- bg: var(--green-deep)
- text: var(--cream)
- border-radius: 12px
- padding: 12px 28px
- font: DM Sans 500
- hover: opacity 0.88, transform scale(1.02), transition 300ms

### Card
- border-radius: 16px
- background: white
- box-shadow: 0 2px 12px rgba(45,106,79,0.10)
- border: 1.5px solid var(--green-mid) with leaf-vein SVG pattern overlay
- padding: 20px

### Input
- border: 1.5px solid var(--green-mid)
- border-radius: 10px
- padding: 10px 14px
- font: DM Sans
- focus outline: var(--green-deep)

### Chip (for cuisine/dietary tags)
- border-radius: 999px
- border: 1.5px solid var(--green-mid)
- selected bg: var(--green-deep), text: var(--cream)
- unselected bg: transparent, text: var(--green-deep)
- padding: 6px 16px
- font: DM Sans 500

### Badge (prep time / leftover)
- bg: var(--warm)
- text: white
- border-radius: 999px
- padding: 3px 10px
- font: DM Sans 500, size 12px

### EquipmentTile
- 80x80px square card variant
- centered icon + label below
- selected: border 2.5px solid var(--green-deep), bg: rgba(82,183,136,0.12)
- unselected: border 1.5px solid #ddd
