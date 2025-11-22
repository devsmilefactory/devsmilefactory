# Requirements Document

## Introduction

This document defines the requirements for the Interactions & Connect service of the social collaboration platform. The system enables users to engage with posts through likes, comments, shares, and saves, and to build their network through connection requests and acceptances.

## Glossary

- **Interaction_Service**: The microservice managing post interactions and profile connections
- **Like**: A positive engagement action on a post
- **Comment**: A text response to a post or another comment
- **Share**: An action to redistribute a post to followers or groups
- **Save**: A bookmark action to save a post for later viewing
- **Connection**: A mutual relationship between two profiles (LinkedIn-style)
- **Connection_Request**: A pending connection invitation
- **Connection_Status**: The state of a connection (none, pending, accepted, rejected)

## Requirements

### Requirement 1

**User Story:** As a user, I want to like posts, so that I can show appreciation for content I enjoy.

#### Acceptance Criteria

1. THE Interaction_Service SHALL allow users to like any post they can view
2. WHEN a user likes a post, THE Interaction_Service SHALL create a like record with profile_id and post_id
3. WHEN a user likes an already-liked post, THE Interaction_Service SHALL remove the like (toggle behavior)
4. THE Interaction_Service SHALL emit a PostLiked event for notification generation
5. THE Interaction_Service SHALL prevent duplicate likes from the same profile on the same post

### Requirement 2

**User Story:** As a user, I want to comment on posts, so that I can engage in discussions and provide feedback.

#### Acceptance Criteria

1. THE Interaction_Service SHALL allow users to comment on any post they can view
2. WHEN a user creates a comment, THE Interaction_Service SHALL require content and post_id
3. THE Interaction_Service SHALL support nested comments with parent_comment_id for replies
4. THE Interaction_Service SHALL validate comment content length between 1 and 1000 characters
5. THE Interaction_Service SHALL emit a CommentCreated event for notification generation

### Requirement 3

**User Story:** As a user, I want to reply to comments, so that I can have threaded conversations.

#### Acceptance Criteria

1. THE Interaction_Service SHALL support parent_comment_id field for comment replies
2. WHEN a comment has a parent_comment_id, THE Interaction_Service SHALL validate the parent exists
3. THE Interaction_Service SHALL support up to 3 levels of comment nesting
4. THE Interaction_Service SHALL return comments in hierarchical structure with replies nested
5. THE Interaction_Service SHALL emit a CommentReplied event for notification generation

### Requirement 4

**User Story:** As a user, I want to edit and delete my comments, so that I can correct mistakes or remove inappropriate content.

#### Acceptance Criteria

1. THE Interaction_Service SHALL allow comment authors to update their comment content
2. WHEN a comment is updated, THE Interaction_Service SHALL update the updated_at timestamp
3. THE Interaction_Service SHALL allow comment authors to delete their comments
4. WHEN a comment with replies is deleted, THE Interaction_Service SHALL mark it as deleted but preserve the thread structure
5. THE Interaction_Service SHALL prevent non-authors from modifying comments

### Requirement 5

**User Story:** As a user, I want to share posts, so that I can redistribute interesting content to my network.

#### Acceptance Criteria

1. THE Interaction_Service SHALL allow users to share any public post
2. WHEN a user shares a post, THE Interaction_Service SHALL create a share record with profile_id, post_id, and optional message
3. THE Interaction_Service SHALL support share_type: timeline, group, direct_message
4. THE Interaction_Service SHALL emit a PostShared event for notification and feed generation
5. THE Interaction_Service SHALL increment the share_count on the original post

### Requirement 6

**User Story:** As a user, I want to save posts for later, so that I can easily find content I want to revisit.

#### Acceptance Criteria

1. THE Interaction_Service SHALL allow users to save any post they can view
2. WHEN a user saves a post, THE Interaction_Service SHALL create a save record with profile_id and post_id
3. WHEN a user saves an already-saved post, THE Interaction_Service SHALL remove the save (toggle behavior)
4. THE Interaction_Service SHALL expose an endpoint to retrieve all saved posts for a profile
5. THE Interaction_Service SHALL order saved posts by saved_at timestamp descending

### Requirement 7

