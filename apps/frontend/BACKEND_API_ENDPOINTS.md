# SmileFactory Backend - API Endpoints Reference

Complete reference for all API endpoints in the SmileFactory backend system.

**Base URL:** `http://localhost:3000/api/v1` (Development)  
**Production URL:** `https://api.smilefactory.com/api/v1`

---

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication Service

### Send OTP
**Endpoint:** `POST /auth/send-otp`  
**Authentication:** None  
**Description:** Send OTP code to user's email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully",
    "expiresIn": 300
  }
}
```

---

### Verify OTP
**Endpoint:** `POST /auth/verify-otp`  
**Authentication:** None  
**Description:** Verify OTP and authenticate user

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2025-10-21T10:00:00Z"
    },
    "profiles": [
      {
        "id": "uuid",
        "displayName": "John Doe",
        "profileType": "innovator",
        "isPrimary": true
      }
    ]
  }
}
```

---

### Refresh Token
**Endpoint:** `POST /auth/refresh-token`  
**Authentication:** None  
**Description:** Get new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Logout
**Endpoint:** `POST /auth/logout`  
**Authentication:** Required  
**Description:** Invalidate current session

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### Get Current User
**Endpoint:** `GET /auth/me`  
**Authentication:** Required  
**Description:** Get current authenticated user info

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "activeProfile": {
      "id": "uuid",
      "displayName": "John Doe",
      "profileType": "innovator"
    }
  }
}
```

---

## 2. User Profile Service

### Get All Profiles for User
**Endpoint:** `GET /profiles`  
**Authentication:** Required  
**Description:** Get all profiles for the authenticated user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "displayName": "John Doe",
      "username": "johndoe",
      "profileType": "innovator",
      "bio": "Innovation enthusiast",
      "avatarUrl": "https://...",
      "isPrimary": true,
      "completionPercentage": 85
    }
  ]
}
```

---

### Create Profile
**Endpoint:** `POST /profiles`  
**Authentication:** Required  
**Description:** Create a new profile for the user

**Request Body:**
```json
{
  "displayName": "Tech Innovations Hub",
  "profileType": "organization",
  "bio": "Accelerating innovation",
  "location": "San Francisco, CA",
  "website": "https://techhub.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "displayName": "Tech Innovations Hub",
    "profileType": "organization",
    "isPrimary": false,
    "completionPercentage": 40
  }
}
```

---

### Get Profile by ID
**Endpoint:** `GET /profiles/:id`  
**Authentication:** Required  
**Description:** Get a specific profile by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "displayName": "John Doe",
    "username": "johndoe",
    "profileType": "innovator",
    "bio": "Innovation enthusiast",
    "location": "New York, NY",
    "website": "https://johndoe.com",
    "avatarUrl": "https://...",
    "coverImageUrl": "https://...",
    "isPrimary": true,
    "isVerified": false,
    "completionPercentage": 85,
    "stats": {
      "posts": 45,
      "connections": 234,
      "following": 156
    }
  }
}
```

---

### Update Profile
**Endpoint:** `PUT /profiles/:id`  
**Authentication:** Required  
**Description:** Update a profile

**Request Body:**
```json
{
  "displayName": "John Doe Updated",
  "bio": "Updated bio",
  "location": "Los Angeles, CA"
}
```

---

### Delete Profile
**Endpoint:** `DELETE /profiles/:id`  
**Authentication:** Required  
**Description:** Delete a profile (cannot delete primary profile if it's the only one)

---

### Set Primary Profile
**Endpoint:** `PATCH /profiles/:id/set-primary`  
**Authentication:** Required  
**Description:** Set a profile as the primary profile

---

### Search Profiles
**Endpoint:** `GET /profiles/search`  
**Authentication:** Required  
**Description:** Search for profiles

**Query Parameters:**
- `q` - Search query
- `type` - Profile type filter
- `page` - Page number
- `limit` - Items per page

**Example:** `/profiles/search?q=innovation&type=innovator&page=1&limit=20`

---

## 3. Feed Service

### Get Feed
**Endpoint:** `GET /feed`  
**Authentication:** Required  
**Description:** Get general feed

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `type` - Post type filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "opportunity",
      "author": {
        "id": "uuid",
        "name": "Tech Ventures",
        "profileType": "investor"
      },
      "title": "Seed Funding Opportunity",
      "content": "Looking for early-stage startups...",
      "imageUrl": "https://...",
      "tags": ["funding", "seed"],
      "likesCount": 45,
      "commentsCount": 12,
      "createdAt": "2025-10-21T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### Get Personalized Feed
**Endpoint:** `GET /feed/personalized`  
**Authentication:** Required  
**Description:** Get personalized feed based on user interests

---

### Create Post
**Endpoint:** `POST /posts`  
**Authentication:** Required  
**Description:** Create a new post

**Request Body:**
```json
{
  "type": "project",
  "title": "AI Healthcare Platform",
  "content": "Building an AI diagnostic tool...",
  "imageUrl": "https://...",
  "tags": ["ai", "healthcare"]
}
```

---

### Get Post by ID
**Endpoint:** `GET /posts/:id`  
**Authentication:** Required  
**Description:** Get a specific post

---

### Update Post
**Endpoint:** `PUT /posts/:id`  
**Authentication:** Required  
**Description:** Update a post (only by author)

---

### Delete Post
**Endpoint:** `DELETE /posts/:id`  
**Authentication:** Required  
**Description:** Delete a post (only by author)

---

### Like Post
**Endpoint:** `POST /posts/:id/like`  
**Authentication:** Required  
**Description:** Like a post

---

### Unlike Post
**Endpoint:** `DELETE /posts/:id/like`  
**Authentication:** Required  
**Description:** Unlike a post

---

### Get Post Comments
**Endpoint:** `GET /posts/:id/comments`  
**Authentication:** Required  
**Description:** Get comments for a post

---

### Add Comment
**Endpoint:** `POST /posts/:id/comments`  
**Authentication:** Required  
**Description:** Add a comment to a post

**Request Body:**
```json
{
  "content": "Great post!",
  "parentCommentId": "uuid" // Optional, for replies
}
```

---

## 4. Messaging Service

### Get Conversations
**Endpoint:** `GET /conversations`  
**Authentication:** Required  
**Description:** Get all conversations for the user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "participants": [
        {
          "id": "uuid",
          "name": "Dr. Sarah Johnson",
          "avatarUrl": "https://..."
        }
      ],
      "lastMessage": {
        "content": "That sounds great!",
        "createdAt": "2025-10-21T10:00:00Z"
      },
      "unreadCount": 2
    }
  ]
}
```

