# Express + MongoDB CRUD API

A modular REST API built with Express and MongoDB, featuring JWT authentication and role-based authorization (admin/member).

## Architecture

This project follows a service-driven architecture with clean separation of concerns:

- **Modules**: Business logic organized by domain (auth, project)
- **Services**: All database and business logic
- **Routes**: Thin request/response handlers
- **Middlewares**: Authentication and authorization
- **ES Modules**: Using import maps for clean imports (`#@/` alias)

## Project Structure

```
src/
  main.js                      # Express app entry point
  databases/connect-mongo.js   # MongoDB connection
  routes/
    index.js                   # Route aggregator
    auth/index.js              # Auth routes
    project/index.js           # Project CRUD routes
  modules/
    auth/
      model/index.js           # User schema
      services/index.js        # Auth services
      index.js
    project/
      model/index.js           # Project schema
      services/index.js        # Project CRUD services
      index.js
  middlewares/
    auth.js                    # JWT verification
    roles.js                   # Role-based authorization
```

## Setup

### Prerequisites

- Node.js v20.6.0 or higher (required for import maps support)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
cd express-mongodb
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/client-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

5. Start the server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "member"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "email": "user@example.com",
    "role": "member",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "email": "user@example.com",
      "role": "member"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Projects

All project endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description",
  "status": "planning",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

#### Get All Projects
```http
GET /api/projects
Authorization: Bearer <token>
```

- **Members**: Only see their own projects
- **Admins**: See all projects

#### Get Single Project
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

#### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "status": "in-progress"
}
```

- **Members**: Can only update their own projects
- **Admins**: Can update any project

#### Delete Project
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

- **Members**: Can only delete their own projects
- **Admins**: Can delete any project

#### Health Check
```http
GET /api/health
```

## Role-Based Authorization

### Roles

- **admin**: Full access to all resources
- **member**: Limited access to own resources only

### Permission Matrix

| Action | Member | Admin |
|--------|--------|-------|
| Create Project | ✅ Own | ✅ All |
| View Projects | ✅ Own | ✅ All |
| Update Project | ✅ Own | ✅ All |
| Delete Project | ✅ Own | ✅ All |

## Authentication Flow

1. User registers or logs in
2. Server returns JWT token
3. Client includes token in `Authorization: Bearer <token>` header
4. Server verifies token and attaches user to request
5. Authorization middleware checks user role and ownership

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Example Usage

### 1. Register a user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"mehdi@example.com","password":"secret123","role":"member"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mehdi@example.com","password":"secret123"}'
```

Save the token from the response.

### 3. Create a project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"My First Project","description":"Testing the API"}'
```

### 4. Get all projects
```bash
curl http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Roadmap

This roadmap outlines the full feature set planned for the API beyond the current MVP.

### Phase 1: MVP (Current) ✅
- [x] Basic authentication (register/login with JWT)
- [x] Role-based authorization (admin/member)
- [x] Project CRUD operations
- [x] MongoDB integration with Mongoose
- [x] Service-driven architecture
- [x] ES Modules with import maps

### Phase 2: Enhanced Authentication & Security
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Refresh token implementation
- [ ] Rate limiting
- [ ] Input validation and sanitization
- [ ] CORS configuration
- [ ] Security headers (helmet.js)
- [ ] Password strength requirements

### Phase 3: Advanced Features
- [ ] Task module (sub-resource of projects)
- [ ] User profile management
- [ ] File upload functionality (avatars, attachments)
- [ ] Search and filtering
- [ ] Pagination
- [ ] Sorting capabilities
- [ ] Audit logging
- [ ] Activity feed

### Phase 4: Collaboration & Communication
- [ ] Team/collaboration features
- [ ] Project invitations
- [ ] Comments on projects
- [ ] Notifications system
- [ ] Real-time updates (WebSockets)
- [ ] Project sharing and permissions

### Phase 5: Analytics & Reporting
- [ ] Dashboard with statistics
- [ ] Project analytics
- [ ] Time tracking
- [ ] Progress reports
- [ ] Export functionality (PDF, CSV)
- [ ] Charts and visualizations

### Phase 6: Integration & Automation
- [ ] Email notifications (Nodemailer)
- [ ] Third-party integrations (Slack, GitHub, etc.)
- [ ] Webhooks
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Automated testing (Jest/Mocha)
- [ ] CI/CD pipeline

### Phase 7: Performance & Scale
- [ ] Caching (Redis)
- [ ] Database indexing optimization
- [ ] Load balancing
- [ ] Performance monitoring
- [ ] Containerization (Docker)
- [ ] Horizontal scaling

### Phase 8: Enterprise Features
- [ ] Multi-tenancy support
- [ ] Custom roles and permissions
- [ ] SSO integration
- [ ] Advanced reporting
- [ ] Data backup and recovery
- [ ] Compliance features (GDPR, etc.)

## Technologies

### Current Stack
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variables

### Planned Technologies
- **Redis** - Caching and sessions
- **Nodemailer** - Email services
- **Socket.io** - Real-time communication
- **Jest** - Testing framework
- **Swagger/OpenAPI** - API documentation
- **Docker** - Containerization
- **Helmet** - Security headers
- **Express-validator** - Input validation
- **Morgan** - HTTP request logger
- **Winston** - Logging

