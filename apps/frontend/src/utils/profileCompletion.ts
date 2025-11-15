import { ProfileQuestion, ProfileSection } from '@/components/DynamicProfileForm';

/**
 * Calculate the completion percentage of a profile based on filled fields
 * @param formData - The current form data
 * @param questions - The profile questions structure
 * @returns Completion percentage (0-100)
 */
export function calculateProfileCompletion(
  formData: Record<string, any>,
  questions: { sections: ProfileSection[] } | null
): number {
  if (!questions || !questions.sections || questions.sections.length === 0) {
    return 0;
  }

  let totalFields = 0;
  let filledFields = 0;

  questions.sections.forEach((section) => {
    section.fields.forEach((field) => {
      // Check if field should be counted based on conditional rendering
      if (field.conditional) {
        const conditionValue = formData[field.conditional.field];
        if (conditionValue !== field.conditional.value) {
          return; // Skip this field
        }
      }

      totalFields++;

      // Check if field is filled
      const value = formData[field.id];
      if (isFieldFilled(value, field.type)) {
        filledFields++;
      }
    });
  });

  if (totalFields === 0) {
    return 0;
  }

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Check if a field value is considered "filled"
 * @param value - The field value
 * @param fieldType - The type of field
 * @returns True if the field is filled
 */
function isFieldFilled(value: any, fieldType: string): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  switch (fieldType) {
    case 'text':
    case 'email':
    case 'url':
    case 'tel':
    case 'textarea':
      return typeof value === 'string' && value.trim().length > 0;

    case 'select':
    case 'dropdown':
      return typeof value === 'string' && value.length > 0;

    case 'checkbox':
    case 'boolean':
    case 'toggle':
      return value === true;

    case 'multiselect':
      return Array.isArray(value) && value.length > 0;

    case 'number':
      return typeof value === 'number' || (typeof value === 'string' && value.trim().length > 0);

    case 'date':
      return value instanceof Date || (typeof value === 'string' && value.length > 0);

    default:
      // For unknown types, check if value exists and is not empty
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return Boolean(value);
  }
}

/**
 * Get completion status badge variant based on percentage
 * @param percentage - Completion percentage (0-100)
 * @returns Badge variant
 */
export function getCompletionBadgeVariant(
  percentage: number
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (percentage === 100) {
    return 'default'; // Green/success
  } else if (percentage >= 50) {
    return 'secondary'; // Yellow/warning
  } else if (percentage > 0) {
    return 'outline'; // Gray/in-progress
  } else {
    return 'destructive'; // Red/not-started
  }
}

/**
 * Get completion status text
 * @param percentage - Completion percentage (0-100)
 * @returns Status text
 */
export function getCompletionStatusText(percentage: number): string {
  if (percentage === 100) {
    return 'Complete';
  } else if (percentage >= 75) {
    return 'Almost Done';
  } else if (percentage >= 50) {
    return 'In Progress';
  } else if (percentage > 0) {
    return 'Started';
  } else {
    return 'Not Started';
  }
}

/**
 * Calculate required fields completion percentage
 * @param formData - The current form data
 * @param questions - The profile questions structure
 * @returns Required fields completion percentage (0-100)
 */
export function calculateRequiredFieldsCompletion(
  formData: Record<string, any>,
  questions: { sections: ProfileSection[] } | null
): number {
  if (!questions || !questions.sections || questions.sections.length === 0) {
    return 0;
  }

  let totalRequiredFields = 0;
  let filledRequiredFields = 0;

  questions.sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (!field.required) {
        return; // Skip optional fields
      }

      // Check if field should be counted based on conditional rendering
      if (field.conditional) {
        const conditionValue = formData[field.conditional.field];
        if (conditionValue !== field.conditional.value) {
          return; // Skip this field
        }
      }

      totalRequiredFields++;

      // Check if field is filled
      const value = formData[field.id];
      if (isFieldFilled(value, field.type)) {
        filledRequiredFields++;
      }
    });
  });

  if (totalRequiredFields === 0) {
    return 100; // No required fields means 100% complete
  }

  return Math.round((filledRequiredFields / totalRequiredFields) * 100);
}

/**
 * Check if all required fields are filled
 * @param formData - The current form data
 * @param questions - The profile questions structure
 * @returns True if all required fields are filled
 */
export function areRequiredFieldsFilled(
  formData: Record<string, any>,
  questions: { sections: ProfileSection[] } | null
): boolean {
  return calculateRequiredFieldsCompletion(formData, questions) === 100;
}

