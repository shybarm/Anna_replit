# Design Guidelines for Dr. Anna Brameli's Medical Website

## Design Approach
**Selected Approach:** Medical minimalism with high-end aesthetic  
**Key Principle:** Trustworthy, empathetic, and professional - balancing medical authority with approachability for parents and patients

## Core Design Elements

### Typography
- **Primary Font:** Heebo or Assistant (Google Fonts)
- **Hierarchy:**
  - H1: 48px (mobile: 36px) - Hero headlines
  - H2: 36px (mobile: 28px) - Section headers
  - H3: 24px (mobile: 20px) - Card titles, subsections
  - Body: 16px - Comfortable reading for medical content
  - Small: 14px - Captions, metadata
- **RTL Direction:** All text must flow right-to-left for Hebrew content

### Layout System
- **Spacing Units:** Tailwind units 4, 6, 8, 12, 16, 20, 24 (p-4, py-6, gap-8, mb-12, etc.)
- **Container:** max-w-7xl for main content areas
- **Grid Systems:** 
  - Services: 3-column grid on desktop (lg:grid-cols-3), 2-column tablet (md:grid-cols-2), single on mobile
  - News/Updates: 2-3 column cards
- **Section Padding:** py-16 (desktop), py-12 (mobile)

### Color Strategy
- **Primary Palette:** Soft teals (#4FD1C5 range), whites (#FFFFFF), warm sand/beige (#F7F4F0, #E8DFD6)
- **Medical Trust Colors:** Clean whites for backgrounds, teal for CTAs and accents
- **Text:** Dark gray for body text (#2D3748), lighter gray for secondary text (#718096)

### Component Library

#### Navigation
- **Sticky Header:** Fixed top navigation with sections: About, Services, Latest Updates, Q&A, Contact
- **Mobile:** Hamburger menu with full-screen overlay
- **Language:** All navigation in Hebrew with RTL alignment

#### Hero Section
- **Layout:** Full-width background with overlay
- **Image:** Large hero image featuring Dr. Anna (placeholder for professional photo)
- **Content:** Centered text with doctor's name, credentials, clear value proposition in Hebrew
- **CTA:** Primary button (blurred background) - "קבעו תור" (Book Appointment)
- **Height:** 85vh minimum for impact

#### Service Cards
- **Design:** Clean white cards with subtle shadows, rounded corners (rounded-lg)
- **Grid:** 3-column responsive grid
- **Content per card:** 
  - Icon (Lucide-react medical icons)
  - Service title (H3)
  - Brief description (2-3 lines)
  - Subtle hover elevation
- **Services:** Food Allergy, Asthma, Skin Conditions, Immunology, Pediatric Allergies, Adult Allergies

#### Latest Updates Section
- **Card Design:** News cards with image thumbnail, title, date, excerpt
- **Layout:** 2-3 column grid with consistent card heights
- **Data:** Mock JSON initially, with clear TODO comment for API integration
- **Visual:** Light background section to distinguish from other areas

#### AI Triage Bot
- **FAB Button:** Fixed bottom-right corner (floating action button)
- **Design:** Circular button with chat icon, soft teal background, subtle shadow
- **Chat Window:** 
  - Slides up from bottom-right
  - White background, rounded corners
  - Message bubbles: patient (left), bot (right, teal background)
  - Input field at bottom with send button
  - Close button in header
- **Size:** 400px wide × 600px tall (desktop), full-screen on mobile

#### Contact/Booking Section
- **Layout:** 2-column - Form left, clinic details right (stacks on mobile)
- **Form Fields:** Name, Phone, Email, Message, Preferred Date/Time
- **Clinic Details:** Address, Phone, Hours, Embedded map
- **CTA:** Primary button - "שלח הודעה" (Send Message)

#### Footer
- **Content:** Quick links, social media, credentials, copyright
- **Design:** Sand/beige background, centered content, minimal
- **Legal:** Privacy policy, terms of service links

### Animations
- **Principle:** Subtle and professional only
- **Usage:** 
  - Gentle fade-in on scroll for sections (Framer Motion)
  - Smooth transitions for navigation
  - Card hover elevations
  - Chat window slide animation
- **Avoid:** Distracting medical content with excessive motion

### Images
- **Hero Image:** Professional portrait of Dr. Anna in clinical setting (warm, approachable)
- **Service Icons:** Medical-themed Lucide icons (no custom SVGs)
- **News Thumbnails:** Placeholder medical imagery for article cards
- **Clinic Photo:** Optional image in contact section showing welcoming clinic environment

### Accessibility & RTL
- **Direction:** All layouts must support RTL (dir="rtl")
- **Contrast:** WCAG AA compliant text contrast ratios
- **Forms:** Clear labels, error states in Hebrew
- **Navigation:** Keyboard accessible, screen reader friendly

### Key Differentiators
- **Medical Authority:** Clean, uncluttered design conveys professionalism
- **Parent-Friendly:** Warm colors and approachable language
- **Action-Oriented:** Clear CTAs throughout - "קבעו תור", "צרו קשר עכשיו"
- **Educational:** Content explains conditions in accessible Hebrew, not clinical jargon