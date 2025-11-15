# SmileFactory Backend System - Documentation Index

Welcome to the SmileFactory Innovation Ecosystem Backend System documentation. This comprehensive guide will help you understand, set up, and develop the backend infrastructure for the SmileFactory platform.

---

## 📚 Documentation Overview

This documentation package includes everything you need to build an enterprise-level backend system for the SmileFactory innovation ecosystem platform.

### What's Included

✅ **Complete Implementation Plan** - 1,700+ lines of detailed technical specifications  
✅ **Database Schema Design** - 18 tables with relationships and migrations  
✅ **Microservices Architecture** - 11 services with clear responsibilities  
✅ **API Documentation** - Complete endpoint reference  
✅ **Deployment Guides** - Docker, Kubernetes, and production setup  
✅ **Developer Onboarding** - Quick start guide for new developers  
✅ **Visual Diagrams** - Architecture, authentication flow, and database ERD  

---

## 📖 Documentation Files

### 1. Implementation Plan
**File:** [`BACKEND_IMPLEMENTATION_PLAN.md`](./BACKEND_IMPLEMENTATION_PLAN.md)

The master document containing:
- Current state analysis
- Technology stack selection and rationale
- Complete system architecture
- Database schema (18 tables)
- 11 microservices breakdown
- Unified OTP authentication system
- API architecture and standards
- Migration strategy from old platform
- 16-week implementation roadmap
- Node.js to Java migration path
- Deployment architecture
- Security considerations

**Start here** if you're a technical lead or architect.

---

### 2. Implementation Summary
**File:** [`BACKEND_IMPLEMENTATION_SUMMARY.md`](./BACKEND_IMPLEMENTATION_SUMMARY.md)

Executive summary including:
- Key deliverables overview
- Technology stack summary
- Architecture highlights
- Implementation timeline
- Success criteria
- Risk assessment
- Budget considerations
- Next steps

**Start here** if you're a stakeholder or project manager.

---

### 3. Folder Structure Guide
**File:** [`BACKEND_FOLDER_STRUCTURE.md`](./BACKEND_FOLDER_STRUCTURE.md)

Complete folder structure for:
- Root directory organization
- Individual microservice structure
- Shared modules
- Infrastructure (Docker, Kubernetes, Terraform)
- Scripts and documentation
- Best practices and naming conventions

**Start here** if you're setting up the project structure.

---

### 4. Quick Start Guide
**File:** [`BACKEND_QUICK_START_GUIDE.md`](./BACKEND_QUICK_START_GUIDE.md)

Developer onboarding guide including:
- Prerequisites and setup instructions
- Environment configuration
- Docker Compose setup
- Database migration steps
- Testing the authentication flow
- Common issues and solutions
- Development workflow
- Useful commands

**Start here** if you're a new developer joining the team.

---

### 5. API Endpoints Reference
**File:** [`BACKEND_API_ENDPOINTS.md`](./BACKEND_API_ENDPOINTS.md)

Complete API documentation covering:
- Authentication endpoints (OTP flow)
- User profile management
- Feed and posts
- Messaging system
- Connections
- Events
- Marketplace
- Search
- Notifications
- Error codes and response formats

**Start here** if you're integrating with the API or building the frontend.

---

## 🏗️ System Architecture

### High-Level Overview

```
Frontend (React) → Load Balancer (Nginx) → API Gateway (NestJS)
                                              ↓
                    ┌─────────────────────────┼─────────────────────────┐
                    ↓                         ↓                         ↓
            Auth Service              User Service              Feed Service
                    ↓                         ↓                         ↓
            Messaging Service         Events Service         Marketplace Service
                    ↓                         ↓                         ↓
                    └─────────────────────────┼─────────────────────────┘
                                              ↓
                    ┌─────────────────────────┼─────────────────────────┐
                    ↓                         ↓                         ↓
              Supabase (DB)              Redis (Cache)           RabbitMQ (Queue)
```

### Technology Stack

- **Backend Framework:** NestJS (TypeScript)
- **Database:** Supabase (PostgreSQL)
- **Caching:** Redis
- **Containerization:** Docker + Docker Compose
- **Message Queue:** RabbitMQ
- **Email Service:** SendGrid
- **Monitoring:** Prometheus + Grafana
- **Logging:** Winston + ELK Stack

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/smilefactory/backend.git
cd backend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start all services with Docker
docker-compose up

# Run database migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

### Verify Installation

```bash
# Check API Gateway health
curl http://localhost:3000/health

# Access API documentation
open http://localhost:3000/api/docs
```

**For detailed setup instructions, see:** [`BACKEND_QUICK_START_GUIDE.md`](./BACKEND_QUICK_START_GUIDE.md)

---

## 🎯 Key Features

### 1. Unified OTP Authentication
- Single flow for sign-in and sign-up
- Seamless user registration (no rejection messages)
- Email-based identification
- Automatic profile creation for new users
- JWT token-based session management

### 2. Multiple Profiles Per User
- One email/account = multiple profiles
- Support for 6 profile types:
  - Innovator
  - Mentor
  - Investor
  - Academic Student
  - Academic Institution
  - Organization
  - Professional
