# 🎨 Visual Design Guide - WorkLedger Enhanced

## Color Palette

### Primary Brand Colors
```
Teal (#2B9D8F)
├── Primary: hsl(173, 80%, 40%)
├── Hover: hsl(173, 80%, 35%)
└── Light: hsl(173, 50%, 95%)

Cyan (#4DB8A3)
└── Secondary: hsl(195, 80%, 45%)
```

### Neutral Colors
```
White (#FFFFFF)
Dark Gray (#1F2937)
Light Gray (#F3F4F6)
Muted Gray (#9CA3AF)
```

### Status Colors
```
Success (Green):      #22c55e (hsl(142, 76%, 36%))
Warning (Amber):      #f59e0b (hsl(38, 92%, 50%))
Danger (Red):         #ef4444 (hsl(0, 84%, 60%))
Info (Blue):          #3b82f6 (hsl(217, 91%, 60%))
```

---

## Typography System

### Heading Hierarchy
```
H1: Poppins, 2.5rem, Weight 700, Letter-spacing -0.02em
    "WorkLedger Dashboard"

H2: Poppins, 2rem, Weight 700, Letter-spacing -0.02em
    "Team Overview"

H3: Poppins, 1.5rem, Weight 600
    "Project Performance"

H4: Poppins, 1.25rem, Weight 600
    "Monthly Salary"

H5: Poppins, 1rem, Weight 600
    "Status Information"

H6: Poppins, 0.875rem, Weight 600
    "Additional Notes"
```

### Body Typography
```
Body Text:    Inter, 1rem, Weight 400
              "Professional project management system"

Label:        Inter, 0.875rem, Weight 500
              "Monthly Salary"

Caption:      Inter, 0.75rem, Weight 400, Muted gray
              "Updated 2 hours ago"

Code/Data:    Monospace, 0.875rem
              "₹99,500"
```

---

## Component Styles

### Cards
```
╔════════════════════════════════════════╗
║  Project Title                 [Badge] ║  
║                                        ║  
║  Card with rounded corners             ║  
║  Soft shadow for depth                 ║  
║  Smooth hover elevation                ║  
║                                        ║  
║  ✓ 2rem border radius                  ║  
║  ✓ 24px padding                        ║  
║  ✓ Shadow: 0 2px 8px rgba(0,0,0,0.06) ║  
║  ✓ Hover: +10px shadow                 ║  
╚════════════════════════════════════════╝

Hover Effect:
- Translate Y: -2px (lift up)
- Shadow increase: 0 12px 24px rgba(0,0,0,0.12)
- Timing: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### Buttons

#### Primary Button
```
╔════════════════════╗
║  Sign In           ║  ← Gradient background
║                    ║  ← 1.5rem rounded corners
╚════════════════════╝     ← Soft shadow with glow

Colors: Linear gradient (Teal → Cyan)
Padding: 12px vertical, 24px horizontal
Font: Inter, Semi-bold (600)
Shadow: 0 4px 12px rgba(43, 157, 143, 0.25)

Hover States:
├── Transform: translateY(-2px)
├── Shadow: 0 8px 20px rgba(43, 157, 143, 0.35)
└── Transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)

Active States:
└── Transform: translateY(0)
```

#### Secondary Button
```
╔════════════════════╗
║  Cancel            ║  ← Outline style
║                    ║  ← Light background
╚════════════════════╝

Colors: Slate gray outline, white background
Padding: 12px vertical, 24px horizontal
Border: 1px solid #e5e7eb
Font: Inter, Semi-bold (600)

Hover States:
├── Background: Muted gray
├── Border: Primary color with opacity
└── Shadow: 0 4px 12px rgba(0,0,0,0.12)
```

### Input Fields
```
┌──────────────────────────────────┐
│ Email Address                  ✓ │  ← Label above
├──────────────────────────────────┤  ← Focus ring
│ user@example.com            [₹]  │  ← Currency symbol
└──────────────────────────────────┘

Border Radius: 1rem
Padding: 12px
Border: 1px solid #e5e7eb

