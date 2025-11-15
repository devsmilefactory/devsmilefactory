# Profile Wizard Enhancements

**Status:** ✅ COMPLETE  
**Date:** November 3, 2025  
**Features:** Profile Completion Tracking & Dynamic Profile Switching

---

## 🎯 Overview

This document describes the enhancements made to the Profile Wizard to add:

1. **Profile Completion Percentage Tracking** - Real-time calculation of how complete each profile is
2. **Dynamic Profile Switching** - Ability to switch between multiple profiles without losing progress
3. **Visual Progress Indicators** - Progress bars, badges, and completion status displays
4. **Smart Form Validation** - Submit button disabled until required fields are complete

---

## ✨ New Features

### 1. Profile Completion Percentage Calculation

**File:** `src/utils/profileCompletion.ts`

A comprehensive utility module that calculates profile completion based on filled fields.

#### Functions:

##### `calculateProfileCompletion(formData, questions): number`
- Calculates overall completion percentage (0-100)
- Counts all fields (required + optional)
- Handles conditional field rendering
- Returns percentage based on filled vs total fields

##### `calculateRequiredFieldsCompletion(formData, questions): number`
- Calculates completion of required fields only
- Used to determine if form can be submitted
- Returns 100% if no required fields exist

##### `areRequiredFieldsFilled(formData, questions): boolean`
- Quick check if all required fields are filled
- Returns true/false

##### `getCompletionStatusText(percentage): string`
- Returns human-readable status:
  - 100% → "Complete"
  - 75-99% → "Almost Done"
  - 50-74% → "In Progress"
  - 1-49% → "Started"
  - 0% → "Not Started"

##### `getCompletionBadgeVariant(percentage): BadgeVariant`
- Returns appropriate badge color based on completion
- Used for visual feedback

#### Field Type Support:

The utility intelligently checks if fields are "filled" based on their type:

- **Text fields** (text, email, url, tel, textarea): Non-empty string
- **Select/Dropdown**: Has selected value
- **Checkbox/Boolean**: Checked (true)
- **Multiselect**: Has at least one selection
- **Number**: Has numeric value
- **Date**: Has date value

#### Conditional Fields:

Fields with conditional rendering are only counted when their condition is met:

```typescript
{
  "id": "company_size",
  "label": "Company Size",
  "type": "select",
  "conditional": {
    "field": "has_company",
    "value": true
  }
}
```

---

### 2. Dynamic Profile Switching

**File:** `src/components/ProfileWizard.tsx`

Users can now switch between multiple selected profiles while maintaining progress on each.

#### Key Features:

##### Profile Switcher Dropdown
- Appears when user selects multiple profile types
- Shows all selected profiles with completion status
- Displays checkmark (✓) for completed profiles
- Shows percentage for incomplete profiles

##### Form Data Persistence
- Each profile's form data is stored separately
- Switching profiles preserves all entered data
- Can switch back and forth without losing progress

##### Smart Navigation
- After completing a profile, automatically moves to next incomplete profile
- Can manually switch to any profile at any time
- Wizard only completes when ALL profiles are done

#### Data Structure:

```typescript
interface ProfileFormData {
  [profileType: string]: {
    data: any;                    // Form field values
    isComplete: boolean;          // Whether profile is submitted
    completionPercentage: number; // 0-100
  };
}
```

#### Example Flow:

```
User selects: Innovator, Mentor, Investor
  ↓
Starts with Innovator (0%)
  ↓
Fills some fields → Innovator (45%)
  ↓
Switches to Mentor using dropdown
  ↓
Fills Mentor fields → Mentor (60%)
  ↓
Switches back to Innovator
  ↓
Previous data still there! → Innovator (45%)
  ↓
Completes Innovator → Innovator (100%) ✓
  ↓
Auto-switches to Mentor
  ↓
Completes Mentor → Mentor (100%) ✓
  ↓
Auto-switches to Investor
  ↓
Completes Investor → Investor (100%) ✓
  ↓
Wizard Complete! 🎉
```

---

### 3. Visual Progress Indicators

