# Requirements Document

## Introduction

This document defines the requirements for the Notifications service of the social collaboration platform. The system consumes domain events from other services via Redis pub/sub and generates in-app notifications for users, providing real-time updates about interactions, connections, and platform activities.

## Glossary

- **Notification_Service**: The microservice managing notification generation and delivery
- **Notification**: An in-app message informing users about platform activities
- **Notification_Type**: The category of notification (like, comment, connection_request, connection_accepted, message, etc.)
- **Notification_Status**: The read state of a notification (unread, read)
- **Domain_Event**: An event published by other services (PostLiked, CommentCreated, ConnectionRequested, etc.)
- **Notification_Template**: A predefined message format for each notification type

## Requirements

### Requirement 1

**User Story:** As a user, I want to receive notifications when someone likes my post, so that I know my content is appreciated.

#### Acceptance Criteria

1. WHEN a PostLiked event is received, THE Notification_Service SHALL create a notification for the post author
2. THE Notification_Service SHALL include liker profile_id, post_id, and notification_type like in the notification
3. THE Notification_Service SHALL set notification status to unread by default
4. THE Notification_Service SHALL not create duplicate notifications for the same event
5. THE Notification_Service SHALL emit the notification via WebSocket if the user is online

### Requirement 2

**User Story:** As a user, I want to receive notifications when someone comments on my post, so that I can engage in discussions.

#### Acceptance Criteria

1. WHEN a CommentCreated event is received, THE Notification_Service SHALL create a notification for the post author
2. WHEN a comment is a reply, THE Notification_Service SHALL also create a notification for the parent comment author
3. THE Notification_Service SHALL include commenter profile_id, post_id, comment_id, and notification_type comment
4. THE Notification_Service SHALL not notify users about their own comments
5. THE Notification_Service SHALL batch multiple comments from the same user within 5 minutes

### Requirement 3

**User Story:** As a user, I want to receive notifications when someone sends me a connection request, so that I can respond promptly.

#### Acceptance Criteria

1. WHEN a ConnectionRequested event is received, THE Notification_Service SHALL create a notification for the target profile
2. THE Notification_Service SHALL include requester profile_id, connection_id, and notification_type connection_request
3. THE Notification_Service SHALL include the optional request message in the notification
4. THE Notification_Service SHALL mark the notification as high priority
5. THE Notification_Service SHALL emit the notification via WebSocket immediately

### Requirement 4

**User Story:** As a user, I want to receive notifications when my connection request is accepted, so that I know I can now interact with that profile.

#### Acceptance Criteria

1. WHEN a ConnectionAccepted event is received, THE Notification_Service SHALL create a notification for the requester profile
2. THE Notification_Service SHALL include accepter profile_id, connection_id, and notification_type connection_accepted
3. THE Notification_Service SHALL set notification status to unread
4. THE Notification_Service SHALL emit the notification via WebSocket if the user is online
5. THE Notification_Service SHALL not create a notification if the connection was rejected

### Requirement 5

**User Story:** As a user, I want to receive notifications when someone sends me a message, so that I can respond to conversations.

#### Acceptance Criteria

1. WHEN a MessageCreated event is received, THE Notification_Service SHALL create a notification for the recipient profile
2. THE Notification_Service SHALL include sender profile_id, conversation_id, and notification_type message
3. THE Notification_Service SHALL not create notifications for messages the user sent
4. THE Notification_Service SHALL batch multiple messages from the same conversation within 2 minutes
5. THE Notification_Service SHALL mark message notifications as high priority

### Requirement 6

**User Story:** As a user, I want to view all my notifications in a list, so that I can catch up on platform activity.

#### Acceptance Criteria

1. THE Notification_Service SHALL expose an endpoint to list notifications for a profile
2. THE Notification_Service SHALL support filtering by notification_status (unread, read, all)
3. THE Notification_Service SHALL return notifications in reverse chronological order
4. THE Notification_Service SHALL support pagination with page size between 10 and 50 results
5. THE Notification_Service SHALL include actor profile information (display_name, avatar_url) in each notification

### Requirement 7

**User Story:** As a user, I want to mark notifications as read, so that I can track which ones I have seen.

#### Acceptance Criteria

1. THE Notification_Service SHALL expose an endpoint to mark a single notification as read
2. THE Notification_Service SHALL expose an endpoint to mark all notifications as read
3. WHEN a notification is marked as read, THE Notification_Service SHALL update the status and set read_at timestamp
4. THE Notification_Service SHALL only allow users to mark their own notifications as read
5. THE Notification_Service SHALL return the updated unread count after marking as read

### Requirement 8

**User Story:** As a user, I want to see an unread notification count, so that I know when I have new activity.

#### Acceptance Criteria

1. THE Notification_Service SHALL expose an endpoint to get unread notification count for a profile
2. THE Notification_Service SHALL cache unread counts in Redis with 30-second TTL
3. THE Notification_Service SHALL invalidate the cache when notifications are created or marked as read
4. THE Notification_Service SHALL complete count queries within 100 milliseconds for 95% of requests
5. THE Notification_Service SHALL emit count updates via WebSocket when the count changes

### Requirement 9

**User Story:** As a user, I want to receive real-time notifications without refreshing, so that I stay updated on platform activity.

#### Acceptance Criteria

1. THE Notification_Service SHALL support WebSocket connections for real-time notification delivery
2. WHEN a notification is created for an online user, THE Notification_Service SHALL push it via WebSocket immediately
3. THE Notification_Service SHALL authenticate WebSocket connections using JWT tokens
4. THE Notification_Service SHALL maintain a mapping of profile_id to WebSocket connection
5. THE Notification_Service SHALL handle WebSocket disconnections gracefully and clean up resources

### Requirement 10

**User Story:** As a platform administrator, I want notification data to be consistent and performant, so that users have a good experience.

#### Acceptance Criteria

1. THE Notification_Service SHALL process domain events within 500 milliseconds of receipt
2. THE Notification_Service SHALL deduplicate events using event_id to prevent duplicate notifications
3. THE Notification_Service SHALL store processed event_ids in Redis with 24-hour TTL
4. THE Notification_Service SHALL handle event processing failures with retry logic (3 attempts)
5. THE Notification_Service SHALL log failed events for manual investigation

### Requirement 11

**User Story:** As a developer integrating with the Notification Service, I want clear API contracts, so that I can build reliable client applications.

#### Acceptance Criteria

1. THE Notification_Service SHALL expose GET /notifications endpoint with status filter and pagination
2. THE Notification_Service SHALL expose POST /notifications/:id/read endpoint to mark single notification as read
3. THE Notification_Service SHALL expose POST /notifications/read-all endpoint to mark all as read
4. THE Notification_Service SHALL expose GET /notifications/unread-count endpoint
5. THE Notification_Service SHALL expose WebSocket endpoint at /notifications/ws for real-time updates
6. THE Notification_Service SHALL return standardized JSON responses with proper HTTP status codes
7. THE Notification_Service SHALL document all endpoints with OpenAPI/Swagger specifications