Focus States:
├── Border Color: Primary (#2B9D8F)
├── Ring: 0 0 0 2px rgba(43, 157, 143, 0.1)
└── Background: White
```

### Badges/Chips
```
┌─────────────────┐
│ ✓ Active        │  ← Filled style
└─────────────────┘

┌─────────────────┐
│ • In Progress   │  ← Outline style
└─────────────────┘

Padding: 3px 12px
Border Radius: 1rem (pill-shaped)
Font: 0.75rem, Weight 600
```

### Tables
```
┌─────────────────┬──────────────┬───────────────┐
│ WORKER NAME     │ ROLE         │ SALARY        │  ← Uppercase header
├─────────────────┼──────────────┼───────────────┤
│ John Doe        │ Architect    │ ₹1,50,000     │
├─────────────────┼──────────────┼───────────────┤  ← Hover: slight BG change
│ Jane Smith      │ Developer    │ ₹1,20,000     │
├─────────────────┼──────────────┼───────────────┤
│ Mike Johnson    │ Designer     │ ₹90,000       │
└─────────────────┴──────────────┴───────────────┘

Header:
├── Background: rgba(43, 157, 143, 0.05)
├── Font: 600 weight, uppercase
└── Border: 2px bottom, #e5e7eb

Row Hover:
├── Background: rgba(43, 157, 143, 0.05)
└── Transition: 200ms smooth

Padding: 16px vertical, 16px horizontal
Border: 1px solid #e5e7eb
```

---

## Spacing Scale

```
XS: 4px  (0.25rem)
SM: 8px  (0.5rem)
MD: 12px (0.75rem)
LG: 16px (1rem)
XL: 24px (1.5rem)
2XL: 32px (2rem)
3XL: 48px (3rem)
4XL: 64px (4rem)

Component Spacing:
├── Button padding: 12px × 24px (MD × XL)
├── Card padding: 24px (XL)
├── Input padding: 12px (MD)
├── Gap between items: 12px (MD) or 16px (LG)
└── Page margin: 16-24px (LG-XL)
```

---

## Border Radius Scale

```
Card:       2rem (32px)     - Large, modern
Button:     1.5rem (24px)   - Friendly, smooth
Input:      1rem (16px)     - Clean, modern
Small:      0.75rem (12px)  - Subtle rounding
Tiny:       0.5rem (8px)    - Minimal
None:       0px             - Sharp edges (rare)
```

---

## Shadow System

### Shadows by Depth

```
Level 1 (Subtle):
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  Usage: Cards, inputs at rest

Level 2 (Medium):
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  Usage: Buttons hover, card hover initial

Level 3 (Strong):
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  Usage: Modals, dropdowns

Level 4 (Maximum):
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.30);
  Usage: Important modals, elevated panels
```

### Glow Effects

```
Primary Glow:
  box-shadow: 0 4px 12px rgba(43, 157, 143, 0.25);
  Usage: Primary buttons

Info Glow:
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  Usage: Info elements
```

---

## Transitions & Animations

### Timing Functions
```
Standard:    cubic-bezier(0.4, 0, 0.2, 1)
Ease Out:    cubic-bezier(0.2, 1, 0.2, 1)
Ease In Out: cubic-bezier(0.4, 0, 0.6, 1)
Natural:     cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

### Duration Scale
```
Fast:    150ms - Quick interactions (opacity changes)
Normal:  300ms - Standard transitions (hover states)
Slow:    500ms - Page transitions
Slower:  1000ms+ - Complex animations
```

### Common Animations
```
Hover Lift:
├── Transform: translateY(-2px)
├── Duration: 300ms
└── Easing: cubic-bezier(0.4, 0, 0.2, 1)

Fade In:
├── Opacity: 0 → 1
├── Duration: 500ms
└── Easing: ease-out

Scale In:
├── Transform: scale(0.95) → scale(1)
├── Duration: 300ms
└── Easing: ease-out

Slide Up:
├── Transform: translateY(20px) → translateY(0)
├── Opacity: 0 → 1
├── Duration: 500ms
└── Easing: ease-out
```

---

