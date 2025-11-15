import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProfileType } from './ProfileTypeSelector';
import { Loader2, Save } from 'lucide-react';
import {
  calculateProfileCompletion,
  calculateRequiredFieldsCompletion,
  getCompletionStatusText
} from '@/utils/profileCompletion';

export interface ProfileQuestion {
  id: string;
  label: string;
  type: string;
  hint?: string;
  required?: boolean;
  options?: string[] | { value: string; label: string }[];
  conditional?: {
    field: string;
    value: any;
  };
}

export interface ProfileSection {
  id: string;
  title: string;
  description?: string;
  fields: ProfileQuestion[];
}

export interface ProfileQuestions {
  sections: ProfileSection[];
}

interface DynamicProfileFormProps {
  profileType: ProfileType;
  onSubmit: (data: any) => Promise<void>;
  onSaveDraft: (data: any, completionPercentage: number) => Promise<void>;
  initialData?: any;
  onFormChange?: (profileType: ProfileType, data: any, completionPercentage: number) => void;
}

export function DynamicProfileForm({
  profileType,
  onSubmit,
  onSaveDraft,
  initialData = {},
  onFormChange
}: DynamicProfileFormProps) {
  const [formData, setFormData] = useState<any>(initialData);
  const [questions, setQuestions] = useState<ProfileQuestions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [requiredCompletion, setRequiredCompletion] = useState(0);

  // Load profile questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch(`/profile-questions/${profileType}.json`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Failed to load profile questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [profileType]);

  // Update form data when initialData changes (profile switching)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData, profileType]);

  // Calculate completion percentage whenever form data or questions change
  useEffect(() => {
    if (questions) {
      const overall = calculateProfileCompletion(formData, questions);
      const required = calculateRequiredFieldsCompletion(formData, questions);

      setCompletionPercentage(overall);
      setRequiredCompletion(required);

      // Notify parent of form changes
      if (onFormChange) {
        onFormChange(profileType, formData, overall);
      }
    }
  }, [formData, questions, profileType, onFormChange]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      await onSaveDraft(formData, completionPercentage);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const renderField = (field: ProfileQuestion) => {
    const value = formData[field.id] || '';

    // Check conditional rendering
    if (field.conditional) {
      const conditionValue = formData[field.conditional.field];
      if (conditionValue !== field.conditional.value) {
        return null;
      }
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'tel':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.hint}
              required={field.required}
            />
            {field.hint && (
              <p className="text-sm text-muted-foreground">{field.hint}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.hint}
              required={field.required}
              rows={4}
            />
            {field.hint && (
              <p className="text-sm text-muted-foreground">{field.hint}</p>
            )}
          </div>
        );

      case 'select':
      case 'dropdown':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleFieldChange(field.id, val)}
              required={field.required}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.hint || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => {
                  const optionValue = typeof option === 'string' ? option : option.value;
                  const optionLabel = typeof option === 'string' ? option : option.label;
                  return (
                    <SelectItem key={optionValue} value={optionValue}>
                      {optionLabel}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {field.hint && (
              <p className="text-sm text-muted-foreground">{field.hint}</p>
            )}
          </div>
        );

      case 'checkbox':
      case 'boolean':
      case 'toggle':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value === true}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
            <Label htmlFor={field.id} className="cursor-pointer">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                const isChecked = Array.isArray(value) && value.includes(optionValue);

                return (
                  <div key={optionValue} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.id}-${optionValue}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const currentValues = Array.isArray(value) ? value : [];
                        const newValues = checked
                          ? [...currentValues, optionValue]
                          : currentValues.filter((v) => v !== optionValue);
                        handleFieldChange(field.id, newValues);
                      }}
                    />
                    <Label htmlFor={`${field.id}-${optionValue}`} className="cursor-pointer">
                      {optionLabel}
                    </Label>
                  </div>
                );
              })}
            </div>
            {field.hint && (
              <p className="text-sm text-muted-foreground">{field.hint}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="text-center p-12">
        <p className="text-muted-foreground">Failed to load profile questions.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Completion Status Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Profile Completion</h3>
                <p className="text-sm text-muted-foreground">
                  {getCompletionStatusText(completionPercentage)}
                </p>
              </div>
              <Badge
                variant={completionPercentage === 100 ? 'default' : 'secondary'}
                className="text-lg px-4 py-2"
              >
                {completionPercentage}%
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Required Fields</span>
                <span className="font-medium">{requiredCompletion}%</span>
              </div>
              <Progress value={requiredCompletion} className="h-2" />
            </div>

            {requiredCompletion < 100 && (
              <p className="text-xs text-muted-foreground">
                ⚠️ Complete all required fields to submit this profile
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {questions.sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            {section.description && (
              <CardDescription>{section.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {section.fields.map((field) => renderField(field))}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSavingDraft || isSubmitting}
        >
          {isSavingDraft ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Draft...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </>
          )}
        </Button>

        <div className="flex items-center gap-3">
          {requiredCompletion < 100 && (
            <p className="text-sm text-muted-foreground">
              Complete required fields to submit
            </p>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || isSavingDraft || requiredCompletion < 100}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Complete Profile'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