- Primary profile designation
- Profile completion tracking

### 3. Social Media Features
- Personalized feed system
- Private messaging with real-time updates
- Connection management
- Content organization (posts, events, marketplace)
- Robust search functionality
- Notifications system

### 4. Migration Support
- Seamless data migration from old platform
- Prominent notification banner
- Profile upgrade prompts
- Gradual rollout strategy

---

## 📊 Database Schema

The system uses 18 core tables:

1. **user_accounts** - Base user accounts
2. **profiles** - Multiple profiles per user
3. **posts** - Feed posts
4. **comments** - Post comments
5. **likes** - Likes on posts/comments
6. **connections** - User connections
7. **conversations** - Message conversations
8. **conversation_participants** - Conversation members
9. **messages** - Chat messages
10. **events** - Events
11. **event_registrations** - Event attendees
12. **marketplace_items** - Products/services
13. **bookmarks** - Saved items
14. **notifications** - User notifications
15. **otp_codes** - Temporary OTP storage
16. **profile_metadata** - Extended profile data
17. **migration_records** - Migration tracking

**For complete schema details, see:** [`BACKEND_IMPLEMENTATION_PLAN.md`](./BACKEND_IMPLEMENTATION_PLAN.md#database-design)

---

## 🔐 Security

### Authentication & Authorization
- OTP with 5-minute expiration
- Max 3 verification attempts
- JWT token rotation
- Session invalidation on logout
- HTTPS only for auth endpoints

### Data Protection
- Encryption at rest (Supabase)
- Encryption in transit (TLS)
- Row Level Security (RLS)
- Input validation
- SQL injection prevention
- XSS prevention

### API Security
- CORS configuration
- Rate limiting (Redis)
- Request size limits
- Timeout configurations

---

## 📅 Implementation Timeline

### Phase 1: Foundation (Weeks 1-4)
- Project setup and infrastructure
- API Gateway and Auth Service
- Database schema implementation
- User Profile Service

### Phase 2: Core Features (Weeks 5-8)
- Feed Service
- Messaging Service
- Connection Service
- Events & Marketplace Services

### Phase 3: Advanced Features (Weeks 9-12)
- Search & Notification Services
- Migration Service
- Integration & Testing
- Frontend Integration

### Phase 4: Deployment & Migration (Weeks 13-16)
- Production deployment
- Beta testing
- User migration
- Full launch

**Total Duration:** 16 weeks

---

## 🛠️ Development Workflow

### Running Tests
```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:e2e         # E2E tests
```

### Linting and Formatting
```bash
npm run lint             # Lint code
npm run lint:fix         # Fix linting issues
npm run format           # Format code
```

### Database Operations
```bash
npm run migrate          # Run migrations
npm run migrate:rollback # Rollback last migration
npm run seed             # Seed database
```

---

## 📈 Monitoring and Observability

### Metrics Tracked
- Request rate and response time
- Error rate
- Active users
- Database query performance
- System resources (CPU, memory)

### Tools
- **Monitoring:** Prometheus + Grafana
- **Logging:** Winston + ELK Stack
- **APM:** New Relic or DataDog (optional)

---

## 🔄 Migration to Java (Future)

The architecture is designed for easy migration to Java:

### Design Principles
1. Layered Architecture (Controllers → Services → Repositories)
2. Dependency Injection (similar to Spring)
3. Decorators to Annotations (direct mapping)
4. DTOs and Validation (compatible patterns)
5. Repository Pattern (TypeORM → Spring Data JPA)

### Migration Mapping
- NestJS `@Module()` → Spring `@Configuration`
- NestJS `@Controller()` → Spring `@RestController`
- NestJS `@Injectable()` → Spring `@Service`
- TypeORM Entity → JPA Entity

**For detailed migration path, see:** [`BACKEND_IMPLEMENTATION_PLAN.md`](./BACKEND_IMPLEMENTATION_PLAN.md#technology-migration-path-nodejs-to-java)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Write tests
4. Run linting and tests: `npm run lint && npm test`
5. Commit your changes: `git commit -m "Add your feature"`
6. Push to the branch: `git push origin feature/your-feature`
7. Create a Pull Request

---

## 📞 Getting Help

- **Documentation:** Check the documentation files in this directory
- **Issues:** Create an issue on GitHub
- **Slack:** Join #backend-dev channel
- **Email:** dev-team@smilefactory.com

---

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Redis Documentation](https://redis.io/docs)
- [Docker Documentation](https://docs.docker.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## ✅ Success Criteria

- ✅ All 11 microservices deployed and functional
- ✅ Authentication system working seamlessly
- ✅ Multiple profiles per user supported
- ✅ Migration from old platform completed
- ✅ All social features operational
- ✅ System performance meets SLAs (response time < 200ms)
- ✅ Security audit passed
- ✅ Documentation complete
- ✅ 99.9% uptime achieved

---

## 📄 License

Copyright © 2025 SmileFactory. All rights reserved.

---

**Ready to Build the Future of Innovation! 🚀**

For questions or support, contact the development team lead.