---

### Create Conversation
**Endpoint:** `POST /conversations`  
**Authentication:** Required  
**Description:** Create a new conversation

**Request Body:**
```json
{
  "participantProfileIds": ["uuid1", "uuid2"]
}
```

---

### Get Conversation Messages
**Endpoint:** `GET /conversations/:id/messages`  
**Authentication:** Required  
**Description:** Get messages in a conversation

---

### Send Message
**Endpoint:** `POST /conversations/:id/messages`  
**Authentication:** Required  
**Description:** Send a message in a conversation

**Request Body:**
```json
{
  "content": "Hello, how are you?"
}
```

---

### Mark as Read
**Endpoint:** `PATCH /conversations/:id/read`  
**Authentication:** Required  
**Description:** Mark all messages in a conversation as read

---

## 5. Connection Service

### Get Connections
**Endpoint:** `GET /connections`  
**Authentication:** Required  
**Description:** Get all connections

**Query Parameters:**
- `status` - Filter by status (accepted, pending)

---

### Send Connection Request
**Endpoint:** `POST /connections/request`  
**Authentication:** Required  
**Description:** Send a connection request

**Request Body:**
```json
{
  "profileId": "uuid"
}
```

---

### Accept Connection
**Endpoint:** `PUT /connections/:id/accept`  
**Authentication:** Required  
**Description:** Accept a connection request

---

### Reject Connection
**Endpoint:** `PUT /connections/:id/reject`  
**Authentication:** Required  
**Description:** Reject a connection request

---

### Remove Connection
**Endpoint:** `DELETE /connections/:id`  
**Authentication:** Required  
**Description:** Remove a connection

---

### Get Connection Suggestions
**Endpoint:** `GET /connections/suggestions`  
**Authentication:** Required  
**Description:** Get suggested connections based on profile

---

## 6. Events Service

### Get Events
**Endpoint:** `GET /events`  
**Authentication:** Required  
**Description:** Get all events

---

### Get Featured Events
**Endpoint:** `GET /events/featured`  
**Authentication:** Required  
**Description:** Get featured events

---

### Create Event
**Endpoint:** `POST /events`  
**Authentication:** Required  
**Description:** Create a new event

---

### Register for Event
**Endpoint:** `POST /events/:id/register`  
**Authentication:** Required  
**Description:** Register for an event

---

### Cancel Registration
**Endpoint:** `DELETE /events/:id/register`  
**Authentication:** Required  
**Description:** Cancel event registration

---

## 7. Marketplace Service

### Get Marketplace Items
**Endpoint:** `GET /marketplace`  
**Authentication:** Required  
**Description:** Get all marketplace items

---

### Create Marketplace Item
**Endpoint:** `POST /marketplace`  
**Authentication:** Required  
**Description:** Create a new marketplace item

---

## 8. Search Service

### Global Search
**Endpoint:** `GET /search`  
**Authentication:** Required  
**Description:** Search across all entities

**Query Parameters:**
- `q` - Search query
- `type` - Entity type (profiles, posts, events, marketplace)

---

## 9. Notification Service

### Get Notifications
**Endpoint:** `GET /notifications`  
**Authentication:** Required  
**Description:** Get all notifications

---

### Mark Notification as Read
**Endpoint:** `PATCH /notifications/:id/read`  
**Authentication:** Required  
**Description:** Mark a notification as read

---

### Mark All as Read
**Endpoint:** `PATCH /notifications/read-all`  
**Authentication:** Required  
**Description:** Mark all notifications as read

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input data |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

**For complete API documentation with examples, visit:** http://localhost:3000/api/docs


