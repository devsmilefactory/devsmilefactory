import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProfileTypeSelector, ProfileType } from './ProfileTypeSelector';
import { DynamicProfileForm } from './DynamicProfileForm';
import { useAuthStore } from '@/stores/authStore';
import { useProfilesStore } from '@/stores/profilesStore';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ProfileWizardProps {
  open: boolean;
}

interface ProfileFormData {
  [profileType: string]: {
    data: any;
    isComplete: boolean;
    completionPercentage: number;
  };
}

export function ProfileWizard({ open }: ProfileWizardProps) {
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [selectedTypes, setSelectedTypes] = useState<ProfileType[]>([]);
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileFormsData, setProfileFormsData] = useState<ProfileFormData>({});

  const { completeWizard } = useAuthStore();
  const { createProfile } = useProfilesStore();

  // Initialize form data for each selected profile type
  useEffect(() => {
    if (selectedTypes.length > 0) {
      const initialData: ProfileFormData = {};
      selectedTypes.forEach((type) => {
        if (!profileFormsData[type]) {
          initialData[type] = {
            data: {},
            isComplete: false,
            completionPercentage: 0,
          };
        } else {
          initialData[type] = profileFormsData[type];
        }
      });
      setProfileFormsData(initialData);
    }
  }, [selectedTypes]);

  const handleTypeSelection = (types: ProfileType[]) => {
    setSelectedTypes(types);
    setStep('form');
    setCurrentTypeIndex(0);
  };

  const handleProfileSwitch = (profileType: ProfileType) => {
    const index = selectedTypes.indexOf(profileType);
    if (index !== -1) {
      setCurrentTypeIndex(index);
    }
  };

  const updateProfileFormData = (profileType: ProfileType, data: any, completionPercentage: number) => {
    setProfileFormsData((prev) => ({
      ...prev,
      [profileType]: {
        data,
        isComplete: completionPercentage === 100,
        completionPercentage,
      },
    }));
  };

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const currentType = selectedTypes[currentTypeIndex];

      // Create profile with the form data
      await createProfile({
        profileType: currentType,
        displayName: formData.displayName || formData.name || 'New Profile',
        bio: formData.bio || formData.executive_summary?.bio || '',
        ...formData,
      });

      // Mark this profile as complete
      updateProfileFormData(currentType, formData, 100);

      toast.success(`${currentType} profile created successfully!`);

      // Check if all profiles are complete
      const allComplete = selectedTypes.every(
        (type) => profileFormsData[type]?.isComplete || type === currentType
      );

      if (allComplete) {
        // All profiles created, complete the wizard
        await completeWizard();
        toast.success('Profile setup complete! Welcome to SmileFactory!');
      } else {
        // Find next incomplete profile
        const nextIncompleteIndex = selectedTypes.findIndex(
          (type, idx) => idx > currentTypeIndex && !profileFormsData[type]?.isComplete
        );

        if (nextIncompleteIndex !== -1) {
          setCurrentTypeIndex(nextIncompleteIndex);
        }
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (formData: any, completionPercentage: number) => {
    // Save draft to profile metadata
    try {
      const currentType = selectedTypes[currentTypeIndex];

      // Update local state
      updateProfileFormData(currentType, formData, completionPercentage);

      await createProfile({
        profileType: currentType,
        displayName: formData.displayName || 'Draft Profile',
        bio: formData.bio || '',
        draftData: formData,
      });

      toast.success('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft.');
    }
  };

  const currentType = selectedTypes[currentTypeIndex];
  const currentFormData = profileFormsData[currentType];
  const completedCount = Object.values(profileFormsData).filter((p) => p.isComplete).length;

  const getProfileDisplayName = (type: ProfileType) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Dialog open={open} modal>
      <DialogContent
        className="max-w-7xl max-h-[90vh] overflow-y-auto p-0"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Creating your profile...</p>
          </div>
        ) : step === 'select' ? (
          <ProfileTypeSelector
            onSelect={handleTypeSelection}
            selectedTypes={selectedTypes}
          />
        ) : (
          <div className="p-6">
            {/* Header with Profile Switcher */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Complete Your Profiles</h2>
                <Badge variant="outline" className="text-sm">
                  {completedCount} of {selectedTypes.length} Complete
                </Badge>
              </div>

              {/* Profile Switcher Dropdown */}
              {selectedTypes.length > 1 && (
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Current Profile:</label>
                  <Select
                    value={currentType}
                    onValueChange={(value) => handleProfileSwitch(value as ProfileType)}
                  >
                    <SelectTrigger className="w-[300px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedTypes.map((type) => {
                        const formData = profileFormsData[type];
                        const isComplete = formData?.isComplete || false;
                        const percentage = formData?.completionPercentage || 0;

                        return (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center justify-between w-full gap-3">
                              <span>{getProfileDisplayName(type)}</span>
                              <div className="flex items-center gap-2">
                                {isComplete ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    {percentage}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Overall Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">
                    {Math.round((completedCount / selectedTypes.length) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(completedCount / selectedTypes.length) * 100}
                  className="h-2"
                />
              </div>

              {/* Current Profile Progress */}
              {currentFormData && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {getProfileDisplayName(currentType)} Completion
                    </span>
                    <span className="font-medium">
                      {currentFormData.completionPercentage}%
                    </span>
                  </div>
                  <Progress
                    value={currentFormData.completionPercentage}
                    className="h-2"
                  />
                </div>
              )}
            </div>

            <DynamicProfileForm
              profileType={currentType}
              onSubmit={handleFormSubmit}
              onSaveDraft={handleSaveDraft}
              initialData={currentFormData?.data || {}}
              onFormChange={updateProfileFormData}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

