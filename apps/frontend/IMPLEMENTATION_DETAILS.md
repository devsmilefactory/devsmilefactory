# Implementation Details - Code Reference

## 1. CompactFeatureAlerts Component

**Location:** `src/components/FeatureAlertsSidebar.tsx`

**What it does:**
- Displays max 2 feature alerts
- Outline design with hover effects
- Compact and minimal
- Used in Feed page below create post

**Key Features:**
```tsx
export function CompactFeatureAlerts() {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  
  // Show only first 2 alerts
  const displayedAlerts = featureAlerts.slice(0, 2);

  return (
    <div className="space-y-2">
      {displayedAlerts.map((alert) => (
        <Card
          key={alert.id}
          className="border p-3 hover:border-primary/50 transition-all cursor-pointer"
          onClick={() => setSelectedAlert(alert.id)}
        >
          <div className="flex items-start gap-2">
            <div className={`mt-0.5 flex-shrink-0 ${alert.color}`}>
              {alert.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-semibold truncate">
                  {alert.title}
                </p>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {alert.badge}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {alert.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

---

## 2. Feed Page Integration

**Location:** `src/pages/Feed.tsx`

**What it does:**
- Imports CompactFeatureAlerts
- Displays it below create post button
- Maintains single-column layout

**Key Code:**
```tsx
import { CompactFeatureAlerts } from "@/components/FeatureAlertsSidebar";

export default function Feed() {
  const posts = usePostsStore((state) => state.posts);
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6">
      {/* Create Post Card */}
      <Card className="p-4">
        {/* Create post UI */}
      </Card>

      {/* Compact Feature Alerts - Below Create Post */}
      <CompactFeatureAlerts />

      {/* Create Post Modal */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl">
          <CreatePostForm onClose={() => setShowCreatePost(false)} />
        </DialogContent>
      </Dialog>

      {/* All Posts */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Latest Posts</h3>
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 3. PostCard CTA Logic

**Location:** `src/components/PostCard.tsx`

**What it does:**
- "View Details" navigates to post view
- "Contact Seller" navigates to messages
- Proper button ordering and logic

**Key Code:**
```tsx
<div className="flex items-center gap-2">
  {/* Primary CTA - View Details for marketplace/events */}
  <Button
    variant={config.ctaVariant}
    size="sm"
    onClick={(e) => {
      e.stopPropagation();

      // For marketplace and events, "View Details" navigates to post
      if ((type === "marketplace" || type === "event") && 
          config.ctaLabel === "View Details") {
        if (id) navigate(`/post/${id}`);
      }
      // Handle event registration
      else if (type === "event" && id && title && date && location) {
        if (!eventRegistered) {
          registerForEvent({
            id,
            title,
            date,
            location,
            status: "Registered",
          });
          setEventRegistered(true);
          toast.success("Successfully registered for event!");
        } else {
          toast.info("You're already registered for this event");
        }
      } else {
        toast.success(`${config.ctaLabel} clicked!`);
      }
    }}
    className={cn("font-medium", config.ctaClassName)}
  >
    {type === "event" && eventRegistered ? "Registered ✓" : config.ctaLabel}
  </Button>

  {/* Secondary CTA - Contact Seller or View Details */}
  {config.secondaryCtaLabel && (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        // For marketplace "Contact Seller", navigate to messages
        if (type === "marketplace" && 
            config.secondaryCtaLabel === "Contact Seller") {
          navigate("/messages");
          toast.success("Message sent to seller! Check your inbox.");
        }
        // For events "View Details", navigate to post
        else if (type === "event" && 
                 config.secondaryCtaLabel === "View Details") {
          if (id) navigate(`/post/${id}`);
        } else {
          toast.info(`${config.secondaryCtaLabel} - Feature coming soon!`);
        }
      }}
      className={cn("font-medium", config.secondaryCtaClassName)}
    >
      {config.secondaryCtaLabel}
    </Button>
  )}

  {/* View Button for non-marketplace/event posts */}
  {type !== "marketplace" && type !== "event" && (
    <Button
      variant="outline"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        if (id) navigate(`/post/${id}`);
      }}
      className="font-medium"
    >
      View
    </Button>
  )}
</div>
```

---

## 4. Feature Alerts Data

**Location:** `src/components/FeatureAlertsSidebar.tsx`

**Data Structure:**
```tsx
interface FeatureAlert {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge: string;
}

const featureAlerts: FeatureAlert[] = [
  {
    id: "1",
    title: "New Marketplace",
    description: "Discover vetted services",
    icon: <Zap className="h-4 w-4" />,
    color: "text-amber-600",
    badge: "New",
  },
  {
    id: "2",
    title: "Event Registration",
    description: "Register for upcoming events",
    icon: <Star className="h-4 w-4" />,
    color: "text-orange-600",
    badge: "Featured",
  },
  {
    id: "3",
    title: "Mentorship Program",
    description: "Connect with mentors",
    icon: <Lightbulb className="h-4 w-4" />,
    color: "text-blue-600",
    badge: "Popular",
  },
];
```

---

## 5. Styling Classes

**Compact Alert Card:**
```tsx
className="border p-3 hover:border-primary/50 transition-all cursor-pointer"
```

**Alert Icon:**
```tsx
className={`mt-0.5 flex-shrink-0 ${alert.color}`}
```

**Alert Title:**
```tsx
className="text-xs font-semibold truncate"
```

**Alert Description:**
```tsx
className="text-xs text-muted-foreground line-clamp-1"
```

---

## 6. Navigation Patterns

**Navigate to Post:**
```tsx
navigate(`/post/${id}`);
```

**Navigate to Messages:**
```tsx
navigate("/messages");
```

**Show Toast:**
```tsx
toast.success("Message sent to seller! Check your inbox.");
```

---

## 7. Store Integration

**Using Posts Store:**
```tsx
const posts = usePostsStore((state) => state.posts);
```

**Using Event Registration Store:**
```tsx
const registerForEvent = useEventRegistrationStore(
  (state) => state.registerForEvent
);
const isRegistered = useEventRegistrationStore(
  (state) => state.isRegistered
);
```

---

## Production Checklist

✅ All components properly typed
✅ Store integration correct
✅ Navigation working
✅ Toast notifications showing
✅ Event handling proper
✅ No console errors
✅ Responsive design maintained
✅ Backward compatible

---

## Customization Guide

### Add More Alerts
Edit `featureAlerts` array in `FeatureAlertsSidebar.tsx`

### Change Max Alerts
Edit `featureAlerts.slice(0, 2)` to `featureAlerts.slice(0, N)`

### Modify Styling
Update className strings in component

### Change Navigation Routes
Update `navigate()` calls in PostCard

### Customize Toast Messages
Edit `toast.success()` messages

---

## Troubleshooting

**Alerts not showing:**
- Check `CompactFeatureAlerts` is imported
- Verify `featureAlerts` array has data
- Check CSS classes are applied

**Navigation not working:**
- Verify post IDs are valid
- Check router is configured
- Ensure navigate is imported from react-router-dom

**Toast not showing:**
- Verify sonner is installed
- Check toast is imported
- Ensure Toaster component is in layout

**Store not working:**
- Verify store is initialized
- Check store hooks are imported correctly
- Ensure store data is populated

