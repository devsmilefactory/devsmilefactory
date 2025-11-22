# Requirements Document

## Introduction

This document defines the requirements for the Messaging & Chat service of the social collaboration platform. The system enables real-time 1:1 and group messaging between profiles, with support for message history, read receipts, typing indicators, and online/offline status.

## Glossary

- **Messaging_Service**: The microservice managing conversations and messages
- **Conversation**: A chat thread between two or more profiles (1:1 or group)
- **Message**: A text communication within a conversation
- **Participant**: A profile that is part of a conversation
- **Read_Receipt**: A record indicating when a participant read a message
- **Typing_Indicator**: A real-time signal that a participant is typing
- **Online_Status**: The current availability state of a profile (online, offline)
- **Conversation_Type**: The category of conversation (direct, group)

## Requirements

### Requirement 1

**User Story:** As a user, I want to start a direct conversation with another profile, so that I can communicate privately.

#### Acceptance Criteria

1. THE Messaging_Service SHALL allow users to create direct conversations with any profile
2. WHEN a direct conversation is created, THE Messaging_Service SHALL check if one already exists between the two profiles
3. WHEN an existing conversation is found, THE Messaging_Service SHALL return the existing conversation_id
4. WHEN no conversation exists, THE Messaging_Service SHALL create a new conversation with type direct
5. THE Messaging_Service SHALL add both profiles as participants with role member

### Requirement 2

**User Story:** As a user, I want to create group conversations, so that I can communicate with multiple people at once.

#### Acceptance Criteria

1. THE Messaging_Service SHALL allow users to create group conversations with 2 or more participants
2. WHEN a group conversation is created, THE Messaging_Service SHALL require a group name
3. THE Messaging_Service SHALL set the creator as a participant with role admin
4. THE Messaging_Service SHALL add all specified participants with role member
5. THE Messaging_Service SHALL support up to 50 participants per group conversation

### Requirement 3

**User Story:** As a user, I want to send messages in conversations, so that I can communicate with others.

#### Acceptance Criteria

1. THE Messaging_Service SHALL allow participants to send messages in their conversations
2. WHEN a message is sent, THE Messaging_Service SHALL require content and conversation_id
3. THE Messaging_Service SHALL validate message content length between 1 and 5000 characters
4. THE Messaging_Service SHALL set sender_profile_id from the authenticated user
5. THE Messaging_Service SHALL emit a MessageCreated event for real-time delivery and notifications

### Requirement 4

**User Story:** As a user, I want to receive messages in real-time, so that I can have fluid conversations.

#### Acceptance Criteria

1. THE Messaging_Service SHALL support WebSocket connections for real-time message delivery
2. WHEN a message is created, THE Messaging_Service SHALL push it to all online participants via WebSocket
3. THE Messaging_Service SHALL authenticate WebSocket connections using JWT tokens
4. THE Messaging_Service SHALL subscribe users to their conversation channels upon connection
5. THE Messaging_Service SHALL handle WebSocket disconnections gracefully

### Requirement 5

**User Story:** As a user, I want to see message history in my conversations, so that I can review past communications.

#### Acceptance Criteria

1. THE Messaging_Service SHALL expose an endpoint to retrieve messages for a conversation
2. THE Messaging_Service SHALL return messages in chronological order (oldest first)
3. THE Messaging_Service SHALL support pagination with cursor-based pagination for efficient loading
4. THE Messaging_Service SHALL include sender profile information (display_name, avatar_url) with each message
5. THE Messaging_Service SHALL return up to 50 messages per page

### Requirement 6

**User Story:** As a user, I want to see read receipts, so that I know when others have read my messages.

#### Acceptance Criteria

1. THE Messaging_Service SHALL track read receipts for each message and participant
2. WHEN a user views messages in a conversation, THE Messaging_Service SHALL mark them as read
3. THE Messaging_Service SHALL expose an endpoint to mark messages as read up to a specific message_id
4. THE Messaging_Service SHALL return read_by array with each message showing which participants have read it
5. THE Messaging_Service SHALL emit MessageRead events for real-time read receipt updates

### Requirement 7

**User Story:** As a user, I want to see typing indicators, so that I know when someone is composing a message.

#### Acceptance Criteria

