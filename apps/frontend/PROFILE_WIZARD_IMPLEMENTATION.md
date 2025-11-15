# Profile Wizard Implementation

**Status:** ✅ COMPLETE  
**Date:** November 2, 2025  
**Feature:** First-Login Profile Creation Wizard with Blocking Modal

---

## 🎯 Overview

This document describes the implementation of a comprehensive profile creation wizard that:
1. **Blocks access** to the platform until users select at least one profile type
2. **Tracks first login** to determine when to show the wizard
3. **Allows partial completion** - users can save drafts and complete later
4. **Uses dynamic forms** generated from profile questions JSON files
5. **Supports multiple profiles** - users can create multiple profile types in one session

---

## ✅ Implementation Details

### 1. Database Changes

**Migration File:** `backend/database/migrations/002_add_first_login_and_draft.sql`

**Changes:**
- Added `first_login` boolean column to `user_accounts` table (default: TRUE)
- Added `draft_data` JSONB column to `profiles` table for storing partial form data
- Added indexes for performance
- Existing users set to `first_login = FALSE`

**SQL:**
```sql
ALTER TABLE user_accounts ADD COLUMN first_login BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN draft_data JSONB DEFAULT '{}'::jsonb;
CREATE INDEX idx_user_accounts_first_login ON user_accounts(first_login) WHERE first_login = TRUE;
CREATE INDEX idx_profiles_draft_data ON profiles USING GIN (draft_data);
```

---

### 2. Backend Changes

#### Auth Service Updates

**Files Modified:**
- `backend/services/auth-service/src/modules/auth/interfaces/auth.interface.ts`
- `backend/services/auth-service/src/modules/auth/dto/auth-response.dto.ts`
- `backend/services/auth-service/src/modules/auth/services/auth.service.ts`
- `backend/services/auth-service/src/modules/auth/controllers/auth.controller.ts`

**Key Changes:**

1. **IUserAccount Interface** - Added `firstLogin: boolean` field

2. **AuthResponseDto** - Added `firstLogin: boolean` field to response

3. **AuthService.verifyOtp()** - Now returns `firstLogin` flag in response

4. **New Method: markFirstLoginComplete()**
   ```typescript
   private async markFirstLoginComplete(userAccountId: string): Promise<void>
   ```

5. **New Method: completeWizard()**
   ```typescript
   async completeWizard(userId: string): Promise<{ message: string }>
   ```

6. **New Endpoint:** `POST /auth/complete-wizard`
   - Marks the wizard as complete
   - Sets `first_login = false` in database
   - Requires JWT authentication

