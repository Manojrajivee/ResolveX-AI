# Runbook Following Agent - Detailed Collection Design

# PHASE 4: DETAILED COLLECTION DESIGN

## COLLECTION 1: Users

### Purpose
Store user account information, authentication credentials, and user status.

### Description
Core user collection containing all user-related data including authentication credentials, profile information, and account status. Supports BCrypt password hashing, account lockout mechanisms, and soft delete functionality.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| username | String | No | Yes | - | 3-50 chars, alphanumeric + underscore, unique |
| email | String | No | Yes | - | Valid email format, unique |
| passwordHash | String | No | Yes | - | BCrypt hash (60 chars) |
| firstName | String | Yes | No | null | 2-50 chars |
| lastName | String | Yes | No | null | 2-50 chars |
| roleId | ObjectId | No | Yes | - | Must reference Roles._id |
| isActive | Boolean | No | Yes | true | - |
| isEmailVerified | Boolean | No | Yes | false | - |
| lastLoginAt | DateTime | Yes | No | null | - |
| failedLoginAttempts | Integer | No | Yes | 0 | 0-10 |
| lockedUntil | DateTime | Yes | No | null | - |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |
| deletedAt | DateTime | Yes | No | null | Soft delete timestamp |

### Unique Constraints
- username
- email

### Foreign Reference Fields
- roleId → Roles._id

### Relationships
- One-to-Many with Sessions
- One-to-Many with Tokens
- One-to-Many with RefreshTokens
- One-to-Many with UserPreferences
- One-to-Many with APIKeys
- One-to-Many with Runbooks
- One-to-Many with Incidents
- One-to-Many with Chats
- Many-to-One with Roles

### Indexes

#### Single Indexes
```javascript
// Username index (unique)
db.Users.createIndex({ username: 1 }, { unique: true })

// Email index (unique)
db.Users.createIndex({ email: 1 }, { unique: true })

// Role ID index
db.Users.createIndex({ roleId: 1 })

// Active status index
db.Users.createIndex({ isActive: 1 })

// Email verified index
db.Users.createIndex({ isEmailVerified: 1 })
```

#### Compound Indexes
```javascript
// Login query optimization
db.Users.createIndex({ email: 1, isActive: 1 })

// User listing with role
db.Users.createIndex({ roleId: 1, isActive: 1 })

// Soft delete filtering
db.Users.createIndex({ deletedAt: 1, isActive: 1 })
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// User login
db.Users.findOne({ 
  email: userEmail, 
  isActive: true, 
  deletedAt: null 
})

// Get user by ID
db.Users.findOne({ 
  _id: userId, 
  deletedAt: null 
})

// List active users with role
db.Users.find({ 
  roleId: roleId, 
  isActive: true, 
  deletedAt: null 
}).sort({ createdAt: -1 })

// Check username availability
db.Users.findOne({ 
  username: username, 
  deletedAt: null 
})
```

### Aggregation Pipelines

```javascript
// User statistics by role
db.Users.aggregate([
  { $match: { deletedAt: null } },
  { $group: { 
    _id: '$roleId',
    count: { $sum: 1 },
    activeCount: { $sum: { $cond: ['$isActive', 1, 0] } },
    verifiedCount: { $sum: { $cond: ['$isEmailVerified', 1, 0] } }
  }},
  { $lookup: {
    from: 'Roles',
    localField: '_id',
    foreignField: '_id',
    as: 'role'
  }}
])

// User activity summary
db.Users.aggregate([
  { $match: { deletedAt: null } },
  { $lookup: {
    from: 'Incidents',
    localField: '_id',
    foreignField: 'createdBy',
    as: 'incidents'
  }},
  { $addFields: {
    incidentCount: { $size: '$incidents' }
  }},
  { $project: {
    username: 1,
    email: 1,
    incidentCount: 1,
    lastLoginAt: 1
  }}
])
```

### Optimization Tips
- Use covered queries for login by including only necessary fields in index
- Implement read concern 'majority' for authentication queries
- Use write concern 'majority' for user creation/update operations
- Cache frequently accessed user data in Redis
- Implement connection pooling for high-traffic authentication

### MongoDB Validation Schema

```javascript
db.createCollection('Users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'passwordHash', 'roleId'],
      properties: {
        _id: { bsonType: 'objectId' },
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 50,
          pattern: '^[a-zA-Z0-9_]+$'
        },
        email: {
          bsonType: 'string',
          pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
        },
        passwordHash: {
          bsonType: 'string',
          minLength: 60,
          maxLength: 60
        },
        firstName: {
          bsonType: ['string', 'null'],
          minLength: 2,
          maxLength: 50
        },
        lastName: {
          bsonType: ['string', 'null'],
          minLength: 2,
          maxLength: 50
        },
        roleId: { bsonType: 'objectId' },
        isActive: { bsonType: 'bool' },
        isEmailVerified: { bsonType: 'bool' },
        lastLoginAt: { bsonType: ['date', 'null'] },
        failedLoginAttempts: {
          bsonType: 'int',
          minimum: 0,
          maximum: 10
        },
        lockedUntil: { bsonType: ['date', 'null'] },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' },
        deletedAt: { bsonType: ['date', 'null'] }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Active admin user
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  username: "admin_john",
  email: "john.doe@company.com",
  passwordHash: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  firstName: "John",
  lastName: "Doe",
  roleId: ObjectId("507f1f77bcf86cd799439020"),
  isActive: true,
  isEmailVerified: true,
  lastLoginAt: ISODate("2024-01-15T10:30:00Z"),
  failedLoginAttempts: 0,
  lockedUntil: null,
  createdAt: ISODate("2023-06-01T08:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z"),
  deletedAt: null
}

// Sample 2: Active regular user
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  username: "engineer_sarah",
  email: "sarah.smith@company.com",
  passwordHash: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  firstName: "Sarah",
  lastName: "Smith",
  roleId: ObjectId("507f1f62bcf86cd799439021"),
  isActive: true,
  isEmailVerified: true,
  lastLoginAt: ISODate("2024-01-14T15:45:00Z"),
  failedLoginAttempts: 0,
  lockedUntil: null,
  createdAt: ISODate("2023-08-15T09:30:00Z"),
  updatedAt: ISODate("2024-01-14T15:45:00Z"),
  deletedAt: null
}

// Sample 3: Locked user
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  username: "user_mike",
  email: "mike.jones@company.com",
  passwordHash: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  firstName: "Mike",
  lastName: "Jones",
  roleId: ObjectId("507f1f62bcf86cd799439021"),
  isActive: true,
  isEmailVerified: true,
  lastLoginAt: ISODate("2024-01-10T08:20:00Z"),
  failedLoginAttempts: 5,
  lockedUntil: ISODate("2024-01-10T18:20:00Z"),
  createdAt: ISODate("2023-09-20T14:00:00Z"),
  updatedAt: ISODate("2024-01-10T08:25:00Z"),
  deletedAt: null
}
```

### CRUD Operations

```javascript
// CREATE
db.Users.insertOne({
  username: "new_user",
  email: "new.user@company.com",
  passwordHash: bcrypt.hash("password123", 10),
  firstName: "New",
  lastName: "User",
  roleId: ObjectId("507f1f62bcf86cd799439021"),
  isActive: true,
  isEmailVerified: false,
  failedLoginAttempts: 0,
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.Users.findOne({ _id: ObjectId("..."), deletedAt: null })

// UPDATE
db.Users.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: { 
      firstName: "Updated",
      updatedAt: new Date()
    }
  }
)

// DELETE (Soft)
db.Users.updateOne(
  { _id: ObjectId("...") },
  { $set: { deletedAt: new Date(), updatedAt: new Date() } }
)
```

### REST APIs using the collection

- POST /api/auth/register → Users, Roles, ActivityLogs
- POST /api/auth/login → Users, Sessions, Tokens, RefreshTokens, ActivityLogs
- GET /api/users/:id → Users
- PUT /api/users/:id → Users, AuditLogs
- DELETE /api/users/:id → Users, AuditLogs, ActivityLogs
- GET /api/users → Users (with pagination)
- POST /api/users/:id/verify-email → Users, ActivityLogs
- POST /api/users/:id/unlock → Users, ActivityLogs

### Security Notes
- Passwords must be hashed using BCrypt before storage
- Implement rate limiting on login endpoints
- Use HTTPS for all authentication requests
- Implement account lockout after 5 failed attempts
- Log all authentication attempts for security monitoring
- Never return password hash in API responses
- Implement password strength requirements at application level

### Future Scalability Notes
- Consider partitioning by region for global deployments
- Implement user data archiving for inactive accounts
- Add support for multi-factor authentication fields
- Consider adding user avatar/image storage references
- Plan for user profile customization fields expansion

---

## COLLECTION 2: Roles

### Purpose
Define user roles with associated permissions for role-based access control (RBAC).

### Description
Stores role definitions and their associated permissions. Each role can have multiple permissions defining what actions users with that role can perform within the system.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| name | String | No | Yes | - | 3-50 chars, unique, case-insensitive |
| description | String | Yes | No | null | Max 500 chars |
| permissions | Array[String] | No | Yes | [] | Array of permission strings |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- name

### Foreign Reference Fields
None

### Relationships
- One-to-Many with Users

### Indexes

#### Single Indexes
```javascript
// Name index (unique, case-insensitive)
db.Roles.createIndex({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })

// Permission index for lookup
db.Roles.createIndex({ permissions: 1 })
```

#### Compound Indexes
None

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get role by name
db.Roles.findOne({ name: "ADMIN" })

// Get all roles
db.Roles.find({}).sort({ name: 1 })

// Check if permission exists in role
db.Roles.findOne({ 
  _id: roleId, 
  permissions: { $in: ["INCIDENT_CREATE"] } 
})
```

### Aggregation Pipelines

```javascript
// Role usage statistics
db.Roles.aggregate([
  { $lookup: {
    from: 'Users',
    localField: '_id',
    foreignField: 'roleId',
    as: 'users'
  }},
  { $addFields: {
    userCount: { $size: '$users' }
  }},
  { $project: {
    name: 1,
    description: 1,
    userCount: 1,
    permissions: 1
  }}
])

// Permission matrix
db.Roles.aggregate([
  { $unwind: '$permissions' },
  { $group: {
    _id: '$permissions',
    roles: { $push: '$name' }
  }}
])
```

### Optimization Tips
- Cache role definitions in memory as they change infrequently
- Use read concern 'local' for role lookups (eventual consistency acceptable)
- Implement role permission caching at application level
- Consider using a separate cache for permission checks

### MongoDB Validation Schema

```javascript
db.createCollection('Roles', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'permissions'],
      properties: {
        _id: { bsonType: 'objectId' },
        name: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 50,
          pattern: '^[A-Z_]+$'
        },
        description: {
          bsonType: ['string', 'null'],
          maxLength: 500
        },
        permissions: {
          bsonType: 'array',
          items: { bsonType: 'string' }
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Admin role
{
  _id: ObjectId("507f1f77bcf86cd799439020"),
  name: "ADMIN",
  description: "Full system access with all permissions",
  permissions: [
    "USER_CREATE",
    "USER_READ",
    "USER_UPDATE",
    "USER_DELETE",
    "RUNBOOK_UPLOAD",
    "RUNBOOK_READ",
    "RUNBOOK_UPDATE",
    "RUNBOOK_DELETE",
    "INCIDENT_CREATE",
    "INCIDENT_READ",
    "INCIDENT_UPDATE",
    "INCIDENT_DELETE",
    "COMMAND_EXECUTE",
    "COMMAND_APPROVE",
    "REPORT_GENERATE",
    "SYSTEM_CONFIG"
  ],
  createdAt: ISODate("2023-01-01T00:00:00Z"),
  updatedAt: ISODate("2023-01-01T00:00:00Z")
}

// Sample 2: Engineer role
{
  _id: ObjectId("507f1f62bcf86cd799439021"),
  name: "ENGINEER",
  description: "Standard engineer with incident resolution permissions",
  permissions: [
    "USER_READ",
    "RUNBOOK_READ",
    "INCIDENT_CREATE",
    "INCIDENT_READ",
    "INCIDENT_UPDATE",
    "COMMAND_EXECUTE",
    "REPORT_GENERATE"
  ],
  createdAt: ISODate("2023-01-01T00:00:00Z"),
  updatedAt: ISODate("2023-01-01T00:00:00Z")
}

// Sample 3: Viewer role
{
  _id: ObjectId("507f1f62bcf86cd799439022"),
  name: "VIEWER",
  description: "Read-only access for viewing incidents and reports",
  permissions: [
    "USER_READ",
    "RUNBOOK_READ",
    "INCIDENT_READ",
    "REPORT_READ"
  ],
  createdAt: ISODate("2023-01-01T00:00:00Z"),
  updatedAt: ISODate("2023-01-01T00:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.Roles.insertOne({
  name: "MANAGER",
  description: "Manager with approval permissions",
  permissions: ["INCIDENT_READ", "INCIDENT_UPDATE", "COMMAND_APPROVE"],
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.Roles.findOne({ _id: ObjectId("...") })

// UPDATE
db.Roles.updateOne(
  { _id: ObjectId("...") },
  { 
    $push: { permissions: "NEW_PERMISSION" },
    $set: { updatedAt: new Date() }
  }
)

// DELETE
db.Roles.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/roles → Roles
- GET /api/roles/:id → Roles
- POST /api/roles → Roles, AuditLogs
- PUT /api/roles/:id → Roles, AuditLogs
- DELETE /api/roles/:id → Roles, AuditLogs

### Security Notes
- Role changes should require admin approval
- Audit all role modifications
- Implement role hierarchy validation at application level
- Prevent self-privilege escalation
- Log all permission changes

### Future Scalability Notes
- Consider adding role hierarchy/inheritance
- Add support for temporary role assignments
- Implement role expiration for temporary access
- Consider adding role-based data partitioning

---

## COLLECTION 3: Sessions

### Purpose
Manage active user sessions for authentication and session tracking.

### Description
Stores active user session information including session tokens, IP addresses, user agents, and expiration times. Supports session invalidation and tracking of concurrent sessions.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| token | String | No | Yes | - | UUID v4, unique |
| ipAddress | String | No | Yes | - | Valid IPv4/IPv6 |
| userAgent | String | Yes | No | null | Max 500 chars |
| expiresAt | DateTime | No | Yes | - | Must be future timestamp |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- token

### Foreign Reference Fields
- userId → Users._id

### Relationships
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// Token index (unique)
db.Sessions.createIndex({ token: 1 }, { unique: true })

// User ID index
db.Sessions.createIndex({ userId: 1 })

// Expiration index for cleanup
db.Sessions.createIndex({ expiresAt: 1 })
```

#### Compound Indexes
```javascript
// User active sessions query
db.Sessions.createIndex({ userId: 1, expiresAt: 1 })
```

#### TTL Indexes
```javascript
// Auto-expire sessions after expiration
db.Sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Recommended Queries

```javascript
// Validate session
db.Sessions.findOne({ 
  token: sessionToken, 
  expiresAt: { $gt: new Date() } 
})

// Get user sessions
db.Sessions.find({ 
  userId: userId, 
  expiresAt: { $gt: new Date() } 
})

// Invalidate user sessions
db.Sessions.deleteMany({ userId: userId })
```

### Aggregation Pipelines

```javascript
// Active sessions per user
db.Sessions.aggregate([
  { $match: { expiresAt: { $gt: new Date() } } },
  { $group: {
    _id: '$userId',
    sessionCount: { $sum: 1 },
    lastActivity: { $max: '$createdAt' }
  }},
  { $lookup: {
    from: 'Users',
    localField: '_id',
    foreignField: '_id',
    as: 'user'
  }}
])

// Session analytics by IP
db.Sessions.aggregate([
  { $group: {
    _id: '$ipAddress',
    sessionCount: { $sum: 1 },
    uniqueUsers: { $addToSet: '$userId' }
  }},
  { $addFields: {
    uniqueUserCount: { $size: '$uniqueUsers' }
  }}
])
```

### Optimization Tips
- Use TTL index for automatic session cleanup
- Implement session caching in Redis for faster lookups
- Use read concern 'local' for session validation
- Implement session limit per user at application level
- Consider using connection pooling for session operations

### MongoDB Validation Schema

```javascript
db.createCollection('Sessions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'token', 'ipAddress', 'expiresAt'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        token: {
          bsonType: 'string',
          pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        },
        ipAddress: {
          bsonType: 'string',
          pattern: '^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$'
        },
        userAgent: {
          bsonType: ['string', 'null'],
          maxLength: 500
        },
        expiresAt: { bsonType: 'date' },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Active session
{
  _id: ObjectId("507f1f77bcf86cd799439030"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  token: "550e8400-e29b-41d4-a716-446655440000",
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  expiresAt: ISODate("2024-01-16T10:30:00Z"),
  createdAt: ISODate("2024-01-15T10:30:00Z")
}

// Sample 2: Mobile session
{
  _id: ObjectId("507f1f77bcf86cd799439031"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  token: "660e8400-e29b-41d4-a716-446655440001",
  ipAddress: "10.0.0.50",
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
  expiresAt: ISODate("2024-01-16T15:45:00Z"),
  createdAt: ISODate("2024-01-15T15:45:00Z")
}

// Sample 3: Session from VPN
{
  _id: ObjectId("507f1f77bcf86cd799439032"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  token: "770e8400-e29b-41d4-a716-446655440002",
  ipAddress: "203.0.113.50",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  expiresAt: ISODate("2024-01-16T08:00:00Z"),
  createdAt: ISODate("2024-01-15T08:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.Sessions.insertOne({
  userId: ObjectId("..."),
  token: UUID.generate(),
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  createdAt: new Date()
})

// READ
db.Sessions.findOne({ token: "..." })

// UPDATE (extend session)
db.Sessions.updateOne(
  { token: "..." },
  { $set: { expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } }
)

// DELETE
db.Sessions.deleteOne({ token: "..." })
```

### REST APIs using the collection

- POST /api/auth/login → Users, Sessions, Tokens, RefreshTokens, ActivityLogs
- POST /api/auth/logout → Sessions, ActivityLogs
- POST /api/auth/refresh → Sessions, Tokens, RefreshTokens
- GET /api/auth/sessions → Sessions
- DELETE /api/auth/sessions/:id → Sessions, ActivityLogs
- DELETE /api/auth/sessions → Sessions (invalidate all)

### Security Notes
- Implement session timeout mechanism
- Detect and prevent session hijacking (IP/user-agent changes)
- Limit concurrent sessions per user
- Implement secure session token generation (UUID v4)
- Log session creation and destruction
- Use secure, HTTP-only cookies for session tokens

### Future Scalability Notes
- Consider adding session metadata (location, device type)
- Implement session analytics for security monitoring
- Add support for session sharing across devices
- Consider implementing session persistence preferences

---

## COLLECTION 4: Tokens

### Purpose
Store JWT access tokens for authentication.

### Description
Stores JWT access tokens with their associated user IDs, token types, and expiration times. Supports token validation and revocation.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| token | String | No | Yes | - | JWT string, unique |
| type | String | No | Yes | - | Enum: ACCESS, RESET, VERIFY |
| expiresAt | DateTime | No | Yes | - | Must be future timestamp |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- token

### Foreign Reference Fields
- userId → Users._id

### Relationships
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// Token index (unique)
db.Tokens.createIndex({ token: 1 }, { unique: true })

// User ID index
db.Tokens.createIndex({ userId: 1 })

// Token type index
db.Tokens.createIndex({ type: 1 })

// Expiration index for cleanup
db.Tokens.createIndex({ expiresAt: 1 })
```

#### Compound Indexes
```javascript
// User tokens by type
db.Tokens.createIndex({ userId: 1, type: 1, expiresAt: 1 })
```

#### TTL Indexes
```javascript
// Auto-expire tokens after expiration
db.Tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Recommended Queries

```javascript
// Validate access token
db.Tokens.findOne({ 
  token: accessToken, 
  type: "ACCESS",
  expiresAt: { $gt: new Date() } 
})

// Get user tokens
db.Tokens.find({ 
  userId: userId, 
  expiresAt: { $gt: new Date() } 
})

// Invalidate user tokens
db.Tokens.deleteMany({ userId: userId })
```

### Aggregation Pipelines

```javascript
// Active tokens per user
db.Tokens.aggregate([
  { $match: { expiresAt: { $gt: new Date() } } },
  { $group: {
    _id: { userId: '$userId', type: '$type' },
    count: { $sum: 1 }
  }}
])

// Token type distribution
db.Tokens.aggregate([
  { $match: { expiresAt: { $gt: new Date() } } },
  { $group: {
    _id: '$type',
    count: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Use TTL index for automatic token cleanup
- Cache valid tokens in Redis for faster validation
- Use read concern 'local' for token validation
- Implement token blacklisting for immediate revocation
- Consider using short-lived access tokens (15-30 minutes)

### MongoDB Validation Schema

```javascript
db.createCollection('Tokens', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'token', 'type', 'expiresAt'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        token: { bsonType: 'string' },
        type: {
          bsonType: 'string',
          enum: ['ACCESS', 'RESET', 'VERIFY']
        },
        expiresAt: { bsonType: 'date' },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Access token
{
  _id: ObjectId("507f1f77bcf86cd799439040"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  type: "ACCESS",
  expiresAt: ISODate("2024-01-15T11:00:00Z"),
  createdAt: ISODate("2024-01-15T10:30:00Z")
}

// Sample 2: Password reset token
{
  _id: ObjectId("507f1f77bcf86cd799439041"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  type: "RESET",
  expiresAt: ISODate("2024-01-16T15:45:00Z"),
  createdAt: ISODate("2024-01-15T15:45:00Z")
}

// Sample 3: Email verification token
{
  _id: ObjectId("507f1f77bcf86cd799439042"),
  userId: ObjectId("507f1f77bcf86cd799439013"),
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  type: "VERIFY",
  expiresAt: ISODate("2024-01-22T08:00:00Z"),
  createdAt: ISODate("2024-01-15T08:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.Tokens.insertOne({
  userId: ObjectId("..."),
  token: jwt.sign({ userId: "..." }, secret, { expiresIn: '30m' }),
  type: "ACCESS",
  expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  createdAt: new Date()
})

// READ
db.Tokens.findOne({ token: "..." })

// DELETE
db.Tokens.deleteOne({ token: "..." })
```

### REST APIs using the collection

- POST /api/auth/login → Users, Sessions, Tokens, RefreshTokens, ActivityLogs
- POST /api/auth/refresh → Tokens, RefreshTokens
- POST /api/auth/logout → Tokens, Sessions, ActivityLogs
- POST /api/auth/reset-password → Tokens, Users, ActivityLogs
- POST /api/auth/verify-email → Tokens, Users, ActivityLogs

### Security Notes
- Use strong JWT signing secrets
- Implement token rotation on refresh
- Use short expiration times for access tokens
- Validate token signature on every request
- Implement token revocation for compromised tokens
- Never store sensitive data in JWT payload

### Future Scalability Notes
- Consider adding token metadata (device, location)
- Implement token usage analytics
- Add support for token scopes/permissions
- Consider implementing token refresh limits

---

## COLLECTION 5: RefreshTokens

### Purpose
Store JWT refresh tokens for token renewal without re-authentication.

### Description
Stores refresh tokens that allow users to obtain new access tokens without re-entering credentials. Refresh tokens have longer lifetimes than access tokens and can be revoked.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| token | String | No | Yes | - | JWT string, unique |
| refreshToken | String | No | Yes | - | Secure random string, unique |
| expiresAt | DateTime | No | Yes | - | Must be future timestamp |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| isRevoked | Boolean | No | Yes | false | - |

### Unique Constraints
- token
- refreshToken

### Foreign Reference Fields
- userId → Users._id

### Relationships
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// Token index (unique)
db.RefreshTokens.createIndex({ token: 1 }, { unique: true })

// Refresh token index (unique)
db.RefreshTokens.createIndex({ refreshToken: 1 }, { unique: true })

// User ID index
db.RefreshTokens.createIndex({ userId: 1 })

// Expiration index for cleanup
db.RefreshTokens.createIndex({ expiresAt: 1 })

// Revoked status index
db.RefreshTokens.createIndex({ isRevoked: 1 })
```

#### Compound Indexes
```javascript
// Valid refresh tokens for user
db.RefreshTokens.createIndex({ 
  userId: 1, 
  isRevoked: 1, 
  expiresAt: 1 
})
```

#### TTL Indexes
```javascript
// Auto-expire refresh tokens after expiration
db.RefreshTokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Recommended Queries

```javascript
// Validate refresh token
db.RefreshTokens.findOne({ 
  refreshToken: refreshToken, 
  isRevoked: false,
  expiresAt: { $gt: new Date() } 
})

// Get user refresh tokens
db.RefreshTokens.find({ 
  userId: userId, 
  isRevoked: false,
  expiresAt: { $gt: new Date() } 
})

// Revoke refresh token
db.RefreshTokens.updateOne(
  { refreshToken: refreshToken },
  { $set: { isRevoked: true } }
)
```

### Aggregation Pipelines

```javascript
// Active refresh tokens per user
db.RefreshTokens.aggregate([
  { $match: { 
    isRevoked: false,
    expiresAt: { $gt: new Date() } 
  }},
  { $group: {
    _id: '$userId',
    tokenCount: { $sum: 1 }
  }}
])

// Refresh token usage analytics
db.RefreshTokens.aggregate([
  { $group: {
    _id: {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
      day: { $dayOfMonth: '$createdAt' }
    },
    created: { $sum: 1 },
    revoked: { $sum: { $cond: ['$isRevoked', 1, 0] } }
  }}
])
```

### Optimization Tips
- Use TTL index for automatic token cleanup
- Implement refresh token rotation (issue new on each use)
- Use longer expiration times (7-30 days)
- Limit number of active refresh tokens per user
- Implement refresh token family tracking for security

### MongoDB Validation Schema

```javascript
db.createCollection('RefreshTokens', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'token', 'refreshToken', 'expiresAt'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        token: { bsonType: 'string' },
        refreshToken: {
          bsonType: 'string',
          minLength: 32
        },
        expiresAt: { bsonType: 'date' },
        createdAt: { bsonType: 'date' },
        isRevoked: { bsonType: 'bool' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Active refresh token
{
  _id: ObjectId("507f1f77bcf86cd799439050"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  expiresAt: ISODate("2024-02-14T10:30:00Z"),
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  isRevoked: false
}

// Sample 2: Revoked refresh token
{
  _id: ObjectId("507f1f77bcf86cd799439051"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7",
  expiresAt: ISODate("2024-02-14T15:45:00Z"),
  createdAt: ISODate("2024-01-15T15:45:00Z"),
  isRevoked: true
}

// Sample 3: Expired refresh token
{
  _id: ObjectId("507f1f77bcf86cd799439052"),
  userId: ObjectId("507f1f77bcf86cd799439013"),
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8",
  expiresAt: ISODate("2024-01-10T08:00:00Z"),
  createdAt: ISODate("2024-01-05T08:00:00Z"),
  isRevoked: false
}
```

### CRUD Operations

```javascript
// CREATE
db.RefreshTokens.insertOne({
  userId: ObjectId("..."),
  token: jwt.sign({ userId: "..." }, secret, { expiresIn: '30d' }),
  refreshToken: crypto.randomBytes(32).toString('hex'),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
  isRevoked: false
})

// READ
db.RefreshTokens.findOne({ refreshToken: "..." })

// UPDATE (revoke)
db.RefreshTokens.updateOne(
  { refreshToken: "..." },
  { $set: { isRevoked: true } }
)

// DELETE
db.RefreshTokens.deleteOne({ refreshToken: "..." })
```

### REST APIs using the collection

- POST /api/auth/login → Users, Sessions, Tokens, RefreshTokens, ActivityLogs
- POST /api/auth/refresh → Tokens, RefreshTokens
- POST /api/auth/logout → Tokens, RefreshTokens, Sessions, ActivityLogs
- POST /api/auth/revoke → RefreshTokens, ActivityLogs

### Security Notes
- Implement refresh token rotation on every use
- Revoke all refresh tokens on password change
- Limit refresh token lifetime (7-30 days)
- Detect and prevent refresh token reuse attacks
- Implement refresh token family tracking
- Log all refresh token usage

### Future Scalability Notes
- Consider adding device fingerprinting
- Implement refresh token usage analytics
- Add support for refresh token scopes
- Consider implementing refresh token inheritance

---

## COLLECTION 6: UserPreferences

### Purpose
Store user-specific preferences and settings.

### Description
Stores user preferences including theme settings, notification preferences, privacy settings, and other customizable options. Supports per-user customization of the application experience.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id, unique |
| theme | Object | Yes | No | { mode: 'light' } | Theme configuration object |
| notifications | Object | Yes | No | { email: true, push: true } | Notification preferences |
| privacy | Object | Yes | No | { profileVisible: true } | Privacy settings |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- userId

### Foreign Reference Fields
- userId → Users._id

### Relationships
- One-to-One with Users

### Indexes

#### Single Indexes
```javascript
// User ID index (unique)
db.UserPreferences.createIndex({ userId: 1 }, { unique: true })
```

#### Compound Indexes
None

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get user preferences
db.UserPreferences.findOne({ userId: userId })

// Update user preferences
db.UserPreferences.updateOne(
  { userId: userId },
  { $set: { theme: { mode: 'dark' }, updatedAt: new Date() } }
)
```

### Aggregation Pipelines

```javascript
// Theme usage statistics
db.UserPreferences.aggregate([
  { $group: {
    _id: '$theme.mode',
    count: { $sum: 1 }
  }}
])

// Notification preference distribution
db.UserPreferences.aggregate([
  { $group: {
    _id: {
      email: '$notifications.email',
      push: '$notifications.push'
    },
    count: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Cache user preferences in memory for fast access
- Use read concern 'local' for preference reads
- Implement preference change logging
- Consider using a separate cache for frequently accessed preferences

### MongoDB Validation Schema

```javascript
db.createCollection('UserPreferences', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        theme: {
          bsonType: ['object', 'null'],
          properties: {
            mode: { bsonType: 'string', enum: ['light', 'dark', 'auto'] },
            primaryColor: { bsonType: 'string' },
            fontSize: { bsonType: 'string' }
          }
        },
        notifications: {
          bsonType: ['object', 'null'],
          properties: {
            email: { bsonType: 'bool' },
            push: { bsonType: 'bool' },
            inApp: { bsonType: 'bool' }
          }
        },
        privacy: {
          bsonType: ['object', 'null'],
          properties: {
            profileVisible: { bsonType: 'bool' },
            activityVisible: { bsonType: 'bool' }
          }
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Dark theme user
{
  _id: ObjectId("507f1f77bcf86cd799439060"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  theme: {
    mode: "dark",
    primaryColor: "#3b82f6",
    fontSize: "medium"
  },
  notifications: {
    email: true,
    push: true,
    inApp: true
  },
  privacy: {
    profileVisible: true,
    activityVisible: false
  },
  createdAt: ISODate("2023-06-01T08:00:00Z"),
  updatedAt: ISODate("2024-01-10T14:30:00Z")
}

// Sample 2: Light theme user
{
  _id: ObjectId("507f1f77bcf86cd799439061"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  theme: {
    mode: "light",
    primaryColor: "#10b981",
    fontSize: "small"
  },
  notifications: {
    email: false,
    push: true,
    inApp: true
  },
  privacy: {
    profileVisible: false,
    activityVisible: false
  },
  createdAt: ISODate("2023-08-15T09:30:00Z"),
  updatedAt: ISODate("2024-01-05T11:20:00Z")
}

// Sample 3: Auto theme user
{
  _id: ObjectId("507f1f77bcf86cd799439062"),
  userId: ObjectId("507f1f77bcf86cd799439013"),
  theme: {
    mode: "auto",
    primaryColor: "#8b5cf6",
    fontSize: "large"
  },
  notifications: {
    email: true,
    push: false,
    inApp: false
  },
  privacy: {
    profileVisible: true,
    activityVisible: true
  },
  createdAt: ISODate("2023-09-20T14:00:00Z"),
  updatedAt: ISODate("2024-01-12T09:15:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.UserPreferences.insertOne({
  userId: ObjectId("..."),
  theme: { mode: 'light' },
  notifications: { email: true, push: true },
  privacy: { profileVisible: true },
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.UserPreferences.findOne({ userId: ObjectId("...") })

// UPDATE
db.UserPreferences.updateOne(
  { userId: ObjectId("...") },
  { 
    $set: { 
      'theme.mode': 'dark',
      updatedAt: new Date()
    }
  }
)

// DELETE
db.UserPreferences.deleteOne({ userId: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/users/:id/preferences → UserPreferences
- PUT /api/users/:id/preferences → UserPreferences, AuditLogs
- PATCH /api/users/:id/preferences → UserPreferences, AuditLogs

### Security Notes
- Validate preference updates against allowed values
- Implement preference change logging
- Prevent users from modifying critical system settings
- Sanitize all preference inputs

### Future Scalability Notes
- Consider adding more granular notification preferences
- Add support for custom themes
- Implement preference templates
- Consider adding accessibility settings

---

## COLLECTION 7: APIKeys

### Purpose
Manage API keys for programmatic access to the system.

### Description
Stores API keys for users to access the system programmatically. Each API key has associated scopes, expiration times, and usage tracking. Supports key revocation and rotation.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| name | String | No | Yes | - | 3-100 chars |
| keyHash | String | No | Yes | - | SHA-256 hash, unique |
| scopes | Array[String] | No | Yes | [] | Array of permission scopes |
| expiresAt | DateTime | Yes | No | null | Future timestamp or null |
| lastUsedAt | DateTime | Yes | No | null | - |
| isActive | Boolean | No | Yes | true | - |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- keyHash

### Foreign Reference Fields
- userId → Users._id

### Relationships
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// Key hash index (unique)
db.APIKeys.createIndex({ keyHash: 1 }, { unique: true })

// User ID index
db.APIKeys.createIndex({ userId: 1 })

// Active status index
db.APIKeys.createIndex({ isActive: 1 })

// Expiration index for cleanup
db.APIKeys.createIndex({ expiresAt: 1 })
```

#### Compound Indexes
```javascript
// Active user API keys
db.APIKeys.createIndex({ 
  userId: 1, 
  isActive: 1, 
  expiresAt: 1 
})
```

#### TTL Indexes
```javascript
// Auto-expire API keys after expiration
db.APIKeys.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Recommended Queries

```javascript
// Validate API key
db.APIKeys.findOne({ 
  keyHash: hash(apiKey), 
  isActive: true,
  $or: [
    { expiresAt: null },
    { expiresAt: { $gt: new Date() } }
  ]
})

// Get user API keys
db.APIKeys.find({ 
  userId: userId,
  isActive: true 
})

// Update last used timestamp
db.APIKeys.updateOne(
  { keyHash: hash(apiKey) },
  { $set: { lastUsedAt: new Date() } }
)
```

### Aggregation Pipelines

```javascript
// API key usage statistics
db.APIKeys.aggregate([
  { $match: { isActive: true } },
  { $group: {
    _id: '$userId',
    keyCount: { $sum: 1 },
    lastUsed: { $max: '$lastUsedAt' }
  }},
  { $lookup: {
    from: 'Users',
    localField: '_id',
    foreignField: '_id',
    as: 'user'
  }}
])

// Scope distribution
db.APIKeys.aggregate([
  { $unwind: '$scopes' },
  { $group: {
    _id: '$scopes',
    count: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Never store raw API keys, only store hashes
- Use strong hashing algorithm (SHA-256 or better)
- Implement API key rotation policy
- Limit API key scopes to minimum required
- Use read concern 'local' for API key validation
- Cache valid API key hashes in Redis

### MongoDB Validation Schema

```javascript
db.createCollection('APIKeys', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'name', 'keyHash', 'scopes'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        name: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 100
        },
        keyHash: {
          bsonType: 'string',
          minLength: 64,
          maxLength: 64
        },
        scopes: {
          bsonType: 'array',
          items: { bsonType: 'string' }
        },
        expiresAt: { bsonType: ['date', 'null'] },
        lastUsedAt: { bsonType: ['date', 'null'] },
        isActive: { bsonType: 'bool' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Active API key
{
  _id: ObjectId("507f1f77bcf86cd799439070"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  name: "Production API Key",
  keyHash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  scopes: ["incidents:read", "incidents:create", "runbooks:read"],
  expiresAt: ISODate("2024-07-15T10:30:00Z"),
  lastUsedAt: ISODate("2024-01-15T10:30:00Z"),
  isActive: true,
  createdAt: ISODate("2024-01-01T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}

// Sample 2: Revoked API key
{
  _id: ObjectId("507f1f77bcf86cd799439071"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  name: "Test API Key",
  keyHash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3",
  scopes: ["incidents:read"],
  expiresAt: null,
  lastUsedAt: ISODate("2024-01-10T15:45:00Z"),
  isActive: false,
  createdAt: ISODate("2023-12-01T15:45:00Z"),
  updatedAt: ISODate("2024-01-10T16:00:00Z")
}

// Sample 3: Expired API key
{
  _id: ObjectId("507f1f77bcf86cd799439072"),
  userId: ObjectId("507f1f77bcf86cd799439013"),
  name: "Temporary API Key",
  keyHash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4",
  scopes: ["incidents:read", "incidents:update"],
  expiresAt: ISODate("2024-01-10T08:00:00Z"),
  lastUsedAt: ISODate("2024-01-09T08:00:00Z"),
  isActive: true,
  createdAt: ISODate("2024-01-05T08:00:00Z"),
  updatedAt: ISODate("2024-01-09T08:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.APIKeys.insertOne({
  userId: ObjectId("..."),
  name: "My API Key",
  keyHash: crypto.createHash('sha256').update(apiKey).digest('hex'),
  scopes: ["incidents:read", "runbooks:read"],
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.APIKeys.findOne({ _id: ObjectId("...") })

// UPDATE
db.APIKeys.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: { 
      isActive: false,
      updatedAt: new Date()
    }
  }
)

// DELETE
db.APIKeys.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/users/:id/api-keys → APIKeys
- POST /api/users/:id/api-keys → APIKeys, AuditLogs
- PUT /api/users/:id/api-keys/:keyId → APIKeys, AuditLogs
- DELETE /api/users/:id/api-keys/:keyId → APIKeys, AuditLogs
- POST /api/api-keys/validate → APIKeys

### Security Notes
- Never return raw API keys in API responses
- Show API key only once during creation
- Implement API key rate limiting
- Log all API key usage
- Implement API key rotation policy
- Use secure random generation for API keys

### Future Scalability Notes
- Consider adding IP whitelisting for API keys
- Implement API key usage analytics
- Add support for API key groups
- Consider implementing API key inheritance

---

## COLLECTION 8: SystemSettings

### Purpose
Store system-wide configuration settings.

### Description
Stores global system configuration including feature flags, system limits, integration settings, and other system-wide parameters. Supports dynamic configuration updates without application restart.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| key | String | No | Yes | - | 3-100 chars, unique |
| value | String | No | Yes | - | Setting value |
| type | String | No | Yes | - | Enum: STRING, NUMBER, BOOLEAN, JSON |
| category | String | No | Yes | - | Setting category |
| description | String | Yes | No | null | Max 500 chars |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- key

### Foreign Reference Fields
None

### Relationships
- One-to-Many with various collections (referenced by key)

### Indexes

#### Single Indexes
```javascript
// Key index (unique)
db.SystemSettings.createIndex({ key: 1 }, { unique: true })

// Category index
db.SystemSettings.createIndex({ category: 1 })

// Type index
db.SystemSettings.createIndex({ type: 1 })
```

#### Compound Indexes
```javascript
// Settings by category
db.SystemSettings.createIndex({ category: 1, key: 1 })
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get setting by key
db.SystemSettings.findOne({ key: "MAX_UPLOAD_SIZE" })

// Get settings by category
db.SystemSettings.find({ category: "FILE_UPLOAD" })

// Update setting
db.SystemSettings.updateOne(
  { key: "MAX_UPLOAD_SIZE" },
  { $set: { value: "104857600", updatedAt: new Date() } }
)
```

### Aggregation Pipelines

```javascript
// Settings by category
db.SystemSettings.aggregate([
  { $group: {
    _id: '$category',
    count: { $sum: 1 },
    settings: { $push: { key: '$key', value: '$value' } }
  }}
])
```

### Optimization Tips
- Cache system settings in memory for fast access
- Implement setting change notifications
- Use read concern 'local' for setting reads
- Implement setting validation at application level
- Consider using a configuration service for distributed systems

### MongoDB Validation Schema

```javascript
db.createCollection('SystemSettings', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['key', 'value', 'type', 'category'],
      properties: {
        _id: { bsonType: 'objectId' },
        key: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 100,
          pattern: '^[A-Z_]+$'
        },
        value: { bsonType: 'string' },
        type: {
          bsonType: 'string',
          enum: ['STRING', 'NUMBER', 'BOOLEAN', 'JSON']
        },
        category: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 50
        },
        description: {
          bsonType: ['string', 'null'],
          maxLength: 500
        },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: File upload setting
{
  _id: ObjectId("507f1f77bcf86cd799439080"),
  key: "MAX_UPLOAD_SIZE",
  value: "104857600",
  type: "NUMBER",
  category: "FILE_UPLOAD",
  description: "Maximum file upload size in bytes (100MB)",
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}

// Sample 2: Feature flag
{
  _id: ObjectId("507f1f77bcf86cd799439081"),
  key: "ENABLE_AI_AGENTS",
  value: "true",
  type: "BOOLEAN",
  category: "FEATURE_FLAGS",
  description: "Enable AI agent functionality",
  updatedAt: ISODate("2024-01-15T10:00:00Z")
}

// Sample 3: Integration setting
{
  _id: ObjectId("507f1f77bcf86cd799439082"),
  key: "OPENAI_API_TIMEOUT",
  value: "30000",
  type: "NUMBER",
  category: "INTEGRATIONS",
  description: "OpenAI API timeout in milliseconds",
  updatedAt: ISODate("2024-01-10T14:30:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.SystemSettings.insertOne({
  key: "NEW_SETTING",
  value: "default_value",
  type: "STRING",
  category: "GENERAL",
  description: "New system setting",
  updatedAt: new Date()
})

// READ
db.SystemSettings.findOne({ key: "MAX_UPLOAD_SIZE" })

// UPDATE
db.SystemSettings.updateOne(
  { key: "MAX_UPLOAD_SIZE" },
  { $set: { value: "209715200", updatedAt: new Date() } }
)

// DELETE
db.SystemSettings.deleteOne({ key: "OLD_SETTING" })
```

### REST APIs using the collection

- GET /api/system/settings → SystemSettings
- GET /api/system/settings/:key → SystemSettings
- PUT /api/system/settings/:key → SystemSettings, AuditLogs
- POST /api/system/settings → SystemSettings, AuditLogs
- DELETE /api/system/settings/:key → SystemSettings, AuditLogs

### Security Notes
- Restrict system setting modifications to admin users
- Audit all setting changes
- Validate setting values before applying
- Implement setting change approval workflow
- Log setting access for security monitoring

### Future Scalability Notes
- Consider adding setting versioning
- Implement setting rollback functionality
- Add support for environment-specific settings
- Consider implementing setting inheritance

---

## COLLECTION 9: Runbooks

### Purpose
Store runbook metadata and file information.

### Description
Stores comprehensive metadata about uploaded runbooks including file information, processing status, version tracking, and embedding generation status. Tracks the complete lifecycle of a runbook from upload to processing.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| title | String | No | Yes | - | 3-200 chars |
| description | String | Yes | No | null | Max 2000 chars |
| uploadedBy | ObjectId | No | Yes | - | Must reference Users._id |
| originalFileName | String | No | Yes | - | Original file name |
| fileName | String | No | Yes | - | Stored file name |
| fileType | String | No | Yes | - | File extension (pdf, md, txt) |
| fileSize | Long | No | Yes | - | File size in bytes |
| fileHash | String | No | Yes | - | SHA-256 hash |
| checksum | String | No | Yes | - | MD5 checksum |
| storagePath | String | No | Yes | - | File storage path |
| version | Integer | No | Yes | 1 | Version number |
| status | String | No | Yes | "DRAFT" | Enum: DRAFT, PUBLISHED, ARCHIVED |
| processingStatus | String | No | Yes | "PENDING" | Enum: PENDING, PROCESSING, COMPLETED, FAILED |
| parserStatus | String | No | Yes | "PENDING" | Enum: PENDING, PROCESSING, COMPLETED, FAILED |
| chunkCount | Integer | Yes | No | 0 | Number of chunks |
| embeddingStatus | String | No | Yes | "PENDING" | Enum: PENDING, PROCESSING, COMPLETED, FAILED |
| vectorIds | Array[String] | No | Yes | [] | ChromaDB vector IDs |
| uploadedAt | DateTime | No | Yes | Current timestamp | - |
| processedAt | DateTime | Yes | No | null | Processing completion time |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |
| deletedAt | DateTime | Yes | No | null | Soft delete timestamp |

### Unique Constraints
- fileHash

### Foreign Reference Fields
- uploadedBy → Users._id

### Relationships
- Many-to-One with Users
- One-to-Many with RunbookVersions
- One-to-Many with RunbookChunks
- One-to-Many with EmbeddingMetadata
- One-to-Many with IncidentAttachments
- One-to-Many with Bookmarks
- One-to-Many with SavedIncidents
- One-to-Many with Incidents

### Indexes

#### Single Indexes
```javascript
// File hash index (unique)
db.Runbooks.createIndex({ fileHash: 1 }, { unique: true })

// Uploaded by index
db.Runbooks.createIndex({ uploadedBy: 1 })

// Status index
db.Runbooks.createIndex({ status: 1 })

// Processing status index
db.Runbooks.createIndex({ processingStatus: 1 })

// Embedding status index
db.Runbooks.createIndex({ embeddingStatus: 1 })

// Title text index
db.Runbooks.createIndex({ title: "text", description: "text" })
```

#### Compound Indexes
```javascript
// User runbooks by status
db.Runbooks.createIndex({ uploadedBy: 1, status: 1, deletedAt: 1 })

// Processing queue
db.Runbooks.createIndex({ processingStatus: 1, createdAt: 1 })

// Embedding queue
db.Runbooks.createIndex({ embeddingStatus: 1, createdAt: 1 })
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get runbook by ID
db.Runbooks.findOne({ _id: runbookId, deletedAt: null })

// Get user runbooks
db.Runbooks.find({ 
  uploadedBy: userId, 
  deletedAt: null 
}).sort({ createdAt: -1 })

// Get published runbooks
db.Runbooks.find({ 
  status: "PUBLISHED",
  deletedAt: null 
}).sort({ createdAt: -1 })

// Search runbooks
db.Runbooks.find({
  $text: { $search: "network troubleshooting" },
  deletedAt: null
})

// Get processing queue
db.Runbooks.find({ 
  processingStatus: "PENDING",
  deletedAt: null 
}).sort({ createdAt: 1 })
```

### Aggregation Pipelines

```javascript
// Runbook statistics by user
db.Runbooks.aggregate([
  { $match: { deletedAt: null } },
  { $group: {
    _id: '$uploadedBy',
    totalCount: { $sum: 1 },
    publishedCount: { $sum: { $cond: [{ $eq: ['$status', 'PUBLISHED'] }, 1, 0] } },
    draftCount: { $sum: { $cond: [{ $eq: ['$status', 'DRAFT'] }, 1, 0] } }
  }},
  { $lookup: {
    from: 'Users',
    localField: '_id',
    foreignField: '_id',
    as: 'user'
  }}
])

// Processing status distribution
db.Runbooks.aggregate([
  { $match: { deletedAt: null } },
  { $group: {
    _id: '$processingStatus',
    count: { $sum: 1 },
    totalSize: { $sum: '$fileSize' }
  }}
])
```

### Optimization Tips
- Use text index for full-text search on runbooks
- Implement file deduplication using fileHash
- Use covered queries for status filtering
- Implement processing queue with priority
- Use read concern 'majority' for runbook reads
- Consider using GridFS for large file storage

### MongoDB Validation Schema

```javascript
db.createCollection('Runbooks', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'uploadedBy', 'originalFileName', 'fileName', 'fileType', 'fileSize', 'fileHash', 'checksum', 'storagePath', 'status', 'processingStatus', 'parserStatus', 'embeddingStatus'],
      properties: {
        _id: { bsonType: 'objectId' },
        title: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 200
        },
        description: {
          bsonType: ['string', 'null'],
          maxLength: 2000
        },
        uploadedBy: { bsonType: 'objectId' },
        originalFileName: { bsonType: 'string' },
        fileName: { bsonType: 'string' },
        fileType: {
          bsonType: 'string',
          enum: ['pdf', 'md', 'txt']
        },
        fileSize: {
          bsonType: 'long',
          minimum: 0
        },
        fileHash: {
          bsonType: 'string',
          minLength: 64,
          maxLength: 64
        },
        checksum: {
          bsonType: 'string',
          minLength: 32,
          maxLength: 32
        },
        storagePath: { bsonType: 'string' },
        version: {
          bsonType: 'int',
          minimum: 1
        },
        status: {
          bsonType: 'string',
          enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED']
        },
        processingStatus: {
          bsonType: 'string',
          enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']
        },
        parserStatus: {
          bsonType: 'string',
          enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']
        },
        chunkCount: {
          bsonType: 'int',
          minimum: 0
        },
        embeddingStatus: {
          bsonType: 'string',
          enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']
        },
        vectorIds: {
          bsonType: 'array',
          items: { bsonType: 'string' }
        },
        uploadedAt: { bsonType: 'date' },
        processedAt: { bsonType: ['date', 'null'] },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' },
        deletedAt: { bsonType: ['date', 'null'] }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Published runbook
{
  _id: ObjectId("507f1f77bcf86cd799439090"),
  title: "Network Troubleshooting Guide",
  description: "Comprehensive guide for diagnosing and resolving network issues",
  uploadedBy: ObjectId("507f1f77bcf86cd799439011"),
  originalFileName: "network_troubleshooting.pdf",
  fileName: "rb_507f1f77bcf86cd799439090_v1.pdf",
  fileType: "pdf",
  fileSize: 5242880,
  fileHash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  checksum: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  storagePath: "/runbooks/2024/01/15/rb_507f1f77bcf86cd799439090_v1.pdf",
  version: 1,
  status: "PUBLISHED",
  processingStatus: "COMPLETED",
  parserStatus: "COMPLETED",
  chunkCount: 150,
  embeddingStatus: "COMPLETED",
  vectorIds: ["vec_001", "vec_002", "vec_003"],
  uploadedAt: ISODate("2024-01-15T10:00:00Z"),
  processedAt: ISODate("2024-01-15T10:05:00Z"),
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:05:00Z"),
  deletedAt: null
}

// Sample 2: Draft runbook
{
  _id: ObjectId("507f1f77bcf86cd799439091"),
  title: "Database Recovery Procedures",
  description: "Step-by-step database recovery procedures",
  uploadedBy: ObjectId("507f1f77bcf86cd799439012"),
  originalFileName: "db_recovery.md",
  fileName: "rb_507f1f77bcf86cd799439091_v1.md",
  fileType: "md",
  fileSize: 1048576,
  fileHash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3",
  checksum: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8",
  storagePath: "/runbooks/2024/01/14/rb_507f1f77bcf86cd799439091_v1.md",
  version: 1,
  status: "DRAFT",
  processingStatus: "COMPLETED",
  parserStatus: "COMPLETED",
  chunkCount: 75,
  embeddingStatus: "COMPLETED",
  vectorIds: ["vec_010", "vec_011"],
  uploadedAt: ISODate("2024-01-14T15:00:00Z"),
  processedAt: ISODate("2024-01-14T15:02:00Z"),
  createdAt: ISODate("2024-01-14T15:00:00Z"),
  updatedAt: ISODate("2024-01-14T15:02:00Z"),
  deletedAt: null
}

// Sample 3: Processing runbook
{
  _id: ObjectId("507f1f77bcf86cd799439092"),
  title: "Server Security Hardening",
  description: "Security hardening procedures for production servers",
  uploadedBy: ObjectId("507f1f77bcf86cd799439011"),
  originalFileName: "security_hardening.txt",
  fileName: "rb_507f1f77bcf86cd799439092_v1.txt",
  fileType: "txt",
  fileSize: 2097152,
  fileHash: "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4",
  checksum: "f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  storagePath: "/runbooks/2024/01/15/rb_507f1f77bcf86cd799439092_v1.txt",
  version: 1,
  status: "DRAFT",
  processingStatus: "PROCESSING",
  parserStatus: "PROCESSING",
  chunkCount: 0,
  embeddingStatus: "PENDING",
  vectorIds: [],
  uploadedAt: ISODate("2024-01-15T11:00:00Z"),
  processedAt: null,
  createdAt: ISODate("2024-01-15T11:00:00Z"),
  updatedAt: ISODate("2024-01-15T11:00:00Z"),
  deletedAt: null
}
```

### CRUD Operations

```javascript
// CREATE
db.Runbooks.insertOne({
  title: "New Runbook",
  description: "Runbook description",
  uploadedBy: ObjectId("..."),
  originalFileName: "document.pdf",
  fileName: "rb_..._v1.pdf",
  fileType: "pdf",
  fileSize: 5242880,
  fileHash: crypto.createHash('sha256').update(fileBuffer).digest('hex'),
  checksum: crypto.createHash('md5').update(fileBuffer).digest('hex'),
  storagePath: "/runbooks/...",
  version: 1,
  status: "DRAFT",
  processingStatus: "PENDING",
  parserStatus: "PENDING",
  chunkCount: 0,
  embeddingStatus: "PENDING",
  vectorIds: [],
  uploadedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.Runbooks.findOne({ _id: ObjectId("..."), deletedAt: null })

// UPDATE
db.Runbooks.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: { 
      status: "PUBLISHED",
      updatedAt: new Date()
    }
  }
)

// DELETE (Soft)
db.Runbooks.updateOne(
  { _id: ObjectId("...") },
  { $set: { deletedAt: new Date(), updatedAt: new Date() } }
)
```

### REST APIs using the collection

- POST /api/runbooks → Runbooks, RunbookVersions, ActivityLogs, AuditLogs
- GET /api/runbooks → Runbooks (with pagination)
- GET /api/runbooks/:id → Runbooks
- PUT /api/runbooks/:id → Runbooks, RunbookVersions, AuditLogs
- DELETE /api/runbooks/:id → Runbooks, AuditLogs, ActivityLogs
- POST /api/runbooks/:id/publish → Runbooks, AuditLogs
- POST /api/runbooks/:id/archive → Runbooks, AuditLogs
- GET /api/runbooks/search → Runbooks (text search)

### Security Notes
- Validate file types before upload
- Implement file size limits
- Scan uploaded files for malware
- Implement file access control based on user permissions
- Log all file upload activities
- Implement file retention policies

### Future Scalability Notes
- Consider using object storage (S3, GCS) for file storage
- Implement file compression for storage optimization
- Add support for multiple file formats
- Consider implementing file versioning with diff storage
- Add support for collaborative editing

---

## COLLECTION 10: RunbookVersions

### Purpose
Store version history for runbooks.

### Description
Maintains a complete history of all runbook versions, allowing users to track changes, rollback to previous versions, and compare versions. Each version stores the complete file information at the time of creation.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| runbookId | ObjectId | No | Yes | - | Must reference Runbooks._id |
| versionNumber | Integer | No | Yes | 1 | Version number |
| title | String | No | Yes | - | 3-200 chars |
| description | String | Yes | No | null | Max 2000 chars |
| uploadedBy | ObjectId | No | Yes | - | Must reference Users._id |
| originalFileName | String | No | Yes | - | Original file name |
| fileName | String | No | Yes | - | Stored file name |
| fileType | String | No | Yes | - | File extension |
| fileSize | Long | No | Yes | - | File size in bytes |
| fileHash | String | No | Yes | - | SHA-256 hash |
| checksum | String | No | Yes | - | MD5 checksum |
| storagePath | String | No | Yes | - | File storage path |
| status | String | No | Yes | "ACTIVE" | Enum: ACTIVE, ARCHIVED |
| uploadedAt | DateTime | No | Yes | Current timestamp | - |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- runbookId + versionNumber (compound)

### Foreign Reference Fields
- runbookId → Runbooks._id
- uploadedBy → Users._id

### Relationships
- Many-to-One with Runbooks
- Many-to-One with Users
- One-to-Many with RunbookChunks
- One-to-Many with EmbeddingMetadata

### Indexes

#### Single Indexes
```javascript
// Runbook ID index
db.RunbookVersions.createIndex({ runbookId: 1 })

// Version number index
db.RunbookVersions.createIndex({ versionNumber: 1 })

// Uploaded by index
db.RunbookVersions.createIndex({ uploadedBy: 1 })

// Status index
db.RunbookVersions.createIndex({ status: 1 })
```

#### Compound Indexes
```javascript
// Unique version per runbook
db.RunbookVersions.createIndex({ 
  runbookId: 1, 
  versionNumber: 1 
}, { unique: true })

// Runbook versions by status
db.RunbookVersions.createIndex({ 
  runbookId: 1, 
  status: 1,
  versionNumber: -1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get runbook versions
db.RunbookVersions.find({ 
  runbookId: runbookId 
}).sort({ versionNumber: -1 })

// Get specific version
db.RunbookVersions.findOne({ 
  runbookId: runbookId, 
  versionNumber: 2 
})

// Get latest version
db.RunbookVersions.findOne({ 
  runbookId: runbookId 
}).sort({ versionNumber: -1 })
```

### Aggregation Pipelines

```javascript
// Version history summary
db.RunbookVersions.aggregate([
  { $match: { runbookId: ObjectId("...") } },
  { $sort: { versionNumber: -1 } },
  { $lookup: {
    from: 'Users',
    localField: 'uploadedBy',
    foreignField: '_id',
    as: 'uploader'
  }},
  { $project: {
    versionNumber: 1,
    title: 1,
    uploadedAt: 1,
    uploader: { $arrayElemAt: ['$uploader', 0] }
  }}
])
```

### Optimization Tips
- Implement version compression for old versions
- Use covered queries for version lookups
- Consider archiving old versions to cold storage
- Implement version cleanup policy
- Use read concern 'local' for version reads

### MongoDB Validation Schema

```javascript
db.createCollection('RunbookVersions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['runbookId', 'versionNumber', 'title', 'uploadedBy', 'originalFileName', 'fileName', 'fileType', 'fileSize', 'fileHash', 'checksum', 'storagePath', 'status'],
      properties: {
        _id: { bsonType: 'objectId' },
        runbookId: { bsonType: 'objectId' },
        versionNumber: {
          bsonType: 'int',
          minimum: 1
        },
        title: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 200
        },
        description: {
          bsonType: ['string', 'null'],
          maxLength: 2000
        },
        uploadedBy: { bsonType: 'objectId' },
        originalFileName: { bsonType: 'string' },
        fileName: { bsonType: 'string' },
        fileType: {
          bsonType: 'string',
          enum: ['pdf', 'md', 'txt']
        },
        fileSize: {
          bsonType: 'long',
          minimum: 0
        },
        fileHash: {
          bsonType: 'string',
          minLength: 64,
          maxLength: 64
        },
        checksum: {
          bsonType: 'string',
          minLength: 32,
          maxLength: 32
        },
        storagePath: { bsonType: 'string' },
        status: {
          bsonType: 'string',
          enum: ['ACTIVE', 'ARCHIVED']
        },
        uploadedAt: { bsonType: 'date' },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Version 1
{
  _id: ObjectId("507f1f77bcf86cd799439100"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  versionNumber: 1,
  title: "Network Troubleshooting Guide",
  description: "Initial version",
  uploadedBy: ObjectId("507f1f77bcf86cd799439011"),
  originalFileName: "network_troubleshooting.pdf",
  fileName: "rb_507f1f77bcf86cd799439090_v1.pdf",
  fileType: "pdf",
  fileSize: 5242880,
  fileHash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  checksum: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  storagePath: "/runbooks/2024/01/15/rb_507f1f77bcf86cd799439090_v1.pdf",
  status: "ACTIVE",
  uploadedAt: ISODate("2024-01-15T10:00:00Z"),
  createdAt: ISODate("2024-01-15T10:00:00Z")
}

// Sample 2: Version 2
{
  _id: ObjectId("507f1f77bcf86cd799439101"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  versionNumber: 2,
  title: "Network Troubleshooting Guide",
  description: "Added wireless troubleshooting section",
  uploadedBy: ObjectId("507f1f77bcf86cd799439011"),
  originalFileName: "network_troubleshooting_v2.pdf",
  fileName: "rb_507f1f77bcf86cd799439090_v2.pdf",
  fileType: "pdf",
  fileSize: 6291456,
  fileHash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3",
  checksum: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8",
  storagePath: "/runbooks/2024/01/20/rb_507f1f77bcf86cd799439090_v2.pdf",
  status: "ACTIVE",
  uploadedAt: ISODate("2024-01-20T14:00:00Z"),
  createdAt: ISODate("2024-01-20T14:00:00Z")
}

// Sample 3: Archived version
{
  _id: ObjectId("507f1f77bcf86cd799439102"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  versionNumber: 3,
  title: "Network Troubleshooting Guide",
  description: "Added VPN troubleshooting",
  uploadedBy: ObjectId("507f1f77bcf86cd799439012"),
  originalFileName: "network_troubleshooting_v3.pdf",
  fileName: "rb_507f1f77bcf86cd799439090_v3.pdf",
  fileType: "pdf",
  fileSize: 7340032,
  fileHash: "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4",
  checksum: "f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  storagePath: "/runbooks/2024/01/25/rb_507f1f77bcf86cd799439090_v3.pdf",
  status: "ARCHIVED",
  uploadedAt: ISODate("2024-01-25T09:00:00Z"),
  createdAt: ISODate("2024-01-25T09:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.RunbookVersions.insertOne({
  runbookId: ObjectId("..."),
  versionNumber: 2,
  title: "Updated Title",
  description: "Version description",
  uploadedBy: ObjectId("..."),
  originalFileName: "document_v2.pdf",
  fileName: "rb_..._v2.pdf",
  fileType: "pdf",
  fileSize: 5242880,
  fileHash: crypto.createHash('sha256').update(fileBuffer).digest('hex'),
  checksum: crypto.createHash('md5').update(fileBuffer).digest('hex'),
  storagePath: "/runbooks/...",
  status: "ACTIVE",
  uploadedAt: new Date(),
  createdAt: new Date()
})

// READ
db.RunbookVersions.findOne({ _id: ObjectId("...") })

// UPDATE
db.RunbookVersions.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: "ARCHIVED" } }
)

// DELETE
db.RunbookVersions.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/runbooks/:id/versions → RunbookVersions
- GET /api/runbooks/:id/versions/:version → RunbookVersions
- POST /api/runbooks/:id/versions → Runbooks, RunbookVersions, AuditLogs
- DELETE /api/runbooks/:id/versions/:version → RunbookVersions, AuditLogs
- POST /api/runbooks/:id/versions/:version/restore → Runbooks, RunbookVersions, AuditLogs

### Security Notes
- Implement version access control
- Log all version restoration activities
- Validate version numbers before creation
- Implement version deletion restrictions
- Archive old versions instead of deleting

### Future Scalability Notes
- Consider implementing version diff storage
- Add support for version branching
- Implement version comparison features
- Consider using delta compression for versions
- Add support for version merging

---

## COLLECTION 11: RunbookChunks

### Purpose
Store text chunks extracted from runbooks for RAG processing.

### Description
Stores individual text chunks extracted from runbooks after text extraction and chunking. Each chunk contains the actual text content, position information, tags, and metadata needed for RAG retrieval. The actual vector embeddings are stored in ChromaDB, while this collection stores the text content and metadata.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| runbookId | ObjectId | No | Yes | - | Must reference Runbooks._id |
| versionId | ObjectId | Yes | No | null | Must reference RunbookVersions._id |
| chunkIndex | Integer | No | Yes | 0 | Chunk sequence number |
| content | String | No | Yes | - | Chunk text content |
| startPosition | Integer | No | Yes | 0 | Start position in document |
| endPosition | Integer | No | Yes | 0 | End position in document |
| tags | Array[String] | No | Yes | [] | Content tags |
| section | String | Yes | No | null | Document section |
| tokenCount | Integer | Yes | No | null | Estimated token count |
| embeddingId | String | Yes | No | null | ChromaDB vector ID |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- runbookId + versionId + chunkIndex (compound)

### Foreign Reference Fields
- runbookId → Runbooks._id
- versionId → RunbookVersions._id

### Relationships
- Many-to-One with Runbooks
- Many-to-One with RunbookVersions
- One-to-One with EmbeddingMetadata

### Indexes

#### Single Indexes
```javascript
// Runbook ID index
db.RunbookChunks.createIndex({ runbookId: 1 })

// Version ID index
db.RunbookChunks.createIndex({ versionId: 1 })

// Chunk index index
db.RunbookChunks.createIndex({ chunkIndex: 1 })

// Embedding ID index
db.RunbookChunks.createIndex({ embeddingId: 1 })

// Content text index
db.RunbookChunks.createIndex({ content: "text" })
```

#### Compound Indexes
```javascript
// Unique chunk per runbook version
db.RunbookChunks.createIndex({ 
  runbookId: 1, 
  versionId: 1, 
  chunkIndex: 1 
}, { unique: true })

// Chunks by runbook
db.RunbookChunks.createIndex({ 
  runbookId: 1, 
  chunkIndex: 1 
})

// Chunks by version
db.RunbookChunks.createIndex({ 
  versionId: 1, 
  chunkIndex: 1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get chunks for runbook
db.RunbookChunks.find({ 
  runbookId: runbookId 
}).sort({ chunkIndex: 1 })

// Get chunks for version
db.RunbookChunks.find({ 
  versionId: versionId 
}).sort({ chunkIndex: 1 })

// Get specific chunk
db.RunbookChunks.findOne({ 
  runbookId: runbookId, 
  chunkIndex: 5 
})

// Search chunks by content
db.RunbookChunks.find({
  $text: { $search: "network configuration" }
})
```

### Aggregation Pipelines

```javascript
// Chunk statistics by runbook
db.RunbookChunks.aggregate([
  { $group: {
    _id: '$runbookId',
    totalChunks: { $sum: 1 },
    totalTokens: { $sum: '$tokenCount' },
    avgTokenCount: { $avg: '$tokenCount' }
  }},
  { $lookup: {
    from: 'Runbooks',
    localField: '_id',
    foreignField: '_id',
    as: 'runbook'
  }}
])

// Section distribution
db.RunbookChunks.aggregate([
  { $match: { runbookId: ObjectId("...") } },
  { $group: {
    _id: '$section',
    chunkCount: { $sum: 1 }
  }},
  { $sort: { chunkCount: -1 } }
])
```

### Optimization Tips
- Use text index for content search
- Implement chunk size optimization for RAG
- Use covered queries for chunk retrieval
- Consider using projection to limit returned fields
- Cache frequently accessed chunks in memory
- Use read concern 'local' for chunk reads

### MongoDB Validation Schema

```javascript
db.createCollection('RunbookChunks', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['runbookId', 'chunkIndex', 'content'],
      properties: {
        _id: { bsonType: 'objectId' },
        runbookId: { bsonType: 'objectId' },
        versionId: { bsonType: ['objectId', 'null'] },
        chunkIndex: {
          bsonType: 'int',
          minimum: 0
        },
        content: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 10000
        },
        startPosition: {
          bsonType: 'int',
          minimum: 0
        },
        endPosition: {
          bsonType: 'int',
          minimum: 0
        },
        tags: {
          bsonType: 'array',
          items: { bsonType: 'string' }
        },
        section: {
          bsonType: ['string', 'null']
        },
        tokenCount: {
          bsonType: ['int', 'null'],
          minimum: 0
        },
        embeddingId: {
          bsonType: ['string', 'null']
        },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Introduction chunk
{
  _id: ObjectId("507f1f77bcf86cd799439110"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  versionId: ObjectId("507f1f77bcf86cd799439100"),
  chunkIndex: 0,
  content: "This guide provides comprehensive troubleshooting steps for network connectivity issues. It covers common problems such as DNS resolution failures, packet loss, and routing issues.",
  startPosition: 0,
  endPosition: 250,
  tags: ["introduction", "overview"],
  section: "Introduction",
  tokenCount: 45,
  embeddingId: "vec_001",
  createdAt: ISODate("2024-01-15T10:01:00Z")
}

// Sample 2: Technical procedure chunk
{
  _id: ObjectId("507f1f77bcf86cd799439111"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  versionId: ObjectId("507f1f77bcf86cd799439100"),
  chunkIndex: 1,
  content: "To diagnose DNS issues, first check the DNS server configuration. Run the command 'nslookup' to verify DNS resolution. If the DNS server is unreachable, check network connectivity using ping.",
  startPosition: 251,
  endPosition: 500,
  tags: ["dns", "troubleshooting", "diagnostics"],
  section: "DNS Troubleshooting",
  tokenCount: 52,
  embeddingId: "vec_002",
  createdAt: ISODate("2024-01-15T10:01:00Z")
}

// Sample 3: Configuration example chunk
{
  _id: ObjectId("507f1f77bcf86cd799439112"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  versionId: ObjectId("507f1f77bcf86cd799439100"),
  chunkIndex: 2,
  content: "Example network configuration:\n\nIP Address: 192.168.1.100\nSubnet Mask: 255.255.255.0\nGateway: 192.168.1.1\nDNS: 8.8.8.8, 8.8.4.4",
  startPosition: 501,
  endPosition: 750,
  tags: ["configuration", "example", "network"],
  section: "Configuration Examples",
  tokenCount: 38,
  embeddingId: "vec_003",
  createdAt: ISODate("2024-01-15T10:01:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.RunbookChunks.insertOne({
  runbookId: ObjectId("..."),
  versionId: ObjectId("..."),
  chunkIndex: 0,
  content: "Chunk text content",
  startPosition: 0,
  endPosition: 250,
  tags: ["tag1", "tag2"],
  section: "Introduction",
  tokenCount: 45,
  embeddingId: "vec_001",
  createdAt: new Date()
})

// READ
db.RunbookChunks.findOne({ _id: ObjectId("...") })

// UPDATE
db.RunbookChunks.updateOne(
  { _id: ObjectId("...") },
  { $set: { embeddingId: "vec_new_001" } }
)

// DELETE
db.RunbookChunks.deleteMany({ runbookId: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/runbooks/:id/chunks → RunbookChunks
- GET /api/runbooks/:id/chunks/:index → RunbookChunks
- POST /api/runbooks/:id/chunks → RunbookChunks, EmbeddingMetadata (internal)
- DELETE /api/runbooks/:id/chunks → RunbookChunks, EmbeddingMetadata (internal)

### Security Notes
- Implement chunk access control based on runbook permissions
- Validate chunk content before storage
- Log chunk access for analytics
- Implement chunk size limits
- Sanitize chunk content to prevent XSS

### Future Scalability Notes
- Consider implementing chunk versioning
- Add support for dynamic chunking strategies
- Implement chunk compression for storage optimization
- Consider using separate collection for very large chunks
- Add support for chunk-level annotations

---

## COLLECTION 12: EmbeddingMetadata

### Purpose
Store metadata about vector embeddings generated for runbook chunks.

### Description
Stores metadata about embeddings generated for runbook chunks, including the embedding model used, vector dimensions, ChromaDB vector IDs, and generation timestamps. This collection bridges MongoDB with ChromaDB, allowing tracking of which chunks have embeddings and where they are stored.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| runbookId | ObjectId | No | Yes | - | Must reference Runbooks._id |
| versionId | ObjectId | Yes | No | null | Must reference RunbookVersions._id |
| chunkId | ObjectId | No | Yes | - | Must reference RunbookChunks._id |
| embeddingModel | String | No | Yes | - | Model name (e.g., text-embedding-ada-002) |
| embeddingDimension | Integer | No | Yes | 1536 | Vector dimension |
| vectorId | String | No | Yes | - | ChromaDB vector ID |
| generatedAt | DateTime | No | Yes | Current timestamp | - |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- chunkId
- vectorId

### Foreign Reference Fields
- runbookId → Runbooks._id
- versionId → RunbookVersions._id
- chunkId → RunbookChunks._id

### Relationships
- Many-to-One with Runbooks
- Many-to-One with RunbookVersions
- One-to-One with RunbookChunks

### Indexes

#### Single Indexes
```javascript
// Runbook ID index
db.EmbeddingMetadata.createIndex({ runbookId: 1 })

// Version ID index
db.EmbeddingMetadata.createIndex({ versionId: 1 })

// Chunk ID index (unique)
db.EmbeddingMetadata.createIndex({ chunkId: 1 }, { unique: true })

// Vector ID index (unique)
db.EmbeddingMetadata.createIndex({ vectorId: 1 }, { unique: true })

// Embedding model index
db.EmbeddingMetadata.createIndex({ embeddingModel: 1 })
```

#### Compound Indexes
```javascript
// Embeddings by runbook
db.EmbeddingMetadata.createIndex({ 
  runbookId: 1, 
  generatedAt: -1 
})

// Embeddings by version
db.EmbeddingMetadata.createIndex({ 
  versionId: 1, 
  generatedAt: -1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get embeddings for runbook
db.EmbeddingMetadata.find({ 
  runbookId: runbookId 
})

// Get embedding for chunk
db.EmbeddingMetadata.findOne({ 
  chunkId: chunkId 
})

// Get embeddings by model
db.EmbeddingMetadata.find({ 
  embeddingModel: "text-embedding-ada-002" 
})

// Check if chunk has embedding
db.EmbeddingMetadata.findOne({ 
  chunkId: chunkId 
})
```

### Aggregation Pipelines

```javascript
// Embedding statistics by model
db.EmbeddingMetadata.aggregate([
  { $group: {
    _id: '$embeddingModel',
    count: { $sum: 1 },
    dimension: { $first: '$embeddingDimension' }
  }}
])

// Embedding generation timeline
db.EmbeddingMetadata.aggregate([
  { $group: {
    _id: {
      date: { $dateToString: { format: '%Y-%m-%d', date: '$generatedAt' } },
      model: '$embeddingModel'
    },
    count: { $sum: 1 }
  }},
  { $sort: { '_id.date': -1 } }
])
```

### Optimization Tips
- Use unique indexes to prevent duplicate embeddings
- Cache embedding metadata in memory for fast lookups
- Implement embedding generation queue management
- Use read concern 'local' for metadata reads
- Consider batch embedding generation for efficiency

### MongoDB Validation Schema

```javascript
db.createCollection('EmbeddingMetadata', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['runbookId', 'chunkId', 'embeddingModel', 'embeddingDimension', 'vectorId'],
      properties: {
        _id: { bsonType: 'objectId' },
        runbookId: { bsonType: 'objectId' },
        versionId: { bsonType: ['objectId', 'null'] },
        chunkId: { bsonType: 'objectId' },
        embeddingModel: {
          bsonType: 'string',
          minLength: 1
        },
        embeddingDimension: {
          bsonType: 'int',
          minimum: 1
        },
        vectorId: {
          bsonType: 'string',
          minLength: 1
        },
        generatedAt: { bsonType: 'date' },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: OpenAI embedding
{
  _id: ObjectId("507f1f77bcf86cd799439120"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  versionId: ObjectId("507f1f77bcf86cd799439100"),
  chunkId: ObjectId("507f1f77bcf86cd799439110"),
  embeddingModel: "text-embedding-ada-002",
  embeddingDimension: 1536,
  vectorId: "vec_001",
  generatedAt: ISODate("2024-01-15T10:02:00Z"),
  createdAt: ISODate("2024-01-15T10:02:00Z")
}

// Sample 2: OpenAI embedding
{
  _id: ObjectId("507f1f77bcf86cd799439121"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  versionId: ObjectId("507f1f77bcf86cd799439100"),
  chunkId: ObjectId("507f1f77bcf86cd799439111"),
  embeddingModel: "text-embedding-ada-002",
  embeddingDimension: 1536,
  vectorId: "vec_002",
  generatedAt: ISODate("2024-01-15T10:02:00Z"),
  createdAt: ISODate("2024-01-15T10:02:00Z")
}

// Sample 3: Different model embedding
{
  _id: ObjectId("507f1f77bcf86cd799439122"),
  runbookId: ObjectId("507f1f77bcf86cd799439091"),
  versionId: ObjectId("507f1f77bcf86cd799439101"),
  chunkId: ObjectId("507f1f77bcf86cd799439113"),
  embeddingModel: "text-embedding-3-small",
  embeddingDimension: 1536,
  vectorId: "vec_010",
  generatedAt: ISODate("2024-01-14T15:03:00Z"),
  createdAt: ISODate("2024-01-14T15:03:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.EmbeddingMetadata.insertOne({
  runbookId: ObjectId("..."),
  versionId: ObjectId("..."),
  chunkId: ObjectId("..."),
  embeddingModel: "text-embedding-ada-002",
  embeddingDimension: 1536,
  vectorId: "vec_001",
  generatedAt: new Date(),
  createdAt: new Date()
})

// READ
db.EmbeddingMetadata.findOne({ chunkId: ObjectId("...") })

// UPDATE
db.EmbeddingMetadata.updateOne(
  { chunkId: ObjectId("...") },
  { $set: { vectorId: "vec_new_001" } }
)

// DELETE
db.EmbeddingMetadata.deleteMany({ runbookId: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/runbooks/:id/embeddings → EmbeddingMetadata (internal)
- POST /api/runbooks/:id/embeddings → EmbeddingMetadata (internal)
- DELETE /api/runbooks/:id/embeddings → EmbeddingMetadata (internal)

### Security Notes
- Restrict embedding metadata access to authorized users
- Log embedding generation activities
- Validate embedding model names
- Implement embedding regeneration controls
- Monitor embedding API usage

### Future Scalability Notes
- Consider supporting multiple embedding models per chunk
- Add embedding quality metrics
- Implement embedding versioning
- Consider embedding caching strategies
- Add support for custom embedding models

---

## COLLECTION 13: IncidentAttachments

### Purpose
Store file attachments related to incidents.

### Description
Stores metadata about files attached to incidents, such as logs, screenshots, configuration files, or other supporting documents. Files are stored externally (e.g., S3, GCS), while this collection tracks the metadata and associations.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| incidentId | ObjectId | No | Yes | - | Must reference Incidents._id |
| runbookId | ObjectId | Yes | No | null | Must reference Runbooks._id |
| fileName | String | No | Yes | - | Stored file name |
| originalFileName | String | No | Yes | - | Original file name |
| fileType | String | No | Yes | - | File extension |
| fileSize | Long | No | Yes | - | File size in bytes |
| storagePath | String | No | Yes | - | File storage path |
| uploadedAt | DateTime | No | Yes | Current timestamp | - |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- incidentId → Incidents._id
- runbookId → Runbooks._id

### Relationships
- Many-to-One with Incidents
- Many-to-One with Runbooks

### Indexes

#### Single Indexes
```javascript
// Incident ID index
db.IncidentAttachments.createIndex({ incidentId: 1 })

// Runbook ID index
db.IncidentAttachments.createIndex({ runbookId: 1 })

// File type index
db.IncidentAttachments.createIndex({ fileType: 1 })

// Upload date index
db.IncidentAttachments.createIndex({ uploadedAt: -1 })
```

#### Compound Indexes
```javascript
// Attachments by incident
db.IncidentAttachments.createIndex({ 
  incidentId: 1, 
  uploadedAt: -1 
})

// Attachments by runbook
db.IncidentAttachments.createIndex({ 
  runbookId: 1, 
  uploadedAt: -1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get attachments for incident
db.IncidentAttachments.find({ 
  incidentId: incidentId 
}).sort({ uploadedAt: -1 })

// Get attachments by type
db.IncidentAttachments.find({ 
  incidentId: incidentId,
  fileType: "log" 
})

// Get total attachment size for incident
db.IncidentAttachments.aggregate([
  { $match: { incidentId: incidentId } },
  { $group: {
    _id: null,
    totalSize: { $sum: '$fileSize' },
    count: { $sum: 1 }
  }}
])
```

### Aggregation Pipelines

```javascript
// Attachment statistics by type
db.IncidentAttachments.aggregate([
  { $group: {
    _id: '$fileType',
    count: { $sum: 1 },
    totalSize: { $sum: '$fileSize' }
  }}
])

// Storage usage by incident
db.IncidentAttachments.aggregate([
  { $group: {
    _id: '$incidentId',
    totalSize: { $sum: '$fileSize' },
    fileCount: { $sum: 1 }
  }},
  { $sort: { totalSize: -1 } }
])
```

### Optimization Tips
- Use object storage (S3, GCS) for file storage
- Implement file size limits per incident
- Use covered queries for attachment lookups
- Consider implementing file compression
- Use read concern 'local' for attachment metadata reads

### MongoDB Validation Schema

```javascript
db.createCollection('IncidentAttachments', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['incidentId', 'fileName', 'originalFileName', 'fileType', 'fileSize', 'storagePath'],
      properties: {
        _id: { bsonType: 'objectId' },
        incidentId: { bsonType: 'objectId' },
        runbookId: { bsonType: ['objectId', 'null'] },
        fileName: { bsonType: 'string' },
        originalFileName: { bsonType: 'string' },
        fileType: { bsonType: 'string' },
        fileSize: {
          bsonType: 'long',
          minimum: 0
        },
        storagePath: { bsonType: 'string' },
        uploadedAt: { bsonType: 'date' },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Log file attachment
{
  _id: ObjectId("507f1f77bcf86cd799439130"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  fileName: "att_507f1f77bcf86cd799439130_system.log",
  originalFileName: "system.log",
  fileType: "log",
  fileSize: 1048576,
  storagePath: "/attachments/2024/01/15/att_507f1f77bcf86cd799439130_system.log",
  uploadedAt: ISODate("2024-01-15T12:00:00Z"),
  createdAt: ISODate("2024-01-15T12:00:00Z")
}

// Sample 2: Screenshot attachment
{
  _id: ObjectId("507f1f77bcf86cd799439131"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  runbookId: null,
  fileName: "att_507f1f77bcf86cd799439131_error.png",
  originalFileName: "error_screenshot.png",
  fileType: "png",
  fileSize: 524288,
  storagePath: "/attachments/2024/01/15/att_507f1f77bcf86cd799439131_error.png",
  uploadedAt: ISODate("2024-01-15T12:05:00Z"),
  createdAt: ISODate("2024-01-15T12:05:00Z")
}

// Sample 3: Configuration file attachment
{
  _id: ObjectId("507f1f77bcf86cd799439132"),
  incidentId: ObjectId("507f1f77bcf86cd799439201"),
  runbookId: ObjectId("507f1f77bcf86cd799439091"),
  fileName: "att_507f1f77bcf86cd799439132_config.json",
  originalFileName: "nginx.conf",
  fileType: "json",
  fileSize: 8192,
  storagePath: "/attachments/2024/01/16/att_507f1f77bcf86cd799439132_config.json",
  uploadedAt: ISODate("2024-01-16T09:30:00Z"),
  createdAt: ISODate("2024-01-16T09:30:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.IncidentAttachments.insertOne({
  incidentId: ObjectId("..."),
  runbookId: ObjectId("..."),
  fileName: "att_..._file.log",
  originalFileName: "file.log",
  fileType: "log",
  fileSize: 1048576,
  storagePath: "/attachments/...",
  uploadedAt: new Date(),
  createdAt: new Date()
})

// READ
db.IncidentAttachments.findOne({ _id: ObjectId("...") })

// DELETE
db.IncidentAttachments.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/incidents/:id/attachments → IncidentAttachments
- POST /api/incidents/:id/attachments → IncidentAttachments, AuditLogs
- DELETE /api/incidents/:id/attachments/:attachmentId → IncidentAttachments, AuditLogs
- GET /api/incidents/:id/attachments/:attachmentId/download → IncidentAttachments (file download)

### Security Notes
- Validate file types before upload
- Implement file size limits
- Scan uploaded files for malware
- Implement attachment access control
- Log all file upload/download activities
- Implement file retention policies

### Future Scalability Notes
- Consider using CDN for file distribution
- Implement file versioning for attachments
- Add support for attachment thumbnails
- Consider implementing file deduplication
- Add support for attachment preview

---

## COLLECTION 14: Bookmarks

### Purpose
Store user bookmarks for runbooks.

### Description
Allows users to bookmark runbooks for quick access. Stores bookmark metadata including title, notes, and timestamps. Supports personal organization of frequently accessed runbooks.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| runbookId | ObjectId | No | Yes | - | Must reference Runbooks._id |
| title | String | Yes | No | null | Max 200 chars |
| notes | String | Yes | No | null | Max 1000 chars |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- userId + runbookId (compound)

### Foreign Reference Fields
- userId → Users._id
- runbookId → Runbooks._id

### Relationships
- Many-to-One with Users
- Many-to-One with Runbooks

### Indexes

#### Single Indexes
```javascript
// User ID index
db.Bookmarks.createIndex({ userId: 1 })

// Runbook ID index
db.Bookmarks.createIndex({ runbookId: 1 })

// Created at index
db.Bookmarks.createIndex({ createdAt: -1 })
```

#### Compound Indexes
```javascript
// Unique bookmark per user
db.Bookmarks.createIndex({ 
  userId: 1, 
  runbookId: 1 
}, { unique: true })

// User bookmarks by date
db.Bookmarks.createIndex({ 
  userId: 1, 
  createdAt: -1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get user bookmarks
db.Bookmarks.find({ 
  userId: userId 
}).sort({ createdAt: -1 })

// Check if runbook is bookmarked
db.Bookmarks.findOne({ 
  userId: userId, 
  runbookId: runbookId 
})

// Get bookmarked runbooks for user
db.Bookmarks.aggregate([
  { $match: { userId: userId } },
  { $lookup: {
    from: 'Runbooks',
    localField: 'runbookId',
    foreignField: '_id',
    as: 'runbook'
  }}
])
```

### Aggregation Pipelines

```javascript
// Bookmark statistics by user
db.Bookmarks.aggregate([
  { $group: {
    _id: '$userId',
    bookmarkCount: { $sum: 1 }
  }},
  { $sort: { bookmarkCount: -1 } }
])

// Most bookmarked runbooks
db.Bookmarks.aggregate([
  { $group: {
    _id: '$runbookId',
    bookmarkCount: { $sum: 1 }
  }},
  { $sort: { bookmarkCount: -1 } },
  { $limit: 10 }
])
```

### Optimization Tips
- Use covered queries for bookmark lookups
- Cache user bookmark lists in memory
- Use read concern 'local' for bookmark reads
- Implement bookmark cleanup for deleted runbooks

### MongoDB Validation Schema

```javascript
db.createCollection('Bookmarks', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'runbookId'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        runbookId: { bsonType: 'objectId' },
        title: {
          bsonType: ['string', 'null'],
          maxLength: 200
        },
        notes: {
          bsonType: ['string', 'null'],
          maxLength: 1000
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Network troubleshooting bookmark
{
  _id: ObjectId("507f1f77bcf86cd799439140"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  title: "Network Troubleshooting - Quick Reference",
  notes: "Essential guide for network issues, keep handy",
  createdAt: ISODate("2024-01-10T08:00:00Z"),
  updatedAt: ISODate("2024-01-10T08:00:00Z")
}

// Sample 2: Database recovery bookmark
{
  _id: ObjectId("507f1f77bcf86cd799439141"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  runbookId: ObjectId("507f1f77bcf86cd799439091"),
  title: "DB Recovery Procedures",
  notes: "Critical for database emergencies",
  createdAt: ISODate("2024-01-12T14:30:00Z"),
  updatedAt: ISODate("2024-01-12T14:30:00Z")
}

// Sample 3: Security hardening bookmark
{
  _id: ObjectId("507f1f77bcf86cd799439142"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  runbookId: ObjectId("507f1f77bcf86cd799439092"),
  title: null,
  notes: "Review before production deployment",
  createdAt: ISODate("2024-01-14T10:15:00Z"),
  updatedAt: ISODate("2024-01-14T10:15:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.Bookmarks.insertOne({
  userId: ObjectId("..."),
  runbookId: ObjectId("..."),
  title: "My Bookmark",
  notes: "Personal notes",
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.Bookmarks.findOne({ _id: ObjectId("...") })

// UPDATE
db.Bookmarks.updateOne(
  { _id: ObjectId("...") },
  { $set: { notes: "Updated notes", updatedAt: new Date() } }
)

// DELETE
db.Bookmarks.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/users/:id/bookmarks → Bookmarks
- POST /api/users/:id/bookmarks → Bookmarks, AuditLogs
- PUT /api/users/:id/bookmarks/:bookmarkId → Bookmarks, AuditLogs
- DELETE /api/users/:id/bookmarks/:bookmarkId → Bookmarks, AuditLogs
- GET /api/runbooks/:id/bookmarks → Bookmarks

### Security Notes
- Implement bookmark access control
- Validate bookmark ownership
- Log bookmark creation/deletion
- Implement bookmark cleanup on runbook deletion

### Future Scalability Notes
- Add support for bookmark folders/categories
- Implement bookmark sharing between users
- Add bookmark import/export functionality
- Consider adding bookmark search/filtering

---

## COLLECTION 15: SavedIncidents

### Purpose
Store user-saved incidents for quick access.

### Description
Allows users to save incidents for future reference, similar to bookmarks but specifically for incidents. Stores custom titles and notes for personal organization.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| incidentId | ObjectId | No | Yes | - | Must reference Incidents._id |
| title | String | Yes | No | null | Max 200 chars |
| notes | String | Yes | No | null | Max 1000 chars |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- userId + incidentId (compound)

### Foreign Reference Fields
- userId → Users._id
- incidentId → Incidents._id

### Relationships
- Many-to-One with Users
- Many-to-One with Incidents

### Indexes

#### Single Indexes
```javascript
// User ID index
db.SavedIncidents.createIndex({ userId: 1 })

// Incident ID index
db.SavedIncidents.createIndex({ incidentId: 1 })

// Created at index
db.SavedIncidents.createIndex({ createdAt: -1 })
```

#### Compound Indexes
```javascript
// Unique saved incident per user
db.SavedIncidents.createIndex({ 
  userId: 1, 
  incidentId: 1 
}, { unique: true })

// User saved incidents by date
db.SavedIncidents.createIndex({ 
  userId: 1, 
  createdAt: -1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get user saved incidents
db.SavedIncidents.find({ 
  userId: userId 
}).sort({ createdAt: -1 })

// Check if incident is saved
db.SavedIncidents.findOne({ 
  userId: userId, 
  incidentId: incidentId 
})
```

### Aggregation Pipelines

```javascript
// Saved incident statistics by user
db.SavedIncidents.aggregate([
  { $group: {
    _id: '$userId',
    savedCount: { $sum: 1 }
  }},
  { $sort: { savedCount: -1 } }
])
```

### Optimization Tips
- Use covered queries for saved incident lookups
- Cache user saved incident lists
- Use read concern 'local' for reads
- Implement cleanup for deleted incidents

### MongoDB Validation Schema

```javascript
db.createCollection('SavedIncidents', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'incidentId'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        incidentId: { bsonType: 'objectId' },
        title: {
          bsonType: ['string', 'null'],
          maxLength: 200
        },
        notes: {
          bsonType: ['string', 'null'],
          maxLength: 1000
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Saved network incident
{
  _id: ObjectId("507f1f77bcf86cd799439150"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  title: "Network Outage - Jan 15",
  notes: "Resolved using network troubleshooting guide",
  createdAt: ISODate("2024-01-15T18:00:00Z"),
  updatedAt: ISODate("2024-01-15T18:00:00Z")
}

// Sample 2: Saved database incident
{
  _id: ObjectId("507f1f77bcf86cd799439151"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  incidentId: ObjectId("507f1f77bcf86cd799439201"),
  title: "Database Recovery - Critical",
  notes: "Important recovery procedure, document for team",
  createdAt: ISODate("2024-01-16T10:30:00Z"),
  updatedAt: ISODate("2024-01-16T10:30:00Z")
}

// Sample 3: Saved server incident
{
  _id: ObjectId("507f1f77bcf86cd799439152"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  incidentId: ObjectId("507f1f77bcf86cd799439202"),
  title: null,
  notes: "Reference for future server issues",
  createdAt: ISODate("2024-01-17T14:45:00Z"),
  updatedAt: ISODate("2024-01-17T14:45:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.SavedIncidents.insertOne({
  userId: ObjectId("..."),
  incidentId: ObjectId("..."),
  title: "My Saved Incident",
  notes: "Personal notes",
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.SavedIncidents.findOne({ _id: ObjectId("...") })

// UPDATE
db.SavedIncidents.updateOne(
  { _id: ObjectId("...") },
  { $set: { notes: "Updated notes", updatedAt: new Date() } }
)

// DELETE
db.SavedIncidents.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/users/:id/saved-incidents → SavedIncidents
- POST /api/users/:id/saved-incidents → SavedIncidents, AuditLogs
- PUT /api/users/:id/saved-incidents/:savedId → SavedIncidents, AuditLogs
- DELETE /api/users/:id/saved-incidents/:savedId → SavedIncidents, AuditLogs
- GET /api/incidents/:id/saved → SavedIncidents

### Security Notes
- Implement saved incident access control
- Validate saved incident ownership
- Log save/unsave activities
- Implement cleanup on incident deletion

### Future Scalability Notes
- Add support for saved incident folders
- Implement saved incident sharing
- Add saved incident export functionality
- Consider adding saved incident reminders

---

## COLLECTION 16: Favorites

### Purpose
Store user favorites for various entities (runbooks, incidents, etc.).

### Description
Generic favorites collection allowing users to favorite any entity type in the system. Supports favorites for runbooks, incidents, reports, and other entities. Provides a unified favorites system.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| targetType | String | No | Yes | - | Entity type (RUNBOOK, INCIDENT, REPORT) |
| targetId | ObjectId | No | Yes | - | Target entity ID |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- userId + targetType + targetId (compound)

### Foreign Reference Fields
- userId → Users._id
- targetId → Various collections based on targetType

### Relationships
- Many-to-One with Users
- Many-to-One with various target entities

### Indexes

#### Single Indexes
```javascript
// User ID index
db.Favorites.createIndex({ userId: 1 })

// Target type index
db.Favorites.createIndex({ targetType: 1 })

// Target ID index
db.Favorites.createIndex({ targetId: 1 })

// Created at index
db.Favorites.createIndex({ createdAt: -1 })
```

#### Compound Indexes
```javascript
// Unique favorite per user
db.Favorites.createIndex({ 
  userId: 1, 
  targetType: 1, 
  targetId: 1 
}, { unique: true })

// User favorites by type
db.Favorites.createIndex({ 
  userId: 1, 
  targetType: 1, 
  createdAt: -1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get user favorites
db.Favorites.find({ 
  userId: userId 
}).sort({ createdAt: -1 })

// Get user favorites by type
db.Favorites.find({ 
  userId: userId, 
  targetType: "RUNBOOK" 
})

// Check if entity is favorited
db.Favorites.findOne({ 
  userId: userId, 
  targetType: "RUNBOOK",
  targetId: targetId 
})
```

### Aggregation Pipelines

```javascript
// Favorite statistics by type
db.Favorites.aggregate([
  { $group: {
    _id: '$targetType',
    count: { $sum: 1 }
  }}
])

// Most favorited entities
db.Favorites.aggregate([
  { $group: {
    _id: { targetType: '$targetType', targetId: '$targetId' },
    favoriteCount: { $sum: 1 }
  }},
  { $sort: { $sort: { favoriteCount: -1 } } },
  { $limit: 10 }
])
```

### Optimization Tips
- Use covered queries for favorite lookups
- Cache user favorite lists
- Use read concern 'local' for reads
- Implement cleanup for deleted entities

### MongoDB Validation Schema

```javascript
db.createCollection('Favorites', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'targetType', 'targetId'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        targetType: {
          bsonType: 'string',
          enum: ['RUNBOOK', 'INCIDENT', 'REPORT', 'USER']
        },
        targetId: { bsonType: 'objectId' },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Favorited runbook
{
  _id: ObjectId("507f1f77bcf86cd799439160"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  targetType: "RUNBOOK",
  targetId: ObjectId("507f1f77bcf86cd799439090"),
  createdAt: ISODate("2024-01-10T09:00:00Z")
}

// Sample 2: Favorited incident
{
  _id: ObjectId("507f1f77bcf86cd799439161"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  targetType: "INCIDENT",
  targetId: ObjectId("507f1f77bcf86cd799439200"),
  createdAt: ISODate("2024-01-15T19:00:00Z")
}

// Sample 3: Favorited report
{
  _id: ObjectId("507f1f77bcf86cd799439162"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  targetType: "REPORT",
  targetId: ObjectId("507f1f77bcf86cd799439300"),
  createdAt: ISODate("2024-01-16T11:30:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.Favorites.insertOne({
  userId: ObjectId("..."),
  targetType: "RUNBOOK",
  targetId: ObjectId("..."),
  createdAt: new Date()
})

// READ
db.Favorites.findOne({ _id: ObjectId("...") })

// DELETE
db.Favorites.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/users/:id/favorites → Favorites
- POST /api/users/:id/favorites → Favorites, AuditLogs
- DELETE /api/users/:id/favorites/:favoriteId → Favorites, AuditLogs
- GET /api/:type/:id/favorite → Favorites

### Security Notes
- Implement favorite access control
- Validate favorite ownership
- Log favorite/unfavorite activities
- Implement cleanup for deleted entities

### Future Scalability Notes
- Add support for favorite folders
- Implement favorite sharing
- Add favorite notifications
- Consider adding favorite categories

---

## COLLECTION 17: Incidents

### Purpose
Store incident records for troubleshooting and resolution tracking.

### Description
Core collection for storing incident information including title, description, severity, status, category, and resolution timeline. Links to runbooks for reference and tracks the complete incident lifecycle from creation to resolution.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| title | String | No | Yes | - | 3-200 chars |
| description | String | Yes | No | null | Max 5000 chars |
| createdBy | ObjectId | No | Yes | - | Must reference Users._id |
| runbookId | ObjectId | Yes | No | null | Must reference Runbooks._id |
| severity | String | No | Yes | "MEDIUM" | Enum: LOW, MEDIUM, HIGH, CRITICAL |
| status | String | No | Yes | "OPEN" | Enum: OPEN, IN_PROGRESS, RESOLVED, CLOSED |
| category | String | Yes | No | null | Incident category |
| tags | Array[String] | No | Yes | [] | Incident tags |
| startedAt | DateTime | No | Yes | Current timestamp | - |
| resolvedAt | DateTime | Yes | No | null | Resolution timestamp |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |
| deletedAt | DateTime | Yes | No | null | Soft delete timestamp |

### Unique Constraints
None

### Foreign Reference Fields
- createdBy → Users._id
- runbookId → Runbooks._id

### Relationships
- Many-to-One with Users
- Many-to-One with Runbooks
- One-to-Many with IncidentSteps
- One-to-Many with Chats
- One-to-Many with ExecutionLogs
- One-to-Many with Reports
- One-to-Many with IncidentAttachments
- One-to-Many with SavedIncidents
- One-to-Many with Favorites
- One-to-Many with AIMemory
- One-to-Many with Feedback

### Indexes

#### Single Indexes
```javascript
// Created by index
db.Incidents.createIndex({ createdBy: 1 })

// Runbook ID index
db.Incidents.createIndex({ runbookId: 1 })

// Severity index
db.Incidents.createIndex({ severity: 1 })

// Status index
db.Incidents.createIndex({ status: 1 })

// Category index
db.Incidents.createIndex({ category: 1 })

// Started at index
db.Incidents.createIndex({ startedAt: -1 })

// Title text index
db.Incidents.createIndex({ title: "text", description: "text" })
```

#### Compound Indexes
```javascript
// User incidents by status
db.Incidents.createIndex({ 
  createdBy: 1, 
  status: 1, 
  deletedAt: 1 
})

// Incidents by severity and status
db.Incidents.createIndex({ 
  severity: 1, 
  status: 1 
})

// Runbook incidents by date
db.Incidents.createIndex({ 
  runbookId: 1, 
  startedAt: -1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get incident by ID
db.Incidents.findOne({ _id: incidentId, deletedAt: null })

// Get user incidents
db.Incidents.find({ 
  createdBy: userId, 
  deletedAt: null 
}).sort({ startedAt: -1 })

// Get open incidents
db.Incidents.find({ 
  status: "OPEN",
  deletedAt: null 
}).sort({ severity: -1, startedAt: -1 })

// Search incidents
db.Incidents.find({
  $text: { $search: "network failure" },
  deletedAt: null
})

// Get incidents by runbook
db.Incidents.find({ 
  runbookId: runbookId,
  deletedAt: null 
}).sort({ startedAt: -1 })
```

### Aggregation Pipelines

```javascript
// Incident statistics by status
db.Incidents.aggregate([
  { $match: { deletedAt: null } },
  { $group: {
    _id: '$status',
    count: { $sum: 1 }
  }}
])

// Incident statistics by severity
db.Incidents.aggregate([
  { $match: { deletedAt: null } },
  { $group: {
    _id: '$severity',
    count: { $sum: 1 }
  }}
])

// Average resolution time
db.Incidents.aggregate([
  { $match: { 
    deletedAt: null, 
    status: "RESOLVED",
    resolvedAt: { $ne: null }
  }},
  { $group: {
    _id: null,
    avgResolutionTime: { 
      $avg: { $subtract: ['$resolvedAt', '$startedAt'] } 
    }
  }}
])
```

### Optimization Tips
- Use text index for incident search
- Implement incident status transitions
- Use covered queries for status filtering
- Cache frequently accessed incidents
- Use read concern 'majority' for incident reads
- Implement incident archiving for old incidents

### MongoDB Validation Schema

```javascript
db.createCollection('Incidents', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'createdBy', 'severity', 'status'],
      properties: {
        _id: { bsonType: 'objectId' },
        title: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 200
        },
        description: {
          bsonType: ['string', 'null'],
          maxLength: 5000
        },
        createdBy: { bsonType: 'objectId' },
        runbookId: { bsonType: ['objectId', 'null'] },
        severity: {
          bsonType: 'string',
          enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        },
        status: {
          bsonType: 'string',
          enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
        },
        category: {
          bsonType: ['string', 'null']
        },
        tags: {
          bsonType: 'array',
          items: { bsonType: 'string' }
        },
        startedAt: { bsonType: 'date' },
        resolvedAt: { bsonType: ['date', 'null'] },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' },
        deletedAt: { bsonType: ['date', 'null'] }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Open critical incident
{
  _id: ObjectId("507f1f77bcf86cd799439200"),
  title: "Production Database Outage",
  description: "Primary database cluster is not responding, affecting all production services",
  createdBy: ObjectId("507f1f77bcf86cd799439011"),
  runbookId: ObjectId("507f1f77bcf86cd799439091"),
  severity: "CRITICAL",
  status: "IN_PROGRESS",
  category: "DATABASE",
  tags: ["database", "outage", "production", "critical"],
  startedAt: ISODate("2024-01-15T10:00:00Z"),
  resolvedAt: null,
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  updatedAt: ISODate("2024-01-15T12:30:00Z"),
  deletedAt: null
}

// Sample 2: Resolved medium incident
{
  _id: ObjectId("507f1f77bcf86cd799439201"),
  title: "Network Latency Issues",
  description: "Users experiencing high latency when accessing application services",
  createdBy: ObjectId("507f1f77bcf86cd799439012"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  severity: "MEDIUM",
  status: "RESOLVED",
  category: "NETWORK",
  tags: ["network", "latency", "performance"],
  startedAt: ISODate("2024-01-14T14:00:00Z"),
  resolvedAt: ISODate("2024-01-14T16:30:00Z"),
  createdAt: ISODate("2024-01-14T14:00:00Z"),
  updatedAt: ISODate("2024-01-14T16:30:00Z"),
  deletedAt: null
}

// Sample 3: Closed low incident
{
  _id: ObjectId("507f1f77bcf86cd799439202"),
  title: "Minor UI Bug in Dashboard",
  description: "Dashboard not displaying correct user count",
  createdBy: ObjectId("507f1f77bcf86cd799439011"),
  runbookId: null,
  severity: "LOW",
  status: "CLOSED",
  category: "UI",
  tags: ["ui", "bug", "dashboard"],
  startedAt: ISODate("2024-01-13T09:00:00Z"),
  resolvedAt: ISODate("2024-01-13T11:00:00Z"),
  createdAt: ISODate("2024-01-13T09:00:00Z"),
  updatedAt: ISODate("2024-01-13T11:00:00Z"),
  deletedAt: null
}
```

### CRUD Operations

```javascript
// CREATE
db.Incidents.insertOne({
  title: "New Incident",
  description: "Incident description",
  createdBy: ObjectId("..."),
  runbookId: ObjectId("..."),
  severity: "MEDIUM",
  status: "OPEN",
  category: "NETWORK",
  tags: ["tag1", "tag2"],
  startedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.Incidents.findOne({ _id: ObjectId("..."), deletedAt: null })

// UPDATE
db.Incidents.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: { 
      status: "RESOLVED",
      resolvedAt: new Date(),
      updatedAt: new Date()
    }
  }
)

// DELETE (Soft)
db.Incidents.updateOne(
  { _id: ObjectId("...") },
  { $set: { deletedAt: new Date(), updatedAt: new Date() } }
)
```

### REST APIs using the collection

- POST /api/incidents → Incidents, ActivityLogs, AuditLogs
- GET /api/incidents → Incidents (with pagination)
- GET /api/incidents/:id → Incidents
- PUT /api/incidents/:id → Incidents, AuditLogs
- DELETE /api/incidents/:id → Incidents, AuditLogs, ActivityLogs
- PATCH /api/incidents/:id/status → Incidents, AuditLogs
- GET /api/incidents/search → Incidents (text search)
- GET /api/runbooks/:id/incidents → Incidents

### Security Notes
- Implement incident access control based on user permissions
- Validate status transitions
- Log all incident status changes
- Implement incident escalation rules
- Restrict incident deletion to authorized users

### Future Scalability Notes
- Add support for incident templates
- Implement incident escalation workflows
- Add incident SLA tracking
- Consider implementing incident merging
- Add support for incident dependencies

---

## COLLECTION 18: IncidentSteps

### Purpose
Store step-by-step incident resolution procedures.

### Description
Stores individual steps for incident resolution, including step descriptions, commands to execute, expected outputs, actual outputs, approval requirements, and execution status. Each step represents a specific action in the incident resolution process.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| incidentId | ObjectId | No | Yes | - | Must reference Incidents._id |
| stepNumber | Integer | No | Yes | 1 | Step sequence number |
| title | String | No | Yes | - | 3-200 chars |
| description | String | Yes | No | null | Max 2000 chars |
| command | String | Yes | No | null | Command to execute |
| expectedOutput | String | Yes | No | null | Expected command output |
| actualOutput | String | Yes | No | null | Actual command output |
| status | String | No | Yes | "PENDING" | Enum: PENDING, APPROVED, EXECUTING, COMPLETED, FAILED, SKIPPED |
| requiresApproval | Boolean | No | Yes | false | Approval required flag |
| approvedBy | ObjectId | Yes | No | null | Must reference Users._id |
| approvedAt | DateTime | Yes | No | null | Approval timestamp |
| executedAt | DateTime | Yes | No | null | Execution timestamp |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- incidentId + stepNumber (compound)

### Foreign Reference Fields
- incidentId → Incidents._id
- approvedBy → Users._id

### Relationships
- Many-to-One with Incidents
- Many-to-One with Users (approver)
- One-to-Many with ExecutionLogs
- One-to-Many with ApprovalRequests
- One-to-Many with CommandHistory
- One-to-Many with Feedback

### Indexes

#### Single Indexes
```javascript
// Incident ID index
db.IncidentSteps.createIndex({ incidentId: 1 })

// Step number index
db.IncidentSteps.createIndex({ stepNumber: 1 })

// Status index
db.IncidentSteps.createIndex({ status: 1 })

// Approved by index
db.IncidentSteps.createIndex({ approvedBy: 1 })
```

#### Compound Indexes
```javascript
// Unique step per incident
db.IncidentSteps.createIndex({ 
  incidentId: 1, 
  stepNumber: 1 
}, { unique: true })

// Steps by incident and status
db.IncidentSteps.createIndex({ 
  incidentId: 1, 
  status: 1,
  stepNumber: 1 
})

// Pending approval steps
db.IncidentSteps.createIndex({ 
  requiresApproval: 1, 
  status: "PENDING" 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get steps for incident
db.IncidentSteps.find({ 
  incidentId: incidentId 
}).sort({ stepNumber: 1 })

// Get pending steps
db.IncidentSteps.find({ 
  incidentId: incidentId,
  status: "PENDING" 
}).sort({ stepNumber: 1 })

// Get steps requiring approval
db.IncidentSteps.find({ 
  requiresApproval: true,
  status: "PENDING" 
})
```

### Aggregation Pipelines

```javascript
// Step completion statistics
db.IncidentSteps.aggregate([
  { $group: {
    _id: '$status',
    count: { $sum: 1 }
  }}
])

// Approval statistics
db.IncidentSteps.aggregate([
  { $group: {
    _id: '$approvedBy',
    approvedCount: { $sum: { $cond: ['$requiresApproval', 1, 0] } }
  }},
  { $lookup: {
    from: 'Users',
    localField: '_id',
    foreignField: '_id',
    as: 'user'
  }}
])
```

### Optimization Tips
- Use covered queries for step lookups
- Cache incident step sequences
- Use read concern 'majority' for step reads
- Implement step status validation

### MongoDB Validation Schema

```javascript
db.createCollection('IncidentSteps', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['incidentId', 'stepNumber', 'title', 'status'],
      properties: {
        _id: { bsonType: 'objectId' },
        incidentId: { bsonType: 'objectId' },
        stepNumber: {
          bsonType: 'int',
          minimum: 1
        },
        title: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 200
        },
        description: {
          bsonType: ['string', 'null'],
          maxLength: 2000
        },
        command: {
          bsonType: ['string', 'null']
        },
        expectedOutput: {
          bsonType: ['string', 'null']
        },
        actualOutput: {
          bsonType: ['string', 'null']
        },
        status: {
          bsonType: 'string',
          enum: ['PENDING', 'APPROVED', 'EXECUTING', 'COMPLETED', 'FAILED', 'SKIPPED']
        },
        requiresApproval: { bsonType: 'bool' },
        approvedBy: { bsonType: ['objectId', 'null'] },
        approvedAt: { bsonType: ['date', 'null'] },
        executedAt: { bsonType: ['date', 'null'] },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Pending step
{
  _id: ObjectId("507f1f77bcf86cd799439210"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  stepNumber: 1,
  title: "Check Database Service Status",
  description: "Verify if the database service is running and accessible",
  command: "systemctl status postgresql",
  expectedOutput: "Active: active (running)",
  actualOutput: null,
  status: "PENDING",
  requiresApproval: false,
  approvedBy: null,
  approvedAt: null,
  executedAt: null,
  createdAt: ISODate("2024-01-15T10:05:00Z"),
  updatedAt: ISODate("2024-01-15T10:05:00Z")
}

// Sample 2: Approved step
{
  _id: ObjectId("507f1f77bcf86cd799439211"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  stepNumber: 2,
  title: "Restart Database Service",
  description: "Restart the PostgreSQL service if it's not responding",
  command: "systemctl restart postgresql",
  expectedOutput: null,
  actualOutput: null,
  status: "APPROVED",
  requiresApproval: true,
  approvedBy: ObjectId("507f1f77bcf86cd799439011"),
  approvedAt: ISODate("2024-01-15T10:30:00Z"),
  executedAt: null,
  createdAt: ISODate("2024-01-15T10:10:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}

// Sample 3: Completed step
{
  _id: ObjectId("507f1f77bcf86cd799439212"),
  incidentId: ObjectId("507f1f77bcf86cd799439201"),
  stepNumber: 1,
  title: "Check Network Connectivity",
  description: "Verify network connectivity to external services",
  command: "ping -c 4 8.8.8.8",
  expectedOutput: "4 packets transmitted, 4 received",
  actualOutput: "4 packets transmitted, 4 received, 0% packet loss",
  status: "COMPLETED",
  requiresApproval: false,
  approvedBy: null,
  approvedAt: null,
  executedAt: ISODate("2024-01-14T14:15:00Z"),
  createdAt: ISODate("2024-01-14T14:05:00Z"),
  updatedAt: ISODate("2024-01-14T14:15:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.IncidentSteps.insertOne({
  incidentId: ObjectId("..."),
  stepNumber: 1,
  title: "Step Title",
  description: "Step description",
  command: "command to execute",
  expectedOutput: "expected output",
  status: "PENDING",
  requiresApproval: false,
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.IncidentSteps.findOne({ _id: ObjectId("...") })

// UPDATE
db.IncidentSteps.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: { 
      status: "COMPLETED",
      actualOutput: "actual output",
      executedAt: new Date(),
      updatedAt: new Date()
    }
  }
)

// DELETE
db.IncidentSteps.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/incidents/:id/steps → IncidentSteps
- POST /api/incidents/:id/steps → IncidentSteps, AuditLogs
- PUT /api/incidents/:id/steps/:stepId → IncidentSteps, AuditLogs
- DELETE /api/incidents/:id/steps/:stepId → IncidentSteps, AuditLogs
- POST /api/incidents/:id/steps/:stepId/approve → IncidentSteps, ApprovalRequests, AuditLogs
- POST /api/incidents/:id/steps/:stepId/execute → IncidentSteps, ExecutionQueue, AuditLogs

### Security Notes
- Implement step access control based on incident permissions
- Validate command execution permissions
- Log all step status changes
- Implement step approval workflow
- Restrict step deletion to authorized users

### Future Scalability Notes
- Add support for step dependencies
- Implement step parallel execution
- Add step timeout configuration
- Consider implementing step retry logic
- Add support for step templates

---

## COLLECTION 19: Chats

### Purpose
Store chat conversations within incidents.

### Description
Stores chat messages exchanged between users and AI agents during incident resolution. Supports multi-turn conversations with role-based messages (user, assistant, system) and citation tracking for RAG responses.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| incidentId | ObjectId | No | Yes | - | Must reference Incidents._id |
| userId | ObjectId | Yes | No | null | Must reference Users._id |
| role | String | No | Yes | - | Enum: USER, ASSISTANT, SYSTEM |
| content | String | No | Yes | - | Message content |
| citations | Array[ObjectId] | No | Yes | [] | Referenced chunk IDs |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- incidentId → Incidents._id
- userId → Users._id
- citations → RunbookChunks._id

### Relationships
- Many-to-One with Incidents
- Many-to-One with Users
- Many-to-Many with RunbookChunks (via citations)

### Indexes

#### Single Indexes
```javascript
// Incident ID index
db.Chats.createIndex({ incidentId: 1 })

// User ID index
db.Chats.createIndex({ userId: 1 })

// Role index
db.Chats.createIndex({ role: 1 })

// Created at index
db.Chats.createIndex({ createdAt: -1 })

// Content text index
db.Chats.createIndex({ content: "text" })
```

#### Compound Indexes
```javascript
// Chats by incident and date
db.Chats.createIndex({ 
  incidentId: 1, 
  createdAt: 1 
})

// Chats by user and date
db.Chats.createIndex({ 
  userId: 1, 
  createdAt: -1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get chat history for incident
db.Chats.find({ 
  incidentId: incidentId 
}).sort({ createdAt: 1 })

// Get user messages
db.Chats.find({ 
  incidentId: incidentId,
  role: "USER" 
}).sort({ createdAt: 1 })

// Search chat content
db.Chats.find({
  incidentId: incidentId,
  $text: { $search: "network issue" }
})
```

### Aggregation Pipelines

```javascript
// Chat statistics by incident
db.Chats.aggregate([
  { $group: {
    _id: '$incidentId',
    messageCount: { $sum: 1 },
    userMessages: { $sum: { $cond: [{ $eq: ['$role', 'USER'] }, 1, 0] } },
    assistantMessages: { $sum: { $cond: [{ $eq: ['$role', 'ASSISTANT'] }, 1, 0] } }
  }}
])

// Chat statistics by role
db.Chats.aggregate([
  { $group: {
    _id: '$role',
    count: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Use text index for chat search
- Cache chat history in memory for active incidents
- Use read concern 'local' for chat reads
- Implement chat pagination for long conversations
- Consider using capped collection for very old chats

### MongoDB Validation Schema

```javascript
db.createCollection('Chats', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['incidentId', 'role', 'content'],
      properties: {
        _id: { bsonType: 'objectId' },
        incidentId: { bsonType: 'objectId' },
        userId: { bsonType: ['objectId', 'null'] },
        role: {
          bsonType: 'string',
          enum: ['USER', 'ASSISTANT', 'SYSTEM']
        },
        content: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 10000
        },
        citations: {
          bsonType: 'array',
          items: { bsonType: 'objectId' }
        },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: User message
{
  _id: ObjectId("507f1f77bcf86cd799439220"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  role: "USER",
  content: "The database is not responding. What should I do?",
  citations: [],
  createdAt: ISODate("2024-01-15T10:10:00Z")
}

// Sample 2: Assistant message with citations
{
  _id: ObjectId("507f1f77bcf86cd799439221"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  userId: null,
  role: "ASSISTANT",
  content: "Based on the database recovery runbook, you should first check the service status using 'systemctl status postgresql'. If the service is down, restart it with 'systemctl restart postgresql'.",
  citations: [ObjectId("507f1f77bcf86cd799439111"), ObjectId("507f1f77bcf86cd799439112")],
  createdAt: ISODate("2024-01-15T10:10:05Z")
}

// Sample 3: System message
{
  _id: ObjectId("507f1f77bcf86cd799439222"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  userId: null,
  role: "SYSTEM",
  content: "Incident status updated to IN_PROGRESS",
  citations: [],
  createdAt: ISODate("2024-01-15T10:15:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.Chats.insertOne({
  incidentId: ObjectId("..."),
  userId: ObjectId("..."),
  role: "USER",
  content: "Message content",
  citations: [],
  createdAt: new Date()
})

// READ
db.Chats.findOne({ _id: ObjectId("...") })

// DELETE
db.Chats.deleteMany({ incidentId: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/incidents/:id/chats → Chats
- POST /api/incidents/:id/chats → Chats, AuditLogs
- DELETE /api/incidents/:id/chats → Chats, AuditLogs
- GET /api/incidents/:id/chats/search → Chats (text search)

### Security Notes
- Implement chat access control based on incident permissions
- Validate message content length
- Log all chat activities
- Implement chat moderation if needed
- Restrict chat deletion to authorized users

### Future Scalability Notes
- Add support for chat reactions
- Implement chat editing
- Add chat message threading
- Consider implementing chat export
- Add support for chat attachments

---

## COLLECTION 20: AIMemory

### Purpose
Store AI agent memory for context and learning.

### Description
Stores memory entries for AI agents including context, reasoning chains, learnings, and decision history. Supports different memory types (short-term, long-term, episodic) and importance scoring for memory retention.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| incidentId | ObjectId | Yes | No | null | Must reference Incidents._id |
| userId | ObjectId | Yes | No | null | Must reference Users._id |
| agentType | String | No | Yes | - | Agent type (PLANNER, EXECUTOR, DECISION, REPORTER, MEMORY) |
| memoryType | String | No | Yes | - | Memory type (CONTEXT, REASONING, LEARNING, DECISION) |
| content | Object | No | Yes | - | Memory content (flexible structure) |
| importance | Integer | No | Yes | 5 | Importance score (1-10) |
| expiresAt | DateTime | Yes | No | null | Memory expiration |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- incidentId → Incidents._id
- userId → Users._id

### Relationships
- Many-to-One with Incidents
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// Incident ID index
db.AIMemory.createIndex({ incidentId: 1 })

// User ID index
db.AIMemory.createIndex({ userId: 1 })

// Agent type index
db.AIMemory.createIndex({ agentType: 1 })

// Memory type index
db.AIMemory.createIndex({ memoryType: 1 })

// Importance index
db.AIMemory.createIndex({ importance: -1 })

// Created at index
db.AIMemory.createIndex({ createdAt: -1 })
```

#### Compound Indexes
```javascript
// Memory by incident and agent
db.AIMemory.createIndex({ 
  incidentId: 1, 
  agentType: 1,
  memoryType: 1 
})

// Memory by user and importance
db.AIMemory.createIndex({ 
  userId: 1, 
  importance: -1 
})

// Expired memory cleanup
db.AIMemory.createIndex({ 
  expiresAt: 1 
})
```

#### TTL Indexes
```javascript
// Auto-expire memory after expiration
db.AIMemory.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Recommended Queries

```javascript
// Get memory for incident
db.AIMemory.find({ 
  incidentId: incidentId 
}).sort({ importance: -1, createdAt: -1 })

// Get memory by agent type
db.AIMemory.find({ 
  incidentId: incidentId,
  agentType: "PLANNER" 
})

// Get high importance memory
db.AIMemory.find({ 
  importance: { $gte: 8 } 
}).sort({ createdAt: -1 })

// Get non-expired memory
db.AIMemory.find({ 
  $or: [
    { expiresAt: null },
    { expiresAt: { $gt: new Date() } }
  ]
})
```

### Aggregation Pipelines

```javascript
// Memory statistics by type
db.AIMemory.aggregate([
  { $group: {
    _id: '$memoryType',
    count: { $sum: 1 },
    avgImportance: { $avg: '$importance' }
  }}
])

// Memory statistics by agent
db.AIMemory.aggregate([
  { $group: {
    _id: '$agentType',
    count: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Use TTL index for automatic memory cleanup
- Cache high-importance memory in memory
- Use read concern 'local' for memory reads
- Implement memory importance scoring
- Consider using separate collections for different memory types

### MongoDB Validation Schema

```javascript
db.createCollection('AIMemory', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['agentType', 'memoryType', 'content', 'importance'],
      properties: {
        _id: { bsonType: 'objectId' },
        incidentId: { bsonType: ['objectId', 'null'] },
        userId: { bsonType: ['objectId', 'null'] },
        agentType: {
          bsonType: 'string',
          enum: ['PLANNER', 'EXECUTOR', 'DECISION', 'REPORTER', 'MEMORY']
        },
        memoryType: {
          bsonType: 'string',
          enum: ['CONTEXT', 'REASONING', 'LEARNING', 'DECISION']
        },
        content: { bsonType: 'object' },
        importance: {
          bsonType: 'int',
          minimum: 1,
          maximum: 10
        },
        expiresAt: { bsonType: ['date', 'null'] },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Planner context memory
{
  _id: ObjectId("507f1f77bcf86cd799439230"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  userId: null,
  agentType: "PLANNER",
  memoryType: "CONTEXT",
  content: {
    incidentSummary: "Database outage affecting production services",
    identifiedIssue: "PostgreSQL service not responding",
    proposedSteps: ["Check service status", "Restart service", "Verify connectivity"]
  },
  importance: 8,
  expiresAt: null,
  createdAt: ISODate("2024-01-15T10:05:00Z")
}

// Sample 2: Executor reasoning memory
{
  _id: ObjectId("507f1f77bcf86cd799439231"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  userId: null,
  agentType: "EXECUTOR",
  memoryType: "REASONING",
  content: {
    decision: "Restart database service",
    reasoning: "Service status check failed, restart is the next logical step",
    riskLevel: "MEDIUM",
    requiresApproval: true
  },
  importance: 7,
  expiresAt: ISODate("2024-01-16T10:05:00Z"),
  createdAt: ISODate("2024-01-15T10:20:00Z")
}

// Sample 3: Learning memory
{
  _id: ObjectId("507f1f77bcf86cd799439232"),
  incidentId: null,
  userId: null,
  agentType: "MEMORY",
  memoryType: "LEARNING",
  content: {
    pattern: "Database outages often occur after system updates",
    recommendation: "Schedule database checks after updates",
    frequency: 3
  },
  importance: 9,
  expiresAt: null,
  createdAt: ISODate("2024-01-15T18:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.AIMemory.insertOne({
  incidentId: ObjectId("..."),
  agentType: "PLANNER",
  memoryType: "CONTEXT",
  content: { key: "value" },
  importance: 8,
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  createdAt: new Date()
})

// READ
db.AIMemory.findOne({ _id: ObjectId("...") })

// UPDATE
db.AIMemory.updateOne(
  { _id: ObjectId("...") },
  { $set: { importance: 9 } }
)

// DELETE
db.AIMemory.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/incidents/:id/ai-memory → AIMemory (internal)
- POST /api/incidents/:id/ai-memory → AIMemory (internal)
- DELETE /api/incidents/:id/ai-memory → AIMemory (internal)

### Security Notes
- Restrict AI memory access to system components
- Log memory access for debugging
- Validate memory content structure
- Implement memory cleanup policies
- Monitor memory usage and growth

### Future Scalability Notes
- Add support for memory compression
- Implement memory sharing between incidents
- Add memory versioning
- Consider implementing memory export/import
- Add support for memory search and retrieval

---

## COLLECTION 21: Feedback

### Purpose
Store user feedback on incidents and steps.

### Description
Stores user feedback including ratings, comments, and categorization for incidents and specific steps. Used for continuous improvement of AI agent performance and runbook quality.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| incidentId | ObjectId | No | Yes | - | Must reference Incidents._id |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| stepId | ObjectId | Yes | No | null | Must reference IncidentSteps._id |
| rating | Integer | No | Yes | - | Rating (1-5) |
| comment | String | Yes | No | null | Max 2000 chars |
| category | String | Yes | No | null | Feedback category |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- userId + incidentId + stepId (compound)

### Foreign Reference Fields
- incidentId → Incidents._id
- userId → Users._id
- stepId → IncidentSteps._id

### Relationships
- Many-to-One with Incidents
- Many-to-One with Users
- Many-to-One with IncidentSteps

### Indexes

#### Single Indexes
```javascript
// Incident ID index
db.Feedback.createIndex({ incidentId: 1 })

// User ID index
db.Feedback.createIndex({ userId: 1 })

// Step ID index
db.Feedback.createIndex({ stepId: 1 })

// Rating index
db.Feedback.createIndex({ rating: -1 })

// Category index
db.Feedback.createIndex({ category: 1 })

// Created at index
db.Feedback.createIndex({ createdAt: -1 })
```

#### Compound Indexes
```javascript
// Unique feedback per user per incident step
db.Feedback.createIndex({ 
  userId: 1, 
  incidentId: 1, 
  stepId: 1 
}, { unique: true })

// Feedback by incident and rating
db.Feedback.createIndex({ 
  incidentId: 1, 
  rating: -1 
})

// Feedback by user and date
db.Feedback.createIndex({ 
  userId: 1, 
  createdAt: -1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get feedback for incident
db.Feedback.find({ 
  incidentId: incidentId 
}).sort({ createdAt: -1 })

// Get feedback for step
db.Feedback.find({ 
  stepId: stepId 
})

// Get average rating for incident
db.Feedback.aggregate([
  { $match: { incidentId: incidentId } },
  { $group: {
    _id: null,
    avgRating: { $avg: '$rating' },
    count: { $sum: 1 }
  }}
])

// Get user feedback
db.Feedback.find({ 
  userId: userId 
}).sort({ createdAt: -1 })
```

### Aggregation Pipelines

```javascript
// Feedback statistics by rating
db.Feedback.aggregate([
  { $group: {
    _id: '$rating',
    count: { $sum: 1 }
  }}
])

// Feedback statistics by category
db.Feedback.aggregate([
  { $group: {
    _id: '$category',
    count: { $sum: 1 },
    avgRating: { $avg: '$rating' }
  }}
])
```

### Optimization Tips
- Use covered queries for feedback lookups
- Cache average ratings for incidents
- Use read concern 'local' for feedback reads
- Implement feedback aggregation for analytics

### MongoDB Validation Schema

```javascript
db.createCollection('Feedback', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['incidentId', 'userId', 'rating'],
      properties: {
        _id: { bsonType: 'objectId' },
        incidentId: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        stepId: { bsonType: ['objectId', 'null'] },
        rating: {
          bsonType: 'int',
          minimum: 1,
          maximum: 5
        },
        comment: {
          bsonType: ['string', 'null'],
          maxLength: 2000
        },
        category: {
          bsonType: ['string', 'null']
        },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Positive incident feedback
{
  _id: ObjectId("507f1f77bcf86cd799439240"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  stepId: null,
  rating: 5,
  comment: "Excellent guidance, resolved the issue quickly",
  category: "RESOLUTION_QUALITY",
  createdAt: ISODate("2024-01-15T18:00:00Z")
}

// Sample 2: Step feedback
{
  _id: ObjectId("507f1f77bcf86cd799439241"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  stepId: ObjectId("507f1f77bcf86cd799439211"),
  rating: 4,
  comment: "Step was clear but approval process was slow",
  category: "STEP_EXECUTION",
  createdAt: ISODate("2024-01-15T18:05:00Z")
}

// Sample 3: Constructive feedback
{
  _id: ObjectId("507f1f77bcf86cd799439242"),
  incidentId: ObjectId("507f1f77bcf86cd799439201"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  stepId: null,
  rating: 3,
  comment: "Good suggestions but could be more specific to our environment",
  category: "RELEVANCE",
  createdAt: ISODate("2024-01-16T10:30:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.Feedback.insertOne({
  incidentId: ObjectId("..."),
  userId: ObjectId("..."),
  stepId: ObjectId("..."),
  rating: 5,
  comment: "Great job!",
  category: "RESOLUTION_QUALITY",
  createdAt: new Date()
})

// READ
db.Feedback.findOne({ _id: ObjectId("...") })

// UPDATE
db.Feedback.updateOne(
  { _id: ObjectId("...") },
  { $set: { rating: 4, comment: "Updated comment" } }
)

// DELETE
db.Feedback.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/incidents/:id/feedback → Feedback
- POST /api/incidents/:id/feedback → Feedback, AuditLogs
- PUT /api/incidents/:id/feedback/:feedbackId → Feedback, AuditLogs
- GET /api/steps/:id/feedback → Feedback
- POST /api/steps/:id/feedback → Feedback, AuditLogs

### Security Notes
- Implement feedback access control
- Validate feedback ownership
- Log feedback submissions
- Implement feedback moderation if needed
- Restrict feedback deletion to authorized users

### Future Scalability Notes
- Add support for feedback categories
- Implement feedback sentiment analysis
- Add feedback aggregation for analytics
- Consider implementing feedback notifications
- Add support for feedback responses

---

## COLLECTION 22: SearchHistory

### Purpose
Store user search query history.

### Description
Stores search queries made by users along with result counts and timestamps. Used for analytics, search optimization, and providing search suggestions.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| query | String | No | Yes | - | Search query |
| results | Array[ObjectId] | No | Yes | [] | Result IDs |
| resultCount | Integer | No | Yes | 0 | Number of results |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- userId → Users._id
- results → Various collections based on search type

### Relationships
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// User ID index
db.SearchHistory.createIndex({ userId: 1 })

// Query text index
db.SearchHistory.createIndex({ query: "text" })

// Created at index
db.SearchHistory.createIndex({ createdAt: -1 })
```

#### Compound Indexes
```javascript
// User search history by date
db.SearchHistory.createIndex({ 
  userId: 1, 
  createdAt: -1 
})
```

#### TTL Indexes
```javascript
// Auto-expire search history after 90 days
db.SearchHistory.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 })
```

### Recommended Queries

```javascript
// Get user search history
db.SearchHistory.find({ 
  userId: userId 
}).sort({ createdAt: -1 })

// Get recent searches
db.SearchHistory.find({ 
  userId: userId 
}).sort({ createdAt: -1 }).limit(10)

// Search for similar queries
db.SearchHistory.find({
  userId: userId,
  $text: { $search: "network" }
})
```

### Aggregation Pipelines

```javascript
// Popular search queries
db.SearchHistory.aggregate([
  { $group: {
    _id: '$query',
    searchCount: { $sum: 1 },
    avgResultCount: { $avg: '$resultCount' }
  }},
  { $sort: { searchCount: -1 } },
  { $limit: 20 }
])

// Search statistics by user
db.SearchHistory.aggregate([
  { $group: {
    _id: '$userId',
    searchCount: { $sum: 1 }
  }},
  { $sort: { searchCount: -1 } }
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Cache popular search queries
- Use read concern 'local' for search history reads
- Implement search suggestion algorithms
- Consider using capped collection for search history

### MongoDB Validation Schema

```javascript
db.createCollection('SearchHistory', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'query'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        query: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 500
        },
        results: {
          bsonType: 'array',
          items: { bsonType: 'objectId' }
        },
        resultCount: {
          bsonType: 'int',
          minimum: 0
        },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Network search
{
  _id: ObjectId("507f1f77bcf86cd799439250"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  query: "network troubleshooting",
  results: [ObjectId("507f1f77bcf86cd799439090"), ObjectId("507f1f77bcf86cd799439092")],
  resultCount: 2,
  createdAt: ISODate("2024-01-15T10:00:00Z")
}

// Sample 2: Database search
{
  _id: ObjectId("507f1f77bcf86cd799439251"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  query: "database recovery procedures",
  results: [ObjectId("507f1f77bcf86cd799439091")],
  resultCount: 1,
  createdAt: ISODate("2024-01-15T11:30:00Z")
}

// Sample 3: Security search
{
  _id: ObjectId("507f1f77bcf86cd799439252"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  query: "server security hardening",
  results: [ObjectId("507f1f77bcf86cd799439092")],
  resultCount: 1,
  createdAt: ISODate("2024-01-16T09:15:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.SearchHistory.insertOne({
  userId: ObjectId("..."),
  query: "search query",
  results: [ObjectId("...")],
  resultCount: 5,
  createdAt: new Date()
})

// READ
db.SearchHistory.findOne({ _id: ObjectId("...") })

// DELETE
db.SearchHistory.deleteMany({ userId: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/users/:id/search-history → SearchHistory
- DELETE /api/users/:id/search-history → SearchHistory, AuditLogs
- GET /api/search/suggestions → SearchHistory

### Security Notes
- Implement search history access control
- Validate search history ownership
- Log search history access
- Implement search history privacy controls
- Restrict search history deletion to authorized users

### Future Scalability Notes
- Add support for search filters
- Implement search history analytics
- Add search result click tracking
- Consider implementing search personalization
- Add support for search sharing

---

## COLLECTION 23: AuditLogs

### Purpose
Store audit trail for all system operations.

### Description
Comprehensive audit logging collection that tracks all critical system operations including user actions, data modifications, configuration changes, and administrative activities. Essential for compliance, security monitoring, and forensic analysis.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | Yes | No | null | Must reference Users._id |
| action | String | No | Yes | - | Action performed |
| entityType | String | No | Yes | - | Entity type affected |
| entityId | ObjectId | Yes | No | null | Entity ID affected |
| details | Object | No | Yes | {} | Additional details |
| ipAddress | String | Yes | No | null | IP address |
| userAgent | String | Yes | No | null | User agent |
| timestamp | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- userId → Users._id
- entityId → Various collections based on entityType

### Relationships
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// User ID index
db.AuditLogs.createIndex({ userId: 1 })

// Action index
db.AuditLogs.createIndex({ action: 1 })

// Entity type index
db.AuditLogs.createIndex({ entityType: 1 })

// Entity ID index
db.AuditLogs.createIndex({ entityId: 1 })

// IP address index
db.AuditLogs.createIndex({ ipAddress: 1 })

// Timestamp index
db.AuditLogs.createIndex({ timestamp: -1 })
```

#### Compound Indexes
```javascript
// Audit logs by user and date
db.AuditLogs.createIndex({ 
  userId: 1, 
  timestamp: -1 
})

// Audit logs by entity
db.AuditLogs.createIndex({ 
  entityType: 1, 
  entityId: 1,
  timestamp: -1 
})

// Audit logs by action and date
db.AuditLogs.createIndex({ 
  action: 1, 
  timestamp: -1 
})
```

#### TTL Indexes
```javascript
// Auto-expire audit logs after 2 years
db.AuditLogs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 63072000 })
```

### Recommended Queries

```javascript
// Get audit logs for user
db.AuditLogs.find({ 
  userId: userId 
}).sort({ timestamp: -1 })

// Get audit logs for entity
db.AuditLogs.find({ 
  entityType: "RUNBOOK",
  entityId: entityId 
}).sort({ timestamp: -1 })

// Get audit logs by action
db.AuditLogs.find({ 
  action: "DELETE" 
}).sort({ timestamp: -1 })

// Get audit logs by IP
db.AuditLogs.find({ 
  ipAddress: "192.168.1.100" 
}).sort({ timestamp: -1 })
```

### Aggregation Pipelines

```javascript
// Audit statistics by action
db.AuditLogs.aggregate([
  { $group: {
    _id: '$action',
    count: { $sum: 1 }
  }},
  { $sort: { count: -1 } }
])

// Audit statistics by entity type
db.AuditLogs.aggregate([
  { $group: {
    _id: '$entityType',
    count: { $sum: 1 }
  }}
])

// User activity summary
db.AuditLogs.aggregate([
  { $group: {
    _id: '$userId',
    actionCount: { $sum: 1 },
    lastActivity: { $max: '$timestamp' }
  }},
  { $sort: { actionCount: -1 } }
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Implement audit log archiving for compliance
- Use read concern 'local' for audit log reads
- Consider using capped collection for high-volume logging
- Implement audit log aggregation for analytics

### MongoDB Validation Schema

```javascript
db.createCollection('AuditLogs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['action', 'entityType'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: ['objectId', 'null'] },
        action: {
          bsonType: 'string',
          minLength: 1
        },
        entityType: {
          bsonType: 'string',
          minLength: 1
        },
        entityId: { bsonType: ['objectId', 'null'] },
        details: { bsonType: 'object' },
        ipAddress: {
          bsonType: ['string', 'null']
        },
        userAgent: {
          bsonType: ['string', 'null']
        },
        timestamp: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: User creation
{
  _id: ObjectId("507f1f77bcf86cd799439260"),
  userId: ObjectId("507f1f77bcf86cd799439010"),
  action: "CREATE",
  entityType: "USER",
  entityId: ObjectId("507f1f77bcf86cd799439011"),
  details: { username: "john.doe", email: "john@example.com" },
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  timestamp: ISODate("2024-01-15T10:00:00Z")
}

// Sample 2: Runbook deletion
{
  _id: ObjectId("507f1f77bcf86cd799439261"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  action: "DELETE",
  entityType: "RUNBOOK",
  entityId: ObjectId("507f1f77bcf86cd799439090"),
  details: { title: "Network Troubleshooting Guide" },
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  timestamp: ISODate("2024-01-15T12:00:00Z")
}

// Sample 3: Incident status change
{
  _id: ObjectId("507f1f77bcf86cd799439262"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  action: "UPDATE",
  entityType: "INCIDENT",
  entityId: ObjectId("507f1f77bcf86cd799439200"),
  details: { oldStatus: "OPEN", newStatus: "IN_PROGRESS" },
  ipAddress: "192.168.1.101",
  userAgent: "Mozilla/5.0...",
  timestamp: ISODate("2024-01-15T10:30:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.AuditLogs.insertOne({
  userId: ObjectId("..."),
  action: "CREATE",
  entityType: "RUNBOOK",
  entityId: ObjectId("..."),
  details: { title: "New Runbook" },
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  timestamp: new Date()
})

// READ
db.AuditLogs.findOne({ _id: ObjectId("...") })

// DELETE
db.AuditLogs.deleteMany({ timestamp: { $lt: new Date("2022-01-01") } })
```

### REST APIs using the collection

- GET /api/audit-logs → AuditLogs (admin only)
- GET /api/audit-logs/:id → AuditLogs (admin only)
- GET /api/users/:id/audit-logs → AuditLogs

### Security Notes
- Restrict audit log access to admin users
- Implement audit log tamper detection
- Log all audit log access
- Implement audit log export for compliance
- Use write concern 'majority' for audit log writes

### Future Scalability Notes
- Add support for audit log encryption
- Implement audit log signature verification
- Add audit log search and filtering
- Consider implementing real-time audit log monitoring
- Add support for audit log retention policies

---

## COLLECTION 24: ActivityLogs

### Purpose
Store user activity logs for analytics and monitoring.

### Description
Stores user activity events including page views, feature usage, and interactions. Used for analytics, user behavior analysis, and system monitoring. Less critical than audit logs but valuable for insights.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| activityType | String | No | Yes | - | Activity type |
| entityType | String | Yes | No | null | Entity type |
| entityId | ObjectId | Yes | No | null | Entity ID |
| metadata | Object | No | Yes | {} | Additional metadata |
| timestamp | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- userId → Users._id
- entityId → Various collections based on entityType

### Relationships
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// User ID index
db.ActivityLogs.createIndex({ userId: 1 })

// Activity type index
db.ActivityLogs.createIndex({ activityType: 1 })

// Entity type index
db.ActivityLogs.createIndex({ entityType: 1 })

// Timestamp index
db.ActivityLogs.createIndex({ timestamp: -1 })
```

#### Compound Indexes
```javascript
// Activity by user and date
db.ActivityLogs.createIndex({ 
  userId: 1, 
  timestamp: -1 
})

// Activity by type and date
db.ActivityLogs.createIndex({ 
  activityType: 1, 
  timestamp: -1 
})
```

#### TTL Indexes
```javascript
// Auto-expire activity logs after 1 year
db.ActivityLogs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 31536000 })
```

### Recommended Queries

```javascript
// Get user activity
db.ActivityLogs.find({ 
  userId: userId 
}).sort({ timestamp: -1 })

// Get activity by type
db.ActivityLogs.find({ 
  activityType: "PAGE_VIEW" 
}).sort({ timestamp: -1 })

// Get recent activity
db.ActivityLogs.find({ 
  timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
}).sort({ timestamp: -1 })
```

### Aggregation Pipelines

```javascript
// Activity statistics by type
db.ActivityLogs.aggregate([
  { $group: {
    _id: '$activityType',
    count: { $sum: 1 }
  }}
])

// User activity summary
db.ActivityLogs.aggregate([
  { $group: {
    _id: '$userId',
    activityCount: { $sum: 1 },
    lastActivity: { $max: '$timestamp' }
  }},
  { $sort: { activityCount: -1 } }
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Implement activity log aggregation
- Use read concern 'local' for activity log reads
- Consider using capped collection for high-volume logging
- Implement activity log sampling for analytics

### MongoDB Validation Schema

```javascript
db.createCollection('ActivityLogs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'activityType'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        activityType: {
          bsonType: 'string',
          minLength: 1
        },
        entityType: {
          bsonType: ['string', 'null']
        },
        entityId: { bsonType: ['objectId', 'null'] },
        metadata: { bsonType: 'object' },
        timestamp: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Page view
{
  _id: ObjectId("507f1f77bcf86cd799439270"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  activityType: "PAGE_VIEW",
  entityType: "RUNBOOK",
  entityId: ObjectId("507f1f77bcf86cd799439090"),
  metadata: { page: "/runbooks/507f1f77bcf86cd799439090" },
  timestamp: ISODate("2024-01-15T10:00:00Z")
}

// Sample 2: Search activity
{
  _id: ObjectId("507f1f77bcf86cd799439271"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  activityType: "SEARCH",
  entityType: null,
  entityId: null,
  metadata: { query: "network troubleshooting", results: 5 },
  timestamp: ISODate("2024-01-15T11:30:00Z")
}

// Sample 3: Incident creation
{
  _id: ObjectId("507f1f77bcf86cd799439272"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  activityType: "INCIDENT_CREATE",
  entityType: "INCIDENT",
  entityId: ObjectId("507f1f77bcf86cd799439200"),
  metadata: { severity: "CRITICAL" },
  timestamp: ISODate("2024-01-15T12:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.ActivityLogs.insertOne({
  userId: ObjectId("..."),
  activityType: "PAGE_VIEW",
  entityType: "RUNBOOK",
  entityId: ObjectId("..."),
  metadata: { page: "/runbooks/..." },
  timestamp: new Date()
})

// READ
db.ActivityLogs.findOne({ _id: ObjectId("...") })

// DELETE
db.ActivityLogs.deleteMany({ timestamp: { $lt: new Date("2023-01-01") } })
```

### REST APIs using the collection

- GET /api/activity-logs → ActivityLogs (admin only)
- GET /api/users/:id/activity-logs → ActivityLogs

### Security Notes
- Implement activity log access control
- Validate activity log ownership
- Log activity log access
- Implement activity log privacy controls

### Future Scalability Notes
- Add support for activity log analytics
- Implement activity log aggregation
- Add real-time activity monitoring
- Consider implementing activity-based recommendations
- Add support for activity log export

---

## COLLECTION 25: LoginHistory

### Purpose
Store user login history for security monitoring.

### Description
Tracks all successful user login attempts including timestamps, IP addresses, user agents, and session information. Used for security monitoring, anomaly detection, and compliance reporting.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| sessionId | ObjectId | No | Yes | - | Must reference Sessions._id |
| loginMethod | String | No | Yes | - | Login method (PASSWORD, SSO, API_KEY) |
| ipAddress | String | No | Yes | - | IP address |
| userAgent | String | Yes | No | null | User agent |
| deviceInfo | Object | No | Yes | {} | Device information |
| location | Object | Yes | No | null | Location data |
| timestamp | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- userId → Users._id
- sessionId → Sessions._id

### Relationships
- Many-to-One with Users
- Many-to-One with Sessions

### Indexes

#### Single Indexes
```javascript
// User ID index
db.LoginHistory.createIndex({ userId: 1 })

// Session ID index
db.LoginHistory.createIndex({ sessionId: 1 })

// Login method index
db.LoginHistory.createIndex({ loginMethod: 1 })

// IP address index
db.LoginHistory.createIndex({ ipAddress: 1 })

// Timestamp index
db.LoginHistory.createIndex({ timestamp: -1 })
```

#### Compound Indexes
```javascript
// Login history by user and date
db.LoginHistory.createIndex({ 
  userId: 1, 
  timestamp: -1 
})

// Login history by IP and date
db.LoginHistory.createIndex({ 
  ipAddress: 1, 
  timestamp: -1 
})
```

#### TTL Indexes
```javascript
// Auto-expire login history after 1 year
db.LoginHistory.createIndex({ timestamp: 1 }, { expireAfterSeconds: 31536000 })
```

### Recommended Queries

```javascript
// Get login history for user
db.LoginHistory.find({ 
  userId: userId 
}).sort({ timestamp: -1 })

// Get recent logins from IP
db.LoginHistory.find({ 
  ipAddress: "192.168.1.100",
  timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
}).sort({ timestamp: -1 })

// Get login statistics
db.LoginHistory.aggregate([
  { $group: {
    _id: '$userId',
    loginCount: { $sum: 1 },
    lastLogin: { $max: '$timestamp' }
  }}
])
```

### Aggregation Pipelines

```javascript
// Login statistics by method
db.LoginHistory.aggregate([
  { $group: {
    _id: '$loginMethod',
    count: { $sum: 1 }
  }}
])

// Login statistics by IP
db.LoginHistory.aggregate([
  { $group: {
    _id: '$ipAddress',
    loginCount: { $sum: 1 }
  }},
  { $sort: { loginCount: -1 } }
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Implement login anomaly detection
- Use read concern 'local' for login history reads
- Cache recent login history for security checks

### MongoDB Validation Schema

```javascript
db.createCollection('LoginHistory', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'sessionId', 'loginMethod', 'ipAddress'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        sessionId: { bsonType: 'objectId' },
        loginMethod: {
          bsonType: 'string',
          enum: ['PASSWORD', 'SSO', 'API_KEY']
        },
        ipAddress: {
          bsonType: 'string'
        },
        userAgent: {
          bsonType: ['string', 'null']
        },
        deviceInfo: { bsonType: 'object' },
        location: {
          bsonType: ['object', 'null']
        },
        timestamp: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Password login
{
  _id: ObjectId("507f1f77bcf86cd799439280"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  sessionId: ObjectId("507f1f77bcf86cd799439020"),
  loginMethod: "PASSWORD",
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  deviceInfo: { os: "Windows", browser: "Chrome" },
  location: { country: "US", city: "New York" },
  timestamp: ISODate("2024-01-15T09:00:00Z")
}

// Sample 2: SSO login
{
  _id: ObjectId("507f1f77bcf86cd799439281"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  sessionId: ObjectId("507f1f77bcf86cd799439021"),
  loginMethod: "SSO",
  ipAddress: "192.168.1.101",
  userAgent: "Mozilla/5.0...",
  deviceInfo: { os: "MacOS", browser: "Safari" },
  location: { country: "US", city: "San Francisco" },
  timestamp: ISODate("2024-01-15T10:30:00Z")
}

// Sample 3: API key login
{
  _id: ObjectId("507f1f77bcf86cd799439282"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  sessionId: ObjectId("507f1f77bcf86cd799439022"),
  loginMethod: "API_KEY",
  ipAddress: "10.0.0.50",
  userAgent: null,
  deviceInfo: { type: "API_CLIENT" },
  location: null,
  timestamp: ISODate("2024-01-15T11:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.LoginHistory.insertOne({
  userId: ObjectId("..."),
  sessionId: ObjectId("..."),
  loginMethod: "PASSWORD",
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  deviceInfo: { os: "Windows", browser: "Chrome" },
  location: { country: "US", city: "New York" },
  timestamp: new Date()
})

// READ
db.LoginHistory.findOne({ _id: ObjectId("...") })

// DELETE
db.LoginHistory.deleteMany({ timestamp: { $lt: new Date("2023-01-01") } })
```

### REST APIs using the collection

- GET /api/users/:id/login-history → LoginHistory
- GET /api/login-history → LoginHistory (admin only)

### Security Notes
- Implement login history access control
- Validate login history ownership
- Log login history access
- Implement login anomaly detection
- Use write concern 'majority' for login history writes

### Future Scalability Notes
- Add support for login risk scoring
- Implement login pattern analysis
- Add real-time login monitoring
- Consider implementing geo-fencing
- Add support for MFA tracking

---

## COLLECTION 26: FailedLoginAttempts

### Purpose
Store failed login attempts for security monitoring.

### Description
Tracks all failed login attempts including usernames, IP addresses, timestamps, and failure reasons. Used for security monitoring, brute-force attack detection, and account lockout enforcement.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| username | String | No | Yes | - | Username attempted |
| userId | ObjectId | Yes | No | null | Must reference Users._id |
| ipAddress | String | No | Yes | - | IP address |
| userAgent | String | Yes | No | null | User agent |
| failureReason | String | No | Yes | - | Failure reason |
| timestamp | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- userId → Users._id

### Relationships
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// Username index
db.FailedLoginAttempts.createIndex({ username: 1 })

// User ID index
db.FailedLoginAttempts.createIndex({ userId: 1 })

// IP address index
db.FailedLoginAttempts.createIndex({ ipAddress: 1 })

// Failure reason index
db.FailedLoginAttempts.createIndex({ failureReason: 1 })

// Timestamp index
db.FailedLoginAttempts.createIndex({ timestamp: -1 })
```

#### Compound Indexes
```javascript
// Failed attempts by username and date
db.FailedLoginAttempts.createIndex({ 
  username: 1, 
  timestamp: -1 
})

// Failed attempts by IP and date
db.FailedLoginAttempts.createIndex({ 
  ipAddress: 1, 
  timestamp: -1 
})

// Failed attempts by user and date
db.FailedLoginAttempts.createIndex({ 
  userId: 1, 
  timestamp: -1 
})
```

#### TTL Indexes
```javascript
// Auto-expire failed login attempts after 90 days
db.FailedLoginAttempts.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 })
```

### Recommended Queries

```javascript
// Get failed attempts for username
db.FailedLoginAttempts.find({ 
  username: "john.doe" 
}).sort({ timestamp: -1 })

// Get recent failed attempts from IP
db.FailedLoginAttempts.find({ 
  ipAddress: "192.168.1.100",
  timestamp: { $gte: new Date(Date.now() - 15 * 60 * 1000) }
}).sort({ timestamp: -1 })

// Check for brute force attack
db.FailedLoginAttempts.aggregate([
  { $match: { 
    timestamp: { $gte: new Date(Date.now() - 15 * 60 * 1000) }
  }},
  { $group: {
    _id: '$ipAddress',
    attemptCount: { $sum: 1 }
  }},
  { $match: { attemptCount: { $gte: 5 } } }
])
```

### Aggregation Pipelines

```javascript
// Failed login statistics by reason
db.FailedLoginAttempts.aggregate([
  { $group: {
    _id: '$failureReason',
    count: { $sum: 1 }
  }}
])

// Failed login statistics by IP
db.FailedLoginAttempts.aggregate([
  { $group: {
    _id: '$ipAddress',
    attemptCount: { $sum: 1 }
  }},
  { $sort: { attemptCount: -1 } }
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Implement brute-force detection
- Use read concern 'local' for failed login reads
- Cache recent failed attempts for rate limiting
- Implement IP blocking for repeated failures

### MongoDB Validation Schema

```javascript
db.createCollection('FailedLoginAttempts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'ipAddress', 'failureReason'],
      properties: {
        _id: { bsonType: 'objectId' },
        username: {
          bsonType: 'string',
          minLength: 1
        },
        userId: { bsonType: ['objectId', 'null'] },
        ipAddress: {
          bsonType: 'string'
        },
        userAgent: {
          bsonType: ['string', 'null']
        },
        failureReason: {
          bsonType: 'string',
          enum: ['INVALID_CREDENTIALS', 'ACCOUNT_LOCKED', 'ACCOUNT_DISABLED', 'MFA_REQUIRED', 'OTHER']
        },
        timestamp: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Invalid credentials
{
  _id: ObjectId("507f1f77bcf86cd799439290"),
  username: "john.doe",
  userId: ObjectId("507f1f77bcf86cd799439011"),
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  failureReason: "INVALID_CREDENTIALS",
  timestamp: ISODate("2024-01-15T09:00:00Z")
}

// Sample 2: Account locked
{
  _id: ObjectId("507f1f77bcf86cd799439291"),
  username: "jane.smith",
  userId: ObjectId("507f1f77bcf86cd799439012"),
  ipAddress: "192.168.1.101",
  userAgent: "Mozilla/5.0...",
  failureReason: "ACCOUNT_LOCKED",
  timestamp: ISODate("2024-01-15T10:30:00Z")
}

// Sample 3: Unknown username
{
  _id: ObjectId("507f1f77bcf86cd799439292"),
  username: "unknown.user",
  userId: null,
  ipAddress: "192.168.1.102",
  userAgent: "Mozilla/5.0...",
  failureReason: "INVALID_CREDENTIALS",
  timestamp: ISODate("2024-01-15T11:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.FailedLoginAttempts.insertOne({
  username: "john.doe",
  userId: ObjectId("..."),
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  failureReason: "INVALID_CREDENTIALS",
  timestamp: new Date()
})

// READ
db.FailedLoginAttempts.findOne({ _id: ObjectId("...") })

// DELETE
db.FailedLoginAttempts.deleteMany({ timestamp: { $lt: new Date("2023-10-01") } })
```

### REST APIs using the collection

- GET /api/failed-login-attempts → FailedLoginAttempts (admin only)
- GET /api/users/:id/failed-login-attempts → FailedLoginAttempts

### Security Notes
- Implement failed login access control
- Validate failed login ownership
- Log failed login access
- Implement account lockout based on failed attempts
- Use write concern 'majority' for failed login writes

### Future Scalability Notes
- Add support for IP reputation checking
- Implement CAPTCHA integration
- Add real-time threat detection
- Consider implementing geo-blocking
- Add support for MFA enforcement

---

## COLLECTION 27: CommandWhitelist

### Purpose
Store whitelisted commands for safe execution.

### Description
Stores approved commands that can be executed by the system without additional approval. Includes command patterns, risk levels, and execution limits for safe command execution.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| commandPattern | String | No | Yes | - | Command pattern (regex) |
| description | String | No | Yes | - | Command description |
| category | String | No | Yes | - | Command category |
| riskLevel | String | No | Yes | "LOW" | Enum: LOW, MEDIUM, HIGH |
| requiresApproval | Boolean | No | Yes | false | Approval required flag |
| maxExecutionTime | Integer | Yes | No | null | Max execution time (seconds) |
| allowedUsers | Array[ObjectId] | No | Yes | [] | Allowed user IDs |
| allowedRoles | Array[ObjectId] | No | Yes | [] | Allowed role IDs |
| createdBy | ObjectId | No | Yes | - | Must reference Users._id |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- commandPattern

### Foreign Reference Fields
- createdBy → Users._id
- allowedUsers → Users._id
- allowedRoles → Roles._id

### Relationships
- Many-to-One with Users (creator)
- Many-to-Many with Users (allowed users)
- Many-to-Many with Roles (allowed roles)
- One-to-Many with CommandHistory
- One-to-Many with ExecutionLogs

### Indexes

#### Single Indexes
```javascript
// Command pattern index (unique)
db.CommandWhitelist.createIndex({ commandPattern: 1 }, { unique: true })

// Category index
db.CommandWhitelist.createIndex({ category: 1 })

// Risk level index
db.CommandWhitelist.createIndex({ riskLevel: 1 })

// Created by index
db.CommandWhitelist.createIndex({ createdBy: 1 })
```

#### Compound Indexes
```javascript
// Commands by category and risk
db.CommandWhitelist.createIndex({ 
  category: 1, 
  riskLevel: 1 
})

// Commands by approval requirement
db.CommandWhitelist.createIndex({ 
  requiresApproval: 1,
  riskLevel: 1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get all whitelisted commands
db.CommandWhitelist.find({}).sort({ category: 1, riskLevel: 1 })

// Check if command is whitelisted
db.CommandWhitelist.findOne({ 
  commandPattern: { $regex: "^systemctl status" }
})

// Get commands by category
db.CommandWhitelist.find({ 
  category: "NETWORK" 
})

// Get high-risk commands
db.CommandWhitelist.find({ 
  riskLevel: "HIGH" 
})
```

### Aggregation Pipelines

```javascript
// Command statistics by category
db.CommandWhitelist.aggregate([
  { $group: {
    _id: '$category',
    count: { $sum: 1 }
  }}
])

// Command statistics by risk level
db.CommandWhitelist.aggregate([
  { $group: {
    _id: '$riskLevel',
    count: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Cache whitelist in memory for fast lookups
- Use regex pattern matching efficiently
- Use read concern 'local' for whitelist reads
- Implement whitelist validation at application level
- Consider using a separate cache service for whitelist

### MongoDB Validation Schema

```javascript
db.createCollection('CommandWhitelist', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['commandPattern', 'description', 'category', 'riskLevel', 'createdBy'],
      properties: {
        _id: { bsonType: 'objectId' },
        commandPattern: {
          bsonType: 'string',
          minLength: 1
        },
        description: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 500
        },
        category: {
          bsonType: 'string',
          minLength: 1
        },
        riskLevel: {
          bsonType: 'string',
          enum: ['LOW', 'MEDIUM', 'HIGH']
        },
        requiresApproval: { bsonType: 'bool' },
        maxExecutionTime: {
          bsonType: ['int', 'null'],
          minimum: 1
        },
        allowedUsers: {
          bsonType: 'array',
          items: { bsonType: 'objectId' }
        },
        allowedRoles: {
          bsonType: 'array',
          items: { bsonType: 'objectId' }
        },
        createdBy: { bsonType: 'objectId' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Low-risk command
{
  _id: ObjectId("507f1f77bcf86cd799439300"),
  commandPattern: "^systemctl status",
  description: "Check service status",
  category: "SYSTEM",
  riskLevel: "LOW",
  requiresApproval: false,
  maxExecutionTime: 10,
  allowedUsers: [],
  allowedRoles: [ObjectId("507f1f77bcf86cd799439001")],
  createdBy: ObjectId("507f1f77bcf86cd799439010"),
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}

// Sample 2: Medium-risk command
{
  _id: ObjectId("507f1f77bcf86cd799439301"),
  commandPattern: "^systemctl restart",
  description: "Restart system service",
  category: "SYSTEM",
  riskLevel: "MEDIUM",
  requiresApproval: true,
  maxExecutionTime: 30,
  allowedUsers: [ObjectId("507f1f77bcf86cd799439011")],
  allowedRoles: [ObjectId("507f1f77bcf86cd799439002")],
  createdBy: ObjectId("507f1f77bcf86cd799439010"),
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}

// Sample 3: High-risk command
{
  _id: ObjectId("507f1f77bcf86cd799439302"),
  commandPattern: "^rm -rf",
  description: "Remove files recursively",
  category: "FILE_SYSTEM",
  riskLevel: "HIGH",
  requiresApproval: true,
  maxExecutionTime: 60,
  allowedUsers: [ObjectId("507f1f77bcf86cd799439011")],
  allowedRoles: [ObjectId("507f1f77bcf86cd799439003")],
  createdBy: ObjectId("507f1f77bcf86cd799439010"),
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.CommandWhitelist.insertOne({
  commandPattern: "^ping",
  description: "Ping network host",
  category: "NETWORK",
  riskLevel: "LOW",
  requiresApproval: false,
  maxExecutionTime: 30,
  allowedUsers: [],
  allowedRoles: [ObjectId("...")],
  createdBy: ObjectId("..."),
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.CommandWhitelist.findOne({ _id: ObjectId("...") })

// UPDATE
db.CommandWhitelist.updateOne(
  { _id: ObjectId("...") },
  { $set: { requiresApproval: true, updatedAt: new Date() } }
)

// DELETE
db.CommandWhitelist.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/command-whitelist → CommandWhitelist (admin only)
- POST /api/command-whitelist → CommandWhitelist, AuditLogs
- PUT /api/command-whitelist/:id → CommandWhitelist, AuditLogs
- DELETE /api/command-whitelist/:id → CommandWhitelist, AuditLogs

### Security Notes
- Restrict whitelist management to admin users
- Validate command patterns before adding
- Log all whitelist modifications
- Implement command pattern validation
- Use write concern 'majority' for whitelist writes

### Future Scalability Notes
- Add support for command templates
- Implement command parameter validation
- Add command execution statistics
- Consider implementing command sandboxing
- Add support for command dependencies

---

## COLLECTION 28: BlockedCommands

### Purpose
Store blocked commands for security enforcement.

### Description
Stores command patterns that are explicitly blocked from execution. Used to prevent dangerous commands and enforce security policies.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| commandPattern | String | No | Yes | - | Command pattern (regex) |
| description | String | No | Yes | - | Block reason |
| category | String | No | Yes | - | Block category |
| severity | String | No | Yes | "HIGH" | Enum: LOW, MEDIUM, HIGH |
| createdBy | ObjectId | No | Yes | - | Must reference Users._id |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- commandPattern

### Foreign Reference Fields
- createdBy → Users._id

### Relationships
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// Command pattern index (unique)
db.BlockedCommands.createIndex({ commandPattern: 1 }, { unique: true })

// Category index
db.BlockedCommands.createIndex({ category: 1 })

// Severity index
db.BlockedCommands.createIndex({ severity: 1 })

// Created by index
db.BlockedCommands.createIndex({ createdBy: 1 })
```

#### Compound Indexes
```javascript
// Commands by category and severity
db.BlockedCommands.createIndex({ 
  category: 1, 
  severity: 1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get all blocked commands
db.BlockedCommands.find({}).sort({ category: 1, severity: 1 })

// Check if command is blocked
db.BlockedCommands.findOne({ 
  commandPattern: { $regex: "^rm -rf /" }
})

// Get blocked commands by category
db.BlockedCommands.find({ 
  category: "FILE_SYSTEM" 
})
```

### Aggregation Pipelines

```javascript
// Blocked command statistics by category
db.BlockedCommands.aggregate([
  { $group: {
    _id: '$category',
    count: { $sum: 1 }
  }}
])

// Blocked command statistics by severity
db.BlockedCommands.aggregate([
  { $group: {
    _id: '$severity',
    count: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Cache blocked commands in memory for fast lookups
- Use regex pattern matching efficiently
- Use read concern 'local' for blocked command reads
- Validate blocked commands before execution
- Consider using a separate cache service for blocked commands

### MongoDB Validation Schema

```javascript
db.createCollection('BlockedCommands', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['commandPattern', 'description', 'category', 'severity', 'createdBy'],
      properties: {
        _id: { bsonType: 'objectId' },
        commandPattern: {
          bsonType: 'string',
          minLength: 1
        },
        description: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 500
        },
        category: {
          bsonType: 'string',
          minLength: 1
        },
        severity: {
          bsonType: 'string',
          enum: ['LOW', 'MEDIUM', 'HIGH']
        },
        createdBy: { bsonType: 'objectId' },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Dangerous file operation
{
  _id: ObjectId("507f1f77bcf86cd799439310"),
  commandPattern: "^rm -rf /",
  description: "Dangerous: Remove root directory",
  category: "FILE_SYSTEM",
  severity: "HIGH",
  createdBy: ObjectId("507f1f77bcf86cd799439010"),
  createdAt: ISODate("2024-01-01T00:00:00Z")
}

// Sample 2: System shutdown
{
  _id: ObjectId("507f1f77bcf86cd799439311"),
  commandPattern: "^shutdown",
  description: "System shutdown command",
  category: "SYSTEM",
  severity: "HIGH",
  createdBy: ObjectId("507f1f77bcf86cd799439010"),
  createdAt: ISODate("2024-01-01T00:00:00Z")
}

// Sample 3: Privilege escalation
{
  _id: ObjectId("507f1f77bcf86cd799439312"),
  commandPattern: "^sudo su",
  description: "Privilege escalation attempt",
  category: "SECURITY",
  severity: "HIGH",
  createdBy: ObjectId("507f1f77bcf86cd799439010"),
  createdAt: ISODate("2024-01-01T00:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.BlockedCommands.insertOne({
  commandPattern: "^dd if=",
  description: "Disk duplication command",
  category: "FILE_SYSTEM",
  severity: "HIGH",
  createdBy: ObjectId("..."),
  createdAt: new Date()
})

// READ
db.BlockedCommands.findOne({ _id: ObjectId("...") })

// DELETE
db.BlockedCommands.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/blocked-commands → BlockedCommands (admin only)
- POST /api/blocked-commands → BlockedCommands, AuditLogs
- DELETE /api/blocked-commands/:id → BlockedCommands, AuditLogs

### Security Notes
- Restrict blocked command management to admin users
- Validate command patterns before adding
- Log all blocked command modifications
- Implement command validation before execution
- Use write concern 'majority' for blocked command writes

### Future Scalability Notes
- Add support for command exceptions
- Implement command severity scoring
- Add command blocking analytics
- Consider implementing command sandboxing
- Add support for temporary command blocks

---

## COLLECTION 29: ApprovalRequests

### Purpose
Store approval requests for command execution.

### Description
Stores approval requests for commands that require authorization before execution. Tracks request status, approvers, and approval timestamps for audit trail.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| incidentId | ObjectId | Yes | No | null | Must reference Incidents._id |
| stepId | ObjectId | Yes | No | null | Must reference IncidentSteps._id |
| requestedBy | ObjectId | No | Yes | - | Must reference Users._id |
| command | String | No | Yes | - | Command to execute |
| reason | String | No | Yes | - | Execution reason |
| status | String | No | Yes | "PENDING" | Enum: PENDING, APPROVED, REJECTED, CANCELLED |
| approvedBy | ObjectId | Yes | No | null | Must reference Users._id |
| approvedAt | DateTime | Yes | No | null | Approval timestamp |
| rejectionReason | String | Yes | No | null | Rejection reason |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- incidentId → Incidents._id
- stepId → IncidentSteps._id
- requestedBy → Users._id
- approvedBy → Users._id

### Relationships
- Many-to-One with Incidents
- Many-to-One with IncidentSteps
- Many-to-One with Users (requester)
- Many-to-One with Users (approver)

### Indexes

#### Single Indexes
```javascript
// Incident ID index
db.ApprovalRequests.createIndex({ incidentId: 1 })

// Step ID index
db.ApprovalRequests.createIndex({ stepId: 1 })

// Requested by index
db.ApprovalRequests.createIndex({ requestedBy: 1 })

// Approved by index
db.ApprovalRequests.createIndex({ approvedBy: 1 })

// Status index
db.ApprovalRequests.createIndex({ status: 1 })

// Created at index
db.ApprovalRequests.createIndex({ createdAt: -1 })
```

#### Compound Indexes
```javascript
// Requests by incident and status
db.ApprovalRequests.createIndex({ 
  incidentId: 1, 
  status: 1 
})

// Requests by step and status
db.ApprovalRequests.createIndex({ 
  stepId: 1, 
  status: 1 
})

// Pending requests
db.ApprovalRequests.createIndex({ 
  status: "PENDING",
  createdAt: 1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get approval requests for incident
db.ApprovalRequests.find({ 
  incidentId: incidentId 
}).sort({ createdAt: -1 })

// Get pending requests
db.ApprovalRequests.find({ 
  status: "PENDING" 
}).sort({ createdAt: 1 })

// Get requests by user
db.ApprovalRequests.find({ 
  requestedBy: userId 
}).sort({ createdAt: -1 })
```

### Aggregation Pipelines

```javascript
// Approval statistics by status
db.ApprovalRequests.aggregate([
  { $group: {
    _id: '$status',
    count: { $sum: 1 }
  }}
])

// Approval statistics by approver
db.ApprovalRequests.aggregate([
  { $match: { status: "APPROVED" } },
  { $group: {
    _id: '$approvedBy',
    approvalCount: { $sum: 1 }
  }},
  { $sort: { approvalCount: -1 } }
])
```

### Optimization Tips
- Cache pending approval requests
- Use covered queries for approval lookups
- Use read concern 'majority' for approval reads
- Implement approval notification system
- Use write concern 'majority' for approval writes

### MongoDB Validation Schema

```javascript
db.createCollection('ApprovalRequests', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['requestedBy', 'command', 'reason', 'status'],
      properties: {
        _id: { bsonType: 'objectId' },
        incidentId: { bsonType: ['objectId', 'null'] },
        stepId: { bsonType: ['objectId', 'null'] },
        requestedBy: { bsonType: 'objectId' },
        command: {
          bsonType: 'string',
          minLength: 1
        },
        reason: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 1000
        },
        status: {
          bsonType: 'string',
          enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']
        },
        approvedBy: { bsonType: ['objectId', 'null'] },
        approvedAt: { bsonType: ['date', 'null'] },
        rejectionReason: {
          bsonType: ['string', 'null'],
          maxLength: 500
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Pending request
{
  _id: ObjectId("507f1f77bcf86cd799439320"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  stepId: ObjectId("507f1f77bcf86cd799439211"),
  requestedBy: ObjectId("507f1f77bcf86cd799439011"),
  command: "systemctl restart postgresql",
  reason: "Database service needs restart after configuration change",
  status: "PENDING",
  approvedBy: null,
  approvedAt: null,
  rejectionReason: null,
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}

// Sample 2: Approved request
{
  _id: ObjectId("507f1f77bcf86cd799439321"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  stepId: ObjectId("507f1f77bcf86cd799439211"),
  requestedBy: ObjectId("507f1f77bcf86cd799439011"),
  command: "systemctl restart postgresql",
  reason: "Database service needs restart after configuration change",
  status: "APPROVED",
  approvedBy: ObjectId("507f1f77bcf86cd799439012"),
  approvedAt: ISODate("2024-01-15T10:45:00Z"),
  rejectionReason: null,
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:45:00Z")
}

// Sample 3: Rejected request
{
  _id: ObjectId("507f1f77bcf86cd799439322"),
  incidentId: ObjectId("507f1f77bcf86cd799439201"),
  stepId: ObjectId("507f1f77bcf86cd799439215"),
  requestedBy: ObjectId("507f1f77bcf86cd799439011"),
  command: "rm -rf /var/log/*",
  reason: "Clear log files to free disk space",
  status: "REJECTED",
  approvedBy: ObjectId("507f1f77bcf86cd799439012"),
  approvedAt: ISODate("2024-01-14T15:30:00Z"),
  rejectionReason: "Too risky, use log rotation instead",
  createdAt: ISODate("2024-01-14T15:15:00Z"),
  updatedAt: ISODate("2024-01-14T15:30:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.ApprovalRequests.insertOne({
  incidentId: ObjectId("..."),
  stepId: ObjectId("..."),
  requestedBy: ObjectId("..."),
  command: "command to execute",
  reason: "Execution reason",
  status: "PENDING",
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.ApprovalRequests.findOne({ _id: ObjectId("...") })

// UPDATE
db.ApprovalRequests.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: { 
      status: "APPROVED",
      approvedBy: ObjectId("..."),
      approvedAt: new Date(),
      updatedAt: new Date()
    }
  }
)

// DELETE
db.ApprovalRequests.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/approval-requests → ApprovalRequests
- POST /api/approval-requests → ApprovalRequests, AuditLogs
- PUT /api/approval-requests/:id/approve → ApprovalRequests, AuditLogs
- PUT /api/approval-requests/:id/reject → ApprovalRequests, AuditLogs
- GET /api/incidents/:id/approval-requests → ApprovalRequests
- GET /api/steps/:id/approval-requests → ApprovalRequests

### Security Notes
- Implement approval request access control
- Validate approval authority
- Log all approval actions
- Implement approval notification system
- Use write concern 'majority' for approval writes

### Future Scalability Notes
- Add support for multi-approver workflows
- Implement approval delegation
- Add approval timeout handling
- Consider implementing approval templates
- Add support for approval comments

---

## COLLECTION 30: ExecutionQueue

### Purpose
Store command execution queue for async processing.

### Description
Stores commands queued for execution with priority, status tracking, and result storage. Supports asynchronous command execution with retry logic and timeout handling.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| incidentId | ObjectId | Yes | No | null | Must reference Incidents._id |
| stepId | ObjectId | Yes | No | null | Must reference IncidentSteps._id |
| command | String | No | Yes | - | Command to execute |
| parameters | Object | No | Yes | {} | Command parameters |
| priority | Integer | No | Yes | 5 | Priority (1-10, higher = more urgent) |
| status | String | No | Yes | "QUEUED" | Enum: QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED |
| machineId | ObjectId | Yes | No | null | Must reference MachineInfo._id |
| startedAt | DateTime | Yes | No | null | Execution start time |
| completedAt | DateTime | Yes | No | null | Execution completion time |
| output | String | Yes | No | null | Command output |
| error | String | Yes | No | null | Error message |
| retryCount | Integer | No | Yes | 0 | Number of retries |
| maxRetries | Integer | No | Yes | 3 | Maximum retries |
| timeout | Integer | Yes | No | null | Timeout in seconds |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- incidentId → Incidents._id
- stepId → IncidentSteps._id
- machineId → MachineInfo._id

### Relationships
- Many-to-One with Incidents
- Many-to-One with IncidentSteps
- Many-to-One with MachineInfo
- One-to-One with ExecutionLogs

### Indexes

#### Single Indexes
```javascript
// Incident ID index
db.ExecutionQueue.createIndex({ incidentId: 1 })

// Step ID index
db.ExecutionQueue.createIndex({ stepId: 1 })

// Status index
db.ExecutionQueue.createIndex({ status: 1 })

// Priority index
db.ExecutionQueue.createIndex({ priority: -1 })

// Machine ID index
db.ExecutionQueue.createIndex({ machineId: 1 })

// Created at index
db.ExecutionQueue.createIndex({ createdAt: 1 })

// Started at index
db.ExecutionQueue.createIndex({ startedAt: 1 })
```

#### Compound Indexes
```javascript
// Queue by status and priority
db.ExecutionQueue.createIndex({ 
  status: 1, 
  priority: -1,
  createdAt: 1 
})

// Queue by machine and status
db.ExecutionQueue.createIndex({ 
  machineId: 1, 
  status: 1 
})

// Queue by incident and status
db.ExecutionQueue.createIndex({ 
  incidentId: 1, 
  status: 1 
})
```

#### TTL Indexes
```javascript
// Auto-expire completed executions after 30 days
db.ExecutionQueue.createIndex({ 
  status: 1, 
  completedAt: 1 
}, { partialFilterExpression: { status: { $in: ["COMPLETED", "FAILED", "CANCELLED"] } }, expireAfterSeconds: 2592000 })
```

### Recommended Queries

```javascript
// Get queued commands
db.ExecutionQueue.find({ 
  status: "QUEUED" 
}).sort({ priority: -1, createdAt: 1 })

// Get running commands
db.ExecutionQueue.find({ 
  status: "RUNNING" 
})

// Get commands for incident
db.ExecutionQueue.find({ 
  incidentId: incidentId 
}).sort({ createdAt: -1 })

// Get commands for machine
db.ExecutionQueue.find({ 
  machineId: machineId,
  status: "QUEUED" 
}).sort({ priority: -1 })
```

### Aggregation Pipelines

```javascript
// Queue statistics by status
db.ExecutionQueue.aggregate([
  { $group: {
    _id: '$status',
    count: { $sum: 1 }
  }}
])

// Queue statistics by priority
db.ExecutionQueue.aggregate([
  { $group: {
    _id: '$priority',
    count: { $sum: 1 }
  }},
  { $sort: { _id: -1 } }
])

// Average execution time
db.ExecutionQueue.aggregate([
  { $match: { 
    status: "COMPLETED",
    startedAt: { $ne: null },
    completedAt: { $ne: null }
  }},
  { $group: {
    _id: null,
    avgExecutionTime: { 
      $avg: { $subtract: ['$completedAt', '$startedAt'] } 
    }
  }}
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Implement queue priority management
- Use read concern 'local' for queue reads
- Implement queue worker pool
- Use write concern 'majority' for queue writes

### MongoDB Validation Schema

```javascript
db.createCollection('ExecutionQueue', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['command', 'priority', 'status'],
      properties: {
        _id: { bsonType: 'objectId' },
        incidentId: { bsonType: ['objectId', 'null'] },
        stepId: { bsonType: ['objectId', 'null'] },
        command: {
          bsonType: 'string',
          minLength: 1
        },
        parameters: { bsonType: 'object' },
        priority: {
          bsonType: 'int',
          minimum: 1,
          maximum: 10
        },
        status: {
          bsonType: 'string',
          enum: ['QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED']
        },
        machineId: { bsonType: ['objectId', 'null'] },
        startedAt: { bsonType: ['date', 'null'] },
        completedAt: { bsonType: ['date', 'null'] },
        output: {
          bsonType: ['string', 'null']
        },
        error: {
          bsonType: ['string', 'null']
        },
        retryCount: {
          bsonType: 'int',
          minimum: 0
        },
        maxRetries: {
          bsonType: 'int',
          minimum: 0
        },
        timeout: {
          bsonType: ['int', 'null'],
          minimum: 1
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Queued command
{
  _id: ObjectId("507f1f77bcf86cd799439330"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  stepId: ObjectId("507f1f77bcf86cd799439211"),
  command: "systemctl restart postgresql",
  parameters: { service: "postgresql" },
  priority: 7,
  status: "QUEUED",
  machineId: null,
  startedAt: null,
  completedAt: null,
  output: null,
  error: null,
  retryCount: 0,
  maxRetries: 3,
  timeout: 30,
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}

// Sample 2: Running command
{
  _id: ObjectId("507f1f77bcf86cd799439331"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  stepId: ObjectId("507f1f77bcf86cd799439211"),
  command: "systemctl restart postgresql",
  parameters: { service: "postgresql" },
  priority: 7,
  status: "RUNNING",
  machineId: ObjectId("507f1f77bcf86cd799439350"),
  startedAt: ISODate("2024-01-15T10:45:00Z"),
  completedAt: null,
  output: null,
  error: null,
  retryCount: 0,
  maxRetries: 3,
  timeout: 30,
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:45:00Z")
}

// Sample 3: Completed command
{
  _id: ObjectId("507f1f77bcf86cd799439332"),
  incidentId: ObjectId("507f1f77bcf86cd799439201"),
  stepId: ObjectId("507f1f77bcf86cd799439212"),
  command: "ping -c 4 8.8.8.8",
  parameters: { count: 4, host: "8.8.8.8" },
  priority: 5,
  status: "COMPLETED",
  machineId: ObjectId("507f1f77bcf86cd799439350"),
  startedAt: ISODate("2024-01-14T14:10:00Z"),
  completedAt: ISODate("2024-01-14T14:10:05Z"),
  output: "4 packets transmitted, 4 received, 0% packet loss",
  error: null,
  retryCount: 0,
  maxRetries: 3,
  timeout: 30,
  createdAt: ISODate("2024-01-14T14:05:00Z"),
  updatedAt: ISODate("2024-01-14T14:10:05Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.ExecutionQueue.insertOne({
  incidentId: ObjectId("..."),
  stepId: ObjectId("..."),
  command: "command to execute",
  parameters: { key: "value" },
  priority: 5,
  status: "QUEUED",
  retryCount: 0,
  maxRetries: 3,
  timeout: 30,
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.ExecutionQueue.findOne({ _id: ObjectId("...") })

// UPDATE
db.ExecutionQueue.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: { 
      status: "RUNNING",
      machineId: ObjectId("..."),
      startedAt: new Date(),
      updatedAt: new Date()
    }
  }
)

// DELETE
db.ExecutionQueue.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/execution-queue → ExecutionQueue (internal)
- POST /api/execution-queue → ExecutionQueue, AuditLogs
- PUT /api/execution-queue/:id → ExecutionQueue, AuditLogs
- DELETE /api/execution-queue/:id → ExecutionQueue, AuditLogs
- GET /api/incidents/:id/execution-queue → ExecutionQueue

### Security Notes
- Implement queue access control
- Validate command execution permissions
- Log all queue operations
- Implement queue priority validation
- Use write concern 'majority' for queue writes

### Future Scalability Notes
- Add support for command dependencies
- Implement queue partitioning
- Add queue monitoring and alerting
- Consider implementing distributed queue
- Add support for command scheduling

---

## COLLECTION 31: CommandHistory

### Purpose
Store complete history of all executed commands.

### Description
Stores the complete execution history of all commands including the command itself, parameters, execution context, and results. Used for audit trail, debugging, and command replay capabilities.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| incidentId | ObjectId | Yes | No | null | Must reference Incidents._id |
| stepId | ObjectId | Yes | No | null | Must reference IncidentSteps._id |
| executionQueueId | ObjectId | Yes | No | null | Must reference ExecutionQueue._id |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| machineId | ObjectId | Yes | No | null | Must reference MachineInfo._id |
| command | String | No | Yes | - | Command executed |
| parameters | Object | No | Yes | {} | Command parameters |
| status | String | No | Yes | "PENDING" | Enum: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED |
| output | String | Yes | No | null | Command output |
| error | String | Yes | No | null | Error message |
| exitCode | Integer | Yes | No | null | Exit code |
| executionTime | Integer | Yes | No | null | Execution time (ms) |
| startedAt | DateTime | Yes | No | null | Start timestamp |
| completedAt | DateTime | Yes | No | null | Completion timestamp |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- incidentId → Incidents._id
- stepId → IncidentSteps._id
- executionQueueId → ExecutionQueue._id
- userId → Users._id
- machineId → MachineInfo._id

### Relationships
- Many-to-One with Incidents
- Many-to-One with IncidentSteps
- Many-to-One with ExecutionQueue
- Many-to-One with Users
- Many-to-One with MachineInfo

### Indexes

#### Single Indexes
```javascript
// Incident ID index
db.CommandHistory.createIndex({ incidentId: 1 })

// Step ID index
db.CommandHistory.createIndex({ stepId: 1 })

// Execution queue ID index
db.CommandHistory.createIndex({ executionQueueId: 1 })

// User ID index
db.CommandHistory.createIndex({ userId: 1 })

// Machine ID index
db.CommandHistory.createIndex({ machineId: 1 })

// Status index
db.CommandHistory.createIndex({ status: 1 })

// Created at index
db.CommandHistory.createIndex({ createdAt: -1 })
```

#### Compound Indexes
```javascript
// History by incident and date
db.CommandHistory.createIndex({ 
  incidentId: 1, 
  createdAt: -1 
})

// History by user and date
db.CommandHistory.createIndex({ 
  userId: 1, 
  createdAt: -1 
})

// History by machine and date
db.CommandHistory.createIndex({ 
  machineId: 1, 
  createdAt: -1 
})
```

#### TTL Indexes
```javascript
// Auto-expire command history after 1 year
db.CommandHistory.createIndex({ createdAt: 1 }, { expireAfterSeconds: 31536000 })
```

### Recommended Queries

```javascript
// Get command history for incident
db.CommandHistory.find({ 
  incidentId: incidentId 
}).sort({ createdAt: -1 })

// Get command history for user
db.CommandHistory.find({ 
  userId: userId 
}).sort({ createdAt: -1 })

// Get failed commands
db.CommandHistory.find({ 
  status: "FAILED" 
}).sort({ createdAt: -1 })

// Get command history for machine
db.CommandHistory.find({ 
  machineId: machineId 
}).sort({ createdAt: -1 })
```

### Aggregation Pipelines

```javascript
// Command statistics by status
db.CommandHistory.aggregate([
  { $group: {
    _id: '$status',
    count: { $sum: 1 }
  }}
])

// Average execution time
db.CommandHistory.aggregate([
  { $match: { 
    status: "COMPLETED",
    executionTime: { $ne: null }
  }},
  { $group: {
    _id: null,
    avgExecutionTime: { $avg: '$executionTime' }
  }}
])

// Command statistics by user
db.CommandHistory.aggregate([
  { $group: {
    _id: '$userId',
    commandCount: { $sum: 1 },
    successCount: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } }
  }}
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Implement command history archiving
- Use read concern 'local' for history reads
- Consider using capped collection for very old history
- Implement command replay functionality

### MongoDB Validation Schema

```javascript
db.createCollection('CommandHistory', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'command', 'status'],
      properties: {
        _id: { bsonType: 'objectId' },
        incidentId: { bsonType: ['objectId', 'null'] },
        stepId: { bsonType: ['objectId', 'null'] },
        executionQueueId: { bsonType: ['objectId', 'null'] },
        userId: { bsonType: 'objectId' },
        machineId: { bsonType: ['objectId', 'null'] },
        command: {
          bsonType: 'string',
          minLength: 1
        },
        parameters: { bsonType: 'object' },
        status: {
          bsonType: 'string',
          enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED']
        },
        output: {
          bsonType: ['string', 'null']
        },
        error: {
          bsonType: ['string', 'null']
        },
        exitCode: {
          bsonType: ['int', 'null']
        },
        executionTime: {
          bsonType: ['int', 'null'],
          minimum: 0
        },
        startedAt: { bsonType: ['date', 'null'] },
        completedAt: { bsonType: ['date', 'null'] },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Completed command
{
  _id: ObjectId("507f1f77bcf86cd799439340"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  stepId: ObjectId("507f1f77bcf86cd799439211"),
  executionQueueId: ObjectId("507f1f77bcf86cd799439330"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  machineId: ObjectId("507f1f77bcf86cd799439350"),
  command: "systemctl restart postgresql",
  parameters: { service: "postgresql" },
  status: "COMPLETED",
  output: "Restarted postgresql service successfully",
  error: null,
  exitCode: 0,
  executionTime: 2500,
  startedAt: ISODate("2024-01-15T10:45:00Z"),
  completedAt: ISODate("2024-01-15T10:45:02.5Z"),
  createdAt: ISODate("2024-01-15T10:30:00Z")
}

// Sample 2: Failed command
{
  _id: ObjectId("507f1f77bcf86cd799439341"),
  incidentId: ObjectId("507f1f77bcf86cd799439201"),
  stepId: ObjectId("507f1f77bcf86cd799439215"),
  executionQueueId: ObjectId("507f1f77bcf86cd799439331"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  machineId: ObjectId("507f1f77bcf86cd799439350"),
  command: "rm -rf /var/log/*",
  parameters: {},
  status: "FAILED",
  output: null,
  error: "Permission denied: cannot remove /var/log/syslog",
  exitCode: 1,
  executionTime: 100,
  startedAt: ISODate("2024-01-14T15:20:00Z"),
  completedAt: ISODate("2024-01-14T15:20:00.1Z"),
  createdAt: ISODate("2024-01-14T15:15:00Z")
}

// Sample 3: Running command
{
  _id: ObjectId("507f1f77bcf86cd799439342"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  stepId: ObjectId("507f1f77bcf86cd799439212"),
  executionQueueId: ObjectId("507f1f77bcf86cd799439332"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  machineId: ObjectId("507f1f77bcf86cd799439351"),
  command: "ping -c 10 8.8.8.8",
  parameters: { count: 10, host: "8.8.8.8" },
  status: "RUNNING",
  output: null,
  error: null,
  exitCode: null,
  executionTime: null,
  startedAt: ISODate("2024-01-15T11:00:00Z"),
  completedAt: null,
  createdAt: ISODate("2024-01-15T10:55:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.CommandHistory.insertOne({
  incidentId: ObjectId("..."),
  stepId: ObjectId("..."),
  executionQueueId: ObjectId("..."),
  userId: ObjectId("..."),
  machineId: ObjectId("..."),
  command: "command to execute",
  parameters: { key: "value" },
  status: "PENDING",
  createdAt: new Date()
})

// READ
db.CommandHistory.findOne({ _id: ObjectId("...") })

// UPDATE
db.CommandHistory.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: { 
      status: "COMPLETED",
      output: "command output",
      exitCode: 0,
      executionTime: 1000,
      completedAt: new Date()
    }
  }
)

// DELETE
db.CommandHistory.deleteMany({ createdAt: { $lt: new Date("2023-01-01") } })
```

### REST APIs using the collection

- GET /api/command-history → CommandHistory (admin only)
- GET /api/incidents/:id/command-history → CommandHistory
- GET /api/users/:id/command-history → CommandHistory
- GET /api/machines/:id/command-history → CommandHistory

### Security Notes
- Implement command history access control
- Validate command history ownership
- Log command history access
- Implement command history export for compliance
- Use write concern 'majority' for command history writes

### Future Scalability Notes
- Add support for command replay
- Implement command history analytics
- Add command pattern detection
- Consider implementing command performance monitoring
- Add support for command diffing

---

## COLLECTION 32: ExecutionLogs

### Purpose
Store detailed execution logs for debugging.

### Description
Stores detailed execution logs including stdout, stderr, and system logs for each command execution. Used for debugging, troubleshooting, and detailed audit trail.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| commandHistoryId | ObjectId | No | Yes | - | Must reference CommandHistory._id |
| logType | String | No | Yes | - | Log type (STDOUT, STDERR, SYSTEM) |
| content | String | No | Yes | - | Log content |
| timestamp | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- commandHistoryId → CommandHistory._id

### Relationships
- Many-to-One with CommandHistory

### Indexes

#### Single Indexes
```javascript
// Command history ID index
db.ExecutionLogs.createIndex({ commandHistoryId: 1 })

// Log type index
db.ExecutionLogs.createIndex({ logType: 1 })

// Timestamp index
db.ExecutionLogs.createIndex({ timestamp: 1 })
```

#### Compound Indexes
```javascript
// Logs by command history and timestamp
db.ExecutionLogs.createIndex({ 
  commandHistoryId: 1, 
  timestamp: 1 
})

// Logs by type and timestamp
db.ExecutionLogs.createIndex({ 
  logType: 1, 
  timestamp: 1 
})
```

#### TTL Indexes
```javascript
// Auto-expire execution logs after 90 days
db.ExecutionLogs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 })
```

### Recommended Queries

```javascript
// Get logs for command
db.ExecutionLogs.find({ 
  commandHistoryId: commandHistoryId 
}).sort({ timestamp: 1 })

// Get stdout logs
db.ExecutionLogs.find({ 
  commandHistoryId: commandHistoryId,
  logType: "STDOUT" 
}).sort({ timestamp: 1 })

// Get stderr logs
db.ExecutionLogs.find({ 
  commandHistoryId: commandHistoryId,
  logType: "STDERR" 
}).sort({ timestamp: 1 })
```

### Aggregation Pipelines

```javascript
// Log statistics by type
db.ExecutionLogs.aggregate([
  { $group: {
    _id: '$logType',
    count: { $sum: 1 }
  }}
])

// Log size statistics
db.ExecutionLogs.aggregate([
  { $group: {
    _id: '$commandHistoryId',
    totalSize: { $sum: { $strLenCP: '$content' } }
  }}
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Implement log compression for large logs
- Use read concern 'local' for log reads
- Consider using GridFS for very large logs
- Implement log streaming for real-time monitoring

### MongoDB Validation Schema

```javascript
db.createCollection('ExecutionLogs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['commandHistoryId', 'logType', 'content'],
      properties: {
        _id: { bsonType: 'objectId' },
        commandHistoryId: { bsonType: 'objectId' },
        logType: {
          bsonType: 'string',
          enum: ['STDOUT', 'STDERR', 'SYSTEM']
        },
        content: {
          bsonType: 'string'
        },
        timestamp: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Stdout log
{
  _id: ObjectId("507f1f77bcf86cd799439360"),
  commandHistoryId: ObjectId("507f1f77bcf86cd799439340"),
  logType: "STDOUT",
  content: "Restarting postgresql service...\nService restarted successfully.",
  timestamp: ISODate("2024-01-15T10:45:00.5Z")
}

// Sample 2: Stderr log
{
  _id: ObjectId("507f1f77bcf86cd799439361"),
  commandHistoryId: ObjectId("507f1f77bcf86cd799439341"),
  logType: "STDERR",
  content: "rm: cannot remove '/var/log/syslog': Permission denied",
  timestamp: ISODate("2024-01-14T15:20:00.05Z")
}

// Sample 3: System log
{
  _id: ObjectId("507f1f77bcf86cd799439362"),
  commandHistoryId: ObjectId("507f1f77bcf86cd799439340"),
  logType: "SYSTEM",
  content: "Command executed on machine prod-db-01 by user john.doe",
  timestamp: ISODate("2024-01-15T10:45:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.ExecutionLogs.insertOne({
  commandHistoryId: ObjectId("..."),
  logType: "STDOUT",
  content: "Log content",
  timestamp: new Date()
})

// READ
db.ExecutionLogs.findOne({ _id: ObjectId("...") })

// DELETE
db.ExecutionLogs.deleteMany({ timestamp: { $lt: new Date("2023-10-01") } })
```

### REST APIs using the collection

- GET /api/execution-logs/:commandHistoryId → ExecutionLogs
- GET /api/command-history/:id/logs → ExecutionLogs

### Security Notes
- Implement execution log access control
- Validate execution log ownership
- Log execution log access
- Implement log size limits
- Use write concern 'majority' for log writes

### Future Scalability Notes
- Add support for log streaming
- Implement log search and filtering
- Add log aggregation for analytics
- Consider implementing log analysis
- Add support for log export

---

## COLLECTION 33: MachineInfo

### Purpose
Store information about target machines for command execution.

### Description
Stores machine information including hostname, IP address, operating system, capabilities, and status. Used for command execution targeting and machine management.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| hostname | String | No | Yes | - | Machine hostname |
| ipAddress | String | No | Yes | - | IP address |
| osType | String | No | Yes | - | OS type (LINUX, WINDOWS, MACOS) |
| osVersion | String | Yes | No | null | OS version |
| capabilities | Array[String] | No | Yes | [] | Machine capabilities |
| status | String | No | Yes | "ONLINE" | Enum: ONLINE, OFFLINE, MAINTENANCE |
| lastSeen | DateTime | No | Yes | Current timestamp | Last heartbeat |
| metadata | Object | No | Yes | {} | Additional metadata |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- hostname
- ipAddress

### Foreign Reference Fields
None

### Relationships
- One-to-Many with ExecutionQueue
- One-to-Many with CommandHistory
- One-to-Many with ExecutionLogs

### Indexes

#### Single Indexes
```javascript
// Hostname index (unique)
db.MachineInfo.createIndex({ hostname: 1 }, { unique: true })

// IP address index (unique)
db.MachineInfo.createIndex({ ipAddress: 1 }, { unique: true })

// OS type index
db.MachineInfo.createIndex({ osType: 1 })

// Status index
db.MachineInfo.createIndex({ status: 1 })

// Last seen index
db.MachineInfo.createIndex({ lastSeen: -1 })
```

#### Compound Indexes
```javascript
// Machines by status and last seen
db.MachineInfo.createIndex({ 
  status: 1, 
  lastSeen: -1 
})

// Machines by OS type and status
db.MachineInfo.createIndex({ 
  osType: 1, 
  status: 1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get all online machines
db.MachineInfo.find({ 
  status: "ONLINE" 
})

// Get machine by hostname
db.MachineInfo.findOne({ 
  hostname: "prod-db-01" 
})

// Get machines by OS type
db.MachineInfo.find({ 
  osType: "LINUX" 
})

// Get offline machines
db.MachineInfo.find({ 
  status: "OFFLINE" 
})
```

### Aggregation Pipelines

```javascript
// Machine statistics by status
db.MachineInfo.aggregate([
  { $group: {
    _id: '$status',
    count: { $sum: 1 }
  }}
])

// Machine statistics by OS type
db.MachineInfo.aggregate([
  { $group: {
    _id: '$osType',
    count: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Cache machine info in memory for fast lookups
- Use covered queries for machine lookups
- Use read concern 'local' for machine reads
- Implement machine heartbeat monitoring
- Use write concern 'majority' for machine writes

### MongoDB Validation Schema

```javascript
db.createCollection('MachineInfo', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['hostname', 'ipAddress', 'osType', 'status'],
      properties: {
        _id: { bsonType: 'objectId' },
        hostname: {
          bsonType: 'string',
          minLength: 1
        },
        ipAddress: {
          bsonType: 'string',
          minLength: 1
        },
        osType: {
          bsonType: 'string',
          enum: ['LINUX', 'WINDOWS', 'MACOS']
        },
        osVersion: {
          bsonType: ['string', 'null']
        },
        capabilities: {
          bsonType: 'array',
          items: { bsonType: 'string' }
        },
        status: {
          bsonType: 'string',
          enum: ['ONLINE', 'OFFLINE', 'MAINTENANCE']
        },
        lastSeen: { bsonType: 'date' },
        metadata: { bsonType: 'object' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Linux production database
{
  _id: ObjectId("507f1f77bcf86cd799439350"),
  hostname: "prod-db-01",
  ipAddress: "10.0.1.100",
  osType: "LINUX",
  osVersion: "Ubuntu 22.04 LTS",
  capabilities: ["SSH", "SYSTEMCTL", "DOCKER", "KUBECTL"],
  status: "ONLINE",
  lastSeen: ISODate("2024-01-15T12:00:00Z"),
  metadata: { environment: "production", datacenter: "us-east-1" },
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-15T12:00:00Z")
}

// Sample 2: Windows application server
{
  _id: ObjectId("507f1f77bcf86cd799439351"),
  hostname: "app-win-01",
  ipAddress: "10.0.2.100",
  osType: "WINDOWS",
  osVersion: "Windows Server 2022",
  capabilities: ["RDP", "POWERSHELL", "IIS"],
  status: "ONLINE",
  lastSeen: ISODate("2024-01-15T11:55:00Z"),
  metadata: { environment: "production", datacenter: "us-east-1" },
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-15T11:55:00Z")
}

// Sample 3: Linux development server
{
  _id: ObjectId("507f1f77bcf86cd799439352"),
  hostname: "dev-linux-01",
  ipAddress: "10.0.3.100",
  osType: "LINUX",
  osVersion: "CentOS 8",
  capabilities: ["SSH", "SYSTEMCTL", "DOCKER"],
  status: "MAINTENANCE",
  lastSeen: ISODate("2024-01-14T18:00:00Z"),
  metadata: { environment: "development", datacenter: "us-west-2" },
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-14T18:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.MachineInfo.insertOne({
  hostname: "new-machine-01",
  ipAddress: "10.0.4.100",
  osType: "LINUX",
  osVersion: "Ubuntu 22.04 LTS",
  capabilities: ["SSH", "SYSTEMCTL"],
  status: "ONLINE",
  lastSeen: new Date(),
  metadata: { environment: "staging" },
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.MachineInfo.findOne({ _id: ObjectId("...") })

// UPDATE
db.MachineInfo.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: "OFFLINE", lastSeen: new Date(), updatedAt: new Date() } }
)

// DELETE
db.MachineInfo.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/machines → MachineInfo
- POST /api/machines → MachineInfo, AuditLogs
- PUT /api/machines/:id → MachineInfo, AuditLogs
- DELETE /api/machines/:id → MachineInfo, AuditLogs
- PUT /api/machines/:id/heartbeat → MachineInfo

### Security Notes
- Implement machine info access control
- Validate machine info modifications
- Log all machine info changes
- Implement machine authentication
- Use write concern 'majority' for machine writes

### Future Scalability Notes
- Add support for machine groups
- Implement machine capability matching
- Add machine health monitoring
- Consider implementing auto-discovery
- Add support for machine templates

---

## COLLECTION 34: ExecutionResults

### Purpose
Store structured results from command execution.

### Description
Stores structured execution results including parsed output, metrics, and analysis. Used for result aggregation, reporting, and AI agent decision making.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| commandHistoryId | ObjectId | No | Yes | - | Must reference CommandHistory._id |
| resultType | String | No | Yes | - | Result type |
| data | Object | No | Yes | {} | Result data |
| metrics | Object | No | Yes | {} | Execution metrics |
| analysis | Object | Yes | No | null | Analysis results |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- commandHistoryId → CommandHistory._id

### Relationships
- Many-to-One with CommandHistory

### Indexes

#### Single Indexes
```javascript
// Command history ID index
db.ExecutionResults.createIndex({ commandHistoryId: 1 })

// Result type index
db.ExecutionResults.createIndex({ resultType: 1 })

// Created at index
db.ExecutionResults.createIndex({ createdAt: -1 })
```

#### Compound Indexes
```javascript
// Results by command history and type
db.ExecutionResults.createIndex({ 
  commandHistoryId: 1, 
  resultType: 1 
})

// Results by type and date
db.ExecutionResults.createIndex({ 
  resultType: 1, 
  createdAt: -1 
})
```

#### TTL Indexes
```javascript
// Auto-expire execution results after 1 year
db.ExecutionResults.createIndex({ createdAt: 1 }, { expireAfterSeconds: 31536000 })
```

### Recommended Queries

```javascript
// Get results for command
db.ExecutionResults.find({ 
  commandHistoryId: commandHistoryId 
})

// Get results by type
db.ExecutionResults.find({ 
  resultType: "METRIC" 
}).sort({ createdAt: -1 })

// Get recent results
db.ExecutionResults.find({ 
  createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
}).sort({ createdAt: -1 })
```

### Aggregation Pipelines

```javascript
// Result statistics by type
db.ExecutionResults.aggregate([
  { $group: {
    _id: '$resultType',
    count: { $sum: 1 }
  }}
])

// Average metrics
db.ExecutionResults.aggregate([
  { $group: {
    _id: null,
    avgExecutionTime: { $avg: '$metrics.executionTime' },
    avgMemoryUsage: { $avg: '$metrics.memoryUsage' }
  }}
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Implement result caching
- Use read concern 'local' for result reads
- Consider using separate collections for different result types
- Implement result aggregation for analytics

### MongoDB Validation Schema

```javascript
db.createCollection('ExecutionResults', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['commandHistoryId', 'resultType', 'data', 'metrics'],
      properties: {
        _id: { bsonType: 'objectId' },
        commandHistoryId: { bsonType: 'objectId' },
        resultType: {
          bsonType: 'string',
          minLength: 1
        },
        data: { bsonType: 'object' },
        metrics: { bsonType: 'object' },
        analysis: {
          bsonType: ['object', 'null']
        },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Metric result
{
  _id: ObjectId("507f1f77bcf86cd799439370"),
  commandHistoryId: ObjectId("507f1f77bcf86cd799439340"),
  resultType: "METRIC",
  data: { serviceStatus: "running", uptime: "15 days" },
  metrics: { executionTime: 2500, memoryUsage: 1024 },
  analysis: { recommendation: "Service is healthy" },
  createdAt: ISODate("2024-01-15T10:45:03Z")
}

// Sample 2: Network result
{
  _id: ObjectId("507f1f77bcf86cd799439371"),
  commandHistoryId: ObjectId("507f1f77bcf86cd799439342"),
  resultType: "NETWORK",
  data: { packetsSent: 10, packetsReceived: 10, packetLoss: 0 },
  metrics: { executionTime: 5000, latency: 12 },
  analysis: { networkHealth: "excellent" },
  createdAt: ISODate("2024-01-15T11:00:10Z")
}

// Sample 3: Error result
{
  _id: ObjectId("507f1f77bcf86cd799439372"),
  commandHistoryId: ObjectId("507f1f77bcf86cd799439341"),
  resultType: "ERROR",
  data: { errorType: "PERMISSION_DENIED", resource: "/var/log/syslog" },
  metrics: { executionTime: 100 },
  analysis: { suggestion: "Use sudo or check file permissions" },
  createdAt: ISODate("2024-01-14T15:20:00.2Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.ExecutionResults.insertOne({
  commandHistoryId: ObjectId("..."),
  resultType: "METRIC",
  data: { key: "value" },
  metrics: { executionTime: 1000 },
  analysis: { recommendation: "Action needed" },
  createdAt: new Date()
})

// READ
db.ExecutionResults.findOne({ _id: ObjectId("...") })

// DELETE
db.ExecutionResults.deleteMany({ createdAt: { $lt: new Date("2023-01-01") } })
```

### REST APIs using the collection

- GET /api/execution-results → ExecutionResults (internal)
- GET /api/command-history/:id/results → ExecutionResults

### Security Notes
- Implement execution result access control
- Validate execution result ownership
- Log execution result access
- Implement result size limits
- Use write concern 'majority' for result writes

### Future Scalability Notes
- Add support for result aggregation
- Implement result trend analysis
- Add result anomaly detection
- Consider implementing result caching
- Add support for result export

---

## COLLECTION 35: Notifications

### Purpose
Store user notifications for alerts and updates.

### Description
Stores user notifications including incident alerts, system updates, and task reminders. Supports notification types, priorities, and read status tracking.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| type | String | No | Yes | - | Notification type |
| title | String | No | Yes | - | Notification title |
| message | String | No | Yes | - | Notification message |
| priority | String | No | Yes | "NORMAL" | Enum: LOW, NORMAL, HIGH, URGENT |
| entityType | String | Yes | No | null | Related entity type |
| entityId | ObjectId | Yes | No | null | Related entity ID |
| isRead | Boolean | No | Yes | false | Read status |
| readAt | DateTime | Yes | No | null | Read timestamp |
| expiresAt | DateTime | Yes | No | null | Expiration timestamp |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- userId → Users._id
- entityId → Various collections based on entityType

### Relationships
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// User ID index
db.Notifications.createIndex({ userId: 1 })

// Type index
db.Notifications.createIndex({ type: 1 })

// Priority index
db.Notifications.createIndex({ priority: 1 })

// Is read index
db.Notifications.createIndex({ isRead: 1 })

// Created at index
db.Notifications.createIndex({ createdAt: -1 })
```

#### Compound Indexes
```javascript
// Notifications by user and read status
db.Notifications.createIndex({ 
  userId: 1, 
  isRead: 1,
  createdAt: -1 
})

// Notifications by user and priority
db.Notifications.createIndex({ 
  userId: 1, 
  priority: -1,
  createdAt: -1 
})

// Unread notifications
db.Notifications.createIndex({ 
  userId: 1, 
  isRead: false,
  createdAt: -1 
})
```

#### TTL Indexes
```javascript
// Auto-expire notifications after 30 days
db.Notifications.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 })
```

### Recommended Queries

```javascript
// Get notifications for user
db.Notifications.find({ 
  userId: userId 
}).sort({ createdAt: -1 })

// Get unread notifications
db.Notifications.find({ 
  userId: userId,
  isRead: false 
}).sort({ createdAt: -1 })

// Get high priority notifications
db.Notifications.find({ 
  userId: userId,
  priority: { $in: ["HIGH", "URGENT"] }
}).sort({ createdAt: -1 })

// Get notifications by type
db.Notifications.find({ 
  userId: userId,
  type: "INCIDENT_ALERT" 
}).sort({ createdAt: -1 })
```

### Aggregation Pipelines

```javascript
// Notification statistics by type
db.Notifications.aggregate([
  { $group: {
    _id: '$type',
    count: { $sum: 1 }
  }}
])

// Unread notification count by user
db.Notifications.aggregate([
  { $match: { isRead: false } },
  { $group: {
    _id: '$userId',
    unreadCount: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Cache unread notification counts
- Use read concern 'local' for notification reads
- Implement notification batching
- Use write concern 'majority' for notification writes

### MongoDB Validation Schema

```javascript
db.createCollection('Notifications', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'type', 'title', 'message'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        type: {
          bsonType: 'string',
          minLength: 1
        },
        title: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 200
        },
        message: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 2000
        },
        priority: {
          bsonType: 'string',
          enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT']
        },
        entityType: {
          bsonType: ['string', 'null']
        },
        entityId: {
          bsonType: ['objectId', 'null']
        },
        isRead: { bsonType: 'bool' },
        readAt: {
          bsonType: ['date', 'null']
        },
        expiresAt: {
          bsonType: ['date', 'null']
        },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Incident alert
{
  _id: ObjectId("507f1f77bcf86cd799439380"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  type: "INCIDENT_ALERT",
  title: "New Critical Incident",
  message: "A new critical incident has been reported: Database outage",
  priority: "URGENT",
  entityType: "INCIDENT",
  entityId: ObjectId("507f1f77bcf86cd799439200"),
  isRead: false,
  readAt: null,
  expiresAt: null,
  createdAt: ISODate("2024-01-15T10:00:00Z")
}

// Sample 2: System update
{
  _id: ObjectId("507f1f77bcf86cd799439381"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  type: "SYSTEM_UPDATE",
  title: "System Maintenance Scheduled",
  message: "System maintenance is scheduled for January 20, 2024 at 02:00 UTC",
  priority: "NORMAL",
  entityType: null,
  entityId: null,
  isRead: true,
  readAt: ISODate("2024-01-15T11:00:00Z"),
  expiresAt: ISODate("2024-01-20T03:00:00Z"),
  createdAt: ISODate("2024-01-15T09:00:00Z")
}

// Sample 3: Approval request
{
  _id: ObjectId("507f1f77bcf86cd799439382"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  type: "APPROVAL_REQUEST",
  title: "Command Approval Required",
  message: "A command requires your approval: systemctl restart postgresql",
  priority: "HIGH",
  entityType: "APPROVAL_REQUEST",
  entityId: ObjectId("507f1f77bcf86cd799439320"),
  isRead: false,
  readAt: null,
  expiresAt: ISODate("2024-01-15T18:00:00Z"),
  createdAt: ISODate("2024-01-15T10:30:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.Notifications.insertOne({
  userId: ObjectId("..."),
  type: "INCIDENT_ALERT",
  title: "Notification title",
  message: "Notification message",
  priority: "NORMAL",
  entityType: "INCIDENT",
  entityId: ObjectId("..."),
  isRead: false,
  createdAt: new Date()
})

// READ
db.Notifications.findOne({ _id: ObjectId("...") })

// UPDATE
db.Notifications.updateOne(
  { _id: ObjectId("...") },
  { $set: { isRead: true, readAt: new Date() } }
)

// DELETE
db.Notifications.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/notifications → Notifications
- POST /api/notifications → Notifications
- PUT /api/notifications/:id/read → Notifications
- DELETE /api/notifications/:id → Notifications
- PUT /api/notifications/mark-all-read → Notifications

### Security Notes
- Implement notification access control
- Validate notification ownership
- Log notification access
- Implement notification rate limiting
- Use write concern 'majority' for notification writes

### Future Scalability Notes
- Add support for notification channels
- Implement notification templates
- Add notification scheduling
- Consider implementing real-time notifications
- Add support for notification actions

---

## COLLECTION 36: NotificationPreferences

### Purpose
Store user notification preferences.

### Description
Stores user preferences for notification delivery including email, SMS, push notifications, and in-app alerts. Supports per-channel and per-type preferences.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| channel | String | No | Yes | - | Notification channel |
| enabled | Boolean | No | Yes | true | Channel enabled flag |
| types | Array[String] | No | Yes | [] | Enabled notification types |
| quietHoursStart | String | Yes | No | null | Quiet hours start (HH:MM) |
| quietHoursEnd | String | Yes | No | null | Quiet hours end (HH:MM) |
| timezone | String | Yes | No | null | User timezone |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- userId + channel (compound)

### Foreign Reference Fields
- userId → Users._id

### Relationships
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// User ID index
db.NotificationPreferences.createIndex({ userId: 1 })

// Channel index
db.NotificationPreferences.createIndex({ channel: 1 })

// Enabled index
db.NotificationPreferences.createIndex({ enabled: 1 })
```

#### Compound Indexes
```javascript
// Unique preference per user per channel
db.NotificationPreferences.createIndex({ 
  userId: 1, 
  channel: 1 
}, { unique: true })

// Preferences by user and enabled status
db.NotificationPreferences.createIndex({ 
  userId: 1, 
  enabled: 1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get preferences for user
db.NotificationPreferences.find({ 
  userId: userId 
})

// Get enabled channels for user
db.NotificationPreferences.find({ 
  userId: userId,
  enabled: true 
})

// Get preferences by channel
db.NotificationPreferences.find({ 
  channel: "EMAIL" 
})
```

### Aggregation Pipelines

```javascript
// Channel statistics
db.NotificationPreferences.aggregate([
  { $group: {
    _id: '$channel',
    enabledCount: { $sum: { $cond: ['$enabled', 1, 0] } },
    totalCount: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Cache user preferences in memory
- Use covered queries for preference lookups
- Use read concern 'local' for preference reads
- Implement preference validation
- Use write concern 'majority' for preference writes

### MongoDB Validation Schema

```javascript
db.createCollection('NotificationPreferences', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'channel', 'enabled', 'types'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        channel: {
          bsonType: 'string',
          enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP']
        },
        enabled: { bsonType: 'bool' },
        types: {
          bsonType: 'array',
          items: { bsonType: 'string' }
        },
        quietHoursStart: {
          bsonType: ['string', 'null']
        },
        quietHoursEnd: {
          bsonType: ['string', 'null']
        },
        timezone: {
          bsonType: ['string', 'null']
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Email preferences
{
  _id: ObjectId("507f1f77bcf86cd799439390"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  channel: "EMAIL",
  enabled: true,
  types: ["INCIDENT_ALERT", "APPROVAL_REQUEST", "SYSTEM_UPDATE"],
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  timezone: "America/New_York",
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:00:00Z")
}

// Sample 2: Push notifications
{
  _id: ObjectId("507f1f77bcf86cd799439391"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  channel: "PUSH",
  enabled: true,
  types: ["INCIDENT_ALERT", "APPROVAL_REQUEST"],
  quietHoursStart: null,
  quietHoursEnd: null,
  timezone: "America/New_York",
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}

// Sample 3: SMS preferences
{
  _id: ObjectId("507f1f77bcf86cd799439392"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  channel: "SMS",
  enabled: false,
  types: [],
  quietHoursStart: null,
  quietHoursEnd: null,
  timezone: "America/Los_Angeles",
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.NotificationPreferences.insertOne({
  userId: ObjectId("..."),
  channel: "EMAIL",
  enabled: true,
  types: ["INCIDENT_ALERT"],
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  timezone: "America/New_York",
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.NotificationPreferences.findOne({ _id: ObjectId("...") })

// UPDATE
db.NotificationPreferences.updateOne(
  { _id: ObjectId("...") },
  { $set: { enabled: false, updatedAt: new Date() } }
)

// DELETE
db.NotificationPreferences.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/users/:id/notification-preferences → NotificationPreferences
- POST /api/users/:id/notification-preferences → NotificationPreferences
- PUT /api/users/:id/notification-preferences/:channel → NotificationPreferences
- DELETE /api/users/:id/notification-preferences/:channel → NotificationPreferences

### Security Notes
- Implement preference access control
- Validate preference ownership
- Log preference changes
- Implement preference validation
- Use write concern 'majority' for preference writes

### Future Scalability Notes
- Add support for notification rules
- Implement preference templates
- Add preference analytics
- Consider implementing smart notifications
- Add support for notification frequency limits

---

## COLLECTION 37: Tags

### Purpose
Store tag definitions for categorization.

### Description
Stores tag definitions including name, color, description, and usage statistics. Used for categorizing runbooks, incidents, and other entities.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| name | String | No | Yes | - | Tag name |
| color | String | No | Yes | "#000000" | Hex color code |
| description | String | Yes | No | null | Tag description |
| category | String | Yes | No | null | Tag category |
| usageCount | Integer | No | Yes | 0 | Usage count |
| createdBy | ObjectId | No | Yes | - | Must reference Users._id |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- name

### Foreign Reference Fields
- createdBy → Users._id

### Relationships
- Many-to-One with Users
- Many-to-Many with Runbooks (via RunbookTags)
- Many-to-Many with Incidents (via IncidentTags)

### Indexes

#### Single Indexes
```javascript
// Name index (unique)
db.Tags.createIndex({ name: 1 }, { unique: true })

// Category index
db.Tags.createIndex({ category: 1 })

// Usage count index
db.Tags.createIndex({ usageCount: -1 })

// Created by index
db.Tags.createIndex({ createdBy: 1 })
```

#### Compound Indexes
```javascript
// Tags by category and usage
db.Tags.createIndex({ 
  category: 1, 
  usageCount: -1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get all tags
db.Tags.find({}).sort({ usageCount: -1 })

// Get tag by name
db.Tags.findOne({ 
  name: "database" 
})

// Get tags by category
db.Tags.find({ 
  category: "TECHNOLOGY" 
})

// Get popular tags
db.Tags.find({ 
  usageCount: { $gte: 10 } 
}).sort({ usageCount: -1 })
```

### Aggregation Pipelines

```javascript
// Tag statistics by category
db.Tags.aggregate([
  { $group: {
    _id: '$category',
    count: { $sum: 1 },
    totalUsage: { $sum: '$usageCount' }
  }}
])
```

### Optimization Tips
- Cache popular tags in memory
- Use covered queries for tag lookups
- Use read concern 'local' for tag reads
- Implement tag suggestion algorithms
- Use write concern 'majority' for tag writes

### MongoDB Validation Schema

```javascript
db.createCollection('Tags', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'color', 'createdBy'],
      properties: {
        _id: { bsonType: 'objectId' },
        name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 50
        },
        color: {
          bsonType: 'string',
          pattern: '^#[0-9A-Fa-f]{6}$'
        },
        description: {
          bsonType: ['string', 'null'],
          maxLength: 500
        },
        category: {
          bsonType: ['string', 'null']
        },
        usageCount: {
          bsonType: 'int',
          minimum: 0
        },
        createdBy: { bsonType: 'objectId' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Database tag
{
  _id: ObjectId("507f1f77bcf86cd799439400"),
  name: "database",
  color: "#3B82F6",
  description: "Database related items",
  category: "TECHNOLOGY",
  usageCount: 45,
  createdBy: ObjectId("507f1f77bcf86cd799439010"),
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:00:00Z")
}

// Sample 2: Critical tag
{
  _id: ObjectId("507f1f77bcf86cd799439401"),
  name: "critical",
  color: "#EF4444",
  description: "Critical priority items",
  category: "PRIORITY",
  usageCount: 32,
  createdBy: ObjectId("507f1f77bcf86cd799439010"),
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:00:00Z")
}

// Sample 3: Network tag
{
  _id: ObjectId("507f1f77bcf86cd799439402"),
  name: "network",
  color: "#10B981",
  description: "Network related items",
  category: "TECHNOLOGY",
  usageCount: 28,
  createdBy: ObjectId("507f1f77bcf86cd799439011"),
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.Tags.insertOne({
  name: "security",
  color: "#F59E0B",
  description: "Security related items",
  category: "TECHNOLOGY",
  usageCount: 0,
  createdBy: ObjectId("..."),
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.Tags.findOne({ _id: ObjectId("...") })

// UPDATE
db.Tags.updateOne(
  { _id: ObjectId("...") },
  { $set: { usageCount: 10, updatedAt: new Date() } }
)

// DELETE
db.Tags.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/tags → Tags
- POST /api/tags → Tags, AuditLogs
- PUT /api/tags/:id → Tags, AuditLogs
- DELETE /api/tags/:id → Tags, AuditLogs

### Security Notes
- Implement tag access control
- Validate tag name uniqueness
- Log all tag modifications
- Implement tag usage tracking
- Use write concern 'majority' for tag writes

### Future Scalability Notes
- Add support for tag hierarchies
- Implement tag synonyms
- Add tag analytics
- Consider implementing tag auto-suggestion
- Add support for tag merging

---

## COLLECTION 38: RunbookTags

### Purpose
Store many-to-many relationship between runbooks and tags.

### Description
Junction collection that links runbooks to tags for categorization and filtering. Enables flexible tagging of runbooks for better organization and discovery.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| runbookId | ObjectId | No | Yes | - | Must reference Runbooks._id |
| tagId | ObjectId | No | Yes | - | Must reference Tags._id |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- runbookId + tagId (compound)

### Foreign Reference Fields
- runbookId → Runbooks._id
- tagId → Tags._id

### Relationships
- Many-to-One with Runbooks
- Many-to-One with Tags

### Indexes

#### Single Indexes
```javascript
// Runbook ID index
db.RunbookTags.createIndex({ runbookId: 1 })

// Tag ID index
db.RunbookTags.createIndex({ tagId: 1 })
```

#### Compound Indexes
```javascript
// Unique tag per runbook
db.RunbookTags.createIndex({ 
  runbookId: 1, 
  tagId: 1 
}, { unique: true })

// Tags by runbook
db.RunbookTags.createIndex({ 
  runbookId: 1, 
  createdAt: 1 
})

// Runbooks by tag
db.RunbookTags.createIndex({ 
  tagId: 1, 
  createdAt: 1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get tags for runbook
db.RunbookTags.find({ 
  runbookId: runbookId 
})

// Get runbooks by tag
db.RunbookTags.find({ 
  tagId: tagId 
})

// Check if runbook has tag
db.RunbookTags.findOne({ 
  runbookId: runbookId,
  tagId: tagId 
})
```

### Aggregation Pipelines

```javascript
// Get tags for runbook with details
db.RunbookTags.aggregate([
  { $match: { runbookId: runbookId } },
  { $lookup: {
    from: 'Tags',
    localField: 'tagId',
    foreignField: '_id',
    as: 'tag'
  }}
])

// Get runbooks by tag with details
db.RunbookTags.aggregate([
  { $match: { tagId: tagId } },
  { $lookup: {
    from: 'Runbooks',
    localField: 'runbookId',
    foreignField: '_id',
    as: 'runbook'
  }}
])
```

### Optimization Tips
- Use covered queries for tag lookups
- Cache tag associations for popular runbooks
- Use read concern 'local' for tag reads
- Implement tag suggestion based on associations
- Use write concern 'majority' for tag writes

### MongoDB Validation Schema

```javascript
db.createCollection('RunbookTags', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['runbookId', 'tagId'],
      properties: {
        _id: { bsonType: 'objectId' },
        runbookId: { bsonType: 'objectId' },
        tagId: { bsonType: 'objectId' },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Database tag on runbook
{
  _id: ObjectId("507f1f77bcf86cd799439410"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  tagId: ObjectId("507f1f77bcf86cd799439400"),
  createdAt: ISODate("2024-01-15T10:00:00Z")
}

// Sample 2: Critical tag on runbook
{
  _id: ObjectId("507f1f77bcf86cd799439411"),
  runbookId: ObjectId("507f1f77bcf86cd799439090"),
  tagId: ObjectId("507f1f77bcf86cd799439401"),
  createdAt: ISODate("2024-01-15T10:00:00Z")
}

// Sample 3: Network tag on runbook
{
  _id: ObjectId("507f1f77bcf86cd799439412"),
  runbookId: ObjectId("507f1f77bcf86cd799439092"),
  tagId: ObjectId("507f1f77bcf86cd799439402"),
  createdAt: ISODate("2024-01-15T11:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.RunbookTags.insertOne({
  runbookId: ObjectId("..."),
  tagId: ObjectId("..."),
  createdAt: new Date()
})

// READ
db.RunbookTags.findOne({ _id: ObjectId("...") })

// DELETE
db.RunbookTags.deleteOne({ runbookId: ObjectId("..."), tagId: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/runbooks/:id/tags → RunbookTags
- POST /api/runbooks/:id/tags → RunbookTags, AuditLogs
- DELETE /api/runbooks/:id/tags/:tagId → RunbookTags, AuditLogs

### Security Notes
- Implement tag association access control
- Validate runbook ownership before tagging
- Log all tag associations
- Use write concern 'majority' for tag writes

### Future Scalability Notes
- Add support for tag weights
- Implement tag auto-suggestion
- Add tag analytics for runbooks
- Consider implementing tag inheritance
- Add support for tag templates

---

## COLLECTION 39: IncidentTags

### Purpose
Store many-to-many relationship between incidents and tags.

### Description
Junction collection that links incidents to tags for categorization and filtering. Enables flexible tagging of incidents for better organization and discovery.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| incidentId | ObjectId | No | Yes | - | Must reference Incidents._id |
| tagId | ObjectId | No | Yes | - | Must reference Tags._id |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- incidentId + tagId (compound)

### Foreign Reference Fields
- incidentId → Incidents._id
- tagId → Tags._id

### Relationships
- Many-to-One with Incidents
- Many-to-One with Tags

### Indexes

#### Single Indexes
```javascript
// Incident ID index
db.IncidentTags.createIndex({ incidentId: 1 })

// Tag ID index
db.IncidentTags.createIndex({ tagId: 1 })
```

#### Compound Indexes
```javascript
// Unique tag per incident
db.IncidentTags.createIndex({ 
  incidentId: 1, 
  tagId: 1 
}, { unique: true })

// Tags by incident
db.IncidentTags.createIndex({ 
  incidentId: 1, 
  createdAt: 1 
})

// Incidents by tag
db.IncidentTags.createIndex({ 
  tagId: 1, 
  createdAt: 1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get tags for incident
db.IncidentTags.find({ 
  incidentId: incidentId 
})

// Get incidents by tag
db.IncidentTags.find({ 
  tagId: tagId 
})

// Check if incident has tag
db.IncidentTags.findOne({ 
  incidentId: incidentId,
  tagId: tagId 
})
```

### Aggregation Pipelines

```javascript
// Get tags for incident with details
db.IncidentTags.aggregate([
  { $match: { incidentId: incidentId } },
  { $lookup: {
    from: 'Tags',
    localField: 'tagId',
    foreignField: '_id',
    as: 'tag'
  }}
])

// Get incidents by tag with details
db.IncidentTags.aggregate([
  { $match: { tagId: tagId } },
  { $lookup: {
    from: 'Incidents',
    localField: 'incidentId',
    foreignField: '_id',
    as: 'incident'
  }}
])
```

### Optimization Tips
- Use covered queries for tag lookups
- Cache tag associations for active incidents
- Use read concern 'local' for tag reads
- Implement tag suggestion based on associations
- Use write concern 'majority' for tag writes

### MongoDB Validation Schema

```javascript
db.createCollection('IncidentTags', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['incidentId', 'tagId'],
      properties: {
        _id: { bsonType: 'objectId' },
        incidentId: { bsonType: 'objectId' },
        tagId: { bsonType: 'objectId' },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Database tag on incident
{
  _id: ObjectId("507f1f77bcf86cd799439420"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  tagId: ObjectId("507f1f77bcf86cd799439400"),
  createdAt: ISODate("2024-01-15T10:00:00Z")
}

// Sample 2: Critical tag on incident
{
  _id: ObjectId("507f1f77bcf86cd799439421"),
  incidentId: ObjectId("507f1f77bcf86cd799439200"),
  tagId: ObjectId("507f1f77bcf86cd799439401"),
  createdAt: ISODate("2024-01-15T10:00:00Z")
}

// Sample 3: Network tag on incident
{
  _id: ObjectId("507f1f77bcf86cd799439422"),
  incidentId: ObjectId("507f1f77bcf86cd799439201"),
  tagId: ObjectId("507f1f77bcf86cd799439402"),
  createdAt: ISODate("2024-01-14T14:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.IncidentTags.insertOne({
  incidentId: ObjectId("..."),
  tagId: ObjectId("..."),
  createdAt: new Date()
})

// READ
db.IncidentTags.findOne({ _id: ObjectId("...") })

// DELETE
db.IncidentTags.deleteOne({ incidentId: ObjectId("..."), tagId: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/incidents/:id/tags → IncidentTags
- POST /api/incidents/:id/tags → IncidentTags, AuditLogs
- DELETE /api/incidents/:id/tags/:tagId → IncidentTags, AuditLogs

### Security Notes
- Implement tag association access control
- Validate incident ownership before tagging
- Log all tag associations
- Use write concern 'majority' for tag writes

### Future Scalability Notes
- Add support for tag weights
- Implement tag auto-suggestion
- Add tag analytics for incidents
- Consider implementing tag inheritance
- Add support for tag templates

---

## COLLECTION 40: RolePermissions

### Purpose
Store many-to-many relationship between roles and permissions.

### Description
Junction collection that links roles to permissions for RBAC implementation. Enables flexible permission assignment to roles.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| roleId | ObjectId | No | Yes | - | Must reference Roles._id |
| permission | String | No | Yes | - | Permission string |
| createdAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- roleId + permission (compound)

### Foreign Reference Fields
- roleId → Roles._id

### Relationships
- Many-to-One with Roles

### Indexes

#### Single Indexes
```javascript
// Role ID index
db.RolePermissions.createIndex({ roleId: 1 })

// Permission index
db.RolePermissions.createIndex({ permission: 1 })
```

#### Compound Indexes
```javascript
// Unique permission per role
db.RolePermissions.createIndex({ 
  roleId: 1, 
  permission: 1 
}, { unique: true })

// Permissions by role
db.RolePermissions.createIndex({ 
  roleId: 1, 
  permission: 1 
})

// Roles by permission
db.RolePermissions.createIndex({ 
  permission: 1, 
  roleId: 1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get permissions for role
db.RolePermissions.find({ 
  roleId: roleId 
})

// Get roles by permission
db.RolePermissions.find({ 
  permission: "incident:create" 
})

// Check if role has permission
db.RolePermissions.findOne({ 
  roleId: roleId,
  permission: "incident:create" 
})
```

### Aggregation Pipelines

```javascript
// Permission statistics
db.RolePermissions.aggregate([
  { $group: {
    _id: '$permission',
    roleCount: { $sum: 1 }
  }},
  { $sort: { roleCount: -1 } }
])

// Role permission count
db.RolePermissions.aggregate([
  { $group: {
    _id: '$roleId',
    permissionCount: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Cache role permissions in memory
- Use covered queries for permission lookups
- Use read concern 'local' for permission reads
- Implement permission caching at application level
- Use write concern 'majority' for permission writes

### MongoDB Validation Schema

```javascript
db.createCollection('RolePermissions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['roleId', 'permission'],
      properties: {
        _id: { bsonType: 'objectId' },
        roleId: { bsonType: 'objectId' },
        permission: {
          bsonType: 'string',
          minLength: 1
        },
        createdAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Incident create permission
{
  _id: ObjectId("507f1f77bcf86cd799439430"),
  roleId: ObjectId("507f1f77bcf86cd799439001"),
  permission: "incident:create",
  createdAt: ISODate("2024-01-01T00:00:00Z")
}

// Sample 2: Runbook manage permission
{
  _id: ObjectId("507f1f77bcf86cd799439431"),
  roleId: ObjectId("507f1f77bcf86cd799439001"),
  permission: "runbook:manage",
  createdAt: ISODate("2024-01-01T00:00:00Z")
}

// Sample 3: Command execute permission
{
  _id: ObjectId("507f1f77bcf86cd799439432"),
  roleId: ObjectId("507f1f77bcf86cd799439002"),
  permission: "command:execute",
  createdAt: ISODate("2024-01-01T00:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.RolePermissions.insertOne({
  roleId: ObjectId("..."),
  permission: "incident:create",
  createdAt: new Date()
})

// READ
db.RolePermissions.findOne({ _id: ObjectId("...") })

// DELETE
db.RolePermissions.deleteOne({ roleId: ObjectId("..."), permission: "incident:create" })
```

### REST APIs using the collection

- GET /api/roles/:id/permissions → RolePermissions
- POST /api/roles/:id/permissions → RolePermissions, AuditLogs
- DELETE /api/roles/:id/permissions/:permission → RolePermissions, AuditLogs

### Security Notes
- Implement permission access control
- Validate role ownership before assigning permissions
- Log all permission changes
- Use write concern 'majority' for permission writes

### Future Scalability Notes
- Add support for permission conditions
- Implement permission inheritance
- Add permission analytics
- Consider implementing permission templates
- Add support for permission expiration

---

## COLLECTION 41: UserRoles

### Purpose
Store many-to-many relationship between users and roles.

### Description
Junction collection that links users to roles for RBAC implementation. Enables flexible role assignment to users.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| userId | ObjectId | No | Yes | - | Must reference Users._id |
| roleId | ObjectId | No | Yes | - | Must reference Roles._id |
| assignedBy | ObjectId | Yes | No | null | Must reference Users._id |
| assignedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- userId + roleId (compound)

### Foreign Reference Fields
- userId → Users._id
- roleId → Roles._id
- assignedBy → Users._id

### Relationships
- Many-to-One with Users
- Many-to-One with Roles

### Indexes

#### Single Indexes
```javascript
// User ID index
db.UserRoles.createIndex({ userId: 1 })

// Role ID index
db.UserRoles.createIndex({ roleId: 1 })

// Assigned by index
db.UserRoles.createIndex({ assignedBy: 1 })
```

#### Compound Indexes
```javascript
// Unique role per user
db.UserRoles.createIndex({ 
  userId: 1, 
  roleId: 1 
}, { unique: true })

// Roles by user
db.UserRoles.createIndex({ 
  userId: 1, 
  assignedAt: -1 
})

// Users by role
db.UserRoles.createIndex({ 
  roleId: 1, 
  assignedAt: -1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get roles for user
db.UserRoles.find({ 
  userId: userId 
}).sort({ assignedAt: -1 })

// Get users by role
db.UserRoles.find({ 
  roleId: roleId 
}).sort({ assignedAt: -1 })

// Check if user has role
db.UserRoles.findOne({ 
  userId: userId,
  roleId: roleId 
})
```

### Aggregation Pipelines

```javascript
// Get roles for user with details
db.UserRoles.aggregate([
  { $match: { userId: userId } },
  { $lookup: {
    from: 'Roles',
    localField: 'roleId',
    foreignField: '_id',
    as: 'role'
  }}
])

// Get users by role with details
db.UserRoles.aggregate([
  { $match: { roleId: roleId } },
  { $lookup: {
    from: 'Users',
    localField: 'userId',
    foreignField: '_id',
    as: 'user'
  }}
])

// Role assignment statistics
db.UserRoles.aggregate([
  { $group: {
    _id: '$roleId',
    userCount: { $sum: 1 }
  }},
  { $sort: { userCount: -1 } }
])
```

### Optimization Tips
- Cache user roles in memory
- Use covered queries for role lookups
- Use read concern 'local' for role reads
- Implement role caching at application level
- Use write concern 'majority' for role writes

### MongoDB Validation Schema

```javascript
db.createCollection('UserRoles', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'roleId'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'objectId' },
        roleId: { bsonType: 'objectId' },
        assignedBy: {
          bsonType: ['objectId', 'null']
        },
        assignedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Admin role assignment
{
  _id: ObjectId("507f1f77bcf86cd799439440"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  roleId: ObjectId("507f1f77bcf86cd799439003"),
  assignedBy: ObjectId("507f1f77bcf86cd799439010"),
  assignedAt: ISODate("2024-01-01T00:00:00Z")
}

// Sample 2: Operator role assignment
{
  _id: ObjectId("507f1f77bcf86cd799439441"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  roleId: ObjectId("507f1f77bcf86cd799439002"),
  assignedBy: ObjectId("507f1f77bcf86cd799439010"),
  assignedAt: ISODate("2024-01-15T09:00:00Z")
}

// Sample 3: Viewer role assignment
{
  _id: ObjectId("507f1f77bcf86cd799439442"),
  userId: ObjectId("507f1f77bcf86cd799439013"),
  roleId: ObjectId("507f1f77bcf86cd799439001"),
  assignedBy: ObjectId("507f1f77bcf86cd799439011"),
  assignedAt: ISODate("2024-01-15T10:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.UserRoles.insertOne({
  userId: ObjectId("..."),
  roleId: ObjectId("..."),
  assignedBy: ObjectId("..."),
  assignedAt: new Date()
})

// READ
db.UserRoles.findOne({ _id: ObjectId("...") })

// DELETE
db.UserRoles.deleteOne({ userId: ObjectId("..."), roleId: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/users/:id/roles → UserRoles
- POST /api/users/:id/roles → UserRoles, AuditLogs
- DELETE /api/users/:id/roles/:roleId → UserRoles, AuditLogs
- GET /api/roles/:id/users → UserRoles

### Security Notes
- Implement role assignment access control
- Validate role assignment authority
- Log all role assignments
- Use write concern 'majority' for role writes

### Future Scalability Notes
- Add support for role expiration
- Implement role assignment conditions
- Add role analytics
- Consider implementing role templates
- Add support for role delegation

---

## COLLECTION 42: SystemMetrics

### Purpose
Store system performance metrics for monitoring.

### Description
Stores system performance metrics including CPU, memory, disk, and network usage. Used for monitoring, alerting, and capacity planning.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| machineId | ObjectId | Yes | No | null | Must reference MachineInfo._id |
| metricType | String | No | Yes | - | Metric type (CPU, MEMORY, DISK, NETWORK) |
| metricName | String | No | Yes | - | Metric name |
| value | Double | No | Yes | - | Metric value |
| unit | String | Yes | No | null | Unit of measurement |
| tags | Object | No | Yes | {} | Additional tags |
| timestamp | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- machineId → MachineInfo._id

### Relationships
- Many-to-One with MachineInfo

### Indexes

#### Single Indexes
```javascript
// Machine ID index
db.SystemMetrics.createIndex({ machineId: 1 })

// Metric type index
db.SystemMetrics.createIndex({ metricType: 1 })

// Metric name index
db.SystemMetrics.createIndex({ metricName: 1 })

// Timestamp index
db.SystemMetrics.createIndex({ timestamp: -1 })
```

#### Compound Indexes
```javascript
// Metrics by machine and type
db.SystemMetrics.createIndex({ 
  machineId: 1, 
  metricType: 1, 
  timestamp: -1 
})

// Metrics by type and timestamp
db.SystemMetrics.createIndex({ 
  metricType: 1, 
  timestamp: -1 
})

// Metrics by name and timestamp
db.SystemMetrics.createIndex({ 
  metricName: 1, 
  timestamp: -1 
})
```

#### TTL Indexes
```javascript
// Auto-expire metrics after 90 days
db.SystemMetrics.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 })
```

### Recommended Queries

```javascript
// Get metrics for machine
db.SystemMetrics.find({ 
  machineId: machineId 
}).sort({ timestamp: -1 })

// Get metrics by type
db.SystemMetrics.find({ 
  metricType: "CPU",
  timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
}).sort({ timestamp: -1 })

// Get latest metrics
db.SystemMetrics.find({ 
  timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
}).sort({ timestamp: -1 })
```

### Aggregation Pipelines

```javascript
// Average metrics by type
db.SystemMetrics.aggregate([
  { $match: { 
    timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
  }},
  { $group: {
    _id: '$metricName',
    avgValue: { $avg: '$value' },
    maxValue: { $max: '$value' },
    minValue: { $min: '$value' }
  }}
])

// Metrics by machine
db.SystemMetrics.aggregate([
  { $group: {
    _id: '$machineId',
    avgCpu: { $avg: { $cond: [{ $eq: ['$metricType', 'CPU'] }, '$value', null] } },
    avgMemory: { $avg: { $cond: [{ $eq: ['$metricType', 'MEMORY'] }, '$value', null] } }
  }}
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Implement metric aggregation
- Use read concern 'local' for metric reads
- Consider using time-series collections for metrics
- Implement metric downsampling for long-term storage

### MongoDB Validation Schema

```javascript
db.createCollection('SystemMetrics', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['metricType', 'metricName', 'value', 'timestamp'],
      properties: {
        _id: { bsonType: 'objectId' },
        machineId: { bsonType: ['objectId', 'null'] },
        metricType: {
          bsonType: 'string',
          enum: ['CPU', 'MEMORY', 'DISK', 'NETWORK']
        },
        metricName: {
          bsonType: 'string',
          minLength: 1
        },
        value: {
          bsonType: 'double'
        },
        unit: {
          bsonType: ['string', 'null']
        },
        tags: { bsonType: 'object' },
        timestamp: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: CPU metric
{
  _id: ObjectId("507f1f77bcf86cd799439450"),
  machineId: ObjectId("507f1f77bcf86cd799439350"),
  metricType: "CPU",
  metricName: "cpu_usage_percent",
  value: 75.5,
  unit: "%",
  tags: { core: "all" },
  timestamp: ISODate("2024-01-15T12:00:00Z")
}

// Sample 2: Memory metric
{
  _id: ObjectId("507f1f77bcf86cd799439451"),
  machineId: ObjectId("507f1f77bcf86cd799439350"),
  metricType: "MEMORY",
  metricName: "memory_usage_bytes",
  value: 8589934592,
  unit: "bytes",
  tags: { type: "used" },
  timestamp: ISODate("2024-01-15T12:00:00Z")
}

// Sample 3: Network metric
{
  _id: ObjectId("507f1f77bcf86cd799439452"),
  machineId: ObjectId("507f1f77bcf86cd799439351"),
  metricType: "NETWORK",
  metricName: "network_throughput_mbps",
  value: 125.3,
  unit: "Mbps",
  tags: { interface: "eth0", direction: "in" },
  timestamp: ISODate("2024-01-15T12:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.SystemMetrics.insertOne({
  machineId: ObjectId("..."),
  metricType: "CPU",
  metricName: "cpu_usage_percent",
  value: 75.5,
  unit: "%",
  tags: { core: "all" },
  timestamp: new Date()
})

// READ
db.SystemMetrics.findOne({ _id: ObjectId("...") })

// DELETE
db.SystemMetrics.deleteMany({ timestamp: { $lt: new Date("2023-10-01") } })
```

### REST APIs using the collection

- GET /api/metrics → SystemMetrics (internal)
- GET /api/machines/:id/metrics → SystemMetrics
- POST /api/metrics → SystemMetrics (internal)

### Security Notes
- Implement metric access control
- Validate metric data format
- Log metric access
- Implement metric rate limiting
- Use write concern 'majority' for metric writes

### Future Scalability Notes
- Add support for metric alerts
- Implement metric anomaly detection
- Add metric forecasting
- Consider using time-series database
- Add support for metric dashboards

---

## COLLECTION 43: IntegrationConfig

### Purpose
Store external system integration configurations.

### Description
Stores configuration for external system integrations including API endpoints, authentication credentials, and connection settings. Used for integrating with external services like monitoring tools, ticketing systems, and notification services.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| name | String | No | Yes | - | Integration name |
| type | String | No | Yes | - | Integration type |
| config | Object | No | Yes | {} | Configuration data |
| enabled | Boolean | No | Yes | true | Enabled flag |
| lastSyncAt | DateTime | Yes | No | null | Last sync timestamp |
| syncStatus | String | Yes | No | null | Sync status |
| createdBy | ObjectId | No | Yes | - | Must reference Users._id |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- name

### Foreign Reference Fields
- createdBy → Users._id

### Relationships
- Many-to-One with Users

### Indexes

#### Single Indexes
```javascript
// Name index (unique)
db.IntegrationConfig.createIndex({ name: 1 }, { unique: true })

// Type index
db.IntegrationConfig.createIndex({ type: 1 })

// Enabled index
db.IntegrationConfig.createIndex({ enabled: 1 })

// Created by index
db.IntegrationConfig.createIndex({ createdBy: 1 })
```

#### Compound Indexes
```javascript
// Integrations by type and enabled status
db.IntegrationConfig.createIndex({ 
  type: 1, 
  enabled: 1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get all enabled integrations
db.IntegrationConfig.find({ 
  enabled: true 
})

// Get integration by name
db.IntegrationConfig.findOne({ 
  name: "slack" 
})

// Get integrations by type
db.IntegrationConfig.find({ 
  type: "NOTIFICATION" 
})
```

### Aggregation Pipelines

```javascript
// Integration statistics by type
db.IntegrationConfig.aggregate([
  { $group: {
    _id: '$type',
    enabledCount: { $sum: { $cond: ['$enabled', 1, 0] } },
    totalCount: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Cache integration configurations in memory
- Use covered queries for integration lookups
- Use read concern 'local' for integration reads
- Implement configuration validation
- Use write concern 'majority' for integration writes

### MongoDB Validation Schema

```javascript
db.createCollection('IntegrationConfig', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'type', 'config', 'createdBy'],
      properties: {
        _id: { bsonType: 'objectId' },
        name: {
          bsonType: 'string',
          minLength: 1
        },
        type: {
          bsonType: 'string',
          minLength: 1
        },
        config: { bsonType: 'object' },
        enabled: { bsonType: 'bool' },
        lastSyncAt: {
          bsonType: ['date', 'null']
        },
        syncStatus: {
          bsonType: ['string', 'null']
        },
        createdBy: { bsonType: 'objectId' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Slack integration
{
  _id: ObjectId("507f1f77bcf86cd799439460"),
  name: "slack",
  type: "NOTIFICATION",
  config: {
    webhookUrl: "https://hooks.slack.com/services/...",
    channel: "#incidents",
    username: "Runbook Bot"
  },
  enabled: true,
  lastSyncAt: ISODate("2024-01-15T12:00:00Z"),
  syncStatus: "SUCCESS",
  createdBy: ObjectId("507f1f77bcf86cd799439010"),
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-15T12:00:00Z")
}

// Sample 2: PagerDuty integration
{
  _id: ObjectId("507f1f77bcf86cd799439461"),
  name: "pagerduty",
  type: "ALERTING",
  config: {
    apiKey: "encrypted_api_key",
    serviceKey: "encrypted_service_key",
    escalationPolicy: "critical_incidents"
  },
  enabled: true,
  lastSyncAt: ISODate("2024-01-15T11:30:00Z"),
  syncStatus: "SUCCESS",
  createdBy: ObjectId("507f1f77bcf86cd799439010"),
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-15T11:30:00Z")
}

// Sample 3: Jira integration
{
  _id: ObjectId("507f1f77bcf86cd799439462"),
  name: "jira",
  type: "TICKETING",
  config: {
    apiUrl: "https://company.atlassian.net",
    username: "runbook-bot",
    apiToken: "encrypted_token",
    projectKey: "INC"
  },
  enabled: false,
  lastSyncAt: null,
  syncStatus: null,
  createdBy: ObjectId("507f1f77bcf86cd799439011"),
  createdAt: ISODate("2024-01-10T00:00:00Z"),
  updatedAt: ISODate("2024-01-10T00:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.IntegrationConfig.insertOne({
  name: "slack",
  type: "NOTIFICATION",
  config: { webhookUrl: "https://..." },
  enabled: true,
  createdBy: ObjectId("..."),
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.IntegrationConfig.findOne({ _id: ObjectId("...") })

// UPDATE
db.IntegrationConfig.updateOne(
  { _id: ObjectId("...") },
  { $set: { enabled: false, updatedAt: new Date() } }
)

// DELETE
db.IntegrationConfig.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/integrations → IntegrationConfig (admin only)
- POST /api/integrations → IntegrationConfig, AuditLogs
- PUT /api/integrations/:id → IntegrationConfig, AuditLogs
- DELETE /api/integrations/:id → IntegrationConfig, AuditLogs
- PUT /api/integrations/:id/sync → IntegrationConfig

### Security Notes
- Implement integration configuration access control
- Encrypt sensitive configuration data
- Log all configuration changes
- Implement configuration validation
- Use write concern 'majority' for configuration writes

### Future Scalability Notes
- Add support for integration templates
- Implement integration testing
- Add integration analytics
- Consider implementing integration marketplace
- Add support for integration versioning

---

## COLLECTION 44: IntegrationLogs

### Purpose
Store logs from external system integrations.

### Description
Stores logs from external system integrations including requests, responses, and errors. Used for debugging, monitoring, and audit trail of integration activities.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| integrationId | ObjectId | No | Yes | - | Must reference IntegrationConfig._id |
| operation | String | No | Yes | - | Operation performed |
| request | Object | No | Yes | {} | Request data |
| response | Object | Yes | No | null | Response data |
| status | String | No | Yes | "SUCCESS" | Enum: SUCCESS, FAILED, PENDING |
| error | String | Yes | No | null | Error message |
| duration | Integer | Yes | No | null | Duration in ms |
| timestamp | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- integrationId → IntegrationConfig._id

### Relationships
- Many-to-One with IntegrationConfig

### Indexes

#### Single Indexes
```javascript
// Integration ID index
db.IntegrationLogs.createIndex({ integrationId: 1 })

// Operation index
db.IntegrationLogs.createIndex({ operation: 1 })

// Status index
db.IntegrationLogs.createIndex({ status: 1 })

// Timestamp index
db.IntegrationLogs.createIndex({ timestamp: -1 })
```

#### Compound Indexes
```javascript
// Logs by integration and date
db.IntegrationLogs.createIndex({ 
  integrationId: 1, 
  timestamp: -1 
})

// Logs by status and date
db.IntegrationLogs.createIndex({ 
  status: 1, 
  timestamp: -1 
})

// Failed logs
db.IntegrationLogs.createIndex({ 
  status: "FAILED",
  timestamp: -1 
})
```

#### TTL Indexes
```javascript
// Auto-expire integration logs after 90 days
db.IntegrationLogs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 })
```

### Recommended Queries

```javascript
// Get logs for integration
db.IntegrationLogs.find({ 
  integrationId: integrationId 
}).sort({ timestamp: -1 })

// Get failed logs
db.IntegrationLogs.find({ 
  status: "FAILED" 
}).sort({ timestamp: -1 })

// Get recent logs
db.IntegrationLogs.find({ 
  timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
}).sort({ timestamp: -1 })
```

### Aggregation Pipelines

```javascript
// Log statistics by status
db.IntegrationLogs.aggregate([
  { $group: {
    _id: '$status',
    count: { $sum: 1 }
  }}
])

// Average duration by operation
db.IntegrationLogs.aggregate([
  { $match: { duration: { $ne: null } } },
  { $group: {
    _id: '$operation',
    avgDuration: { $avg: '$duration' },
    count: { $sum: 1 }
  }}
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Implement log aggregation
- Use read concern 'local' for log reads
- Consider using capped collection for high-volume logging
- Implement log sampling for analytics

### MongoDB Validation Schema

```javascript
db.createCollection('IntegrationLogs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['integrationId', 'operation', 'status'],
      properties: {
        _id: { bsonType: 'objectId' },
        integrationId: { bsonType: 'objectId' },
        operation: {
          bsonType: 'string',
          minLength: 1
        },
        request: { bsonType: 'object' },
        response: {
          bsonType: ['object', 'null']
        },
        status: {
          bsonType: 'string',
          enum: ['SUCCESS', 'FAILED', 'PENDING']
        },
        error: {
          bsonType: ['string', 'null']
        },
        duration: {
          bsonType: ['int', 'null'],
          minimum: 0
        },
        timestamp: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Successful Slack notification
{
  _id: ObjectId("507f1f77bcf86cd799439470"),
  integrationId: ObjectId("507f1f77bcf86cd799439460"),
  operation: "SEND_NOTIFICATION",
  request: { channel: "#incidents", message: "New critical incident" },
  response: { status: "ok", timestamp: "2024-01-15T12:00:00Z" },
  status: "SUCCESS",
  error: null,
  duration: 250,
  timestamp: ISODate("2024-01-15T12:00:00Z")
}

// Sample 2: Failed PagerDuty alert
{
  _id: ObjectId("507f1f77bcf86cd799439471"),
  integrationId: ObjectId("507f1f77bcf86cd799439461"),
  operation: "CREATE_INCIDENT",
  request: { title: "Database outage", severity: "critical" },
  response: null,
  status: "FAILED",
  error: "API rate limit exceeded",
  duration: 500,
  timestamp: ISODate("2024-01-15T11:30:00Z")
}

// Sample 3: Jira ticket creation
{
  _id: ObjectId("507f1f77bcf86cd799439472"),
  integrationId: ObjectId("507f1f77bcf86cd799439462"),
  operation: "CREATE_TICKET",
  request: { projectKey: "INC", summary: "Database outage", description: "..." },
  response: { ticketId: "INC-1234", url: "https://company.atlassian.net/browse/INC-1234" },
  status: "SUCCESS",
  error: null,
  duration: 1200,
  timestamp: ISODate("2024-01-14T15:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.IntegrationLogs.insertOne({
  integrationId: ObjectId("..."),
  operation: "SEND_NOTIFICATION",
  request: { channel: "#incidents", message: "Test" },
  response: { status: "ok" },
  status: "SUCCESS",
  duration: 100,
  timestamp: new Date()
})

// READ
db.IntegrationLogs.findOne({ _id: ObjectId("...") })

// DELETE
db.IntegrationLogs.deleteMany({ timestamp: { $lt: new Date("2023-10-01") } })
```

### REST APIs using the collection

- GET /api/integrations/:id/logs → IntegrationLogs (admin only)
- GET /api/integration-logs → IntegrationLogs (internal)

### Security Notes
- Implement integration log access control
- Validate log ownership
- Log integration log access
- Implement log size limits
- Use write concern 'majority' for log writes

### Future Scalability Notes
- Add support for log streaming
- Implement log search and filtering
- Add log aggregation for analytics
- Consider implementing log analysis
- Add support for log export

---

## COLLECTION 45: Webhooks

### Purpose
Store webhook configurations for external callbacks.

### Description
Stores webhook configurations including URLs, authentication, and event subscriptions. Used for sending notifications to external systems when specific events occur.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| name | String | No | Yes | - | Webhook name |
| url | String | No | Yes | - | Webhook URL |
| events | Array[String] | No | Yes | [] | Subscribed events |
| headers | Object | No | Yes | {} | HTTP headers |
| secret | String | Yes | No | null | Webhook secret for signature |
| enabled | Boolean | No | Yes | true | Enabled flag |
| lastTriggeredAt | DateTime | Yes | No | null | Last trigger timestamp |
| triggerCount | Integer | No | Yes | 0 | Trigger count |
| createdBy | ObjectId | No | Yes | - | Must reference Users._id |
| createdAt | DateTime | No | Yes | Current timestamp | - |
| updatedAt | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
- name

### Foreign Reference Fields
- createdBy → Users._id

### Relationships
- Many-to-One with Users
- One-to-Many with WebhookLogs

### Indexes

#### Single Indexes
```javascript
// Name index (unique)
db.Webhooks.createIndex({ name: 1 }, { unique: true })

// Enabled index
db.Webhooks.createIndex({ enabled: 1 })

// Created by index
db.Webhooks.createIndex({ createdBy: 1 })
```

#### Compound Indexes
```javascript
// Webhooks by event
db.Webhooks.createIndex({ 
  events: 1, 
  enabled: 1 
})
```

#### TTL Indexes
None

### Recommended Queries

```javascript
// Get all enabled webhooks
db.Webhooks.find({ 
  enabled: true 
})

// Get webhooks by event
db.Webhooks.find({ 
  events: "incident.created",
  enabled: true 
})

// Get webhook by name
db.Webhooks.findOne({ 
  name: "slack-alerts" 
})
```

### Aggregation Pipelines

```javascript
// Webhook statistics by event
db.Webhooks.aggregate([
  { $unwind: '$events' },
  { $group: {
    _id: '$events',
    webhookCount: { $sum: 1 }
  }}
])

// Trigger statistics
db.Webhooks.aggregate([
  { $group: {
    _id: null,
    totalTriggers: { $sum: '$triggerCount' },
    activeWebhooks: { $sum: { $cond: ['$enabled', 1, 0] } }
  }}
])
```

### Optimization Tips
- Cache webhook configurations in memory
- Use covered queries for webhook lookups
- Use read concern 'local' for webhook reads
- Implement webhook signature validation
- Use write concern 'majority' for webhook writes

### MongoDB Validation Schema

```javascript
db.createCollection('Webhooks', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'url', 'events', 'createdBy'],
      properties: {
        _id: { bsonType: 'objectId' },
        name: {
          bsonType: 'string',
          minLength: 1
        },
        url: {
          bsonType: 'string',
          minLength: 1
        },
        events: {
          bsonType: 'array',
          items: { bsonType: 'string' }
        },
        headers: { bsonType: 'object' },
        secret: {
          bsonType: ['string', 'null']
        },
        enabled: { bsonType: 'bool' },
        lastTriggeredAt: {
          bsonType: ['date', 'null']
        },
        triggerCount: {
          bsonType: 'int',
          minimum: 0
        },
        createdBy: { bsonType: 'objectId' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Slack webhook
{
  _id: ObjectId("507f1f77bcf86cd799439480"),
  name: "slack-incident-alerts",
  url: "https://hooks.slack.com/services/...",
  events: ["incident.created", "incident.resolved"],
  headers: { "Content-Type": "application/json" },
  secret: "webhook_secret_key",
  enabled: true,
  lastTriggeredAt: ISODate("2024-01-15T10:00:00Z"),
  triggerCount: 45,
  createdBy: ObjectId("507f1f77bcf86cd799439010"),
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-15T10:00:00Z")
}

// Sample 2: PagerDuty webhook
{
  _id: ObjectId("507f1f77bcf86cd799439481"),
  name: "pagerduty-critical",
  url: "https://events.pagerduty.com/v2/enqueue",
  events: ["incident.created"],
  headers: { "Content-Type": "application/json", "Accept": "application/json" },
  secret: "pagerduty_integration_key",
  enabled: true,
  lastTriggeredAt: ISODate("2024-01-14T15:30:00Z"),
  triggerCount: 12,
  createdBy: ObjectId("507f1f77bcf86cd799439010"),
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-14T15:30:00Z")
}

// Sample 3: Custom webhook
{
  _id: ObjectId("507f1f77bcf86cd799439482"),
  name: "custom-analytics",
  url: "https://analytics.company.com/webhook",
  events: ["incident.created", "incident.updated", "incident.resolved"],
  headers: { "Content-Type": "application/json", "X-API-Key": "encrypted_key" },
  secret: null,
  enabled: false,
  lastTriggeredAt: null,
  triggerCount: 0,
  createdBy: ObjectId("507f1f77bcf86cd799439011"),
  createdAt: ISODate("2024-01-10T00:00:00Z"),
  updatedAt: ISODate("2024-01-10T00:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.Webhooks.insertOne({
  name: "slack-alerts",
  url: "https://hooks.slack.com/services/...",
  events: ["incident.created"],
  headers: { "Content-Type": "application/json" },
  secret: "webhook_secret",
  enabled: true,
  createdBy: ObjectId("..."),
  createdAt: new Date(),
  updatedAt: new Date()
})

// READ
db.Webhooks.findOne({ _id: ObjectId("...") })

// UPDATE
db.Webhooks.updateOne(
  { _id: ObjectId("...") },
  { $set: { enabled: false, updatedAt: new Date() } }
)

// DELETE
db.Webhooks.deleteOne({ _id: ObjectId("...") })
```

### REST APIs using the collection

- GET /api/webhooks → Webhooks (admin only)
- POST /api/webhooks → Webhooks, AuditLogs
- PUT /api/webhooks/:id → Webhooks, AuditLogs
- DELETE /api/webhooks/:id → Webhooks, AuditLogs
- PUT /api/webhooks/:id/trigger → Webhooks, WebhookLogs

### Security Notes
- Implement webhook access control
- Encrypt webhook secrets
- Log all webhook triggers
- Implement webhook signature validation
- Use write concern 'majority' for webhook writes

### Future Scalability Notes
- Add support for webhook retry logic
- Implement webhook rate limiting
- Add webhook analytics
- Consider implementing webhook templates
- Add support for webhook chaining

---

## COLLECTION 46: WebhookLogs

### Purpose
Store logs from webhook executions.

### Description
Stores logs from webhook executions including requests, responses, and retry attempts. Used for debugging, monitoring, and audit trail of webhook activities.

### Fields

| Field Name | Data Type | Nullable | Required | Default Value | Validation Rules |
|-----------|-----------|----------|----------|---------------|-----------------|
| _id | ObjectId | No | Yes | Auto-generated | - |
| webhookId | ObjectId | No | Yes | - | Must reference Webhooks._id |
| eventType | String | No | Yes | - | Event type |
| payload | Object | No | Yes | {} | Event payload |
| requestHeaders | Object | No | Yes | {} | Request headers |
| responseStatus | Integer | Yes | No | null | HTTP status code |
| responseBody | String | Yes | No | null | Response body |
| error | String | Yes | No | null | Error message |
| retryCount | Integer | No | Yes | 0 | Retry count |
| duration | Integer | Yes | No | null | Duration in ms |
| timestamp | DateTime | No | Yes | Current timestamp | - |

### Unique Constraints
None

### Foreign Reference Fields
- webhookId → Webhooks._id

### Relationships
- Many-to-One with Webhooks

### Indexes

#### Single Indexes
```javascript
// Webhook ID index
db.WebhookLogs.createIndex({ webhookId: 1 })

// Event type index
db.WebhookLogs.createIndex({ eventType: 1 })

// Response status index
db.WebhookLogs.createIndex({ responseStatus: 1 })

// Timestamp index
db.WebhookLogs.createIndex({ timestamp: -1 })
```

#### Compound Indexes
```javascript
// Logs by webhook and date
db.WebhookLogs.createIndex({ 
  webhookId: 1, 
  timestamp: -1 
})

// Failed logs
db.WebhookLogs.createIndex({ 
  responseStatus: { $ne: 200 },
  timestamp: -1 
})
```

#### TTL Indexes
```javascript
// Auto-expire webhook logs after 90 days
db.WebhookLogs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 })
```

### Recommended Queries

```javascript
// Get logs for webhook
db.WebhookLogs.find({ 
  webhookId: webhookId 
}).sort({ timestamp: -1 })

// Get failed logs
db.WebhookLogs.find({ 
  responseStatus: { $ne: 200 } 
}).sort({ timestamp: -1 })

// Get logs by event type
db.WebhookLogs.find({ 
  eventType: "incident.created" 
}).sort({ timestamp: -1 })
```

### Aggregation Pipelines

```javascript
// Log statistics by status
db.WebhookLogs.aggregate([
  { $group: {
    _id: '$responseStatus',
    count: { $sum: 1 }
  }}
])

// Average duration by webhook
db.WebhookLogs.aggregate([
  { $match: { duration: { $ne: null } } },
  { $group: {
    _id: '$webhookId',
    avgDuration: { $avg: '$duration' },
    successRate: { 
      $avg: { $cond: [{ $eq: ['$responseStatus', 200] }, 1, 0] } 
    }
  }}
])
```

### Optimization Tips
- Use TTL index for automatic cleanup
- Implement log aggregation
- Use read concern 'local' for log reads
- Consider using capped collection for high-volume logging
- Implement log sampling for analytics

### MongoDB Validation Schema

```javascript
db.createCollection('WebhookLogs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['webhookId', 'eventType', 'payload'],
      properties: {
        _id: { bsonType: 'objectId' },
        webhookId: { bsonType: 'objectId' },
        eventType: {
          bsonType: 'string',
          minLength: 1
        },
        payload: { bsonType: 'object' },
        requestHeaders: { bsonType: 'object' },
        responseStatus: {
          bsonType: ['int', 'null']
        },
        responseBody: {
          bsonType: ['string', 'null']
        },
        error: {
          bsonType: ['string', 'null']
        },
        retryCount: {
          bsonType: 'int',
          minimum: 0
        },
        duration: {
          bsonType: ['int', 'null'],
          minimum: 0
        },
        timestamp: { bsonType: 'date' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### Complete Sample Documents

```javascript
// Sample 1: Successful webhook
{
  _id: ObjectId("507f1f77bcf86cd799439490"),
  webhookId: ObjectId("507f1f77bcf86cd799439480"),
  eventType: "incident.created",
  payload: { incidentId: "507f1f77bcf86cd799439200", title: "Database outage" },
  requestHeaders: { "Content-Type": "application/json" },
  responseStatus: 200,
  responseBody: "ok",
  error: null,
  retryCount: 0,
  duration: 250,
  timestamp: ISODate("2024-01-15T10:00:00Z")
}

// Sample 2: Failed webhook
{
  _id: ObjectId("507f1f77bcf86cd799439491"),
  webhookId: ObjectId("507f1f77bcf86cd799439481"),
  eventType: "incident.created",
  payload: { incidentId: "507f1f77bcf86cd799439201", title: "Network issue" },
  requestHeaders: { "Content-Type": "application/json" },
  responseStatus: 500,
  responseBody: "Internal Server Error",
  error: "Server returned 500",
  retryCount: 2,
  duration: 500,
  timestamp: ISODate("2024-01-14T15:30:00Z")
}

// Sample 3: Timeout webhook
{
  _id: ObjectId("507f1f77bcf86cd799439492"),
  webhookId: ObjectId("507f1f77bcf86cd799439482"),
  eventType: "incident.resolved",
  payload: { incidentId: "507f1f77bcf86cd799439200", title: "Database outage" },
  requestHeaders: { "Content-Type": "application/json" },
  responseStatus: null,
  responseBody: null,
  error: "Request timeout after 30s",
  retryCount: 1,
  duration: 30000,
  timestamp: ISODate("2024-01-15T14:00:00Z")
}
```

### CRUD Operations

```javascript
// CREATE
db.WebhookLogs.insertOne({
  webhookId: ObjectId("..."),
  eventType: "incident.created",
  payload: { incidentId: "..." },
  requestHeaders: { "Content-Type": "application/json" },
  responseStatus: 200,
  responseBody: "ok",
  retryCount: 0,
  duration: 100,
  timestamp: new Date()
})

// READ
db.WebhookLogs.findOne({ _id: ObjectId("...") })

// DELETE
db.WebhookLogs.deleteMany({ timestamp: { $lt: new Date("2023-10-01") } })
```

### REST APIs using the collection

- GET /api/webhooks/:id/logs → WebhookLogs (admin only)
- GET /api/webhook-logs → WebhookLogs (internal)

### Security Notes
- Implement webhook log access control
- Validate log ownership
- Log webhook log access
- Implement log size limits
- Use write concern 'majority' for log writes

### Future Scalability Notes
- Add support for log streaming
- Implement log search and filtering
- Add log aggregation for analytics
- Consider implementing log analysis
- Add support for log export

---

# Phase 4: Detailed Collection Design - COMPLETED

All 46 collections have been designed with complete specifications including:
- Purpose and description
- Field definitions with data types, constraints, and validation rules
- Unique constraints and foreign key references
- Relationship mappings
- Comprehensive indexing strategy (single, compound, text, TTL, unique)
- Recommended queries and aggregation pipelines
- Optimization tips
- MongoDB JSON schema validation
- Complete sample documents (3 per collection)
- CRUD operations
- REST API mappings
- Security notes
- Future scalability considerations

The detailed collection design is now complete and ready for the next phase.

---

# Phase 6: Complete Indexing Strategy

## Indexing Strategy Overview

This section provides a comprehensive summary of all indexes across the 46 collections in the Runbook Following Agent MongoDB database. The indexing strategy is designed to optimize query performance, support data integrity, and enable efficient data retrieval patterns.

### Index Categories

1. **Single Indexes**: Indexes on individual fields for simple lookups
2. **Compound Indexes**: Multi-field indexes for complex query patterns
3. **Unique Indexes**: Enforce data uniqueness constraints
4. **TTL Indexes**: Automatic document expiration based on timestamp
5. **Text Indexes**: Full-text search capabilities

---

## Collection Index Summary

### Security & Authentication Collections

#### Users Collection
**Single Indexes:**
- `email` (unique)
- `username` (unique)
- `status`
- `createdAt`

**Compound Indexes:**
- `status + createdAt`
- `status + lastLoginAt`

**TTL Indexes:**
- None

---

#### Roles Collection
**Single Indexes:**
- `name` (unique)
- `status`
- `createdAt`

**Compound Indexes:**
- `status + createdAt`

**TTL Indexes:**
- None

---

#### Sessions Collection
**Single Indexes:**
- `userId`
- `token`
- `expiresAt`
- `createdAt`

**Compound Indexes:**
- `userId + expiresAt`
- `userId + createdAt`

**TTL Indexes:**
- `expiresAt` (auto-expire sessions)

---

#### Tokens Collection
**Single Indexes:**
- `userId`
- `token`
- `type`
- `expiresAt`
- `createdAt`

**Compound Indexes:**
- `userId + type`
- `userId + expiresAt`

**TTL Indexes:**
- `expiresAt` (auto-expire tokens)

---

#### RefreshTokens Collection
**Single Indexes:**
- `userId`
- `token`
- `expiresAt`
- `createdAt`

**Compound Indexes:**
- `userId + expiresAt`
- `userId + createdAt`

**TTL Indexes:**
- `expiresAt` (auto-expire refresh tokens)

---

#### UserPreferences Collection
**Single Indexes:**
- `userId` (unique)

**Compound Indexes:**
- None

**TTL Indexes:**
- None

---

#### APIKeys Collection
**Single Indexes:**
- `userId`
- `key` (unique)
- `status`
- `expiresAt`
- `createdAt`

**Compound Indexes:**
- `userId + status`
- `status + expiresAt`

**TTL Indexes:**
- `expiresAt` (auto-expire API keys)

---

### System Configuration Collections

#### SystemSettings Collection
**Single Indexes:**
- `key` (unique)
- `category`
- `updatedAt`

**Compound Indexes:**
- `category + updatedAt`

**TTL Indexes:**
- None

---

### Runbook Management Collections

#### Runbooks Collection
**Single Indexes:**
- `name` (unique)
- `status`
- `category`
- `createdBy`
- `createdAt`
- `updatedAt`

**Compound Indexes:**
- `status + updatedAt`
- `category + status`
- `createdBy + createdAt`

**Text Indexes:**
- `name`, `description`, `category` (full-text search)

**TTL Indexes:**
- None

---

#### RunbookVersions Collection
**Single Indexes:**
- `runbookId`
- `versionNumber`
- `status`
- `createdAt`

**Compound Indexes:**
- `runbookId + versionNumber` (unique)
- `runbookId + createdAt`
- `status + createdAt`

**TTL Indexes:**
- None

---

#### RunbookChunks Collection
**Single Indexes:**
- `runbookId`
- `versionId`
- `chunkNumber`
- `createdAt`

**Compound Indexes:**
- `runbookId + versionId + chunkNumber` (unique)
- `versionId + chunkNumber`

**TTL Indexes:**
- None

---

#### EmbeddingMetadata Collection
**Single Indexes:**
- `runbookId`
- `versionId`
- `chunkId`
- `vectorStore`
- `createdAt`

**Compound Indexes:**
- `runbookId + versionId`
- `chunkId + vectorStore`

**TTL Indexes:**
- None

---

#### IncidentAttachments Collection
**Single Indexes:**
- `incidentId`
- `uploadedBy`
- `fileName`
- `fileType`
- `createdAt`

**Compound Indexes:**
- `incidentId + createdAt`
- `uploadedBy + createdAt`

**TTL Indexes:**
- None

---

### User Content Collections

#### Bookmarks Collection
**Single Indexes:**
- `userId`
- `runbookId`
- `createdAt`

**Compound Indexes:**
- `userId + runbookId` (unique)
- `userId + createdAt`

**TTL Indexes:**
- None

---

#### SavedIncidents Collection
**Single Indexes:**
- `userId`
- `incidentId`
- `createdAt`

**Compound Indexes:**
- `userId + incidentId` (unique)
- `userId + createdAt`

**TTL Indexes:**
- None

---

#### Favorites Collection
**Single Indexes:**
- `userId`
- `entityType`
- `entityId`
- `createdAt`

**Compound Indexes:**
- `userId + entityType + entityId` (unique)
- `userId + entityType + createdAt`

**TTL Indexes:**
- None

---

### Incident Management Collections

#### Incidents Collection
**Single Indexes:**
- `title`
- `status`
- `priority`
- `assignedTo`
- `createdBy`
- `createdAt`
- `updatedAt`

**Compound Indexes:**
- `status + priority + updatedAt`
- `assignedTo + status`
- `createdBy + createdAt`

**Text Indexes:**
- `title`, `description` (full-text search)

**TTL Indexes:**
- None

---

#### IncidentSteps Collection
**Single Indexes:**
- `incidentId`
- `stepNumber`
- `status`
- `executedBy`
- `createdAt`

**Compound Indexes:**
- `incidentId + stepNumber` (unique)
- `incidentId + status`
- `status + createdAt`

**TTL Indexes:**
- None

---

### AI Agent Collections

#### Chats Collection
**Single Indexes:**
- `incidentId`
- `userId`
- `role`
- `createdAt`

**Compound Indexes:**
- `incidentId + createdAt`
- `userId + createdAt`

**TTL Indexes:**
- `createdAt` (auto-expire after 1 year)

---

#### AIMemory Collection
**Single Indexes:**
- `userId`
- `memoryType`
- `createdAt`
- `expiresAt`

**Compound Indexes:**
- `userId + memoryType`
- `userId + createdAt`

**TTL Indexes:**
- `expiresAt` (auto-expire memory)

---

#### Feedback Collection
**Single Indexes:**
- `incidentId`
- `userId`
- `rating`
- `createdAt`

**Compound Indexes:**
- `incidentId + createdAt`
- `userId + createdAt`

**TTL Indexes:**
- None

---

#### SearchHistory Collection
**Single Indexes:**
- `userId`
- `searchType`
- `createdAt`

**Compound Indexes:**
- `userId + createdAt`
- `searchType + createdAt`

**TTL Indexes:**
- `createdAt` (auto-expire after 90 days)

---

### Audit & Logging Collections

#### AuditLogs Collection
**Single Indexes:**
- `userId`
- `action`
- `entityType`
- `createdAt`

**Compound Indexes:**
- `userId + createdAt`
- `action + createdAt`
- `entityType + createdAt`

**TTL Indexes:**
- `createdAt` (auto-expire after 1 year)

---

#### ActivityLogs Collection
**Single Indexes:**
- `userId`
- `activityType`
- `createdAt`

**Compound Indexes:**
- `userId + createdAt`
- `activityType + createdAt`

**TTL Indexes:**
- `createdAt` (auto-expire after 90 days)

---

#### LoginHistory Collection
**Single Indexes:**
- `userId`
- `loginMethod`
- `status`
- `loginAt`

**Compound Indexes:**
- `userId + loginAt`
- `status + loginAt`

**TTL Indexes:**
- `loginAt` (auto-expire after 1 year)

---

#### FailedLoginAttempts Collection
**Single Indexes:**
- `userId`
- `ipAddress`
- `attemptedAt`

**Compound Indexes:**
- `userId + attemptedAt`
- `ipAddress + attemptedAt`

**TTL Indexes:**
- `attemptedAt` (auto-expire after 30 days)

---

### Command Execution Security Collections

#### CommandWhitelist Collection
**Single Indexes:**
- `command` (unique)
- `category`
- `status`
- `createdAt`

**Compound Indexes:**
- `category + status`
- `status + createdAt`

**TTL Indexes:**
- None

---

#### BlockedCommands Collection
**Single Indexes:**
- `command` (unique)
- `category`
- `status`
- `createdAt`

**Compound Indexes:**
- `category + status`
- `status + createdAt`

**TTL Indexes:**
- None

---

#### ApprovalRequests Collection
**Single Indexes:**
- `requestedBy`
- `approvedBy`
- `status`
- `riskLevel`
- `createdAt`

**Compound Indexes:**
- `requestedBy + status`
- `approvedBy + status`
- `status + createdAt`
- `riskLevel + status`

**TTL Indexes:**
- `createdAt` (auto-expire pending requests after 7 days)

---

#### ExecutionQueue Collection
**Single Indexes:**
- `command`
- `status`
- `priority`
- `riskLevel`
- `createdAt`

**Compound Indexes:**
- `status + priority + createdAt`
- `riskLevel + status`
- `machineId + status`

**TTL Indexes:**
- `createdAt` (auto-expire completed items after 30 days)

---

#### CommandHistory Collection
**Single Indexes:**
- `incidentId`
- `stepId`
- `executionQueueId`
- `userId`
- `machineId`
- `status`
- `createdAt`

**Compound Indexes:**
- `incidentId + createdAt`
- `userId + createdAt`
- `machineId + createdAt`

**TTL Indexes:**
- `createdAt` (auto-expire after 1 year)

---

#### ExecutionLogs Collection
**Single Indexes:**
- `commandHistoryId`
- `logType`
- `timestamp`

**Compound Indexes:**
- `commandHistoryId + timestamp`
- `logType + timestamp`

**TTL Indexes:**
- `timestamp` (auto-expire after 90 days)

---

#### MachineInfo Collection
**Single Indexes:**
- `hostname` (unique)
- `ipAddress` (unique)
- `osType`
- `status`
- `lastSeen`

**Compound Indexes:**
- `status + lastSeen`
- `osType + status`

**TTL Indexes:**
- None

---

#### ExecutionResults Collection
**Single Indexes:**
- `commandHistoryId`
- `resultType`
- `createdAt`

**Compound Indexes:**
- `commandHistoryId + resultType`
- `resultType + createdAt`

**TTL Indexes:**
- `createdAt` (auto-expire after 1 year)

---

### Notification Collections

#### Notifications Collection
**Single Indexes:**
- `userId`
- `type`
- `priority`
- `isRead`
- `createdAt`

**Compound Indexes:**
- `userId + isRead + createdAt`
- `userId + priority + createdAt`
- `userId + isRead(false) + createdAt`

**TTL Indexes:**
- `createdAt` (auto-expire after 30 days)

---

#### NotificationPreferences Collection
**Single Indexes:**
- `userId`
- `channel`
- `enabled`

**Compound Indexes:**
- `userId + channel` (unique)
- `userId + enabled`

**TTL Indexes:**
- None

---

### Tagging Collections

#### Tags Collection
**Single Indexes:**
- `name` (unique)
- `category`
- `usageCount`
- `createdBy`

**Compound Indexes:**
- `category + usageCount`

**TTL Indexes:**
- None

---

#### RunbookTags Collection
**Single Indexes:**
- `runbookId`
- `tagId`

**Compound Indexes:**
- `runbookId + tagId` (unique)
- `runbookId + createdAt`
- `tagId + createdAt`

**TTL Indexes:**
- None

---

#### IncidentTags Collection
**Single Indexes:**
- `incidentId`
- `tagId`

**Compound Indexes:**
- `incidentId + tagId` (unique)
- `incidentId + createdAt`
- `tagId + createdAt`

**TTL Indexes:**
- None

---

### RBAC Collections

#### RolePermissions Collection
**Single Indexes:**
- `roleId`
- `permission`

**Compound Indexes:**
- `roleId + permission` (unique)
- `roleId + permission`
- `permission + roleId`

**TTL Indexes:**
- None

---

#### UserRoles Collection
**Single Indexes:**
- `userId`
- `roleId`
- `assignedBy`

**Compound Indexes:**
- `userId + roleId` (unique)
- `userId + assignedAt`
- `roleId + assignedAt`

**TTL Indexes:**
- None

---

### Monitoring Collections

#### SystemMetrics Collection
**Single Indexes:**
- `machineId`
- `metricType`
- `metricName`
- `timestamp`

**Compound Indexes:**
- `machineId + metricType + timestamp`
- `metricType + timestamp`
- `metricName + timestamp`

**TTL Indexes:**
- `timestamp` (auto-expire after 90 days)

---

### Integration Collections

#### IntegrationConfig Collection
**Single Indexes:**
- `name` (unique)
- `type`
- `enabled`
- `createdBy`

**Compound Indexes:**
- `type + enabled`

**TTL Indexes:**
- None

---

#### IntegrationLogs Collection
**Single Indexes:**
- `integrationId`
- `operation`
- `status`
- `timestamp`

**Compound Indexes:**
- `integrationId + timestamp`
- `status + timestamp`
- `status(FAILED) + timestamp`

**TTL Indexes:**
- `timestamp` (auto-expire after 90 days)

---

#### Webhooks Collection
**Single Indexes:**
- `name` (unique)
- `enabled`
- `createdBy`

**Compound Indexes:**
- `events + enabled`

**TTL Indexes:**
- None

---

#### WebhookLogs Collection
**Single Indexes:**
- `webhookId`
- `eventType`
- `responseStatus`
- `timestamp`

**Compound Indexes:**
- `webhookId + timestamp`
- `responseStatus(!200) + timestamp`

**TTL Indexes:**
- `timestamp` (auto-expire after 90 days)

---

## Index Performance Considerations

### Index Maintenance

1. **Index Build Strategy**: Build indexes in background for large collections
2. **Index Size Monitoring**: Monitor index size vs data size ratio
3. **Index Usage Analysis**: Use `$indexStats` to identify unused indexes
4. **Index Rebuilding**: Rebuild fragmented indexes periodically

### Index Selection Guidelines

1. **ESR Rule**: Equality, Sort, Range - order index fields accordingly
2. **Covered Queries**: Design indexes to support covered queries
3. **Selectivity**: Index highly selective fields first
4. **Cardinality**: Index fields with high cardinality

### Index Optimization Tips

1. **Partial Indexes**: Use partial indexes for filtered queries
2. **Sparse Indexes**: Use sparse indexes for fields with many nulls
3. **Wildcard Indexes**: Use wildcard indexes for dynamic schemas
4. **Collation**: Consider collation for internationalization

---

## TTL Index Summary

| Collection | TTL Field | Expiration | Purpose |
|------------|-----------|------------|---------|
| Sessions | expiresAt | Session duration | Auto-expire sessions |
| Tokens | expiresAt | Token lifetime | Auto-expire tokens |
| RefreshTokens | expiresAt | Refresh token lifetime | Auto-expire refresh tokens |
| APIKeys | expiresAt | API key lifetime | Auto-expire API keys |
| Chats | createdAt | 1 year | Auto-expire chat history |
| AIMemory | expiresAt | Memory lifetime | Auto-expire AI memory |
| SearchHistory | createdAt | 90 days | Auto-expire search history |
| AuditLogs | createdAt | 1 year | Auto-expire audit logs |
| ActivityLogs | createdAt | 90 days | Auto-expire activity logs |
| LoginHistory | loginAt | 1 year | Auto-expire login history |
| FailedLoginAttempts | attemptedAt | 30 days | Auto-expire failed attempts |
| ApprovalRequests | createdAt | 7 days (pending) | Auto-expire pending requests |
| ExecutionQueue | createdAt | 30 days (completed) | Auto-expire queue items |
| CommandHistory | createdAt | 1 year | Auto-expire command history |
| ExecutionLogs | timestamp | 90 days | Auto-expire execution logs |
| ExecutionResults | createdAt | 1 year | Auto-expire results |
| Notifications | createdAt | 30 days | Auto-expire notifications |
| SystemMetrics | timestamp | 90 days | Auto-expire metrics |
| IntegrationLogs | timestamp | 90 days | Auto-expire integration logs |
| WebhookLogs | timestamp | 90 days | Auto-expire webhook logs |

---

## Unique Index Summary

| Collection | Unique Fields | Purpose |
|------------|---------------|---------|
| Users | email, username | Prevent duplicate users |
| Roles | name | Prevent duplicate roles |
| Runbooks | name | Prevent duplicate runbooks |
| RunbookVersions | runbookId + versionNumber | Prevent duplicate versions |
| RunbookChunks | runbookId + versionId + chunkNumber | Prevent duplicate chunks |
| SystemSettings | key | Prevent duplicate settings |
| MachineInfo | hostname, ipAddress | Prevent duplicate machines |
| Tags | name | Prevent duplicate tags |
| IntegrationConfig | name | Prevent duplicate integrations |
| Webhooks | name | Prevent duplicate webhooks |
| Bookmarks | userId + runbookId | Prevent duplicate bookmarks |
| SavedIncidents | userId + incidentId | Prevent duplicate saves |
| Favorites | userId + entityType + entityId | Prevent duplicate favorites |
| IncidentSteps | incidentId + stepNumber | Prevent duplicate steps |
| RunbookTags | runbookId + tagId | Prevent duplicate tag associations |
| IncidentTags | incidentId + tagId | Prevent duplicate tag associations |
| RolePermissions | roleId + permission | Prevent duplicate permissions |
| UserRoles | userId + roleId | Prevent duplicate role assignments |
| NotificationPreferences | userId + channel | Prevent duplicate preferences |

---

## Text Index Summary

| Collection | Text Fields | Purpose |
|------------|-------------|---------|
| Runbooks | name, description, category | Full-text search for runbooks |
| Incidents | title, description | Full-text search for incidents |

---

# Phase 6: Complete Indexing Strategy - COMPLETED

All indexing strategies have been documented for the 46 collections, including:
- Single indexes for field-based lookups
- Compound indexes for complex query patterns
- Unique indexes for data integrity
- TTL indexes for automatic data expiration
- Text indexes for full-text search capabilities
- Performance considerations and optimization guidelines
- Index maintenance and monitoring recommendations

The indexing strategy is designed to support the application's query patterns while maintaining optimal performance and data integrity.

---

# Phase 7: Relationships and Foreign Key References

## Relationship Overview

This section documents all relationships and foreign key references across the 46 collections in the Runbook Following Agent MongoDB database. Relationships are categorized by type (One-to-One, One-to-Many, Many-to-Many) and include cascade behavior and referential integrity considerations.

### Relationship Types

1. **One-to-One (1:1)**: Single document relationship
2. **One-to-Many (1:N)**: Parent-child relationship
3. **Many-to-Many (N:M)**: Junction collection relationship

---

## Security & Authentication Relationships

### Users Collection

**One-to-Many Relationships:**
- Users → Sessions (1:N)
  - Foreign Key: `Sessions.userId` → `Users._id`
  - Cascade: Delete user → Delete sessions
  - Description: A user can have multiple sessions

- Users → Tokens (1:N)
  - Foreign Key: `Tokens.userId` → `Users._id`
  - Cascade: Delete user → Delete tokens
  - Description: A user can have multiple access tokens

- Users → RefreshTokens (1:N)
  - Foreign Key: `RefreshTokens.userId` → `Users._id`
  - Cascade: Delete user → Delete refresh tokens
  - Description: A user can have multiple refresh tokens

- Users → UserPreferences (1:1)
  - Foreign Key: `UserPreferences.userId` → `Users._id`
  - Cascade: Delete user → Delete preferences
  - Description: A user has one preference document

- Users → APIKeys (1:N)
  - Foreign Key: `APIKeys.userId` → `Users._id`
  - Cascade: Delete user → Delete API keys
  - Description: A user can have multiple API keys

- Users → Bookmarks (1:N)
  - Foreign Key: `Bookmarks.userId` → `Users._id`
  - Cascade: Delete user → Delete bookmarks
  - Description: A user can bookmark multiple runbooks

- Users → SavedIncidents (1:N)
  - Foreign Key: `SavedIncidents.userId` → `Users._id`
  - Cascade: Delete user → Delete saved incidents
  - Description: A user can save multiple incidents

- Users → Favorites (1:N)
  - Foreign Key: `Favorites.userId` → `Users._id`
  - Cascade: Delete user → Delete favorites
  - Description: A user can favorite multiple entities

- Users → Incidents (1:N)
  - Foreign Key: `Incidents.createdBy` → `Users._id`
  - Cascade: Restrict (preserve audit trail)
  - Description: A user can create multiple incidents

- Users → Incidents (1:N)
  - Foreign Key: `Incidents.assignedTo` → `Users._id`
  - Cascade: Set null
  - Description: A user can be assigned multiple incidents

- Users → IncidentSteps (1:N)
  - Foreign Key: `IncidentSteps.executedBy` → `Users._id`
  - Cascade: Set null
  - Description: A user can execute multiple steps

- Users → Chats (1:N)
  - Foreign Key: `Chats.userId` → `Users._id`
  - Cascade: Delete user → Delete chats
  - Description: A user can have multiple chat messages

- Users → AIMemory (1:N)
  - Foreign Key: `AIMemory.userId` → `Users._id`
  - Cascade: Delete user → Delete AI memory
  - Description: A user can have multiple AI memory entries

- Users → Feedback (1:N)
  - Foreign Key: `Feedback.userId` → `Users._id`
  - Cascade: Keep (preserve feedback)
  - Description: A user can provide multiple feedback entries

- Users → SearchHistory (1:N)
  - Foreign Key: `SearchHistory.userId` → `Users._id`
  - Cascade: Delete user → Delete search history
  - Description: A user can have multiple search history entries

- Users → AuditLogs (1:N)
  - Foreign Key: `AuditLogs.userId` → `Users._id`
  - Cascade: Keep (preserve audit trail)
  - Description: A user can generate multiple audit logs

- Users → ActivityLogs (1:N)
  - Foreign Key: `ActivityLogs.userId` → `Users._id`
  - Cascade: Keep (preserve activity trail)
  - Description: A user can generate multiple activity logs

- Users → LoginHistory (1:N)
  - Foreign Key: `LoginHistory.userId` → `Users._id`
  - Cascade: Keep (preserve login history)
  - Description: A user can have multiple login history entries

- Users → FailedLoginAttempts (1:N)
  - Foreign Key: `FailedLoginAttempts.userId` → `Users._id`
  - Cascade: Delete user → Delete failed attempts
  - Description: A user can have multiple failed login attempts

- Users → ApprovalRequests (1:N)
  - Foreign Key: `ApprovalRequests.requestedBy` → `Users._id`
  - Cascade: Keep (preserve approval history)
  - Description: A user can request multiple approvals

- Users → ApprovalRequests (1:N)
  - Foreign Key: `ApprovalRequests.approvedBy` → `Users._id`
  - Cascade: Set null
  - Description: A user can approve multiple requests

- Users → CommandHistory (1:N)
  - Foreign Key: `CommandHistory.userId` → `Users._id`
  - Cascade: Keep (preserve command history)
  - Description: A user can execute multiple commands

- Users → Notifications (1:N)
  - Foreign Key: `Notifications.userId` → `Users._id`
  - Cascade: Delete user → Delete notifications
  - Description: A user can receive multiple notifications

- Users → NotificationPreferences (1:N)
  - Foreign Key: `NotificationPreferences.userId` → `Users._id`
  - Cascade: Delete user → Delete notification preferences
  - Description: A user can have multiple notification preferences

- Users → Tags (1:N)
  - Foreign Key: `Tags.createdBy` → `Users._id`
  - Cascade: Keep (preserve tag ownership)
  - Description: A user can create multiple tags

- Users → IntegrationConfig (1:N)
  - Foreign Key: `IntegrationConfig.createdBy` → `Users._id`
  - Cascade: Keep (preserve integration ownership)
  - Description: A user can create multiple integrations

- Users → Webhooks (1:N)
  - Foreign Key: `Webhooks.createdBy` → `Users._id`
  - Cascade: Keep (preserve webhook ownership)
  - Description: A user can create multiple webhooks

- Users → UserRoles (1:N)
  - Foreign Key: `UserRoles.userId` → `Users._id`
  - Cascade: Delete user → Delete user roles
  - Description: A user can have multiple roles

- Users → UserRoles (1:N)
  - Foreign Key: `UserRoles.assignedBy` → `Users._id`
  - Cascade: Set null
  - Description: A user can assign roles to others

---

### Roles Collection

**Many-to-Many Relationships:**
- Roles ↔ Users (N:M via UserRoles)
  - Junction: UserRoles
  - Foreign Keys: `UserRoles.userId` → `Users._id`, `UserRoles.roleId` → `Roles._id`
  - Cascade: Delete role → Delete role assignments
  - Description: A role can be assigned to multiple users, a user can have multiple roles

**One-to-Many Relationships:**
- Roles → RolePermissions (1:N)
  - Foreign Key: `RolePermissions.roleId` → `Roles._id`
  - Cascade: Delete role → Delete permissions
  - Description: A role can have multiple permissions

---

### Sessions Collection

**Many-to-One Relationships:**
- Sessions → Users (N:1)
  - Foreign Key: `Sessions.userId` → `Users._id`
  - Cascade: Delete user → Delete sessions
  - Description: Multiple sessions belong to one user

---

### Tokens Collection

**Many-to-One Relationships:**
- Tokens → Users (N:1)
  - Foreign Key: `Tokens.userId` → `Users._id`
  - Cascade: Delete user → Delete tokens
  - Description: Multiple tokens belong to one user

---

### RefreshTokens Collection

**Many-to-One Relationships:**
- RefreshTokens → Users (N:1)
  - Foreign Key: `RefreshTokens.userId` → `Users._id`
  - Cascade: Delete user → Delete refresh tokens
  - Description: Multiple refresh tokens belong to one user

---

### UserPreferences Collection

**Many-to-One Relationships:**
- UserPreferences → Users (N:1)
  - Foreign Key: `UserPreferences.userId` → `Users._id`
  - Cascade: Delete user → Delete preferences
  - Description: One preference document belongs to one user

---

### APIKeys Collection

**Many-to-One Relationships:**
- APIKeys → Users (N:1)
  - Foreign Key: `APIKeys.userId` → `Users._id`
  - Cascade: Delete user → Delete API keys
  - Description: Multiple API keys belong to one user

---

## System Configuration Relationships

### SystemSettings Collection

**No Relationships**
- Standalone collection with no foreign key references

---

## Runbook Management Relationships

### Runbooks Collection

**One-to-Many Relationships:**
- Runbooks → RunbookVersions (1:N)
  - Foreign Key: `RunbookVersions.runbookId` → `Runbooks._id`
  - Cascade: Delete runbook → Delete versions
  - Description: A runbook can have multiple versions

- Runbooks → IncidentAttachments (1:N)
  - Foreign Key: `IncidentAttachments.runbookId` → `Runbooks._id`
  - Cascade: Keep (preserve attachments)
  - Description: A runbook can have multiple attachments

- Runbooks → Bookmarks (1:N)
  - Foreign Key: `Bookmarks.runbookId` → `Runbooks._id`
  - Cascade: Delete runbook → Delete bookmarks
  - Description: A runbook can be bookmarked by multiple users

- Runbooks → Incidents (1:N)
  - Foreign Key: `Incidents.runbookId` → `Runbooks._id`
  - Cascade: Set null
  - Description: A runbook can be used in multiple incidents

**Many-to-Many Relationships:**
- Runbooks ↔ Tags (N:M via RunbookTags)
  - Junction: RunbookTags
  - Foreign Keys: `RunbookTags.runbookId` → `Runbooks._id`, `RunbookTags.tagId` → `Tags._id`
  - Cascade: Delete runbook → Delete tag associations
  - Description: A runbook can have multiple tags, a tag can be applied to multiple runbooks

**Many-to-One Relationships:**
- Runbooks → Users (N:1)
  - Foreign Key: `Runbooks.createdBy` → `Users._id`
  - Cascade: Set null
  - Description: Multiple runbooks can be created by one user

---

### RunbookVersions Collection

**Many-to-One Relationships:**
- RunbookVersions → Runbooks (N:1)
  - Foreign Key: `RunbookVersions.runbookId` → `Runbooks._id`
  - Cascade: Delete runbook → Delete versions
  - Description: Multiple versions belong to one runbook

**One-to-Many Relationships:**
- RunbookVersions → RunbookChunks (1:N)
  - Foreign Key: `RunbookChunks.versionId` → `RunbookVersions._id`
  - Cascade: Delete version → Delete chunks
  - Description: A version can have multiple chunks

- RunbookVersions → EmbeddingMetadata (1:N)
  - Foreign Key: `EmbeddingMetadata.versionId` → `RunbookVersions._id`
  - Cascade: Delete version → Delete embedding metadata
  - Description: A version can have multiple embedding metadata entries

---

### RunbookChunks Collection

**Many-to-One Relationships:**
- RunbookChunks → Runbooks (N:1)
  - Foreign Key: `RunbookChunks.runbookId` → `Runbooks._id`
  - Cascade: Delete runbook → Delete chunks
  - Description: Multiple chunks belong to one runbook

- RunbookChunks → RunbookVersions (N:1)
  - Foreign Key: `RunbookChunks.versionId` → `RunbookVersions._id`
  - Cascade: Delete version → Delete chunks
  - Description: Multiple chunks belong to one version

**One-to-Many Relationships:**
- RunbookChunks → EmbeddingMetadata (1:N)
  - Foreign Key: `EmbeddingMetadata.chunkId` → `RunbookChunks._id`
  - Cascade: Delete chunk → Delete embedding metadata
  - Description: A chunk can have multiple embedding metadata entries

---

### EmbeddingMetadata Collection

**Many-to-One Relationships:**
- EmbeddingMetadata → Runbooks (N:1)
  - Foreign Key: `EmbeddingMetadata.runbookId` → `Runbooks._id`
  - Cascade: Delete runbook → Delete embedding metadata
  - Description: Multiple embedding metadata entries belong to one runbook

- EmbeddingMetadata → RunbookVersions (N:1)
  - Foreign Key: `EmbeddingMetadata.versionId` → `RunbookVersions._id`
  - Cascade: Delete version → Delete embedding metadata
  - Description: Multiple embedding metadata entries belong to one version

- EmbeddingMetadata → RunbookChunks (N:1)
  - Foreign Key: `EmbeddingMetadata.chunkId` → `RunbookChunks._id`
  - Cascade: Delete chunk → Delete embedding metadata
  - Description: Multiple embedding metadata entries belong to one chunk

---

### IncidentAttachments Collection

**Many-to-One Relationships:**
- IncidentAttachments → Incidents (N:1)
  - Foreign Key: `IncidentAttachments.incidentId` → `Incidents._id`
  - Cascade: Delete incident → Delete attachments
  - Description: Multiple attachments belong to one incident

- IncidentAttachments → Runbooks (N:1)
  - Foreign Key: `IncidentAttachments.runbookId` → `Runbooks._id`
  - Cascade: Set null
  - Description: Multiple attachments can reference one runbook

- IncidentAttachments → Users (N:1)
  - Foreign Key: `IncidentAttachments.uploadedBy` → `Users._id`
  - Cascade: Set null
  - Description: Multiple attachments can be uploaded by one user

---

## User Content Relationships

### Bookmarks Collection

**Many-to-One Relationships:**
- Bookmarks → Users (N:1)
  - Foreign Key: `Bookmarks.userId` → `Users._id`
  - Cascade: Delete user → Delete bookmarks
  - Description: Multiple bookmarks belong to one user

- Bookmarks → Runbooks (N:1)
  - Foreign Key: `Bookmarks.runbookId` → `Runbooks._id`
  - Cascade: Delete runbook → Delete bookmarks
  - Description: Multiple bookmarks can reference one runbook

---

### SavedIncidents Collection

**Many-to-One Relationships:**
- SavedIncidents → Users (N:1)
  - Foreign Key: `SavedIncidents.userId` → `Users._id`
  - Cascade: Delete user → Delete saved incidents
  - Description: Multiple saved incidents belong to one user

- SavedIncidents → Incidents (N:1)
  - Foreign Key: `SavedIncidents.incidentId` → `Incidents._id`
  - Cascade: Delete incident → Delete saved incidents
  - Description: Multiple saved incidents can reference one incident

---

### Favorites Collection

**Many-to-One Relationships:**
- Favorites → Users (N:1)
  - Foreign Key: `Favorites.userId` → `Users._id`
  - Cascade: Delete user → Delete favorites
  - Description: Multiple favorites belong to one user

---

## Incident Management Relationships

### Incidents Collection

**One-to-Many Relationships:**
- Incidents → IncidentSteps (1:N)
  - Foreign Key: `IncidentSteps.incidentId` → `Incidents._id`
  - Cascade: Delete incident → Delete steps
  - Description: An incident can have multiple steps

- Incidents → IncidentAttachments (1:N)
  - Foreign Key: `IncidentAttachments.incidentId` → `Incidents._id`
  - Cascade: Delete incident → Delete attachments
  - Description: An incident can have multiple attachments

- Incidents → SavedIncidents (1:N)
  - Foreign Key: `SavedIncidents.incidentId` → `Incidents._id`
  - Cascade: Delete incident → Delete saved incidents
  - Description: An incident can be saved by multiple users

- Incidents → Chats (1:N)
  - Foreign Key: `Chats.incidentId` → `Incidents._id`
  - Cascade: Delete incident → Delete chats
  - Description: An incident can have multiple chat messages

- Incidents → Feedback (1:N)
  - Foreign Key: `Feedback.incidentId` → `Incidents._id`
  - Cascade: Keep (preserve feedback)
  - Description: An incident can have multiple feedback entries

- Incidents → CommandHistory (1:N)
  - Foreign Key: `CommandHistory.incidentId` → `Incidents._id`
  - Cascade: Keep (preserve command history)
  - Description: An incident can have multiple command history entries

- Incidents → Notifications (1:N)
  - Foreign Key: `Notifications.entityId` → `Incidents._id` (when entityType = "INCIDENT")
  - Cascade: Delete incident → Delete notifications
  - Description: An incident can generate multiple notifications

**Many-to-Many Relationships:**
- Incidents ↔ Tags (N:M via IncidentTags)
  - Junction: IncidentTags
  - Foreign Keys: `IncidentTags.incidentId` → `Incidents._id`, `IncidentTags.tagId` → `Tags._id`
  - Cascade: Delete incident → Delete tag associations
  - Description: An incident can have multiple tags, a tag can be applied to multiple incidents

**Many-to-One Relationships:**
- Incidents → Users (N:1)
  - Foreign Key: `Incidents.createdBy` → `Users._id`
  - Cascade: Set null
  - Description: Multiple incidents can be created by one user

- Incidents → Users (N:1)
  - Foreign Key: `Incidents.assignedTo` → `Users._id`
  - Cascade: Set null
  - Description: Multiple incidents can be assigned to one user

- Incidents → Runbooks (N:1)
  - Foreign Key: `Incidents.runbookId` → `Runbooks._id`
  - Cascade: Set null
  - Description: Multiple incidents can reference one runbook

---

### IncidentSteps Collection

**Many-to-One Relationships:**
- IncidentSteps → Incidents (N:1)
  - Foreign Key: `IncidentSteps.incidentId` → `Incidents._id`
  - Cascade: Delete incident → Delete steps
  - Description: Multiple steps belong to one incident

- IncidentSteps → Users (N:1)
  - Foreign Key: `IncidentSteps.executedBy` → `Users._id`
  - Cascade: Set null
  - Description: Multiple steps can be executed by one user

**One-to-Many Relationships:**
- IncidentSteps → CommandHistory (1:N)
  - Foreign Key: `CommandHistory.stepId` → `IncidentSteps._id`
  - Cascade: Keep (preserve command history)
  - Description: A step can have multiple command history entries

---

## AI Agent Relationships

### Chats Collection

**Many-to-One Relationships:**
- Chats → Incidents (N:1)
  - Foreign Key: `Chats.incidentId` → `Incidents._id`
  - Cascade: Delete incident → Delete chats
  - Description: Multiple chat messages belong to one incident

- Chats → Users (N:1)
  - Foreign Key: `Chats.userId` → `Users._id`
  - Cascade: Delete user → Delete chats
  - Description: Multiple chat messages belong to one user

---

### AIMemory Collection

**Many-to-One Relationships:**
- AIMemory → Users (N:1)
  - Foreign Key: `AIMemory.userId` → `Users._id`
  - Cascade: Delete user → Delete AI memory
  - Description: Multiple AI memory entries belong to one user

---

### Feedback Collection

**Many-to-One Relationships:**
- Feedback → Incidents (N:1)
  - Foreign Key: `Feedback.incidentId` → `Incidents._id`
  - Cascade: Keep (preserve feedback)
  - Description: Multiple feedback entries belong to one incident

- Feedback → Users (N:1)
  - Foreign Key: `Feedback.userId` → `Users._id`
  - Cascade: Keep (preserve feedback)
  - Description: Multiple feedback entries can be provided by one user

---

### SearchHistory Collection

**Many-to-One Relationships:**
- SearchHistory → Users (N:1)
  - Foreign Key: `SearchHistory.userId` → `Users._id`
  - Cascade: Delete user → Delete search history
  - Description: Multiple search history entries belong to one user

---

## Audit & Logging Relationships

### AuditLogs Collection

**Many-to-One Relationships:**
- AuditLogs → Users (N:1)
  - Foreign Key: `AuditLogs.userId` → `Users._id`
  - Cascade: Keep (preserve audit trail)
  - Description: Multiple audit logs can be generated by one user

---

### ActivityLogs Collection

**Many-to-One Relationships:**
- ActivityLogs → Users (N:1)
  - Foreign Key: `ActivityLogs.userId` → `Users._id`
  - Cascade: Keep (preserve activity trail)
  - Description: Multiple activity logs can be generated by one user

---

### LoginHistory Collection

**Many-to-One Relationships:**
- LoginHistory → Users (N:1)
  - Foreign Key: `LoginHistory.userId` → `Users._id`
  - Cascade: Keep (preserve login history)
  - Description: Multiple login history entries belong to one user

---

### FailedLoginAttempts Collection

**Many-to-One Relationships:**
- FailedLoginAttempts → Users (N:1)
  - Foreign Key: `FailedLoginAttempts.userId` → `Users._id`
  - Cascade: Delete user → Delete failed attempts
  - Description: Multiple failed login attempts belong to one user

---

## Command Execution Security Relationships

### CommandWhitelist Collection

**No Relationships**
- Standalone collection with no foreign key references

---

### BlockedCommands Collection

**No Relationships**
- Standalone collection with no foreign key references

---

### ApprovalRequests Collection

**Many-to-One Relationships:**
- ApprovalRequests → Users (N:1)
  - Foreign Key: `ApprovalRequests.requestedBy` → `Users._id`
  - Cascade: Keep (preserve approval history)
  - Description: Multiple approval requests can be requested by one user

- ApprovalRequests → Users (N:1)
  - Foreign Key: `ApprovalRequests.approvedBy` → `Users._id`
  - Cascade: Set null
  - Description: Multiple approval requests can be approved by one user

---

### ExecutionQueue Collection

**One-to-Many Relationships:**
- ExecutionQueue → CommandHistory (1:N)
  - Foreign Key: `CommandHistory.executionQueueId` → `ExecutionQueue._id`
  - Cascade: Keep (preserve command history)
  - Description: A queue item can generate multiple command history entries

**Many-to-One Relationships:**
- ExecutionQueue → MachineInfo (N:1)
  - Foreign Key: `ExecutionQueue.machineId` → `MachineInfo._id`
  - Cascade: Set null
  - Description: Multiple queue items can target one machine

---

### CommandHistory Collection

**Many-to-One Relationships:**
- CommandHistory → Incidents (N:1)
  - Foreign Key: `CommandHistory.incidentId` → `Incidents._id`
  - Cascade: Keep (preserve command history)
  - Description: Multiple command history entries belong to one incident

- CommandHistory → IncidentSteps (N:1)
  - Foreign Key: `CommandHistory.stepId` → `IncidentSteps._id`
  - Cascade: Keep (preserve command history)
  - Description: Multiple command history entries belong to one step

- CommandHistory → ExecutionQueue (N:1)
  - Foreign Key: `CommandHistory.executionQueueId` → `ExecutionQueue._id`
  - Cascade: Keep (preserve command history)
  - Description: Multiple command history entries belong to one queue item

- CommandHistory → Users (N:1)
  - Foreign Key: `CommandHistory.userId` → `Users._id`
  - Cascade: Keep (preserve command history)
  - Description: Multiple command history entries can be executed by one user

- CommandHistory → MachineInfo (N:1)
  - Foreign Key: `CommandHistory.machineId` → `MachineInfo._id`
  - Cascade: Set null
  - Description: Multiple command history entries can target one machine

**One-to-Many Relationships:**
- CommandHistory → ExecutionLogs (1:N)
  - Foreign Key: `ExecutionLogs.commandHistoryId` → `CommandHistory._id`
  - Cascade: Delete command history → Delete execution logs
  - Description: A command history entry can have multiple execution logs

- CommandHistory → ExecutionResults (1:N)
  - Foreign Key: `ExecutionResults.commandHistoryId` → `CommandHistory._id`
  - Cascade: Delete command history → Delete execution results
  - Description: A command history entry can have multiple execution results

---

### ExecutionLogs Collection

**Many-to-One Relationships:**
- ExecutionLogs → CommandHistory (N:1)
  - Foreign Key: `ExecutionLogs.commandHistoryId` → `CommandHistory._id`
  - Cascade: Delete command history → Delete execution logs
  - Description: Multiple execution logs belong to one command history entry

---

### MachineInfo Collection

**One-to-Many Relationships:**
- MachineInfo → ExecutionQueue (1:N)
  - Foreign Key: `ExecutionQueue.machineId` → `MachineInfo._id`
  - Cascade: Set null
  - Description: A machine can have multiple queue items

- MachineInfo → CommandHistory (1:N)
  - Foreign Key: `CommandHistory.machineId` → `MachineInfo._id`
  - Cascade: Set null
  - Description: A machine can have multiple command history entries

- MachineInfo → SystemMetrics (1:N)
  - Foreign Key: `SystemMetrics.machineId` → `MachineInfo._id`
  - Cascade: Delete machine → Delete metrics
  - Description: A machine can have multiple metric entries

---

### ExecutionResults Collection

**Many-to-One Relationships:**
- ExecutionResults → CommandHistory (N:1)
  - Foreign Key: `ExecutionResults.commandHistoryId` → `CommandHistory._id`
  - Cascade: Delete command history → Delete execution results
  - Description: Multiple execution results belong to one command history entry

---

## Notification Relationships

### Notifications Collection

**Many-to-One Relationships:**
- Notifications → Users (N:1)
  - Foreign Key: `Notifications.userId` → `Users._id`
  - Cascade: Delete user → Delete notifications
  - Description: Multiple notifications belong to one user

---

### NotificationPreferences Collection

**Many-to-One Relationships:**
- NotificationPreferences → Users (N:1)
  - Foreign Key: `NotificationPreferences.userId` → `Users._id`
  - Cascade: Delete user → Delete notification preferences
  - Description: Multiple notification preferences belong to one user

---

## Tagging Relationships

### Tags Collection

**Many-to-Many Relationships:**
- Tags ↔ Runbooks (N:M via RunbookTags)
  - Junction: RunbookTags
  - Foreign Keys: `RunbookTags.tagId` → `Tags._id`, `RunbookTags.runbookId` → `Runbooks._id`
  - Cascade: Delete tag → Delete tag associations
  - Description: A tag can be applied to multiple runbooks, a runbook can have multiple tags

- Tags ↔ Incidents (N:M via IncidentTags)
  - Junction: IncidentTags
  - Foreign Keys: `IncidentTags.tagId` → `Tags._id`, `IncidentTags.incidentId` → `Incidents._id`
  - Cascade: Delete tag → Delete tag associations
  - Description: A tag can be applied to multiple incidents, an incident can have multiple tags

**Many-to-One Relationships:**
- Tags → Users (N:1)
  - Foreign Key: `Tags.createdBy` → `Users._id`
  - Cascade: Keep (preserve tag ownership)
  - Description: Multiple tags can be created by one user

---

### RunbookTags Collection

**Many-to-One Relationships:**
- RunbookTags → Runbooks (N:1)
  - Foreign Key: `RunbookTags.runbookId` → `Runbooks._id`
  - Cascade: Delete runbook → Delete tag associations
  - Description: Multiple tag associations belong to one runbook

- RunbookTags → Tags (N:1)
  - Foreign Key: `RunbookTags.tagId` → `Tags._id`
  - Cascade: Delete tag → Delete tag associations
  - Description: Multiple tag associations belong to one tag

---

### IncidentTags Collection

**Many-to-One Relationships:**
- IncidentTags → Incidents (N:1)
  - Foreign Key: `IncidentTags.incidentId` → `Incidents._id`
  - Cascade: Delete incident → Delete tag associations
  - Description: Multiple tag associations belong to one incident

- IncidentTags → Tags (N:1)
  - Foreign Key: `IncidentTags.tagId` → `Tags._id`
  - Cascade: Delete tag → Delete tag associations
  - Description: Multiple tag associations belong to one tag

---

## RBAC Relationships

### RolePermissions Collection

**Many-to-One Relationships:**
- RolePermissions → Roles (N:1)
  - Foreign Key: `RolePermissions.roleId` → `Roles._id`
  - Cascade: Delete role → Delete permissions
  - Description: Multiple permissions belong to one role

---

### UserRoles Collection

**Many-to-One Relationships:**
- UserRoles → Users (N:1)
  - Foreign Key: `UserRoles.userId` → `Users._id`
  - Cascade: Delete user → Delete user roles
  - Description: Multiple role assignments belong to one user

- UserRoles → Roles (N:1)
  - Foreign Key: `UserRoles.roleId` → `Roles._id`
  - Cascade: Delete role → Delete user roles
  - Description: Multiple role assignments belong to one role

- UserRoles → Users (N:1)
  - Foreign Key: `UserRoles.assignedBy` → `Users._id`
  - Cascade: Set null
  - Description: Multiple role assignments can be made by one user

---

## Monitoring Relationships

### SystemMetrics Collection

**Many-to-One Relationships:**
- SystemMetrics → MachineInfo (N:1)
  - Foreign Key: `SystemMetrics.machineId` → `MachineInfo._id`
  - Cascade: Delete machine → Delete metrics
  - Description: Multiple metric entries belong to one machine

---

## Integration Relationships

### IntegrationConfig Collection

**Many-to-One Relationships:**
- IntegrationConfig → Users (N:1)
  - Foreign Key: `IntegrationConfig.createdBy` → `Users._id`
  - Cascade: Keep (preserve integration ownership)
  - Description: Multiple integrations can be created by one user

**One-to-Many Relationships:**
- IntegrationConfig → IntegrationLogs (1:N)
  - Foreign Key: `IntegrationLogs.integrationId` → `IntegrationConfig._id`
  - Cascade: Delete integration → Delete integration logs
  - Description: An integration can have multiple log entries

---

### IntegrationLogs Collection

**Many-to-One Relationships:**
- IntegrationLogs → IntegrationConfig (N:1)
  - Foreign Key: `IntegrationLogs.integrationId` → `IntegrationConfig._id`
  - Cascade: Delete integration → Delete integration logs
  - Description: Multiple log entries belong to one integration

---

### Webhooks Collection

**Many-to-One Relationships:**
- Webhooks → Users (N:1)
  - Foreign Key: `Webhooks.createdBy` → `Users._id`
  - Cascade: Keep (preserve webhook ownership)
  - Description: Multiple webhooks can be created by one user

**One-to-Many Relationships:**
- Webhooks → WebhookLogs (1:N)
  - Foreign Key: `WebhookLogs.webhookId` → `Webhooks._id`
  - Cascade: Delete webhook → Delete webhook logs
  - Description: A webhook can have multiple log entries

---

### WebhookLogs Collection

**Many-to-One Relationships:**
- WebhookLogs → Webhooks (N:1)
  - Foreign Key: `WebhookLogs.webhookId` → `Webhooks._id`
  - Cascade: Delete webhook → Delete webhook logs
  - Description: Multiple log entries belong to one webhook

---

## Cascade Behavior Summary

| Cascade Type | Description | Collections |
|--------------|-------------|------------|
| **Delete** | Delete related documents when parent is deleted | Sessions, Tokens, RefreshTokens, UserPreferences, APIKeys, Bookmarks, SavedIncidents, Favorites, Chats, AIMemory, SearchHistory, NotificationPreferences, RunbookVersions, RunbookChunks, EmbeddingMetadata, IncidentAttachments, IncidentSteps, ExecutionLogs, ExecutionResults, SystemMetrics, IntegrationLogs, WebhookLogs |
| **Set Null** | Set foreign key to null when parent is deleted | Incidents.assignedTo, IncidentSteps.executedBy, ApprovalRequests.approvedBy, CommandHistory.machineId, ExecutionQueue.machineId, IncidentAttachments.runbookId, IncidentAttachments.uploadedBy, Incidents.runbookId, Runbooks.createdBy, UserRoles.assignedBy |
| **Restrict/Keep** | Prevent deletion or keep related documents for audit trail | AuditLogs, ActivityLogs, LoginHistory, CommandHistory, Feedback, ApprovalRequests.requestedBy, IntegrationConfig, Webhooks, Tags.createdBy |

---

## Referential Integrity Guidelines

1. **Application-Level Enforcement**: MongoDB does not enforce foreign key constraints at the database level. All referential integrity must be enforced at the application level.

2. **Transaction Support**: Use MongoDB transactions for multi-document operations to ensure data consistency.

3. **Soft Deletes**: Implement soft deletes for collections where audit trail preservation is critical.

4. **Cleanup Jobs**: Implement scheduled cleanup jobs for documents with cascade delete behavior.

5. **Index Maintenance**: Ensure all foreign key fields are indexed for efficient join operations.

6. **Validation**: Implement validation logic to prevent orphaned documents.

---

# Phase 7: Relationships and Foreign Key References - COMPLETED

All relationships and foreign key references have been documented for the 46 collections, including:
- One-to-One relationships
- One-to-Many relationships
- Many-to-Many relationships with junction collections
- Cascade behavior specifications
- Referential integrity guidelines
- Foreign key field mappings

The relationship documentation provides a comprehensive view of how collections interact within the Runbook Following Agent database architecture.

---

# Phase 10: CRUD Matrix for All Collections

## CRUD Overview

This section provides a comprehensive CRUD (Create, Read, Update, Delete) matrix for all 46 collections in the Runbook Following Agent MongoDB database. The matrix includes operation details, permissions, validation, and error handling for each collection.

### CRUD Operations Legend

- **C**: Create - Insert new documents
- **R**: Read - Query and retrieve documents
- **U**: Update - Modify existing documents
- **D**: Delete - Remove documents (soft/hard delete)

---

## Security & Authentication Collections

### Users Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/users` | `USER_CREATE` | Email unique, password strength, required fields | 409 if email exists, 400 if validation fails |
| Read (All) | GET | `/api/users` | `USER_READ_ALL` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/users/{id}` | `USER_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/users/{id}` | `USER_UPDATE` (own) or `USER_UPDATE_ALL` | Email unique, password strength | 404 if not found, 403 if not own |
| Delete | DELETE | `/api/users/{id}` | `USER_DELETE` | Check dependencies | 403 if has dependencies, 404 if not found |
| Soft Delete | PATCH | `/api/users/{id}/deactivate` | `USER_UPDATE` (own) or `USER_UPDATE_ALL` | Valid ObjectId | 404 if not found |

**Special Operations:**
- Change Password: `PATCH /api/users/{id}/password` - `USER_UPDATE` (own)
- Reset Password: `POST /api/users/{id}/reset-password` - `USER_RESET_PASSWORD`
- Verify Email: `POST /api/users/{id}/verify-email` - Public (with token)

---

### Roles Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/roles` | `ROLE_CREATE` | Name unique, required fields | 409 if name exists |
| Read (All) | GET | `/api/roles` | `ROLE_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/roles/{id}` | `ROLE_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/roles/{id}` | `ROLE_UPDATE` | Name unique | 404 if not found, 409 if name conflict |
| Delete | DELETE | `/api/roles/{id}` | `ROLE_DELETE` | Check user assignments | 403 if has users, 404 if not found |

---

### Sessions Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/sessions` | Public (login) | Valid credentials | 401 if invalid |
| Read (All) | GET | `/api/sessions` | `SESSION_READ_ALL` | Pagination | 403 if unauthorized |
| Read (One) | GET | `/api/sessions/{id}` | `SESSION_READ` (own) or `SESSION_READ_ALL` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/sessions/{id}` | `SESSION_UPDATE` (own) | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/sessions/{id}` | `SESSION_DELETE` (own) or `SESSION_DELETE_ALL` | Valid ObjectId | 404 if not found |
| Delete (All User) | DELETE | `/api/sessions/user/{userId}` | `SESSION_DELETE_ALL` | Valid ObjectId | 404 if not found |

**Special Operations:**
- Refresh Token: `POST /api/sessions/refresh` - Public (with refresh token)
- Logout: `POST /api/sessions/logout` - Authenticated

---

### Tokens Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/tokens` | Public (login) | Valid credentials | 401 if invalid |
| Read (All) | GET | `/api/tokens` | `TOKEN_READ_ALL` | Pagination | 403 if unauthorized |
| Read (One) | GET | `/api/tokens/{id}` | `TOKEN_READ` (own) or `TOKEN_READ_ALL` | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/tokens/{id}` | `TOKEN_DELETE` (own) or `TOKEN_DELETE_ALL` | Valid ObjectId | 404 if not found |
| Delete (All User) | DELETE | `/api/tokens/user/{userId}` | `TOKEN_DELETE_ALL` | Valid ObjectId | 404 if not found |

---

### RefreshTokens Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/refresh-tokens` | Public (login) | Valid credentials | 401 if invalid |
| Read (All) | GET | `/api/refresh-tokens` | `TOKEN_READ_ALL` | Pagination | 403 if unauthorized |
| Delete | DELETE | `/api/refresh-tokens/{id}` | `TOKEN_DELETE` (own) or `TOKEN_DELETE_ALL` | Valid ObjectId | 404 if not found |
| Delete (All User) | DELETE | `/api/refresh-tokens/user/{userId}` | `TOKEN_DELETE_ALL` | Valid ObjectId | 404 if not found |

---

### UserPreferences Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/user-preferences` | `PREFERENCE_CREATE` (own) | Valid userId | 403 if not own |
| Read (One) | GET | `/api/user-preferences/{userId}` | `PREFERENCE_READ` (own) or `PREFERENCE_READ_ALL` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/user-preferences/{userId}` | `PREFERENCE_UPDATE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Delete | DELETE | `/api/user-preferences/{userId}` | `PREFERENCE_DELETE` (own) | Valid ObjectId | 404 if not found, 403 if not own |

---

### APIKeys Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/api-keys` | `APIKEY_CREATE` (own) | Valid userId, key generation | 403 if not own |
| Read (All) | GET | `/api/api-keys` | `APIKEY_READ` (own) or `APIKEY_READ_ALL` | Pagination | 403 if unauthorized |
| Read (One) | GET | `/api/api-keys/{id}` | `APIKEY_READ` (own) or `APIKEY_READ_ALL` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/api-keys/{id}` | `APIKEY_UPDATE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Delete | DELETE | `/api/api-keys/{id}` | `APIKEY_DELETE` (own) or `APIKEY_DELETE_ALL` | Valid ObjectId | 404 if not found |
| Revoke | PATCH | `/api/api-keys/{id}/revoke` | `APIKEY_UPDATE` (own) | Valid ObjectId | 404 if not found |

---

## System Configuration Collections

### SystemSettings Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/system-settings` | `SYSTEM_SETTINGS_CREATE` | Key unique, required fields | 409 if key exists |
| Read (All) | GET | `/api/system-settings` | `SYSTEM_SETTINGS_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/system-settings/{key}` | `SYSTEM_SETTINGS_READ` | Valid key | 404 if not found |
| Update | PUT | `/api/system-settings/{key}` | `SYSTEM_SETTINGS_UPDATE` | Valid key | 404 if not found |
| Delete | DELETE | `/api/system-settings/{key}` | `SYSTEM_SETTINGS_DELETE` | Valid key, check critical | 403 if critical, 404 if not found |

---

## Runbook Management Collections

### Runbooks Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/runbooks` | `RUNBOOK_CREATE` | Name unique, required fields | 409 if name exists |
| Read (All) | GET | `/api/runbooks` | `RUNBOOK_READ` | Pagination, filters, search | 403 if unauthorized |
| Read (One) | GET | `/api/runbooks/{id}` | `RUNBOOK_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/runbooks/{id}` | `RUNBOOK_UPDATE` (own) or `RUNBOOK_UPDATE_ALL` | Name unique | 404 if not found, 403 if not own |
| Delete | DELETE | `/api/runbooks/{id}` | `RUNBOOK_DELETE` (own) or `RUNBOOK_DELETE_ALL` | Check dependencies | 403 if has incidents, 404 if not found |
| Soft Delete | PATCH | `/api/runbooks/{id}/archive` | `RUNBOOK_UPDATE` (own) or `RUNBOOK_UPDATE_ALL` | Valid ObjectId | 404 if not found |
| Search | GET | `/api/runbooks/search` | `RUNBOOK_READ` | Query parameter | 400 if invalid query |

**Special Operations:**
- Create Version: `POST /api/runbooks/{id}/versions` - `RUNBOOK_UPDATE` (own)
- Get Versions: `GET /api/runbooks/{id}/versions` - `RUNBOOK_READ`
- Publish: `PATCH /api/runbooks/{id}/publish` - `RUNBOOK_UPDATE` (own)

---

### RunbookVersions Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/runbook-versions` | `RUNBOOK_UPDATE` (own) | Valid runbookId, version number | 404 if runbook not found |
| Read (All) | GET | `/api/runbook-versions` | `RUNBOOK_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/runbook-versions/{id}` | `RUNBOOK_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/runbook-versions/{id}` | `RUNBOOK_UPDATE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Delete | DELETE | `/api/runbook-versions/{id}` | `RUNBOOK_DELETE` (own) or `RUNBOOK_DELETE_ALL` | Check dependencies | 403 if is current, 404 if not found |

---

### RunbookChunks Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/runbook-chunks` | `RUNBOOK_UPDATE` (own) | Valid versionId, chunk number | 404 if version not found |
| Read (All) | GET | `/api/runbook-chunks` | `RUNBOOK_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/runbook-chunks/{id}` | `RUNBOOK_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/runbook-chunks/{id}` | `RUNBOOK_UPDATE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Delete | DELETE | `/api/runbook-chunks/{id}` | `RUNBOOK_DELETE` (own) or `RUNBOOK_DELETE_ALL` | Valid ObjectId | 404 if not found |

---

### EmbeddingMetadata Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/embedding-metadata` | `RUNBOOK_UPDATE` (own) | Valid chunkId, vectorStore | 404 if chunk not found |
| Read (All) | GET | `/api/embedding-metadata` | `RUNBOOK_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/embedding-metadata/{id}` | `RUNBOOK_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/embedding-metadata/{id}` | `RUNBOOK_UPDATE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Delete | DELETE | `/api/embedding-metadata/{id}` | `RUNBOOK_DELETE` (own) or `RUNBOOK_DELETE_ALL` | Valid ObjectId | 404 if not found |

---

### IncidentAttachments Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/incident-attachments` | `INCIDENT_UPDATE` (own) | Valid incidentId, file validation | 404 if incident not found, 400 if invalid file |
| Read (All) | GET | `/api/incident-attachments` | `INCIDENT_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/incident-attachments/{id}` | `INCIDENT_READ` | Valid ObjectId | 404 if not found |
| Download | GET | `/api/incident-attachments/{id}/download` | `INCIDENT_READ` | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/incident-attachments/{id}` | `INCIDENT_UPDATE` (own) or `INCIDENT_UPDATE_ALL` | Valid ObjectId | 404 if not found, 403 if not own |

---

## User Content Collections

### Bookmarks Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/bookmarks` | `BOOKMARK_CREATE` (own) | Valid runbookId, userId | 409 if already bookmarked |
| Read (All) | GET | `/api/bookmarks` | `BOOKMARK_READ` (own) | Pagination | 403 if unauthorized |
| Read (One) | GET | `/api/bookmarks/{id}` | `BOOKMARK_READ` (own) | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/bookmarks/{id}` | `BOOKMARK_DELETE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Check | GET | `/api/bookmarks/check/{runbookId}` | `BOOKMARK_READ` (own) | Valid runbookId | 404 if runbook not found |

---

### SavedIncidents Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/saved-incidents` | `SAVED_INCIDENT_CREATE` (own) | Valid incidentId, userId | 409 if already saved |
| Read (All) | GET | `/api/saved-incidents` | `SAVED_INCIDENT_READ` (own) | Pagination | 403 if unauthorized |
| Read (One) | GET | `/api/saved-incidents/{id}` | `SAVED_INCIDENT_READ` (own) | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/saved-incidents/{id}` | `SAVED_INCIDENT_DELETE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Check | GET | `/api/saved-incidents/check/{incidentId}` | `SAVED_INCIDENT_READ` (own) | Valid incidentId | 404 if incident not found |

---

### Favorites Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/favorites` | `FAVORITE_CREATE` (own) | Valid entityType, entityId, userId | 409 if already favorited |
| Read (All) | GET | `/api/favorites` | `FAVORITE_READ` (own) | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/favorites/{id}` | `FAVORITE_READ` (own) | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/favorites/{id}` | `FAVORITE_DELETE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Check | GET | `/api/favorites/check/{entityType}/{entityId}` | `FAVORITE_READ` (own) | Valid parameters | 400 if invalid parameters |

---

## Incident Management Collections

### Incidents Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/incidents` | `INCIDENT_CREATE` | Required fields, valid runbookId | 404 if runbook not found |
| Read (All) | GET | `/api/incidents` | `INCIDENT_READ` | Pagination, filters, search | 403 if unauthorized |
| Read (One) | GET | `/api/incidents/{id}` | `INCIDENT_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/incidents/{id}` | `INCIDENT_UPDATE` (own) or `INCIDENT_UPDATE_ALL` | Valid ObjectId | 404 if not found, 403 if not own |
| Delete | DELETE | `/api/incidents/{id}` | `INCIDENT_DELETE` (own) or `INCIDENT_DELETE_ALL` | Check dependencies | 403 if has steps, 404 if not found |
| Assign | PATCH | `/api/incidents/{id}/assign` | `INCIDENT_ASSIGN` | Valid assignedTo | 404 if not found |
| Change Status | PATCH | `/api/incidents/{id}/status` | `INCIDENT_UPDATE` (own) or `INCIDENT_UPDATE_ALL` | Valid status | 404 if not found |
| Search | GET | `/api/incidents/search` | `INCIDENT_READ` | Query parameter | 400 if invalid query |

**Special Operations:**
- Get Steps: `GET /api/incidents/{id}/steps` - `INCIDENT_READ`
- Get Attachments: `GET /api/incidents/{id}/attachments` - `INCIDENT_READ`
- Get Chats: `GET /api/incidents/{id}/chats` - `INCIDENT_READ`

---

### IncidentSteps Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/incident-steps` | `INCIDENT_UPDATE` (own) or `INCIDENT_UPDATE_ALL` | Valid incidentId, step number | 404 if incident not found |
| Read (All) | GET | `/api/incident-steps` | `INCIDENT_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/incident-steps/{id}` | `INCIDENT_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/incident-steps/{id}` | `INCIDENT_UPDATE` (own) or `INCIDENT_UPDATE_ALL` | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/incident-steps/{id}` | `INCIDENT_DELETE` (own) or `INCIDENT_DELETE_ALL` | Valid ObjectId | 404 if not found |
| Execute | POST | `/api/incident-steps/{id}/execute` | `INCIDENT_EXECUTE` (own) or `INCIDENT_EXECUTE_ALL` | Valid ObjectId | 404 if not found |
| Change Status | PATCH | `/api/incident-steps/{id}/status` | `INCIDENT_UPDATE` (own) or `INCIDENT_UPDATE_ALL` | Valid status | 404 if not found |

---

## AI Agent Collections

### Chats Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/chats` | `CHAT_CREATE` (own) | Valid incidentId, userId | 404 if incident not found |
| Read (All) | GET | `/api/chats` | `CHAT_READ` (own) | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/chats/{id}` | `CHAT_READ` (own) | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/chats/{id}` | `CHAT_DELETE` (own) or `CHAT_DELETE_ALL` | Valid ObjectId | 404 if not found, 403 if not own |
| Get By Incident | GET | `/api/chats/incident/{incidentId}` | `CHAT_READ` (own) | Valid incidentId | 404 if incident not found |

---

### AIMemory Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/ai-memory` | `AI_MEMORY_CREATE` (own) | Valid userId, memoryType | 403 if not own |
| Read (All) | GET | `/api/ai-memory` | `AI_MEMORY_READ` (own) | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/ai-memory/{id}` | `AI_MEMORY_READ` (own) | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/ai-memory/{id}` | `AI_MEMORY_UPDATE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Delete | DELETE | `/api/ai-memory/{id}` | `AI_MEMORY_DELETE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Clear | DELETE | `/api/ai-memory/user/{userId}` | `AI_MEMORY_DELETE` (own) | Valid userId | 404 if not found |

---

### Feedback Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/feedback` | `FEEDBACK_CREATE` (own) | Valid incidentId, userId, rating | 404 if incident not found |
| Read (All) | GET | `/api/feedback` | `FEEDBACK_READ` (own) or `FEEDBACK_READ_ALL` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/feedback/{id}` | `FEEDBACK_READ` (own) or `FEEDBACK_READ_ALL` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/feedback/{id}` | `FEEDBACK_UPDATE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Delete | DELETE | `/api/feedback/{id}` | `FEEDBACK_DELETE` (own) or `FEEDBACK_DELETE_ALL` | Valid ObjectId | 404 if not found |

---

### SearchHistory Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/search-history` | `SEARCH_HISTORY_CREATE` (own) | Valid userId, searchType | 403 if not own |
| Read (All) | GET | `/api/search-history` | `SEARCH_HISTORY_READ` (own) | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/search-history/{id}` | `SEARCH_HISTORY_READ` (own) | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/search-history/{id}` | `SEARCH_HISTORY_DELETE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Clear | DELETE | `/api/search-history/user/{userId}` | `SEARCH_HISTORY_DELETE` (own) | Valid userId | 404 if not found |

---

## Audit & Logging Collections

### AuditLogs Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/audit-logs` | System Only | Valid userId, action, entityType | 400 if validation fails |
| Read (All) | GET | `/api/audit-logs` | `AUDIT_LOG_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/audit-logs/{id}` | `AUDIT_LOG_READ` | Valid ObjectId | 404 if not found |
| Export | GET | `/api/audit-logs/export` | `AUDIT_LOG_READ` | Date range | 400 if invalid range |

---

### ActivityLogs Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/activity-logs` | System Only | Valid userId, activityType | 400 if validation fails |
| Read (All) | GET | `/api/activity-logs` | `ACTIVITY_LOG_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/activity-logs/{id}` | `ACTIVITY_LOG_READ` | Valid ObjectId | 404 if not found |
| Export | GET | `/api/activity-logs/export` | `ACTIVITY_LOG_READ` | Date range | 400 if invalid range |

---

### LoginHistory Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/login-history` | System Only | Valid userId, loginMethod | 400 if validation fails |
| Read (All) | GET | `/api/login-history` | `LOGIN_HISTORY_READ` (own) or `LOGIN_HISTORY_READ_ALL` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/login-history/{id}` | `LOGIN_HISTORY_READ` (own) or `LOGIN_HISTORY_READ_ALL` | Valid ObjectId | 404 if not found |
| Export | GET | `/api/login-history/export` | `LOGIN_HISTORY_READ_ALL` | Date range | 400 if invalid range |

---

### FailedLoginAttempts Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/failed-login-attempts` | System Only | Valid userId, ipAddress | 400 if validation fails |
| Read (All) | GET | `/api/failed-login-attempts` | `FAILED_LOGIN_READ` (own) or `FAILED_LOGIN_READ_ALL` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/failed-login-attempts/{id}` | `FAILED_LOGIN_READ` (own) or `FAILED_LOGIN_READ_ALL` | Valid ObjectId | 404 if not found |
| Clear | DELETE | `/api/failed-login-attempts/user/{userId}` | `FAILED_LOGIN_DELETE` (own) or `FAILED_LOGIN_DELETE_ALL` | Valid userId | 404 if not found |

---

## Command Execution Security Collections

### CommandWhitelist Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/command-whitelist` | `COMMAND_WHITELIST_CREATE` | Command unique, required fields | 409 if command exists |
| Read (All) | GET | `/api/command-whitelist` | `COMMAND_WHITELIST_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/command-whitelist/{id}` | `COMMAND_WHITELIST_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/command-whitelist/{id}` | `COMMAND_WHITELIST_UPDATE` | Command unique | 404 if not found, 409 if conflict |
| Delete | DELETE | `/api/command-whitelist/{id}` | `COMMAND_WHITELIST_DELETE` | Valid ObjectId | 404 if not found |

---

### BlockedCommands Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/blocked-commands` | `BLOCKED_COMMAND_CREATE` | Command unique, required fields | 409 if command exists |
| Read (All) | GET | `/api/blocked-commands` | `BLOCKED_COMMAND_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/blocked-commands/{id}` | `BLOCKED_COMMAND_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/blocked-commands/{id}` | `BLOCKED_COMMAND_UPDATE` | Command unique | 404 if not found, 409 if conflict |
| Delete | DELETE | `/api/blocked-commands/{id}` | `BLOCKED_COMMAND_DELETE` | Valid ObjectId | 404 if not found |

---

### ApprovalRequests Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/approval-requests` | `APPROVAL_REQUEST_CREATE` | Valid command, risk level | 400 if validation fails |
| Read (All) | GET | `/api/approval-requests` | `APPROVAL_REQUEST_READ` (own) or `APPROVAL_REQUEST_READ_ALL` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/approval-requests/{id}` | `APPROVAL_REQUEST_READ` (own) or `APPROVAL_REQUEST_READ_ALL` | Valid ObjectId | 404 if not found |
| Approve | PATCH | `/api/approval-requests/{id}/approve` | `APPROVAL_REQUEST_APPROVE` | Valid ObjectId, status PENDING | 404 if not found, 400 if not pending |
| Reject | PATCH | `/api/approval-requests/{id}/reject` | `APPROVAL_REQUEST_APPROVE` | Valid ObjectId, status PENDING | 404 if not found, 400 if not pending |
| Cancel | PATCH | `/api/approval-requests/{id}/cancel` | `APPROVAL_REQUEST_CANCEL` (own) | Valid ObjectId, status PENDING | 404 if not found, 400 if not pending |

---

### ExecutionQueue Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/execution-queue` | `EXECUTION_QUEUE_CREATE` | Valid command, machineId | 404 if machine not found |
| Read (All) | GET | `/api/execution-queue` | `EXECUTION_QUEUE_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/execution-queue/{id}` | `EXECUTION_QUEUE_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/execution-queue/{id}` | `EXECUTION_QUEUE_UPDATE` | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/execution-queue/{id}` | `EXECUTION_QUEUE_DELETE` | Valid ObjectId | 404 if not found |
| Process | POST | `/api/execution-queue/{id}/process` | `EXECUTION_QUEUE_PROCESS` | Valid ObjectId, status PENDING | 404 if not found, 400 if not pending |

---

### CommandHistory Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/command-history` | System Only | Valid userId, command | 400 if validation fails |
| Read (All) | GET | `/api/command-history` | `COMMAND_HISTORY_READ` (own) or `COMMAND_HISTORY_READ_ALL` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/command-history/{id}` | `COMMAND_HISTORY_READ` (own) or `COMMAND_HISTORY_READ_ALL` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/command-history/{id}` | System Only | Valid ObjectId | 404 if not found |
| Export | GET | `/api/command-history/export` | `COMMAND_HISTORY_READ_ALL` | Date range | 400 if invalid range |

---

### ExecutionLogs Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/execution-logs` | System Only | Valid commandHistoryId, logType | 400 if validation fails |
| Read (All) | GET | `/api/execution-logs` | `EXECUTION_LOG_READ` (own) or `EXECUTION_LOG_READ_ALL` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/execution-logs/{id}` | `EXECUTION_LOG_READ` (own) or `EXECUTION_LOG_READ_ALL` | Valid ObjectId | 404 if not found |
| Export | GET | `/api/execution-logs/export` | `EXECUTION_LOG_READ_ALL` | Date range | 400 if invalid range |

---

### MachineInfo Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/machine-info` | `MACHINE_INFO_CREATE` | Hostname unique, ipAddress unique | 409 if hostname/IP exists |
| Read (All) | GET | `/api/machine-info` | `MACHINE_INFO_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/machine-info/{id}` | `MACHINE_INFO_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/machine-info/{id}` | `MACHINE_INFO_UPDATE` | Hostname unique, ipAddress unique | 404 if not found, 409 if conflict |
| Delete | DELETE | `/api/machine-info/{id}` | `MACHINE_INFO_DELETE` | Check dependencies | 403 if has queue items, 404 if not found |
| Heartbeat | PATCH | `/api/machine-info/{id}/heartbeat` | System Only | Valid ObjectId | 404 if not found |

---

### ExecutionResults Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/execution-results` | System Only | Valid commandHistoryId, resultType | 400 if validation fails |
| Read (All) | GET | `/api/execution-results` | `EXECUTION_RESULT_READ` (own) or `EXECUTION_RESULT_READ_ALL` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/execution-results/{id}` | `EXECUTION_RESULT_READ` (own) or `EXECUTION_RESULT_READ_ALL` | Valid ObjectId | 404 if not found |

---

## Notification Collections

### Notifications Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/notifications` | System Only | Valid userId, type | 400 if validation fails |
| Read (All) | GET | `/api/notifications` | `NOTIFICATION_READ` (own) | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/notifications/{id}` | `NOTIFICATION_READ` (own) | Valid ObjectId | 404 if not found |
| Mark Read | PATCH | `/api/notifications/{id}/read` | `NOTIFICATION_UPDATE` (own) | Valid ObjectId | 404 if not found |
| Mark All Read | PATCH | `/api/notifications/user/{userId}/read-all` | `NOTIFICATION_UPDATE` (own) | Valid userId | 404 if not found |
| Delete | DELETE | `/api/notifications/{id}` | `NOTIFICATION_DELETE` (own) | Valid ObjectId | 404 if not found |
| Delete All | DELETE | `/api/notifications/user/{userId}` | `NOTIFICATION_DELETE` (own) | Valid userId | 404 if not found |

---

### NotificationPreferences Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/notification-preferences` | `NOTIFICATION_PREFERENCE_CREATE` (own) | Valid userId, channel | 409 if preference exists |
| Read (All) | GET | `/api/notification-preferences` | `NOTIFICATION_PREFERENCE_READ` (own) | Pagination | 403 if unauthorized |
| Read (One) | GET | `/api/notification-preferences/{id}` | `NOTIFICATION_PREFERENCE_READ` (own) | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/notification-preferences/{id}` | `NOTIFICATION_PREFERENCE_UPDATE` (own) | Valid ObjectId | 404 if not found, 403 if not own |
| Delete | DELETE | `/api/notification-preferences/{id}` | `NOTIFICATION_PREFERENCE_DELETE` (own) | Valid ObjectId | 404 if not found, 403 if not own |

---

## Tagging Collections

### Tags Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/tags` | `TAG_CREATE` | Name unique, required fields | 409 if name exists |
| Read (All) | GET | `/api/tags` | `TAG_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/tags/{id}` | `TAG_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/tags/{id}` | `TAG_UPDATE` (own) or `TAG_UPDATE_ALL` | Name unique | 404 if not found, 409 if conflict |
| Delete | DELETE | `/api/tags/{id}` | `TAG_DELETE` (own) or `TAG_DELETE_ALL` | Check dependencies | 403 if in use, 404 if not found |
| Search | GET | `/api/tags/search` | `TAG_READ` | Query parameter | 400 if invalid query |

---

### RunbookTags Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/runbook-tags` | `RUNBOOK_TAG_CREATE` (own) or `RUNBOOK_TAG_CREATE_ALL` | Valid runbookId, tagId | 409 if association exists |
| Read (All) | GET | `/api/runbook-tags` | `RUNBOOK_TAG_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/runbook-tags/{id}` | `RUNBOOK_TAG_READ` | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/runbook-tags/{id}` | `RUNBOOK_TAG_DELETE` (own) or `RUNBOOK_TAG_DELETE_ALL` | Valid ObjectId | 404 if not found |
| Delete By Runbook | DELETE | `/api/runbook-tags/runbook/{runbookId}` | Tag owner or admin | Valid runbookId | 404 if not found |

---

### IncidentTags Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/incident-tags` | `INCIDENT_TAG_CREATE` (own) or `INCIDENT_TAG_CREATE_ALL` | Valid incidentId, tagId | 409 if association exists |
| Read (All) | GET | `/api/incident-tags` | `INCIDENT_TAG_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/incident-tags/{id}` | `INCIDENT_TAG_READ` | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/incident-tags/{id}` | `INCIDENT_TAG_DELETE` (own) or `INCIDENT_TAG_DELETE_ALL` | Valid ObjectId | 404 if not found |
| Delete By Incident | DELETE | `/api/incident-tags/incident/{incidentId}` | Incident owner or admin | Valid incidentId | 404 if not found |

---

## RBAC Collections

### RolePermissions Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/role-permissions` | `ROLE_PERMISSION_CREATE` | Valid roleId, permission | 409 if permission exists |
| Read (All) | GET | `/api/role-permissions` | `ROLE_PERMISSION_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/role-permissions/{id}` | `ROLE_PERMISSION_READ` | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/role-permissions/{id}` | `ROLE_PERMISSION_DELETE` | Valid ObjectId | 404 if not found |
| Delete By Role | DELETE | `/api/role-permissions/role/{roleId}` | `ROLE_PERMISSION_DELETE` | Valid roleId | 404 if not found |

---

### UserRoles Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/user-roles` | `USER_ROLE_ASSIGN` | Valid userId, roleId | 409 if assignment exists |
| Read (All) | GET | `/api/user-roles` | `USER_ROLE_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/user-roles/{id}` | User or admin | Valid ObjectId | 404 if not found |
| Delete | DELETE | `/api/user-roles/{id}` | `USER_ROLE_REMOVE` | Valid ObjectId | 404 if not found |
| Delete By User | DELETE | `/api/user-roles/user/{userId}` | `USER_ROLE_REMOVE` or admin | Valid userId | 404 if not found |
| Delete By Role | DELETE | `/api/user-roles/role/{roleId}` | `USER_ROLE_REMOVE` or admin | Valid roleId | 404 if not found |

---

## Monitoring Collections

### SystemMetrics Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/system-metrics` | System Only | Valid machineId, metricType | 400 if validation fails |
| Read (All) | GET | `/api/system-metrics` | `SYSTEM_METRIC_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/system-metrics/{id}` | `SYSTEM_METRIC_READ` | Valid ObjectId | 404 if not found |
| Aggregate | GET | `/api/system-metrics/aggregate` | `SYSTEM_METRIC_READ` | Aggregation parameters | 400 if invalid parameters |
| Export | GET | `/api/system-metrics/export` | `SYSTEM_METRIC_READ` | Date range | 400 if invalid range |

---

## Integration Collections

### IntegrationConfig Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/integration-config` | `INTEGRATION_CREATE` | Name unique, required fields | 409 if name exists |
| Read (All) | GET | `/api/integration-config` | `INTEGRATION_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/integration-config/{id}` | `INTEGRATION_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/integration-config/{id}` | `INTEGRATION_UPDATE` (own) or `INTEGRATION_UPDATE_ALL` | Name unique | 404 if not found, 409 if conflict |
| Delete | DELETE | `/api/integration-config/{id}` | `INTEGRATION_DELETE` (own) or `INTEGRATION_DELETE_ALL` | Valid ObjectId | 404 if not found |
| Test | POST | `/api/integration-config/{id}/test` | `INTEGRATION_UPDATE` (own) or `INTEGRATION_UPDATE_ALL` | Valid ObjectId | 404 if not found |
| Enable/Disable | PATCH | `/api/integration-config/{id}/toggle` | `INTEGRATION_UPDATE` (own) or `INTEGRATION_UPDATE_ALL` | Valid ObjectId | 404 if not found |

---

### IntegrationLogs Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/integration-logs` | System Only | Valid integrationId, operation | 400 if validation fails |
| Read (All) | GET | `/api/integration-logs` | `INTEGRATION_LOG_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/integration-logs/{id}` | `INTEGRATION_LOG_READ` | Valid ObjectId | 404 if not found |
| Export | GET | `/api/integration-logs/export` | `INTEGRATION_LOG_READ` | Date range | 400 if invalid range |

---

### Webhooks Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/webhooks` | `WEBHOOK_CREATE` | Name unique, required fields | 409 if name exists |
| Read (All) | GET | `/api/webhooks` | `WEBHOOK_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/webhooks/{id}` | `WEBHOOK_READ` | Valid ObjectId | 404 if not found |
| Update | PUT | `/api/webhooks/{id}` | `WEBHOOK_UPDATE` (own) or `WEBHOOK_UPDATE_ALL` | Name unique | 404 if not found, 409 if conflict |
| Delete | DELETE | `/api/webhooks/{id}` | `WEBHOOK_DELETE` (own) or `WEBHOOK_DELETE_ALL` | Valid ObjectId | 404 if not found |
| Test | POST | `/api/webhooks/{id}/test` | `WEBHOOK_UPDATE` (own) or `WEBHOOK_UPDATE_ALL` | Valid ObjectId | 404 if not found |
| Enable/Disable | PATCH | `/api/webhooks/{id}/toggle` | `WEBHOOK_UPDATE` (own) or `WEBHOOK_UPDATE_ALL` | Valid ObjectId | 404 if not found |

---

### WebhookLogs Collection

| Operation | HTTP Method | Endpoint | Required Permissions | Validation | Error Handling |
|-----------|--------------|----------|----------------------|------------|----------------|
| Create | POST | `/api/webhook-logs` | System Only | Valid webhookId, eventType | 400 if validation fails |
| Read (All) | GET | `/api/webhook-logs` | `WEBHOOK_LOG_READ` | Pagination, filters | 403 if unauthorized |
| Read (One) | GET | `/api/webhook-logs/{id}` | `WEBHOOK_LOG_READ` | Valid ObjectId | 404 if not found |
| Retry | POST | `/api/webhook-logs/{id}/retry` | `WEBHOOK_UPDATE` (own) or `WEBHOOK_UPDATE_ALL` | Valid ObjectId, status FAILED | 404 if not found, 400 if not failed |
| Export | GET | `/api/webhook-logs/export` | `WEBHOOK_LOG_READ` | Date range | 400 if invalid range |

---

## CRUD Operation Summary

### Permission Categories

| Category | Description | Example Permissions |
|----------|-------------|---------------------|
| **User Management** | Create, read, update, delete user accounts | `USER_CREATE`, `USER_READ`, `USER_UPDATE`, `USER_DELETE` |
| **Role Management** | Manage roles and permissions | `ROLE_CREATE`, `ROLE_READ`, `ROLE_UPDATE`, `ROLE_DELETE` |
| **Runbook Management** | Manage runbooks and versions | `RUNBOOK_CREATE`, `RUNBOOK_READ`, `RUNBOOK_UPDATE`, `RUNBOOK_DELETE` |
| **Incident Management** | Manage incidents and steps | `INCIDENT_CREATE`, `INCIDENT_READ`, `INCIDENT_UPDATE`, `INCIDENT_DELETE` |
| **Command Execution** | Execute commands and manage approvals | `COMMAND_EXECUTE`, `APPROVAL_REQUEST_APPROVE`, `EXECUTION_QUEUE_PROCESS` |
| **System Administration** | System settings, integrations, webhooks | `SYSTEM_SETTINGS_UPDATE`, `INTEGRATION_CREATE`, `WEBHOOK_CREATE` |
| **Audit & Logging** | Read audit logs and activity logs | `AUDIT_LOG_READ`, `ACTIVITY_LOG_READ`, `LOGIN_HISTORY_READ` |

### Common Error Codes

| Status Code | Description | Common Causes |
|-------------|-------------|----------------|
| 200 | Success | Operation completed successfully |
| 201 | Created | Document created successfully |
| 204 | No Content | Delete operation successful |
| 400 | Bad Request | Validation failed, invalid parameters |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Document does not exist |
| 409 | Conflict | Duplicate key, constraint violation |
| 422 | Unprocessable Entity | Business logic validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Validation Rules Summary

1. **Unique Constraints**: Email, username, runbook name, tag name, integration name, webhook name
2. **Foreign Key Validation**: All ObjectId references must exist in target collections
3. **Required Fields**: All required fields must be present and non-null
4. **Enum Validation**: Status, priority, type fields must use valid enum values
5. **Data Type Validation**: Fields must match specified data types
6. **Business Logic Validation**: Status transitions must follow allowed workflows

---

# Phase 10: CRUD Matrix for All Collections - COMPLETED

All CRUD operations have been documented for the 46 collections, including:
- Create, Read, Update, Delete operations for each collection
- HTTP method and endpoint mappings
- Required permissions for each operation
- Validation rules and error handling
- Special operations and workflows
- Permission categories and common error codes

The CRUD matrix provides a comprehensive reference for implementing REST API endpoints for the Runbook Following Agent application.

---

# Phase 13: Security Design

## Security Architecture Overview

This section documents the comprehensive security design for the Runbook Following Agent MongoDB database, including authentication, authorization, audit logging, encryption, and security best practices. The security design follows industry standards and implements defense-in-depth principles.

### Security Pillars

1. **Authentication**: Verify user identity through JWT tokens and session management
2. **Authorization**: Control access through Role-Based Access Control (RBAC)
3. **Audit**: Track all security-relevant events for compliance and forensics
4. **Encryption**: Protect data at rest and in transit
5. **Integrity**: Ensure data consistency and prevent tampering

---

## Authentication Design

### JWT Token Architecture

#### Token Structure

```javascript
// Access Token Payload
{
  "sub": "user_id",           // User ID
  "iat": 1234567890,          // Issued at timestamp
  "exp": 1234571490,          // Expiration timestamp (15 minutes)
  "iss": "runbook-agent",     // Issuer
  "aud": "runbook-api",       // Audience
  "roles": ["USER", "ADMIN"], // User roles
  "permissions": [           // User permissions
    "RUNBOOK_READ",
    "INCIDENT_CREATE"
  ],
  "jti": "unique_token_id"    // JWT ID for revocation
}

// Refresh Token Payload
{
  "sub": "user_id",
  "iat": 1234567890,
  "exp": 1237151890,          // Expiration (30 days)
  "iss": "runbook-agent",
  "aud": "runbook-api",
  "jti": "unique_refresh_id",
  "tokenVersion": 1           // For token invalidation
}
```

#### Token Storage

**Access Tokens:**
- Stored in memory (React state, Vuex/Pinia store)
- Not persisted to localStorage or sessionStorage
- Short-lived (15 minutes)
- Sent in Authorization header: `Bearer <token>`

**Refresh Tokens:**
- Stored in httpOnly, secure, sameSite cookies
- Long-lived (30 days)
- Automatically sent with requests
- Rotated on each refresh

#### Token Validation

```javascript
// Token Validation Process
1. Verify signature using RS256 algorithm
2. Check issuer (iss) matches expected value
3. Check audience (aud) matches expected value
4. Check expiration (exp) is not in the past
5. Check issued at (iat) is not in the future
6. Check token is not revoked (check Tokens collection)
7. Extract user roles and permissions
8. Validate user account is active (status = ACTIVE)
```

#### Token Revocation

**Revocation Triggers:**
- User logout
- User password change
- User account deactivation
- Admin token revocation
- Security incident response

**Revocation Implementation:**
```javascript
// On logout - delete token from database
db.Tokens.deleteOne({ jti: token.jti })

// On password change - invalidate all user tokens
db.Tokens.deleteMany({ userId: userId })

// On account deactivation - invalidate all tokens
db.Tokens.deleteMany({ userId: userId })

// Token validation check
const token = await db.Tokens.findOne({ jti: payload.jti })
if (!token) throw new Error('Token revoked')
```

---

### Password Security

#### Password Hashing

```javascript
// BCrypt Configuration
const saltRounds = 12
const hash = await bcrypt.hash(password, saltRounds)

// Password Verification
const isValid = await bcrypt.compare(password, hash)
```

#### Password Requirements

- Minimum length: 12 characters
- Maximum length: 128 characters
- Required: Uppercase letter
- Required: Lowercase letter
- Required: Number
- Required: Special character
- Forbidden: Common passwords (check against list)
- Forbidden: User information (username, email)

#### Password Reset Flow

```
1. User requests password reset
2. Generate reset token (random, 1-hour expiry)
3. Send reset link via email
4. User clicks link and enters new password
5. Validate reset token
6. Hash new password
7. Update user document
8. Invalidate all existing tokens
9. Send confirmation email
```

---

### Session Management

#### Session Lifecycle

```
Login → Create Session → Create Access Token → Create Refresh Token
       ↓
User Activity → Refresh Access Token (if expired)
       ↓
Logout → Delete Session → Delete Tokens
       ↓
Session Expiry → TTL Index Auto-Delete
```

#### Session Configuration

```javascript
// Session Collection Schema
{
  userId: ObjectId,
  token: String,           // Session token
  ipAddress: String,       // Client IP
  userAgent: String,       // Client user agent
  deviceType: String,      // mobile, desktop, tablet
  location: {
    country: String,
    city: String,
    latitude: Number,
    longitude: Number
  },
  createdAt: Date,
  expiresAt: Date,         // 24 hours from creation
  lastActivityAt: Date     // Updated on each request
}
```

#### Session Security

- IP address validation (optional, configurable)
- User agent validation (optional, configurable)
- Concurrent session limits (configurable per user)
- Session activity tracking
- Automatic session expiry (TTL index)

---

## Authorization Design (RBAC)

### Role-Based Access Control Architecture

#### Role Hierarchy

```
ADMIN (Full access)
├── SYSTEM_ADMIN (System configuration)
├── RUNBOOK_ADMIN (Runbook management)
├── INCIDENT_ADMIN (Incident management)
└── USER_ADMIN (User management)

OPERATOR (Operational access)
├── RUNBOOK_OPERATOR (Read/execute runbooks)
├── INCIDENT_OPERATOR (Create/manage incidents)
└── COMMAND_OPERATOR (Execute commands)

USER (Basic access)
├── RUNBOOK_USER (Read runbooks)
├── INCIDENT_USER (Create incidents)
└── READ_ONLY (Read-only access)
```

#### Permission Structure

```javascript
// Permission Categories
const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_READ_ALL: 'user:read:all',
  USER_UPDATE: 'user:update',
  USER_UPDATE_ALL: 'user:update:all',
  USER_DELETE: 'user:delete',
  USER_DELETE_ALL: 'user:delete:all',
  USER_RESET_PASSWORD: 'user:reset_password',

  // Role Management
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  ROLE_ASSIGN: 'role:assign',

  // Runbook Management
  RUNBOOK_CREATE: 'runbook:create',
  RUNBOOK_READ: 'runbook:read',
  RUNBOOK_UPDATE: 'runbook:update',
  RUNBOOK_UPDATE_ALL: 'runbook:update:all',
  RUNBOOK_DELETE: 'runbook:delete',
  RUNBOOK_DELETE_ALL: 'runbook:delete:all',
  RUNBOOK_PUBLISH: 'runbook:publish',

  // Incident Management
  INCIDENT_CREATE: 'incident:create',
  INCIDENT_READ: 'incident:read',
  INCIDENT_UPDATE: 'incident:update',
  INCIDENT_UPDATE_ALL: 'incident:update:all',
  INCIDENT_DELETE: 'incident:delete',
  INCIDENT_DELETE_ALL: 'incident:delete:all',
  INCIDENT_ASSIGN: 'incident:assign',
  INCIDENT_EXECUTE: 'incident:execute',

  // Command Execution
  COMMAND_EXECUTE: 'command:execute',
  COMMAND_EXECUTE_ALL: 'command:execute:all',
  APPROVAL_REQUEST_CREATE: 'approval_request:create',
  APPROVAL_REQUEST_APPROVE: 'approval_request:approve',
  APPROVAL_REQUEST_CANCEL: 'approval_request:cancel',
  EXECUTION_QUEUE_PROCESS: 'execution_queue:process',

  // System Administration
  SYSTEM_SETTINGS_READ: 'system_settings:read',
  SYSTEM_SETTINGS_UPDATE: 'system_settings:update',
  SYSTEM_SETTINGS_DELETE: 'system_settings:delete',
  INTEGRATION_CREATE: 'integration:create',
  INTEGRATION_READ: 'integration:read',
  INTEGRATION_UPDATE: 'integration:update',
  INTEGRATION_DELETE: 'integration:delete',
  WEBHOOK_CREATE: 'webhook:create',
  WEBHOOK_READ: 'webhook:read',
  WEBHOOK_UPDATE: 'webhook:update',
  WEBHOOK_DELETE: 'webhook:delete',

  // Audit & Logging
  AUDIT_LOG_READ: 'audit_log:read',
  ACTIVITY_LOG_READ: 'activity_log:read',
  LOGIN_HISTORY_READ: 'login_history:read',
  LOGIN_HISTORY_READ_ALL: 'login_history:read:all',
  FAILED_LOGIN_READ: 'failed_login:read',
  FAILED_LOGIN_READ_ALL: 'failed_login:read:all',
  FAILED_LOGIN_DELETE: 'failed_login:delete'
}
```

#### Permission Assignment

```javascript
// Role Permissions Mapping
const ROLE_PERMISSIONS = {
  ADMIN: [
    // All permissions
    ...Object.values(PERMISSIONS)
  ],
  SYSTEM_ADMIN: [
    PERMISSIONS.SYSTEM_SETTINGS_READ,
    PERMISSIONS.SYSTEM_SETTINGS_UPDATE,
    PERMISSIONS.SYSTEM_SETTINGS_DELETE,
    PERMISSIONS.INTEGRATION_CREATE,
    PERMISSIONS.INTEGRATION_READ,
    PERMISSIONS.INTEGRATION_UPDATE,
    PERMISSIONS.INTEGRATION_DELETE,
    PERMISSIONS.WEBHOOK_CREATE,
    PERMISSIONS.WEBHOOK_READ,
    PERMISSIONS.WEBHOOK_UPDATE,
    PERMISSIONS.WEBHOOK_DELETE,
    PERMISSIONS.AUDIT_LOG_READ,
    PERMISSIONS.ACTIVITY_LOG_READ,
    PERMISSIONS.LOGIN_HISTORY_READ_ALL,
    PERMISSIONS.FAILED_LOGIN_READ_ALL,
    PERMISSIONS.FAILED_LOGIN_DELETE
  ],
  RUNBOOK_ADMIN: [
    PERMISSIONS.RUNBOOK_CREATE,
    PERMISSIONS.RUNBOOK_READ,
    PERMISSIONS.RUNBOOK_UPDATE_ALL,
    PERMISSIONS.RUNBOOK_DELETE_ALL,
    PERMISSIONS.RUNBOOK_PUBLISH
  ],
  INCIDENT_ADMIN: [
    PERMISSIONS.INCIDENT_CREATE,
    PERMISSIONS.INCIDENT_READ,
    PERMISSIONS.INCIDENT_UPDATE_ALL,
    PERMISSIONS.INCIDENT_DELETE_ALL,
    PERMISSIONS.INCIDENT_ASSIGN,
    PERMISSIONS.INCIDENT_EXECUTE
  ],
  USER_ADMIN: [
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ_ALL,
    PERMISSIONS.USER_UPDATE_ALL,
    PERMISSIONS.USER_DELETE_ALL,
    PERMISSIONS.USER_RESET_PASSWORD,
    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_READ,
    PERMISSIONS.ROLE_UPDATE,
    PERMISSIONS.ROLE_DELETE,
    PERMISSIONS.ROLE_ASSIGN
  ],
  OPERATOR: [
    PERMISSIONS.RUNBOOK_READ,
    PERMISSIONS.RUNBOOK_UPDATE,
    PERMISSIONS.INCIDENT_CREATE,
    PERMISSIONS.INCIDENT_READ,
    PERMISSIONS.INCIDENT_UPDATE,
    PERMISSIONS.INCIDENT_EXECUTE,
    PERMISSIONS.COMMAND_EXECUTE,
    PERMISSIONS.APPROVAL_REQUEST_CREATE,
    PERMISSIONS.APPROVAL_REQUEST_APPROVE
  ],
  USER: [
    PERMISSIONS.RUNBOOK_READ,
    PERMISSIONS.INCIDENT_CREATE,
    PERMISSIONS.INCIDENT_READ,
    PERMISSIONS.INCIDENT_UPDATE
  ],
  READ_ONLY: [
    PERMISSIONS.RUNBOOK_READ,
    PERMISSIONS.INCIDENT_READ
  ]
}
```

#### Permission Check Implementation

```javascript
// Middleware Permission Check
async function checkPermission(permission) {
  return async (req, res, next) => {
    try {
      const user = await getUserFromToken(req)
      const userRoles = await getUserRoles(user._id)
      const userPermissions = await getUserPermissions(userRoles)

      if (userPermissions.includes(permission)) {
        next()
      } else {
        res.status(403).json({ error: 'Insufficient permissions' })
      }
    } catch (error) {
      res.status(401).json({ error: 'Authentication required' })
    }
  }
}

// Usage in Routes
router.post('/api/runbooks', 
  authenticate,
  checkPermission(PERMISSIONS.RUNBOOK_CREATE),
  createRunbookHandler
)
```

#### Resource-Based Authorization

```javascript
// Check if user owns resource
async function checkResourceOwnership(collection, resourceIdField) {
  return async (req, res, next) => {
    try {
      const user = await getUserFromToken(req)
      const resource = await db[collection].findOne({
        _id: req.params.id
      })

      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' })
      }

      // Admin can access all resources
      if (user.roles.includes('ADMIN')) {
        req.resource = resource
        return next()
      }

      // Check ownership
      if (resource[resourceIdField].toString() === user._id.toString()) {
        req.resource = resource
        next()
      } else {
        res.status(403).json({ error: 'Access denied' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Authorization check failed' })
    }
  }
}

// Usage
router.put('/api/runbooks/:id',
  authenticate,
  checkPermission(PERMISSIONS.RUNBOOK_UPDATE),
  checkResourceOwnership('Runbooks', 'createdBy'),
  updateRunbookHandler
)
```

---

## Audit Logging Design

### Audit Event Categories

```javascript
const AUDIT_CATEGORIES = {
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  USER_MANAGEMENT: 'USER_MANAGEMENT',
  ROLE_MANAGEMENT: 'ROLE_MANAGEMENT',
  RUNBOOK_MANAGEMENT: 'RUNBOOK_MANAGEMENT',
  INCIDENT_MANAGEMENT: 'INCIDENT_MANAGEMENT',
  COMMAND_EXECUTION: 'COMMAND_EXECUTION',
  SYSTEM_CONFIGURATION: 'SYSTEM_CONFIGURATION',
  DATA_ACCESS: 'DATA_ACCESS',
  SECURITY_EVENT: 'SECURITY_EVENT'
}

const AUDIT_ACTIONS = {
  // Authentication
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOGIN_FAILED: 'LOGIN_FAILED',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  TOKEN_REVOKED: 'TOKEN_REVOKED',

  // User Management
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
  USER_DEACTIVATED: 'USER_DEACTIVATED',
  USER_REACTIVATED: 'USER_REACTIVATED',

  // Role Management
  ROLE_CREATED: 'ROLE_CREATED',
  ROLE_UPDATED: 'ROLE_UPDATED',
  ROLE_DELETED: 'ROLE_DELETED',
  ROLE_ASSIGNED: 'ROLE_ASSIGNED',
  ROLE_REVOKED: 'ROLE_REVOKED',

  // Runbook Management
  RUNBOOK_CREATED: 'RUNBOOK_CREATED',
  RUNBOOK_UPDATED: 'RUNBOOK_UPDATED',
  RUNBOOK_DELETED: 'RUNBOOK_DELETED',
  RUNBOOK_PUBLISHED: 'RUNBOOK_PUBLISHED',
  RUNBOOK_ARCHIVED: 'RUNBOOK_ARCHIVED',

  // Incident Management
  INCIDENT_CREATED: 'INCIDENT_CREATED',
  INCIDENT_UPDATED: 'INCIDENT_UPDATED',
  INCIDENT_DELETED: 'INCIDENT_DELETED',
  INCIDENT_ASSIGNED: 'INCIDENT_ASSIGNED',
  INCIDENT_STATUS_CHANGED: 'INCIDENT_STATUS_CHANGED',

  // Command Execution
  COMMAND_EXECUTED: 'COMMAND_EXECUTED',
  COMMAND_APPROVED: 'COMMAND_APPROVED',
  COMMAND_REJECTED: 'COMMAND_REJECTED',
  COMMAND_FAILED: 'COMMAND_FAILED',

  // System Configuration
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',
  INTEGRATION_CONFIGURED: 'INTEGRATION_CONFIGURED',
  WEBHOOK_CONFIGURED: 'WEBHOOK_CONFIGURED',

  // Data Access
  DATA_EXPORTED: 'DATA_EXPORTED',
  DATA_IMPORTED: 'DATA_IMPORTED',
  SENSITIVE_DATA_ACCESSED: 'SENSITIVE_DATA_ACCESSED',

  // Security Events
  SECURITY_ALERT: 'SECURITY_ALERT',
  UNAUTHORIZED_ACCESS_ATTEMPT: 'UNAUTHORIZED_ACCESS_ATTEMPT',
  PRIVILEGE_ESCALATION: 'PRIVILEGE_ESCALATION',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY'
}
```

### Audit Log Structure

```javascript
// AuditLogs Collection Schema
{
  _id: ObjectId,
  userId: ObjectId,              // User who performed the action
  username: String,             // Username (for quick reference)
  action: String,               // Action performed
  category: String,             // Category of action
  entityType: String,           // Type of entity affected
  entityId: ObjectId,           // ID of entity affected
  entityName: String,           // Name of entity (for quick reference)
  description: String,          // Human-readable description
  ipAddress: String,            // Client IP address
  userAgent: String,            // Client user agent
  requestMethod: String,        // HTTP method
  requestPath: String,          // Request path
  requestParams: Object,        // Request parameters (sanitized)
  changes: {                    // Before/after changes
    before: Object,             // State before change
    after: Object               // State after change
  },
  result: String,               // SUCCESS, FAILURE, PARTIAL
  errorMessage: String,        // Error message if failed
  timestamp: Date,              // Event timestamp
  sessionId: ObjectId,          // Session ID
  correlationId: String        // Request correlation ID
}
```

### Audit Log Implementation

```javascript
// Audit Logger Middleware
async function auditLogger(action, category) {
  return async (req, res, next) => {
    const startTime = Date.now()
    const originalSend = res.send

    res.send = function(data) {
      res.send = originalSend
      const duration = Date.now() - startTime
      const result = res.statusCode >= 200 && res.statusCode < 300 ? 'SUCCESS' : 'FAILURE'

      // Log audit event
      db.AuditLogs.insertOne({
        userId: req.user?._id,
        username: req.user?.username,
        action: action,
        category: category,
        entityType: req.params.entityType,
        entityId: req.params.id,
        description: `${action} on ${req.params.entityType}`,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        requestMethod: req.method,
        requestPath: req.path,
        requestParams: sanitizeParams(req.params),
        result: result,
        timestamp: new Date(),
        sessionId: req.session?._id,
        correlationId: req.id
      })

      res.send(data)
    }

    next()
  }
}

// Usage
router.post('/api/users',
  authenticate,
  auditLogger(AUDIT_ACTIONS.USER_CREATED, AUDIT_CATEGORIES.USER_MANAGEMENT),
  createUserHandler
)
```

### Audit Log Retention

- **Critical Events**: 7 years (compliance requirements)
- **Security Events**: 5 years
- **User Management Events**: 3 years
- **Configuration Changes**: 2 years
- **Data Access Events**: 1 year
- **General Events**: 90 days

---

## Encryption Design

### Encryption at Rest

#### Field-Level Encryption

```javascript
// Encrypted Fields
const ENCRYPTED_FIELDS = {
  Users: ['email', 'phoneNumber'],
  APIKeys: ['key'],
  IntegrationConfig: ['apiKey', 'apiSecret', 'webhookUrl'],
  Webhooks: ['secret'],
  MachineInfo: ['sshKey', 'password']
}

// Encryption Implementation using AES-256-GCM
const crypto = require('crypto')

function encrypt(text, key) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag()
  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    data: encrypted
  }
}

function decrypt(encryptedData, key) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(encryptedData.iv, 'hex')
  )
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))
  let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
```

#### Key Management

```javascript
// Key Rotation Strategy
const KEY_VERSIONS = {
  current: 1,
  keys: {
    1: process.env.ENCRYPTION_KEY_V1,
    2: process.env.ENCRYPTION_KEY_V2
  }
}

// Encryption with versioning
function encryptWithVersion(text, keyVersion = KEY_VERSIONS.current) {
  const key = KEY_VERSIONS.keys[keyVersion]
  const encrypted = encrypt(text, key)
  return {
    ...encrypted,
    keyVersion: keyVersion
  }
}

// Decryption with version support
function decryptWithVersion(encryptedData) {
  const key = KEY_VERSIONS.keys[encryptedData.keyVersion]
  return decrypt(encryptedData, key)
}
```

### Encryption in Transit

#### TLS Configuration

```javascript
// HTTPS Configuration
const tlsOptions = {
  key: fs.readFileSync('/path/to/private.key'),
  cert: fs.readFileSync('/path/to/certificate.crt'),
  ca: fs.readFileSync('/path/to/ca-bundle.crt'),
  minVersion: 'TLSv1.2',
  maxVersion: 'TLSv1.3',
  ciphers: [
    'ECDHE-ECDSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-ECDSA-CHACHA20-POLY1305',
    'ECDHE-RSA-CHACHA20-POLY1305'
  ],
  honorCipherOrder: true,
  rejectUnauthorized: true
}
```

#### MongoDB TLS Configuration

```javascript
// MongoDB Connection with TLS
const mongoOptions = {
  tls: true,
  tlsCAFile: '/path/to/mongodb-ca.pem',
  tlsCertificateKeyFile: '/path/to/mongodb-client.pem',
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  sslValidate: true
}
```

---

## Security Best Practices

### Input Validation

```javascript
// Input Sanitization
const { body, validationResult } = require('express-validator')

const userValidationRules = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .trim(),
  body('username')
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .trim(),
  body('password')
    .isLength({ min: 12, max: 128 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
]

// Validation Middleware
function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}
```

### SQL/NoSQL Injection Prevention

```javascript
// MongoDB Injection Prevention
// Always use parameterized queries
const safeQuery = {
  username: req.body.username,
  status: 'ACTIVE'
}

// Never use this (vulnerable to injection)
const unsafeQuery = {
  username: req.body.username,
  $where: `this.username === '${req.body.username}'`
}
```

### XSS Prevention

```javascript
// Output Encoding
const escape = require('escape-html')

function sanitizeOutput(data) {
  if (typeof data === 'string') {
    return escape(data)
  }
  if (typeof data === 'object') {
    for (const key in data) {
      data[key] = sanitizeOutput(data[key])
    }
  }
  return data
}
```

### CSRF Protection

```javascript
// CSRF Token Implementation
const csrf = require('csurf')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(csrf({ cookie: true }))

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

// Include CSRF token in requests
app.post('/api/users', (req, res) => {
  // CSRF token automatically validated
})
```

### Rate Limiting

```javascript
// Rate Limiting Configuration
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true
})

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later'
})

app.post('/api/auth/login', loginLimiter, loginHandler)
app.use('/api/', apiLimiter)
```

### Security Headers

```javascript
// Security Headers Middleware
const helmet = require('helmet')

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true
}))
```

---

## Compliance Considerations

### GDPR Compliance

- **Data Minimization**: Collect only necessary data
- **Right to Access**: Users can request their data
- **Right to Deletion**: Users can request account deletion
- **Data Portability**: Export user data on request
- **Consent Management**: Track user consent for data processing

### SOC 2 Compliance

- **Access Control**: Implement least privilege access
- **Audit Logging**: Comprehensive audit trail
- **Change Management**: Track all configuration changes
- **Incident Response**: Document security incidents
- **Data Encryption**: Encrypt sensitive data at rest and in transit

### HIPAA Compliance (if applicable)

- **PHI Protection**: Encrypt protected health information
- **Access Logs**: Track all PHI access
- **Business Associate Agreements**: Document vendor relationships
- **Risk Assessment**: Regular security risk assessments

---

## Security Monitoring

### Security Metrics

```javascript
// Security Metrics to Monitor
const SECURITY_METRICS = {
  failedLoginAttempts: 'Failed login attempts per hour',
  successfulLogins: 'Successful logins per hour',
  permissionDenials: 'Permission denials per hour',
  suspiciousActivity: 'Suspicious activity events',
  dataAccessEvents: 'Sensitive data access events',
  configurationChanges: 'Configuration changes per day',
  commandExecutions: 'Command executions per hour',
  approvalRequests: 'Approval requests per day',
  securityAlerts: 'Security alerts per day'
}
```

### Alert Thresholds

```javascript
// Alert Configuration
const ALERT_THRESHOLDS = {
  failedLoginAttempts: {
    warning: 5,
    critical: 10,
    window: '1 hour'
  },
  permissionDenials: {
    warning: 20,
    critical: 50,
    window: '1 hour'
  },
  suspiciousActivity: {
    warning: 1,
    critical: 3,
    window: '1 hour'
  }
}
```

---

# Phase 13: Security Design - COMPLETED

The security design has been documented comprehensively, including:
- JWT token architecture and management
- Password security and hashing
- Session management and security
- Role-Based Access Control (RBAC) implementation
- Permission checking and resource-based authorization
- Audit logging design and implementation
- Encryption at rest and in transit
- Security best practices (input validation, XSS, CSRF, rate limiting)
- Security headers and configuration
- Compliance considerations (GDPR, SOC 2, HIPAA)
- Security monitoring and alerting

The security design provides a robust foundation for protecting the Runbook Following Agent application and its data.

---

# Phase 14: Complete Documentation and Best Practices

## Documentation Overview

This section provides comprehensive documentation and best practices for the Runbook Following Agent MongoDB database design, including implementation guidelines, deployment considerations, maintenance procedures, and operational best practices.

---

## Implementation Guidelines

### Database Initialization

```javascript
// Database Initialization Script
const { MongoClient } = require('mongodb')

async function initializeDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('runbook-agent')
    
    // Create all collections with validators
    await createCollections(db)
    
    // Create all indexes
    await createIndexes(db)
    
    // Insert initial data
    await insertInitialData(db)
    
    console.log('Database initialized successfully')
  } finally {
    await client.close()
  }
}

async function createCollections(db) {
  const collections = [
    'Users', 'Roles', 'Sessions', 'Tokens', 'RefreshTokens',
    'UserPreferences', 'APIKeys', 'SystemSettings', 'Runbooks',
    'RunbookVersions', 'RunbookChunks', 'EmbeddingMetadata',
    'IncidentAttachments', 'Bookmarks', 'SavedIncidents', 'Favorites',
    'Incidents', 'IncidentSteps', 'Chats', 'AIMemory', 'Feedback',
    'SearchHistory', 'AuditLogs', 'ActivityLogs', 'LoginHistory',
    'FailedLoginAttempts', 'CommandWhitelist', 'BlockedCommands',
    'ApprovalRequests', 'ExecutionQueue', 'CommandHistory',
    'ExecutionLogs', 'MachineInfo', 'ExecutionResults', 'Notifications',
    'NotificationPreferences', 'Tags', 'RunbookTags', 'IncidentTags',
    'RolePermissions', 'UserRoles', 'SystemMetrics', 'IntegrationConfig',
    'IntegrationLogs', 'Webhooks', 'WebhookLogs'
  ]
  
  for (const collectionName of collections) {
    const exists = await db.listCollections({ name: collectionName }).hasNext()
    if (!exists) {
      await db.createCollection(collectionName)
      console.log(`Created collection: ${collectionName}`)
    }
  }
}
```

### Connection Management

```javascript
// MongoDB Connection Pool Configuration
const mongoOptions = {
  maxPoolSize: 100,              // Maximum connections in pool
  minPoolSize: 10,               // Minimum connections in pool
  maxIdleTimeMS: 60000,          // Close idle connections after 60s
  waitQueueTimeoutMS: 5000,      // Wait 5s for available connection
  retryWrites: true,             // Retry failed writes
  retryReads: true,              // Retry failed reads
  serverSelectionTimeoutMS: 5000, // Server selection timeout
  socketTimeoutMS: 45000,       // Socket timeout
  connectTimeoutMS: 10000,      // Connection timeout
  compressors: ['zlib'],         // Enable compression
  zlibCompressionLevel: 6        // Compression level
}

// Connection String
const connectionString = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?${new URLSearchParams(mongoOptions)}`
```

### Transaction Management

```javascript
// Transaction Example
async function executeTransaction(operations) {
  const session = client.startSession()
  
  try {
    await session.withTransaction(async () => {
      for (const operation of operations) {
        await operation(session)
      }
    })
    return { success: true }
  } catch (error) {
    console.error('Transaction failed:', error)
    return { success: false, error: error.message }
  } finally {
    await session.endSession()
  }
}

// Usage
const operations = [
  async (session) => {
    await db.collection('Users').updateOne(
      { _id: userId },
      { $set: { status: 'ACTIVE' } },
      { session }
    )
  },
  async (session) => {
    await db.collection('AuditLogs').insertOne(
      { userId, action: 'USER_REACTIVATED', timestamp: new Date() },
      { session }
    )
  }
]

const result = await executeTransaction(operations)
```

---

## Deployment Considerations

### Environment Configuration

```javascript
// Development Environment
const devConfig = {
  mongodb: {
    uri: 'mongodb://localhost:27017/runbook-agent-dev',
    poolSize: 10,
    ssl: false
  },
  redis: {
    host: 'localhost',
    port: 6379
  },
  logging: {
    level: 'debug'
  }
}

// Production Environment
const prodConfig = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    poolSize: 100,
    ssl: true,
    replicaSet: process.env.MONGODB_REPLICA_SET
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  },
  logging: {
    level: 'info'
  }
}
```

### Replica Set Configuration

```javascript
// Replica Set Setup
const replicaSetConfig = {
  name: 'runbook-agent-rs',
  members: [
    { host: 'mongodb-1.example.com', port: 27017, priority: 2 }, // Primary
    { host: 'mongodb-2.example.com', port: 27017, priority: 1 }, // Secondary
    { host: 'mongodb-3.example.com', port: 27017, priority: 1 }, // Secondary
    { host: 'mongodb-4.example.com', port: 27017, priority: 0, arbiterOnly: true } // Arbiter
  ]
}

// Connection String with Replica Set
const connectionString = `mongodb://mongodb-1.example.com:27017,mongodb-2.example.com:27017,mongodb-3.example.com:27017/runbook-agent?replicaSet=runbook-agent-rs&readPreference=primaryPreferred&retryWrites=true`
```

### Sharding Strategy

```javascript
// Sharding Configuration
const shardingConfig = {
  // Shard by userId for user-related collections
  Users: { shardKey: { _id: 1 }, strategy: 'hashed' },
  Sessions: { shardKey: { userId: 1 }, strategy: 'hashed' },
  Tokens: { shardKey: { userId: 1 }, strategy: 'hashed' },
  
  // Shard by incidentId for incident-related collections
  Incidents: { shardKey: { _id: 1 }, strategy: 'hashed' },
  IncidentSteps: { shardKey: { incidentId: 1 }, strategy: 'hashed' },
  Chats: { shardKey: { incidentId: 1 }, strategy: 'hashed' },
  
  // Shard by runbookId for runbook-related collections
  Runbooks: { shardKey: { _id: 1 }, strategy: 'hashed' },
  RunbookVersions: { shardKey: { runbookId: 1 }, strategy: 'hashed' },
  RunbookChunks: { shardKey: { runbookId: 1 }, strategy: 'hashed' },
  
  // Shard by timestamp for time-series collections
  AuditLogs: { shardKey: { timestamp: 1 }, strategy: 'range' },
  ActivityLogs: { shardKey: { timestamp: 1 }, strategy: 'range' },
  SystemMetrics: { shardKey: { timestamp: 1 }, strategy: 'range' }
}
```

### Backup Strategy

```javascript
// Backup Script
const { exec } = require('child_process')

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = `/backups/runbook-agent-${timestamp}`
  
  const command = `mongodump --uri="${process.env.MONGODB_URI}" --out="${backupPath}"`
  
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve({ backupPath, timestamp })
      }
    })
  })
}

// Restore Script
async function restoreBackup(backupPath) {
  const command = `mongorestore --uri="${process.env.MONGODB_URI}" "${backupPath}"`
  
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve({ success: true })
      }
    })
  })
}
```

---

## Maintenance Procedures

### Index Maintenance

```javascript
// Index Rebuild Script
async function rebuildIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('runbook-agent')
    const collections = await db.listCollections().toArray()
    
    for (const collection of collections) {
      const coll = db.collection(collection.name)
      const indexes = await coll.indexes()
      
      for (const index of indexes) {
        if (index.name !== '_id_') {
          await coll.dropIndex(index.name)
          console.log(`Dropped index: ${collection.name}.${index.name}`)
        }
      }
      
      // Recreate indexes based on collection design
      await createIndexesForCollection(db, collection.name)
    }
    
    console.log('Index rebuild completed')
  } finally {
    await client.close()
  }
}

// Index Statistics
async function getIndexStats() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('runbook-agent')
    const collections = await db.listCollections().toArray()
    
    for (const collection of collections) {
      const coll = db.collection(collection.name)
      const stats = await coll.indexStats().toArray()
      
      console.log(`\n${collection.name} Index Statistics:`)
      for (const stat of stats) {
        console.log(`  ${stat.name}: ${stat.accesses.ops} ops, size: ${stat.size} bytes`)
      }
    }
  } finally {
    await client.close()
  }
}
```

### Data Cleanup

```javascript
// Data Cleanup Script
async function cleanupOldData() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('runbook-agent')
    
    // Cleanup based on TTL index expiration
    const cleanupTasks = [
      // Sessions older than 24 hours
      db.collection('Sessions').deleteMany({ 
        expiresAt: { $lt: new Date() } 
      }),
      
      // Tokens older than 30 days
      db.collection('Tokens').deleteMany({ 
        expiresAt: { $lt: new Date() } 
      }),
      
      // Refresh tokens older than 30 days
      db.collection('RefreshTokens').deleteMany({ 
        expiresAt: { $lt: new Date() } 
      }),
      
      // Chat history older than 1 year
      db.collection('Chats').deleteMany({ 
        createdAt: { $lt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } 
      }),
      
      // Search history older than 90 days
      db.collection('SearchHistory').deleteMany({ 
        createdAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } 
      }),
      
      // Activity logs older than 90 days
      db.collection('ActivityLogs').deleteMany({ 
        createdAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } 
      }),
      
      // Failed login attempts older than 30 days
      db.collection('FailedLoginAttempts').deleteMany({ 
        attemptedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      }),
      
      // Notifications older than 30 days
      db.collection('Notifications').deleteMany({ 
        createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      }),
      
      // System metrics older than 90 days
      db.collection('SystemMetrics').deleteMany({ 
        timestamp: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } 
      }),
      
      // Integration logs older than 90 days
      db.collection('IntegrationLogs').deleteMany({ 
        timestamp: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } 
      }),
      
      // Webhook logs older than 90 days
      db.collection('WebhookLogs').deleteMany({ 
        timestamp: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } 
      })
    ]
    
    const results = await Promise.all(cleanupTasks)
    console.log('Data cleanup completed', results)
  } finally {
    await client.close()
  }
}
```

### Statistics Collection

```javascript
// Database Statistics
async function getDatabaseStats() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('runbook-agent')
    const stats = await db.stats()
    
    console.log('Database Statistics:')
    console.log(`  Collections: ${stats.collections}`)
    console.log(`  Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  Total Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  Average Object Size: ${stats.avgObjSize} bytes`)
    
    // Collection-specific stats
    const collections = await db.listCollections().toArray()
    for (const collection of collections) {
      const collStats = await db.collection(collection.name).stats()
      console.log(`\n${collection.name}:`)
      console.log(`  Documents: ${collStats.count}`)
      console.log(`  Size: ${(collStats.size / 1024 / 1024).toFixed(2)} MB`)
      console.log(`  Avg Object Size: ${collStats.avgObjSize} bytes`)
      console.log(`  Indexes: ${collStats.nindexes}`)
    }
  } finally {
    await client.close()
  }
}
```

---

## Performance Best Practices

### Query Optimization

```javascript
// Best Practice 1: Use Covered Queries
// Instead of:
db.Users.find({ email: 'user@example.com' }, { username: 1, status: 1 })

// Create a covered query index:
db.Users.createIndex({ email: 1, username: 1, status: 1 })

// Best Practice 2: Use Projection to Limit Fields
// Instead of:
db.Users.find({ status: 'ACTIVE' })

// Use projection:
db.Users.find({ status: 'ACTIVE' }, { username: 1, email: 1, _id: 0 })

// Best Practice 3: Use Pagination
// Instead of:
db.Runbooks.find({ status: 'PUBLISHED' }).toArray()

// Use pagination:
db.Runbooks.find({ status: 'PUBLISHED' })
  .skip(0)
  .limit(20)
  .toArray()

// Best Practice 4: Use Explain to Analyze Queries
const explain = db.Incidents.find({ status: 'OPEN', priority: 'HIGH' }).explain()
console.log(explain.executionStats)

// Best Practice 5: Use Aggregation for Complex Queries
db.Incidents.aggregate([
  { $match: { status: 'OPEN' } },
  { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
])
```

### Bulk Operations

```javascript
// Bulk Insert
async function bulkInsertDocuments(collectionName, documents) {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('runbook-agent')
    const collection = db.collection(collectionName)
    
    const result = await collection.insertMany(documents, {
      ordered: false, // Continue on error
      writeConcern: { w: 'majority' }
    })
    
    console.log(`Inserted ${result.insertedCount} documents`)
    return result
  } finally {
    await client.close()
  }
}

// Bulk Update
async function bulkUpdateDocuments(collectionName, updates) {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('runbook-agent')
    const collection = db.collection(collectionName)
    
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update._id },
        update: { $set: update.changes }
      }
    }))
    
    const result = await collection.bulkWrite(bulkOps, {
      ordered: false,
      writeConcern: { w: 'majority' }
    })
    
    console.log(`Updated ${result.modifiedCount} documents`)
    return result
  } finally {
    await client.close()
  }
}
```

### Caching Strategy

```javascript
// Redis Caching Implementation
const Redis = require('ioredis')
const redis = new Redis()

async function getCachedData(key, fetchFunction, ttl = 300) {
  // Try to get from cache
  const cached = await redis.get(key)
  if (cached) {
    return JSON.parse(cached)
  }
  
  // Fetch from database
  const data = await fetchFunction()
  
  // Cache the result
  await redis.setex(key, ttl, JSON.stringify(data))
  
  return data
}

// Usage
async function getUserWithCache(userId) {
  const cacheKey = `user:${userId}`
  return getCachedData(cacheKey, async () => {
    return db.Users.findOne({ _id: userId })
  }, 300) // 5 minutes TTL
}

// Cache Invalidation
async function invalidateUserCache(userId) {
  await redis.del(`user:${userId}`)
}
```

---

## Monitoring and Alerting

### Health Checks

```javascript
// Database Health Check
async function healthCheck() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('runbook-agent')
    
    // Check server status
    const serverStatus = await db.admin().serverStatus()
    
    // Check connection pool
    const poolStats = await db.admin().currentOp()
    
    // Check replication status
    const replStatus = await db.admin().replSetGetStatus()
    
    return {
      status: 'healthy',
      serverStatus: {
        connections: serverStatus.connections,
        uptime: serverStatus.uptime
      },
      poolStats: {
        active: poolStats.length
      },
      replication: {
        state: replStatus.myState,
        members: replStatus.members.length
      }
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    }
  } finally {
    await client.close()
  }
}
```

### Performance Monitoring

```javascript
// Slow Query Monitoring
async function monitorSlowQueries() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('runbook-agent')
    
    // Enable slow query logging
    await db.admin().command({
      setParameter: 1,
      slowms: 100 // Log queries slower than 100ms
    })
    
    // Get slow query stats
    const slowQueries = await db.admin().command({
      profile: 2 // Log all operations
    })
    
    console.log('Slow Queries:', slowQueries)
  } finally {
    await client.close()
  }
}

// Connection Pool Monitoring
async function monitorConnectionPool() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const pool = client.topology.s.pool
    
    console.log('Connection Pool Status:')
    console.log(`  Total Connections: ${pool.totalConnectionCount}`)
    console.log(`  Available Connections: ${pool.availableConnectionCount}`)
    console.log(`  Active Connections: ${pool.activeConnectionCount}`)
    console.log(`  Wait Queue Size: ${pool.waitQueueSize}`)
  } finally {
    await client.close()
  }
}
```

---

## Disaster Recovery

### Failover Procedure

```javascript
// Automatic Failover Configuration
const failoverConfig = {
  readPreference: 'primaryPreferred',
  replicaSet: 'runbook-agent-rs',
  retryWrites: true,
  retryReads: true,
  maxStalenessSeconds: 120,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000
}

// Manual Failover Trigger
async function triggerFailover() {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const admin = client.db('admin')
    
    // Step down primary
    await admin.command({
      replSetStepDown: 60,
      force: true
    })
    
    console.log('Failover triggered successfully')
  } finally {
    await client.close()
  }
}
```

### Point-in-Time Recovery

```javascript
// Point-in-Time Recovery Script
async function pointInTimeRecovery(targetTimestamp) {
  const client = new MongoClient(process.env.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('runbook-agent')
    
    // Get oplog timestamp
    const oplog = client.db('local').collection('oplog.rs')
    const oplogEntry = await oplog.findOne({
      ts: { $lte: new Timestamp(0, Math.floor(targetTimestamp / 1000)) }
    }, { sort: { ts: -1 } })
    
    if (!oplogEntry) {
      throw new Error('Oplog entry not found for timestamp')
    }
    
    // Restore from backup
    await restoreBackup('/backups/latest')
    
    // Apply oplog entries
    await applyOplogEntries(oplogEntry.ts)
    
    console.log('Point-in-time recovery completed')
  } finally {
    await client.close()
  }
}
```

---

## Security Best Practices

### Network Security

```javascript
// IP Whitelist Configuration
const ipWhitelist = [
  '10.0.0.0/8',    // Internal network
  '172.16.0.0/12', // Private network
  '192.168.0.0/16' // Private network
]

// IP Validation Middleware
function validateIP(req, ipWhitelist) {
  const clientIP = req.ip
  const isAllowed = ipWhitelist.some(range => {
    return ipRangeCheck(clientIP, range)
  })
  
  if (!isAllowed) {
    throw new Error('IP address not whitelisted')
  }
}

// MongoDB IP Whitelist (Atlas)
const atlasIPWhitelist = {
  comment: 'Application servers',
  ipAddress: '10.0.0.0/8',
  status: 'active'
}
```

### Data Masking

```javascript
// Data Masking for Logs
function maskSensitiveData(data) {
  const masked = { ...data }
  
  // Mask email
  if (masked.email) {
    masked.email = masked.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
  }
  
  // Mask API keys
  if (masked.apiKey) {
    masked.apiKey = masked.apiKey.substring(0, 8) + '...'
  }
  
  // Mask tokens
  if (masked.token) {
    masked.token = masked.token.substring(0, 16) + '...'
  }
  
  return masked
}

// Usage in logging
console.log('User data:', maskSensitiveData(userData))
```

---

## Testing Guidelines

### Unit Testing

```javascript
// MongoDB Unit Test Example
const { MongoClient } = require('mongodb')
const { MongoMemoryServer } = require('mongodb-memory-server')

describe('User Repository Tests', () => {
  let mongod
  let client
  let db
  
  beforeAll(async () => {
    mongod = await MongoMemoryServer.start()
    const uri = mongod.getUri()
    client = new MongoClient(uri)
    await client.connect()
    db = client.db('test')
  })
  
  afterAll(async () => {
    await client.close()
    await mongod.stop()
  })
  
  beforeEach(async () => {
    await db.collection('Users').deleteMany({})
  })
  
  test('should create user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword'
    }
    
    const result = await db.collection('Users').insertOne(userData)
    expect(result.insertedCount).toBe(1)
  })
})
```

### Integration Testing

```javascript
// Integration Test Example
describe('Incident Management Integration Tests', () => {
  test('should create incident with steps', async () => {
    const session = client.startSession()
    
    try {
      await session.withTransaction(async () => {
        // Create incident
        const incident = await db.collection('Incidents').insertOne({
          title: 'Test Incident',
          status: 'OPEN',
          createdAt: new Date()
        }, { session })
        
        // Create steps
        await db.collection('IncidentSteps').insertOne({
          incidentId: incident.insertedId,
          stepNumber: 1,
          description: 'Test step',
          status: 'PENDING'
        }, { session })
      })
      
      // Verify
      const incidentCount = await db.collection('Incidents').countDocuments()
      expect(incidentCount).toBe(1)
    } finally {
      await session.endSession()
    }
  })
})
```

---

## Documentation Standards

### Code Documentation

```javascript
/**
 * Creates a new user in the database
 * @param {Object} userData - User data object
 * @param {string} userData.username - User's username (3-50 characters)
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's hashed password
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @returns {Promise<Object>} Created user document
 * @throws {Error} If validation fails or user already exists
 * @example
 * const user = await createUser({
 *   username: 'john_doe',
 *   email: 'john@example.com',
 *   password: 'hashedPassword123',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * })
 */
async function createUser(userData) {
  // Implementation
}
```

### API Documentation

```javascript
/**
 * @api {post} /api/users Create a new user
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} Authorization JWT access token
 *
 * @apiParam {String} username User's username (3-50 characters)
 * @apiParam {String} email User's email address
 * @apiParam {String} password User's password (min 12 characters)
 * @apiParam {String} firstName User's first name
 * @apiParam {String} lastName User's last name
 *
 * @apiSuccess {String} _id User ID
 * @apiSuccess {String} username User's username
 * @apiSuccess {String} email User's email
 * @apiSuccess {String} status User's status
 * @apiSuccess {Date} createdAt Creation timestamp
 *
 * @apiError 400 Bad Request - Validation failed
 * @apiError 409 Conflict - User already exists
 * @apiError 500 Internal Server Error - Server error
 */
```

---

## Troubleshooting Guide

### Common Issues

**Issue: Slow Query Performance**
- Check query execution plan using `explain()`
- Verify indexes are being used
- Consider adding compound indexes
- Review query projection to limit returned fields

**Issue: Connection Pool Exhaustion**
- Increase `maxPoolSize` in connection configuration
- Check for connection leaks in application code
- Monitor connection pool metrics
- Implement proper connection cleanup

**Issue: High Memory Usage**
- Monitor document sizes and reduce if necessary
- Implement document pagination
- Use projection to limit returned fields
- Consider data archiving for old records

**Issue: Replication Lag**
- Check network latency between replica members
- Monitor disk I/O performance
- Review write concern settings
- Consider adding more replica members

---

# Phase 14: Complete Documentation and Best Practices - COMPLETED

The complete documentation and best practices have been documented, including:
- Implementation guidelines for database initialization
- Deployment considerations for different environments
- Maintenance procedures for index management and data cleanup
- Performance best practices for query optimization
- Monitoring and alerting configurations
- Disaster recovery procedures
- Security best practices
- Testing guidelines
- Documentation standards
- Troubleshooting guide

---

# MongoDB Database Design - COMPLETED

All 14 phases of the enterprise-grade MongoDB database design for the Runbook Following Agent application have been completed:

1. **Phase 1**: Complete Architecture - Architecture, Collection Hierarchy, Diagrams
2. **Phase 2**: ER Diagram and Data Flow Diagram
3. **Phase 3**: Complete Collection List and Dependency Graph
4. **Phase 4**: Detailed Collection Design - All 46 collections with full specifications
5. **Phase 5**: MongoDB JSON Schema Validation for every collection
6. **Phase 6**: Complete Indexing Strategy - Single, Compound, Text, TTL, Unique
7. **Phase 7**: Relationships and Foreign Key References
8. **Phase 8**: Sample Documents - 3 per collection
9. **Phase 9**: REST API Mapping to Collections
10. **Phase 10**: CRUD Matrix for all collections
11. **Phase 11**: Aggregation Pipelines and Recommended Queries
12. **Phase 12**: Optimization Tips and Performance Strategies
13. **Phase 13**: Security Design - JWT, RBAC, Audit, Encryption
14. **Phase 14**: Complete Documentation and Best Practices

The database design is now complete and ready for implementation. The design provides a comprehensive foundation for building a scalable, secure, and performant Runbook Following Agent application.

---

**Document Location**: `d:\database\COLLECTION_DESIGN.md`
**Architecture Document**: `d:\database\MONGODB_DATABASE_ARCHITECTURE.md`
**Total Collections**: 46
**Total Lines of Documentation**: 15,000+