1. THE Messaging_Service SHALL support typing indicator events via WebSocket
2. WHEN a user starts typing, THE Messaging_Service SHALL broadcast a TypingStarted event to other participants
3. WHEN a user stops typing or sends a message, THE Messaging_Service SHALL broadcast a TypingStopped event
4. THE Messaging_Service SHALL automatically stop typing indicators after 5 seconds of inactivity
5. THE Messaging_Service SHALL not persist typing indicators in the database

### Requirement 8

**User Story:** As a user, I want to see online/offline status of conversation participants, so that I know when they are available.

#### Acceptance Criteria

1. THE Messaging_Service SHALL track online status based on WebSocket connections
2. WHEN a user connects via WebSocket, THE Messaging_Service SHALL set their status to online
3. WHEN a user disconnects, THE Messaging_Service SHALL set their status to offline after 30-second grace period
4. THE Messaging_Service SHALL broadcast status changes to relevant conversation participants
5. THE Messaging_Service SHALL cache online status in Redis with 1-minute TTL

### Requirement 9

**User Story:** As a user, I want to see a list of my conversations, so that I can access my chats easily.

#### Acceptance Criteria

1. THE Messaging_Service SHALL expose an endpoint to list conversations for a profile
2. THE Messaging_Service SHALL return conversations ordered by last_message_at descending
3. THE Messaging_Service SHALL include last message preview, unread count, and participant info for each conversation
4. THE Messaging_Service SHALL support pagination with page size between 10 and 50 results
5. THE Messaging_Service SHALL cache conversation lists in Redis with 30-second TTL

### Requirement 10

**User Story:** As a user, I want to see unread message counts, so that I know which conversations need my attention.

#### Acceptance Criteria

1. THE Messaging_Service SHALL track unread message count per conversation per participant
2. THE Messaging_Service SHALL expose an endpoint to get total unread count across all conversations
3. WHEN messages are marked as read, THE Messaging_Service SHALL decrement the unread count
4. THE Messaging_Service SHALL emit unread count updates via WebSocket
5. THE Messaging_Service SHALL cache unread counts in Redis with 30-second TTL

### Requirement 11

**User Story:** As a group admin, I want to add and remove participants, so that I can manage group membership.

#### Acceptance Criteria

1. THE Messaging_Service SHALL allow admin participants to add new members to group conversations
2. THE Messaging_Service SHALL allow admin participants to remove members from group conversations
3. WHEN a participant is added, THE Messaging_Service SHALL create a system message announcing the addition
4. WHEN a participant is removed, THE Messaging_Service SHALL create a system message announcing the removal
5. THE Messaging_Service SHALL prevent non-admin participants from modifying group membership

### Requirement 12

**User Story:** As a user, I want to search messages within conversations, so that I can find specific information quickly.

#### Acceptance Criteria

1. THE Messaging_Service SHALL expose an endpoint to search messages within a conversation
2. THE Messaging_Service SHALL support full-text search on message content
3. THE Messaging_Service SHALL return matching messages with highlighted search terms
4. THE Messaging_Service SHALL support pagination for search results
5. THE Messaging_Service SHALL complete searches within 500 milliseconds for 95% of queries

### Requirement 13

**User Story:** As a user, I want to delete messages I sent, so that I can remove mistakes or inappropriate content.

#### Acceptance Criteria

1. THE Messaging_Service SHALL allow message senders to delete their own messages
2. WHEN a message is deleted, THE Messaging_Service SHALL mark it as deleted but preserve the record
3. THE Messaging_Service SHALL replace deleted message content with "This message was deleted"
4. THE Messaging_Service SHALL emit a MessageDeleted event for real-time updates
5. THE Messaging_Service SHALL prevent users from deleting messages sent by others

### Requirement 14

**User Story:** As a developer integrating with the Messaging Service, I want clear API contracts, so that I can build reliable client applications.

#### Acceptance Criteria

1. THE Messaging_Service SHALL expose POST /conversations endpoint to create conversations
2. THE Messaging_Service SHALL expose GET /conversations endpoint to list conversations
3. THE Messaging_Service SHALL expose POST /conversations/:id/messages endpoint to send messages
4. THE Messaging_Service SHALL expose GET /conversations/:id/messages endpoint to retrieve message history
5. THE Messaging_Service SHALL expose POST /conversations/:id/read endpoint to mark messages as read
6. THE Messaging_Service SHALL expose WebSocket endpoint at /messaging/ws for real-time features
7. THE Messaging_Service SHALL return standardized JSON responses with proper HTTP status codes
8. THE Messaging_Service SHALL document all endpoints with OpenAPI/Swagger specifications
