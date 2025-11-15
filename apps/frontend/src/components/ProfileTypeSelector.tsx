import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

export type ProfileType = 
  | 'innovator' 
  | 'mentor' 
  | 'investor' 
  | 'academic_student' 
  | 'academic_institution' 
  | 'organization' 
  | 'professional';

interface ProfileTypeOption {
  type: ProfileType;
  title: string;
  description: string;
}

const profileTypes: ProfileTypeOption[] = [
  {
    type: 'innovator',
    title: 'Innovator',
    description: 'Entrepreneurs, startups, and innovation projects',
  },
  {
    type: 'mentor',
    title: 'Mentor',
    description: 'Experienced professionals offering guidance',
  },
  {
    type: 'investor',
    title: 'Investor',
    description: 'Angel investors, VCs, and funding organizations',
  },
  {
    type: 'academic_student',
    title: 'Academic Student',
    description: 'Students seeking learning and collaboration',
  },
  {
    type: 'academic_institution',
    title: 'Academic Institution',
    description: 'Universities and research centers',
  },
  {
    type: 'organization',
    title: 'Organization',
    description: 'Companies, NGOs, and government bodies',
  },
  {
    type: 'professional',
    title: 'Professional',
    description: 'Industry professionals and consultants',
  },
];

interface ProfileTypeSelectorProps {
  onSelect: (selectedTypes: ProfileType[]) => void;
  selectedTypes?: ProfileType[];
}

export function ProfileTypeSelector({ 
  onSelect, 
  selectedTypes: initialSelectedTypes = []
}: ProfileTypeSelectorProps) {
  const [selectedTypes, setSelectedTypes] = useState<ProfileType[]>(initialSelectedTypes);

  const toggleType = (type: ProfileType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleContinue = () => {
    if (selectedTypes.length > 0) {
      onSelect(selectedTypes);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome to SmileFactory!</h1>
        <p className="text-muted-foreground text-lg">
          Select the profile type(s) that best describe you
        </p>
        <Badge variant="outline" className="mt-2">
          You can select multiple profiles
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profileTypes.map((profileType) => {
          const isSelected = selectedTypes.includes(profileType.type);
          
          return (
            <Card
              key={profileType.type}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected 
                  ? 'border-primary border-2 shadow-md' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => toggleType(profileType.type)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{profileType.title}</CardTitle>
                  {isSelected && (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  )}
                </div>
                <CardDescription className="text-sm">
                  {profileType.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center items-center pt-6">
        <Button 
          onClick={handleContinue}
          disabled={selectedTypes.length === 0}
          size="lg"
        >
          Continue with {selectedTypes.length} profile{selectedTypes.length !== 1 ? 's' : ''}
        </Button>
      </div>

      {selectedTypes.length === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          ⚠️ Please select at least one profile type to continue
        </p>
      )}
    </div>
  );
}

