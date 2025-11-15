# Image Download Guide for Features Section

## Current Image Repetition Problem

The Features section currently uses only 3 images repeated across 6 stakeholder types:

```
stakeholderImage1 (2148634783.jpg) - Used 5 times
stakeholderImage2 (image001-2.jpg) - Used 4 times
stakeholderImage3 (images (2).jpeg) - Used 5 times
```

## Solution: Download 5-7 New Images

### Step 1: Choose Free Stock Photo Sites

**Best Options:**
- **Unsplash** (unsplash.com) - Highest quality, no attribution required
- **Pexels** (pexels.com) - Great variety, free downloads
- **Pixabay** (pixabay.com) - Large library, free for commercial use

### Step 2: Search Terms to Use

Search for these terms on your chosen platform:

1. **"business team collaboration"** - For Innovators/Mentors
2. **"professional mentoring"** - For Mentors section
3. **"business conference"** - For Industry Experts
4. **"students learning together"** - For Academic Students
5. **"corporate meeting"** - For Academic Institutions
6. **"diverse team working"** - For Organizations
7. **"startup workspace"** - Alternative for Innovators

### Step 3: Download Images

**Recommended Settings:**
- Format: JPG or PNG
- Size: At least 1200x800px (for quality)
- License: Free for commercial use

### Step 4: Save to Project

1. Download images to your computer
2. Rename them clearly:
   - `team-collaboration.jpg`
   - `mentoring-session.jpg`
   - `business-conference.jpg`
   - `students-learning.jpg`
   - `corporate-meeting.jpg`
   - `diverse-team.jpg`
   - `startup-workspace.jpg`

3. Copy to: `src/assets/` folder

### Step 5: Update Landing.tsx

**Add imports at the top (after line 17):**

```tsx
import stakeholderImage4 from "@/assets/team-collaboration.jpg";
import stakeholderImage5 from "@/assets/mentoring-session.jpg";
import stakeholderImage6 from "@/assets/business-conference.jpg";
import stakeholderImage7 from "@/assets/students-learning.jpg";
import stakeholderImage8 from "@/assets/corporate-meeting.jpg";
import stakeholderImage9 from "@/assets/diverse-team.jpg";
import stakeholderImage10 from "@/assets/startup-workspace.jpg";
```

### Step 6: Replace Image References

**Find and replace in the Features section (lines 628-778):**

**Innovators (activeStakeholder === 0):**
- Line 628: Keep `stakeholderImage1` or replace with `stakeholderImage4`

**Mentors (activeStakeholder === 1):**
- Line 653: Replace `stakeholderImage2` with `stakeholderImage5`
- Line 658: Replace `stakeholderImage3` with `stakeholderImage6`

**Industry Experts (activeStakeholder === 2):**
- Line 681: Replace `stakeholderImage1` with `stakeholderImage7`

**Academic Students (activeStakeholder === 3):**
- Line 708: Replace `stakeholderImage3` with `stakeholderImage8`
- Line 712: Replace `stakeholderImage2` with `stakeholderImage9`
- Line 717: Replace `stakeholderImage1` with `stakeholderImage10`

**Academic Institutions (activeStakeholder === 4):**
- Line 741: Replace `stakeholderImage1` with `stakeholderImage4`
- Line 746: Replace `stakeholderImage2` with `stakeholderImage5`
- Line 751: Replace `stakeholderImage3` with `stakeholderImage6`

**Organizations (activeStakeholder === 5):**
- Line 778: Replace `stakeholderImage2` with `stakeholderImage7`

### Step 7: Test

1. Run `npm run dev`
2. Navigate to the Features section
3. Click through each stakeholder type
4. Verify all images display correctly
5. Check responsive design on mobile

## Quick Reference: Image Mapping

| Stakeholder | Current Images | New Images |
|---|---|---|
| Innovators | Image1 | Image4 (team-collaboration) |
| Mentors | Image2, Image3 | Image5, Image6 (mentoring, conference) |
| Industry Experts | Image1 | Image7 (business-conference) |
| Academic Students | Image3, Image2, Image1 | Image8, Image9, Image10 |
| Academic Institutions | Image1, Image2, Image3 | Image4, Image5, Image6 |
| Organizations | Image2 | Image7 (business-conference) |

## Alternative: Use URLs Instead

If you prefer not to download, you can use direct URLs from Unsplash:

```tsx
const stakeholderImage4 = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80";
const stakeholderImage5 = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80";
// etc.
```

**Note:** This requires internet connection and may have performance implications.

## Recommended: Use Local Files

Downloading and storing locally is better for:
- Performance (no external requests)
- Reliability (no broken links)
- Offline functionality
- Faster load times