Multiple progress indicators provide clear feedback on completion status.

#### Overall Progress Bar (Wizard Level)

Located at the top of the wizard form:

- Shows completion across ALL selected profiles
- Example: "2 of 3 Complete" → 67%
- Green progress bar
- Badge showing completed count

#### Current Profile Progress Bar

Shows completion of the currently active profile:

- Separate progress bar for current profile
- Updates in real-time as fields are filled
- Shows percentage (0-100%)

#### Profile Completion Card

Prominent card at the top of each form showing:

- **Completion Badge**: Large percentage badge
  - Green (default) when 100%
  - Yellow (secondary) when < 100%
- **Status Text**: "Complete", "Almost Done", "In Progress", "Started", "Not Started"
- **Overall Progress Bar**: All fields (required + optional)
- **Required Fields Progress Bar**: Required fields only
- **Warning Message**: Shows when required fields incomplete

#### Profile Switcher Indicators

In the dropdown menu:
- ✓ Checkmark icon for completed profiles
- Percentage display for incomplete profiles
- Visual distinction between complete/incomplete

---

### 4. Smart Form Validation

**File:** `src/components/DynamicProfileForm.tsx`

Enhanced form validation ensures data quality.

#### Features:

##### Required Field Tracking
- Separate progress bar for required fields
- Submit button disabled until required fields complete
- Clear messaging: "Complete required fields to submit"

##### Real-Time Validation
- Completion percentage updates as user types
- Instant feedback on progress
- No need to click "Save" to see progress

##### Visual Feedback
- Required fields marked with red asterisk (*)
- Warning icon when required fields incomplete
- Disabled submit button with tooltip

##### Draft Saving
- Can save draft at any completion level
- Draft includes completion percentage
- Can resume later from any completion state

---

## 🔄 Updated Components

### ProfileWizard.tsx

**New State:**
```typescript
const [profileFormsData, setProfileFormsData] = useState<ProfileFormData>({});
```

**New Functions:**
- `handleProfileSwitch(profileType)` - Switch to different profile
- `updateProfileFormData(profileType, data, percentage)` - Update profile data
- Enhanced `handleFormSubmit()` - Checks all profiles complete before finishing
- Enhanced `handleSaveDraft()` - Includes completion percentage

**New UI Elements:**
- Profile switcher dropdown (when multiple profiles)
- Overall progress bar
- Current profile progress bar
- Completion count badge

---

### DynamicProfileForm.tsx

**New Props:**
```typescript
interface DynamicProfileFormProps {
  onFormChange?: (profileType, data, completionPercentage) => void;
  onSaveDraft: (data, completionPercentage) => Promise<void>;
}
```

**New State:**
```typescript
const [completionPercentage, setCompletionPercentage] = useState(0);
const [requiredCompletion, setRequiredCompletion] = useState(0);
```

**New Effects:**
- Auto-calculate completion on form data change
- Notify parent component of changes via `onFormChange`
- Update when switching profiles (initialData changes)

**New UI Elements:**
- Profile Completion Card (top of form)
- Overall progress bar
- Required fields progress bar
- Status badge and text
- Enhanced submit button with validation

---

## 📊 User Experience Improvements

### Before Enhancement:
- ❌ No visibility into completion progress
- ❌ Had to complete profiles sequentially
- ❌ Couldn't switch between profiles
- ❌ Lost data if navigated away
- ❌ No indication of required vs optional fields

### After Enhancement:
- ✅ Real-time completion percentage
- ✅ Switch between profiles freely
- ✅ All progress saved automatically
- ✅ Clear visual feedback on progress
- ✅ Separate tracking for required fields
- ✅ Smart validation prevents incomplete submissions
- ✅ Overall progress across all profiles

---

## 🎨 Visual Design

### Color Scheme:

**Completion Badges:**
- 100% → Green (success)
- 50-99% → Yellow (warning)
- 1-49% → Gray (in-progress)
- 0% → Red (not-started)

**Progress Bars:**
- Primary color (blue/brand)
- Height: 2px (subtle)
- Smooth animations

