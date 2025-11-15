# Sidebar Layout - Visual Reference

## 📐 New Sidebar Structure

### Desktop View (Expanded)

```
┌─────────────────────────────────────┐
│                                     │
│  [Logo]                             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Avatar] EFF HGG            │   │
│  │ 🟢 Premium Member           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [+ Create Post]            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [🏠] [🔍] [📑] [💬]¹       │   │
│  │ Home Search Bookmarks Msgs  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Notifications & Feature Alerts     │
│  ┌─────────────────────────────┐   │
│  │ 🔔 Notifications        [3] │   │
│  │ ─────────────────────────── │   │
│  │ ⚡ You can now create...    │   │
│  │    [New]                    │   │
│  │    Manage different...      │   │
│  │ ─────────────────────────── │   │
│  │ ⭐ Event Registration       │   │
│  │    [Featured]               │   │
│  │    Register for upcoming... │   │
│  └─────────────────────────────┘   │
│  (Scrollable - max 300px)           │
│                                     │
│  © 2025 InnoConnect                 │
│                                     │
└─────────────────────────────────────┘
```

### Desktop View (Collapsed)

```
┌──────┐
│      │
│ [L]  │ Logo only
│      │
│ [🏠] │ Home icon
│ [🔍] │ Search icon
│ [📑] │ Bookmarks icon
│ [💬] │ Messages icon (with badge)
│      │
│      │ (Notifications & Alerts hidden)
│      │
│ ©    │ Footer (abbreviated)
│      │
└──────┘
```

---

## 🎨 Component Breakdown

### 1. Top Section (Always Visible)
- **Logo:** Smile Factory logo
- **User Info:** Avatar, name, status (only when expanded)
- **Create Post Button:** Full width button (text hidden when collapsed)

### 2. Horizontal Navigation Icons
- **Layout:** 4 icons in a row
- **Icons:** Home, Search, Bookmarks, Messages
- **Spacing:** Equal width (flex-1)
- **Badge:** Messages shows "1" badge
- **Active State:** Highlighted background
- **Hover State:** Light background

### 3. Notifications & Feature Alerts Card
- **Label:** "Notifications & Feature Alerts"
- **Container:** Outline border, rounded corners, light background
- **Max Height:** 300px (scrollable if content exceeds)
- **Content:**
  - Notifications item with badge (3)
  - Divider line
  - Feature alerts (max 2 shown)

### 4. Footer (When Expanded)
- **Text:** "© 2025 InnoConnect"
- **Hidden:** When sidebar is collapsed

---

## 📱 Mobile View

On mobile, the sidebar becomes a sheet/drawer:
- All content visible in drawer
- Notifications & Feature Alerts card fully visible
- Scrollable if content exceeds screen height
- Close button to dismiss drawer

---

## 🔄 Scrollable Container Details

### Notifications & Feature Alerts Card

**Container Styling:**
```
border rounded-lg p-3 bg-card/50 max-h-[300px] overflow-y-auto space-y-3
```

**Content:**
1. **Notifications Item**
   - Icon: Bell (🔔)
   - Text: "Notifications"
   - Badge: "3" (red)
   - Clickable link to /notifications

2. **Divider**
   - Horizontal line (h-px bg-border)
   - Separates notifications from alerts

3. **Feature Alerts**
   - Max 2 alerts shown
   - Each alert has:
     - Icon with color
     - Title
     - Badge (New, Featured, Popular)
     - Description
   - Scrollable if more than 2 alerts

---

## 🎯 Interaction Patterns

### Horizontal Icons
- **Click:** Navigate to respective page
- **Hover:** Light background highlight
- **Active:** Darker background highlight
- **Badge:** Shows unread count

### Notifications Item
- **Click:** Navigate to /notifications
- **Badge:** Shows count of unread notifications

### Feature Alerts
- **Click:** Can be used to expand/show details
- **Hover:** Border color changes
- **Scrollable:** If more than 2 alerts exist

---

## 📊 Responsive Behavior

### Desktop (md and up)
- Sidebar always visible
- Full width when expanded
- Icon-only when collapsed
- All content visible

### Mobile (below md)
- Sidebar as sheet/drawer
- Triggered by hamburger menu
- Full content visible
- Scrollable if needed

---

## 🎨 Color & Styling

### Active States
- **Background:** `bg-muted`
- **Text:** `text-foreground`
- **Font:** `font-medium`

### Hover States
- **Background:** `hover:bg-muted/50`
- **Text:** `text-muted-foreground`

### Badges
- **Variant:** `destructive` (red)
- **Size:** `h-5 w-5`
- **Shape:** `rounded-full`
- **Text:** `text-xs`

### Cards
- **Border:** `border`
- **Padding:** `p-3`
- **Background:** `bg-card/50`
- **Rounded:** `rounded-lg`

---

## 📐 Spacing

- **Logo Section:** `px-4 py-6`
- **Horizontal Icons:** `px-4 py-4`
- **Card Container:** `p-3`
- **Items:** `space-y-3`
- **Divider:** `h-px`

---

## 🔧 Key Features

✅ **Horizontal Navigation Icons**
- 4 main navigation items in a row
- Equal width distribution
- Active state highlighting
- Badge on Messages

✅ **Unified Notifications & Alerts**
- Single scrollable card
- Notifications item with badge
- Feature alerts below divider
- Max 2 alerts shown
- Scrollable if more content

✅ **Responsive Design**
- Works on desktop and mobile
- Collapses to icons only
- Drawer on mobile
- Touch-friendly

✅ **Clean Layout**
- Organized sections
- Clear visual hierarchy
- Proper spacing
- Outline design

---

## 🚀 Production Ready

✅ All components implemented
✅ Responsive design working
✅ Navigation functional
✅ Badges displaying
✅ Scrolling working
✅ No console errors

---

**Status:** ✅ COMPLETE AND TESTED
**Date:** October 16, 2025

