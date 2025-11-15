# Profile View Quick Reference

## 🎯 Profile View Types

### 1. Current User Profile
**Route:** `/profile/current-user`
**Component:** `UnifiedProfiles`
**Layout:** Full-width, no sidebars
**Features:** Manage multiple profiles, create new profiles, view posts/bookmarks/comments

---

### 2. Single Profile View (NEW)
**Routes:** 
- `/profile/profile-2` - Tech Innovations Hub
- `/profile/profile-3` - EFF HGG - Mentor

**Component:** `SingleProfileView`
**Layout:** Dedicated, distraction-free
**Features:** View profile info, posts, about, activity, follow/message

---

### 3. Profile View (Fallback)
**Route:** `/profile/:id`
**Component:** `ProfileView`
**Layout:** With sidebars
**Features:** General profile viewing

---

## 📍 Navigation

### From Profiles Page
```
/profiles
  ↓ (Click profile card)
/profile/profile-2 (SingleProfileView)
```

### From Sidebar
```
Click profile link
  ↓
/profile/profile-2 (SingleProfileView)
```

### Back Navigation
```
/profile/profile-2
  ↓ (Click back button)
Previous page (using browser history)
```

---

## 🎨 Layout Comparison

### SingleProfileView (NEW)
```
┌─────────────────────────────────┐
│ Sticky Header (Back, Share)     │
├─────────────────────────────────┤
│ Cover Image                     │
├─────────────────────────────────┤
│ Profile Info                    │
│ - Avatar                        │
│ - Name, Type, Bio               │
│ - Location, Website, Joined     │
│ - Stats                         │
│ - Expertise Tags                │
│ - Follow/Message Buttons        │
├─────────────────────────────────┤
│ Tabs: Posts | About | Activity  │
├─────────────────────────────────┤
│ Tab Content                     │
└─────────────────────────────────┘
```

### ProfileView (Fallback)
```
┌──────────┬──────────────┬──────────┐
│ Sidebar  │ Profile Info │ Sidebar  │
│          │ - Avatar     │          │
│          │ - Name, Bio  │          │
│          │ - Stats      │          │
│          │ - Expertise  │          │
│          ├──────────────┤          │
│          │ Tabs Content │          │
│          │              │          │
└──────────┴──────────────┴──────────┘
```

---

## 📊 Supported Profiles

### Profile 2: Tech Innovations Hub
- **ID:** `profile-2`
- **Type:** Organization
- **URL:** `/profile/profile-2`
- **Location:** San Francisco, CA
- **Posts:** 78

### Profile 3: EFF HGG - Mentor
- **ID:** `profile-3`
- **Type:** Mentor
- **URL:** `/profile/profile-3`
- **Location:** Harare, Zimbabwe
- **Posts:** 23

---

## 🔧 Adding New Profiles

### Step 1: Add Profile Data
Edit `src/pages/SingleProfileView.tsx`:

```tsx
const profilesData: Record<string, any> = {
  "profile-4": {
    id: "profile-4",
    name: "New Profile Name",
    type: "Innovator",
    // ... other fields
  },
};
```

### Step 2: Add Route
Edit `src/App.tsx`:

```tsx
<Route path="/profile/profile-4" element={<SingleProfileView />} />
```

### Step 3: Test
Navigate to `/profile/profile-4`

---

## 🎯 Features

### Header
- Back button
- Profile name
- Post count
- Share button
- More options

### Profile Section
- Cover image
- Avatar
- Profile type badge
- Bio
- Meta info (location, website, joined)
- Stats (posts, connections, following)
- Expertise tags
- Follow/Message buttons

### Tabs
1. **Posts** - User's posts
2. **About** - Bio, types, expertise
3. **Activity** - Recent activity

---

## 🚀 Usage Examples

### View Profile 2
```
Click: /profiles → Profile Card → /profile/profile-2
```

### View Profile 3
```
Click: /profiles → Profile Card → /profile/profile-3
```

### Go Back
```
Click: Back Button → Previous Page
```

### Follow Profile
```
Click: Follow Button → Toggle Follow State
```

### Message Profile
```
Click: Message Button → Open Messages
```

---

## 📱 Responsive Behavior

- **Desktop:** Full layout with all features
- **Tablet:** Responsive grid, optimized spacing
- **Mobile:** Stacked layout, touch-friendly

---

## 🔗 Related Files

- `src/pages/SingleProfileView.tsx` - Main component
- `src/App.tsx` - Routes configuration
- `src/pages/Profiles.tsx` - Profiles listing page
- `src/pages/ProfileView.tsx` - Fallback profile view
- `src/pages/UnifiedProfiles.tsx` - Current user profiles

---

## ✅ Checklist

- [x] SingleProfileView component created
- [x] Routes configured
- [x] Profile data added
- [x] Sticky header working
- [x] Tabs functional
- [x] Responsive design
- [x] Navigation working
- [x] Auto-scroll to top

---

## 🎓 Next Steps

1. ✅ View `/profile/profile-2` - Tech Innovations Hub
2. ✅ View `/profile/profile-3` - EFF HGG - Mentor
3. ✅ Test back button navigation
4. ✅ Test follow/message buttons
5. ✅ Test tab switching
6. ✅ Test responsive design

---

**Status:** ✅ COMPLETE
**Ready:** ✅ YES