**Status Card:**
- Light primary background
- Primary border
- Prominent placement at top

---

## 🔧 Technical Implementation

### Completion Calculation Algorithm:

```typescript
1. Get all sections and fields from profile questions
2. For each field:
   a. Check if conditional rendering applies
   b. Skip if condition not met
   c. Check if field is filled based on type
   d. Increment counters
3. Calculate percentage: (filled / total) * 100
4. Round to nearest integer
```

### Form Data Flow:

```
User types in field
  ↓
handleFieldChange() updates formData
  ↓
useEffect detects formData change
  ↓
calculateProfileCompletion() runs
  ↓
setCompletionPercentage() updates state
  ↓
onFormChange() notifies parent (ProfileWizard)
  ↓
ProfileWizard updates profileFormsData
  ↓
UI re-renders with new percentage
```

### Profile Switching Flow:

```
User selects different profile from dropdown
  ↓
handleProfileSwitch() called
  ↓
setCurrentTypeIndex() updates active profile
  ↓
ProfileWizard re-renders
  ↓
DynamicProfileForm receives new initialData
  ↓
useEffect detects initialData change
  ↓
setFormData() loads saved data
  ↓
Form displays with previous progress
```

---

## 📝 Usage Examples

### Example 1: Single Profile

```tsx
<ProfileWizard open={true} />

// User selects: Innovator
// - No profile switcher shown (only 1 profile)
// - Shows completion percentage
// - Can save draft or complete
```

### Example 2: Multiple Profiles

```tsx
<ProfileWizard open={true} />

// User selects: Innovator, Mentor, Investor
// - Profile switcher dropdown appears
// - Overall progress: "0 of 3 Complete"
// - Can switch between profiles
// - Each profile maintains its own data
// - Wizard completes when all 3 are done
```

### Example 3: Partial Completion

```tsx
// User fills Innovator to 60%
// Switches to Mentor, fills to 40%
// Saves draft and closes browser

// Later:
// User logs back in
// firstLogin = true (wizard not completed)
// Wizard appears
// Innovator shows 60%, Mentor shows 40%
// Can continue from where they left off
```

---

## 🧪 Testing Checklist

- [x] Completion percentage calculates correctly
- [x] Required fields tracked separately
- [x] Profile switching preserves data
- [x] Submit button disabled when required fields incomplete
- [x] Progress bars update in real-time
- [x] Draft saving includes completion percentage
- [x] Wizard completes only when all profiles done
- [x] Visual indicators show correct status
- [x] Conditional fields handled correctly
- [x] Multiple profile types work together

---

## 🚀 Future Enhancements

1. **Profile Templates** - Pre-fill common fields based on profile type
2. **Field-Level Progress** - Show which sections are complete
3. **Auto-Save** - Automatically save draft every N seconds
4. **Resume Notification** - "You have incomplete profiles" banner
5. **Completion Rewards** - Badges/achievements for completing profiles
6. **Profile Comparison** - Side-by-side view of multiple profiles
7. **Bulk Edit** - Edit common fields across multiple profiles
8. **Import/Export** - Import profile data from LinkedIn/CV

---

## 📚 Related Files

**New Files:**
- `src/utils/profileCompletion.ts` - Completion calculation utilities

**Modified Files:**
- `src/components/ProfileWizard.tsx` - Profile switching and progress tracking
- `src/components/DynamicProfileForm.tsx` - Form validation and progress display

**Dependencies:**
- `@/components/ui/progress` - Progress bar component
- `@/components/ui/badge` - Badge component
- `@/components/ui/select` - Dropdown component

---

## 🎉 Summary

These enhancements transform the Profile Wizard from a simple sequential form into a sophisticated multi-profile management system with:

✅ **Real-time progress tracking**  
✅ **Flexible profile switching**  
✅ **Smart validation**  
✅ **Visual feedback**  
✅ **Data persistence**  
✅ **Professional UX**  

The wizard now provides a smooth, intuitive experience for users creating multiple profiles while maintaining data integrity and providing clear feedback on completion status.

---

**Implementation Complete!** 🎉

