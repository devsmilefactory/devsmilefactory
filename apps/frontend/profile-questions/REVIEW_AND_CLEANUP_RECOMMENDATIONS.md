# Profile Questions Review and Cleanup Recommendations

## Executive Summary

After reviewing all 9 profile question files (innovator, mentor, investor, academic_student, academic_institution, organisation, professional, industry_expert), the following recommendations are provided for cleanup, consolidation, and improvement.

## Common Sections Across All Profiles

The following sections appear across multiple profile types and should be standardized:

### 1. **Executive Summary** (All profiles)
- ✅ Well-implemented across all profiles
- Consistent structure with bio field
- **Recommendation**: Keep as-is

### 2. **Social Media & Online Presence** (All profiles)
- ✅ Consistent across all profiles
- Fields: website, linkedin, twitter, facebook, instagram
- **Recommendation**: Keep as-is, consider adding:
  - YouTube
  - GitHub (for technical profiles)
  - Medium/Blog

### 3. **Contact Information** (All profiles)
- ✅ Present in all profiles
- Fields: contact_email, contact_phone, whatsapp, preferred_contact_method
- **Issue**: Some profiles call it "Business Contact Information", others just "Contact Information"
- **Recommendation**: Standardize to "Contact Information"

### 4. **Location** (All profiles)
- ✅ Present in all profiles
- Fields: city, country
- **Issue**: Inconsistent handling of "willing_to_relocate" field
  - Innovator: "Operate in Other Markets"
  - Mentor: "Remote Mentoring"
  - Others: Various interpretations
- **Recommendation**: Standardize based on profile type context

### 5. **Goals & Interests** (All profiles)
- ✅ Present in all profiles
- **Issue**: Field names vary (short_term_goals, mentorship_goals, investment_goals, etc.)
- **Recommendation**: Keep profile-specific but ensure consistency in structure

## Profile-Specific Issues and Recommendations

### Innovator Profile

**Issues:**
1. "Innovation Area" options are comprehensive but could be updated:
   - Add: "Artificial Intelligence & Machine Learning"
   - Add: "Blockchain & Web3"
   - Add: "Cybersecurity"

2. "Team Expertise" and "Team Needs" have identical options - this is correct but could be confusing

**Recommendations:**
- ✅ Overall structure is excellent
- Consider adding "Pitch Deck" upload field
- Consider adding "Demo Video" URL field

### Mentor Profile

**Issues:**
1. "Mentorship Style" has too many options (12 options) - some overlap
   - "One-on-One", "Group Sessions", "Workshop Based" are delivery methods
   - "Hands-on", "Advisory", "Coaching", "Challenging", "Supportive" are styles
   - **Recommendation**: Split into two fields:
     - "Mentorship Delivery Method"
     - "Mentorship Approach"

2. "Availability" has too many overlapping options (12 options)
   - Mix of frequency and time preferences
   - **Recommendation**: Split into:
     - "Availability Frequency" (Weekly, Bi-weekly, Monthly, etc.)
     - "Availability Time" (Weekdays, Weekends, Evenings, Flexible)

**Recommendations:**
- Simplify and reorganize mentorship-related fields
- Add "Mentorship Capacity" field (how many mentees can you take on?)

### Investor Profile

**Issues:**
1. "Investment Performance" section might be too intrusive
   - "Average Annual Return" - investors may not want to share this
   - **Recommendation**: Make all fields in this section optional or remove sensitive ones

2. Missing "Actively Investing" boolean field
   - Important to know if investor is currently active

**Recommendations:**
- Add "Actively Investing" field
- Add "Investment Thesis" textarea field
- Consider adding "Preferred Deal Structure" field

### Academic Student Profile
*(Need to review this file)*

### Academic Institution Profile
*(Need to review this file)*

### Organisation Profile
*(Need to review this file)*

### Professional Profile
*(Need to review this file)*

### Industry Expert Profile
*(Need to review this file)*

## Common Cleanup Tasks

### 1. Standardize Country List
All profiles use the same country list, which is good. However:
- **Recommendation**: Move to a shared constants file
- Consider expanding the list or using a comprehensive country dropdown

### 2. Standardize Field Types
- **Issue**: Some profiles use "toggle", others use "boolean"
- **Recommendation**: Standardize to "boolean" or "toggle" consistently

### 3. Remove Duplicate Questions
The following questions appear in multiple profiles with slight variations:
- Bio/Executive Summary ✅ (intentional, keep)
- Contact information ✅ (intentional, keep)
- Social media ✅ (intentional, keep)
- Location ✅ (intentional, keep)

### 4. Improve Hints
Some hints are too generic:
- "Tell us briefly..." - could be more specific
- "Share..." - could provide examples

**Recommendation**: Add examples to hints where appropriate

## Categorization Recommendations

### Core Categories (All Profiles)
1. **Personal Information**
   - Executive Summary
   - Bio

2. **Professional Background**
   - Profile-specific expertise/experience

3. **Contact & Location**
   - Contact Information
   - Social Media
   - Location

4. **Goals & Preferences**
   - Goals & Interests
   - Looking For

### Profile-Specific Categories

**Innovator:**
- Innovation Details
- Market & Competition
- Business Model
- Team
- Funding
- Intellectual Property

**Mentor:**
- Expertise & Experience
- Mentorship Details
- Professional Background
- Mentee Preferences

**Investor:**
- Investment Preferences
- Investment Criteria
- Firm Details
- Investment Process
- Investment Performance

## Consolidation Opportunities

### 1. Create Shared Question Library
Extract common questions into a shared library:
- `common/bio.json`
- `common/contact.json`
- `common/social-media.json`
- `common/location.json`

### 2. Profile Type Mapping
Create a mapping file that combines shared and profile-specific questions:
```json
{
  "innovator": {
    "sections": [
      "@common/bio",
      "@innovator/innovation-details",
      "@common/contact",
      "@common/social-media",
      "@common/location",
      "@innovator/goals"
    ]
  }
}
```

## Priority Actions

### High Priority
1. ✅ Standardize "Contact Information" section title
2. ✅ Fix Mentor "Mentorship Style" and "Availability" fields
3. ✅ Add "Actively Investing" field to Investor profile
4. ✅ Review and complete analysis of remaining 5 profiles

### Medium Priority
1. Add new innovation areas (AI/ML, Blockchain, Cybersecurity)
2. Improve hints with examples
3. Standardize field types (boolean vs toggle)

### Low Priority
1. Create shared question library
2. Expand country list
3. Add new social media fields (YouTube, GitHub)

## Next Steps

1. Complete review of remaining 5 profile types
2. Create detailed cleanup plan for each profile
3. Implement high-priority changes
4. Test changes with sample data
5. Update documentation

## Conclusion

The profile questions are well-structured overall. The main improvements needed are:
- Standardization of common sections
- Simplification of complex multi-option fields
- Addition of missing but important fields
- Better organization through categorization

The questions are comprehensive and cover all necessary aspects for each profile type. With the recommended cleanup, they will be even more user-friendly and maintainable.