**User Story:** As a user, I want to send connection requests to other profiles, so that I can build my professional network.

#### Acceptance Criteria

1. THE Interaction_Service SHALL allow users to send connection requests to any public profile
2. WHEN a connection request is sent, THE Interaction_Service SHALL create a connection record with status pending
3. THE Interaction_Service SHALL prevent duplicate connection requests between the same profiles
4. THE Interaction_Service SHALL emit a ConnectionRequested event for notification generation
5. THE Interaction_Service SHALL support an optional message with the connection request

### Requirement 8

**User Story:** As a user, I want to accept or reject connection requests, so that I can control who is in my network.

#### Acceptance Criteria

1. THE Interaction_Service SHALL allow target profiles to accept connection requests
2. WHEN a connection is accepted, THE Interaction_Service SHALL update status to accepted
3. THE Interaction_Service SHALL allow target profiles to reject connection requests
4. WHEN a connection is rejected, THE Interaction_Service SHALL update status to rejected
5. THE Interaction_Service SHALL emit ConnectionAccepted or ConnectionRejected events

### Requirement 9

**User Story:** As a user, I want to view my connections list, so that I can see who is in my network.

#### Acceptance Criteria

1. THE Interaction_Service SHALL expose an endpoint to list all accepted connections for a profile
2. THE Interaction_Service SHALL return connection profiles with display_name, avatar_url, profile_type, location
3. THE Interaction_Service SHALL support pagination for connections list
4. THE Interaction_Service SHALL support filtering connections by profile_type
5. THE Interaction_Service SHALL order connections by connection accepted_at timestamp descending

### Requirement 10

**User Story:** As a user, I want to see pending connection requests, so that I can respond to them.

#### Acceptance Criteria

1. THE Interaction_Service SHALL expose an endpoint to list pending incoming connection requests
2. THE Interaction_Service SHALL expose an endpoint to list pending outgoing connection requests
3. THE Interaction_Service SHALL return request profiles with display_name, avatar_url, profile_type, request message
4. THE Interaction_Service SHALL order requests by created_at timestamp descending
5. THE Interaction_Service SHALL include request_id for accept/reject actions

### Requirement 11

**User Story:** As a user viewing a profile or post, I want to see engagement counts, so that I can gauge popularity and activity.

#### Acceptance Criteria

1. THE Interaction_Service SHALL expose an endpoint to get engagement counts for a post
2. THE Interaction_Service SHALL return counts for: likes, comments, shares, saves
3. THE Interaction_Service SHALL cache engagement counts in Redis with 1-minute TTL
4. THE Interaction_Service SHALL invalidate cache when new interactions occur
5. THE Interaction_Service SHALL complete count queries within 200 milliseconds for 95% of requests

### Requirement 12

**User Story:** As a user, I want to see if I have already liked, saved, or connected with content/profiles, so that I know my current interaction state.

#### Acceptance Criteria

1. THE Interaction_Service SHALL expose an endpoint to check user's interaction state with a post
2. THE Interaction_Service SHALL return boolean flags: has_liked, has_saved, has_commented
3. THE Interaction_Service SHALL expose an endpoint to check connection status between two profiles
4. THE Interaction_Service SHALL return connection_status: none, pending_sent, pending_received, accepted
5. THE Interaction_Service SHALL cache interaction states in Redis with 5-minute TTL

### Requirement 13

**User Story:** As a developer integrating with the Interaction Service, I want clear API contracts, so that I can build reliable client applications.

#### Acceptance Criteria

1. THE Interaction_Service SHALL expose POST /posts/:id/like endpoint for toggling likes
2. THE Interaction_Service SHALL expose POST /posts/:id/comments endpoint for creating comments
3. THE Interaction_Service SHALL expose POST /posts/:id/share endpoint for sharing posts
4. THE Interaction_Service SHALL expose POST /posts/:id/save endpoint for toggling saves
5. THE Interaction_Service SHALL expose POST /connections endpoint for sending connection requests
6. THE Interaction_Service SHALL expose POST /connections/:id/accept and /connections/:id/reject endpoints
7. THE Interaction_Service SHALL return standardized JSON responses with proper HTTP status codes