**API Response Example:**
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": { "id": "...", "email": "..." },
    "profiles": [...],
    "isNewUser": true,
    "firstLogin": true  // NEW FIELD
  }
}
```

---

### 3. Frontend Changes

#### Auth Store Updates

**File:** `src/stores/authStore.ts`

**Changes:**
1. Added `firstLogin: boolean` to state
2. Added `completeWizard()` action
3. Updated `verifyOtp()` to extract `firstLogin` from response
4. Updated persistence to include `firstLogin`

**New Action:**
```typescript
completeWizard: async () => {
  await api.post('/auth/complete-wizard', {}, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  set({ firstLogin: false });
}
```

---

#### Profiles Store Updates

**File:** `src/stores/profilesStore.ts`

**Changes:**
1. Added `draftData?: any` to `CreateProfileData` interface
2. Added `[key: string]: any` to allow additional form fields

---

#### New Components

##### 1. ProfileTypeSelector Component

**File:** `src/components/ProfileTypeSelector.tsx`

**Purpose:** First step of wizard - allows users to select profile type(s)

**Features:**
- Grid layout with 7 profile type cards
- Multi-select support (users can select multiple types)
- Visual feedback with checkmarks for selected types
- Disabled "Continue" button until at least one type is selected
- Responsive design (1 column mobile, 2 tablet, 3 desktop)

**Profile Types:**
1. Innovator
2. Mentor
3. Investor
4. Academic Student
5. Academic Institution
6. Organization
7. Professional

**Props:**
```typescript
interface ProfileTypeSelectorProps {
  onSelect: (selectedTypes: ProfileType[]) => void;
  selectedTypes?: ProfileType[];
}
```

---

##### 2. DynamicProfileForm Component

**File:** `src/components/DynamicProfileForm.tsx`

**Purpose:** Generates dynamic forms from profile questions JSON files

**Features:**
- Loads profile questions from `/profile-questions/{profileType}.json`
- Renders fields based on question type (text, textarea, select, checkbox, multiselect)
- Supports conditional field rendering
- Save draft functionality
- Form validation
- Loading states

**Supported Field Types:**
- `text`, `email`, `url`, `tel` → Input component
- `textarea` → Textarea component
- `select`, `dropdown` → Select component
- `checkbox`, `boolean`, `toggle` → Checkbox component
- `multiselect` → Multiple checkboxes

**Props:**
```typescript
interface DynamicProfileFormProps {
  profileType: ProfileType;
  onSubmit: (data: any) => Promise<void>;
  onSaveDraft: (data: any) => Promise<void>;
  initialData?: any;
}
```

**JSON Structure Expected:**
```json
{
  "sections": [
    {
      "id": "executive_summary",
      "title": "Executive Summary",
      "description": "Brief overview",
      "fields": [
        {
          "id": "bio",
          "label": "Bio",
          "type": "textarea",
          "hint": "Tell us about yourself",
          "required": true
        }
      ]
    }
  ]
}
```

---

##### 3. ProfileWizard Component

**File:** `src/components/ProfileWizard.tsx`

**Purpose:** Main wizard component that orchestrates the multi-step flow

**Features:**
- **Blocking modal** - Cannot be dismissed (no ESC, no outside click)
- **Two-step flow:**
  1. Profile type selection
  2. Form completion for each selected type
- **Progress tracking** - Shows "Profile X of Y"
- **Draft saving** - Saves partial data to `draft_data` field
- **Auto-completion** - Calls `completeWizard()` after all profiles created
- **Loading states** - Shows spinner during submission

**Flow:**
```
Step 1: Select Profile Types
  ↓
Step 2: Complete Form for Type 1
  ↓
Step 2: Complete Form for Type 2 (if multiple selected)
  ↓
...
  ↓
Complete Wizard → Set firstLogin = false
```

**Props:**
```typescript
interface ProfileWizardProps {
  open: boolean;
}
```

---

#### Layout Integration

**File:** `src/components/Layout.tsx`

**Changes:**
1. Import `ProfileWizard` and `useAuthStore`
2. Get `firstLogin` and `isAuthenticated` from auth store
3. Render wizard when `isAuthenticated && firstLogin`

**Code:**
```tsx
{isAuthenticated && firstLogin && <ProfileWizard open={true} />}
```

**Positioning:**
- Rendered at top level (before main content)
- Blocks all interaction with the platform
- Cannot be dismissed until profile type is selected

---

## 🔄 User Flow

### First-Time User Journey

1. **User signs up** with email + OTP
2. **Backend creates account** with `first_login = TRUE`
3. **Auth response** includes `firstLogin: true`
4. **Frontend redirects** to feed
5. **ProfileWizard appears** as blocking modal
6. **User selects** one or more profile types
7. **For each profile type:**
   - Dynamic form loads from JSON
   - User fills in details
   - Can save draft or complete
8. **After all profiles created:**
   - `completeWizard()` called
   - `first_login` set to FALSE
   - Modal closes
   - User can access platform

### Returning User Journey

1. **User logs in** with email + OTP
2. **Backend returns** `firstLogin: false`
3. **No wizard shown**
4. **User accesses** platform normally

---

## 📁 File Structure

```
backend/
├── database/
│   └── migrations/
│       └── 002_add_first_login_and_draft.sql (NEW)
└── services/
    └── auth-service/
        └── src/
            └── modules/
                └── auth/
                    ├── interfaces/auth.interface.ts (MODIFIED)
                    ├── dto/auth-response.dto.ts (MODIFIED)
                    ├── services/auth.service.ts (MODIFIED)
                    └── controllers/auth.controller.ts (MODIFIED)

src/
├── components/
│   ├── ProfileTypeSelector.tsx (NEW)
│   ├── DynamicProfileForm.tsx (NEW)
│   ├── ProfileWizard.tsx (NEW)
│   └── Layout.tsx (MODIFIED)
└── stores/
    ├── authStore.ts (MODIFIED)
    └── profilesStore.ts (MODIFIED)
```

---

## 🚀 How to Use

### 1. Run Database Migration

```sql
-- In Supabase SQL Editor
-- Run: backend/database/migrations/002_add_first_login_and_draft.sql
```

### 2. Restart Backend Services

```bash
cd backend/services/auth-service
npm run dev

cd backend/services/user-service
npm run dev
```

### 3. Test the Flow

1. Create a new account (sign up)
2. Verify OTP
3. **Wizard should appear immediately**
4. Select at least one profile type
5. Fill in the form (or save draft)
6. Complete the wizard
7. **Wizard should close and not appear again**

---

## 🎨 UI/UX Features

### Blocking Behavior

- ✅ Modal cannot be closed with ESC key
- ✅ Modal cannot be closed by clicking outside
- ✅ No close button provided
- ✅ User MUST select at least one profile type
- ✅ "Continue" button disabled until selection made

### Visual Feedback

- ✅ Selected profile types show checkmark icon
- ✅ Selected cards have primary border
- ✅ Progress indicator shows "Profile X of Y"
- ✅ Loading spinners during submission
- ✅ Toast notifications for success/error
- ✅ Warning message when no type selected

### Accessibility

- ✅ Keyboard navigation supported
- ✅ Clear labels and hints
- ✅ Required fields marked with asterisk
- ✅ Error messages displayed
- ✅ Responsive design for all screen sizes

---

## 🔧 Configuration

### Profile Questions Location

Profile questions JSON files must be in:
```
public/profile-questions/{profileType}.json
```

**Required files:**
- `innovator.json`
- `mentor.json`
- `investor.json`
- `academic_student.json`
- `academic_institution.json`
- `organization.json`
- `professional.json`

### Customization

**To add a new profile type:**
1. Add to `ProfileType` enum in `ProfileTypeSelector.tsx`
2. Add to `profileTypes` array with title and description
3. Create corresponding JSON file in `public/profile-questions/`
4. Update backend `ProfileType` enum

**To modify form fields:**
1. Edit the corresponding JSON file in `public/profile-questions/`
2. No code changes needed - form is dynamically generated

---

## 📝 Notes

### Draft Data Storage

- Draft data is stored in `profiles.draft_data` JSONB column
- Can be retrieved later to resume form completion
- Currently not implemented in UI (future enhancement)

### Multiple Profiles

- Users can select multiple profile types in one session
- Each profile is created sequentially
- Wizard only completes after ALL profiles are created
- Users can add more profiles later from their profile page

### Error Handling

- Network errors show toast notification
- Form validation errors shown inline
- Failed profile creation allows retry
- Draft save failures don't block completion

---

## 🎯 Success Criteria

✅ First-time users CANNOT access platform without selecting profile type  
✅ Wizard appears immediately after signup  
✅ Wizard does NOT appear for returning users  
✅ Users can select multiple profile types  
✅ Forms are dynamically generated from JSON  
✅ Users can save drafts (partial completion)  
✅ Wizard completes only after profile type selected  
✅ `first_login` flag properly tracked in database  

---

## 🔮 Future Enhancements

1. **Resume Draft** - Allow users to resume incomplete profiles
2. **Profile Completion Percentage** - Show progress bar
3. **Skip Optional Sections** - Allow skipping non-required sections
4. **Profile Preview** - Show preview before final submission
5. **Guided Tour** - Show platform tour after wizard completion
6. **Profile Templates** - Pre-fill common fields based on profile type
7. **Bulk Import** - Import profile data from LinkedIn/CV

---

## 🐛 Known Issues

None at this time.

---

## 📚 Related Documentation

- [AUTH_AND_PROFILES_IMPLEMENTATION.md](./AUTH_AND_PROFILES_IMPLEMENTATION.md) - Main auth implementation
- [REVIEW_AND_CLEANUP_RECOMMENDATIONS.md](./profile-questions/REVIEW_AND_CLEANUP_RECOMMENDATIONS.md) - Profile questions review
- [backend/database/README.md](./backend/database/README.md) - Database setup guide

---

**Implementation Complete!** 🎉