## Currency Formatting

### Display Format
```
₹999              (thousands)
₹1,499            (with comma)
₹25,000           (proper separator)
₹1,50,000         (Indian format)
₹12,34,56,789     (large amounts)
```

### Input Fields
```
┌──────────────────────┐
│ ₹ │ 50000            │  ← Symbol on left
└──────────────────────┘

Format: Currency symbol (₹) + number with separators
Locale: en-IN (Indian English)
Currency: INR
```

---

## Responsive Breakpoints

```
Mobile (< 600px):
├── Font sizes: Smaller
├── Padding: Reduced
├── Card width: Full width minus margin
└── Stack elements vertically

Tablet (600px - 960px):
├── Two-column layouts
├── Larger padding
├── Better spacing
└── Readable fonts

Desktop (960px+):
├── Multi-column layouts
├── Optimal spacing
├── Full typography
└── Enhanced interactions
```

---

## Dark Mode

### Color Adjustments
```
Light Mode → Dark Mode

White Background → Dark Gray (#1a1a1a)
Dark Text → Light Text
Light Cards → Dark Cards
Soft shadows → Subtle dark shadows
Colors maintain saturation
```

### Dark Mode Implementation
```css
.dark {
  --background: 222 47% 6%;
  --foreground: 210 20% 95%;
  --card: 222 47% 9%;
  /* ... etc ... */
}
```

---

## Accessibility

### Color Contrast
```
✓ Text on background: 7:1 ratio (AAA)
✓ Borders: 3:1 ratio minimum
✓ Icons: 3:1 ratio minimum
✓ Focus indicators: Bright, visible
```

### Focus States
```
┌────────────────────┐
│ Focused Button     │  ← 2px solid ring
│ (outline)          │     Ring color: Primary
└────────────────────┘

All interactive elements have visible focus states.
No elements lose focus outlines.
```

---

## Component Usage Examples

### Stat Card
```
╔════════════════════════════════╗
║ Total Monthly Cost      [💰]   ║
║                                ║
║ ₹25,43,500                     ║
║                                ║
║ ↑ 12% vs last month            ║
╚════════════════════════════════╝
```

### Project Card
```
╔════════════════════════════════╗
║ Mobile App Redesign   [Active] ║
║                                ║
║ Status: In Progress (65%)      ║
║ ████████░░░░░░░░░░░░░░░░      ║
║                                ║
║ Team: 5 members                ║
║ Budget: ₹5,00,000             ║
║                                ║
║ [View Details]    [Edit]       ║
╚════════════════════════════════╝
```

### Data Table
```
WORKER NAME      ROLE              SALARY        PROJECTS
John Doe         Architect         ₹1,50,000     3
Jane Smith       Developer         ₹1,20,000     5
Mike Johnson     Designer          ₹90,000       2
```

---

## Design Tokens Summary

```
Colors:       16 primary colors + status colors
Typography:  2 font families, 7 sizes, 4 weights
Spacing:     6 size units
Radius:      5 radius sizes
Shadows:     4 shadow depths + glow
Durations:   4 animation speeds
Easing:      4 timing functions
```

---

## Quick Reference Card

```
WORKLEDGER DESIGN SYSTEM

Primary Color:    #2B9D8F (Teal)
Secondary Color:  #E5E7EB (Gray)

Headings:         Poppins, Bold (700)
Body:             Inter, Regular (400)

Card Radius:      2rem
Button Radius:    1.5rem

Button Padding:   12px vertical, 24px horizontal
Card Padding:     24px

Shadow Light:     0 2px 8px rgba(0,0,0,0.06)
Shadow Heavy:     0 12px 24px rgba(0,0,0,0.15)

Transition:       300ms cubic-bezier(0.4, 0, 0.2, 1)

Breakpoint Mobile:  < 600px
Breakpoint Tablet:  600px - 960px
Breakpoint Desktop: > 960px

Currency:         Indian Rupee (₹)
Locale:          en-IN
```

---

**Design System Version**: 1.0  
**Last Updated**: January 13, 2026  
**Status**: Production Ready ✅
