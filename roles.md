# Role Structure and Permissions

This document outlines the role structure and permissions for the application.

## Role Hierarchy

1. **Superadmin**
   - Has full access to all system features
   - Can manage all users, settings, and configurations
   - Can impersonate other users

2. **Admin**
   - Has administrative access to most features
   - Can manage users, settings, teams, and projects
   - Cannot access system-level configurations

3. **Manager**
   - Has team and project management capabilities
   - Can view team members and manage projects
   - Can access and manage calendars
   - Limited administrative capabilities

4. **User**
   - Basic access level
   - Can access personal profile and settings
   - Can view assigned projects and team information
   - Can access personal calendar

## Permission Matrix

| Permission        | Superadmin | Admin | Manager | User |
|-------------------|------------|-------|---------|------|
| user:read         | ✓          | ✓     | ✓       | ✓    |
| user:write        | ✓          | ✓     | ✗       | ✗    |
| user:delete       | ✓          | ✗     | ✗       | ✗    |
| settings:read     | ✓          | ✓     | ✗       | ✗    |
| settings:write    | ✓          | ✓     | ✗       | ✗    |
| system:read       | ✓          | ✗     | ✗       | ✗    |
| system:write      | ✓          | ✗     | ✗       | ✗    |
| team:read         | ✓          | ✓     | ✓       | ✗    |
| team:write        | ✓          | ✓     | ✓       | ✗    |
| project:read      | ✓          | ✓     | ✓       | ✗    |
| project:write     | ✓          | ✓     | ✓       | ✗    |
| calendar:read     | ✓          | ✓     | ✓       | ✓    |
| calendar:write    | ✓          | ✓     | ✓       | ✗    |
| profile:read      | ✓          | ✓     | ✓       | ✓    |
| profile:write     | ✓          | ✓     | ✓       | ✓    |
| user:impersonate  | ✓          | ✗     | ✗       | ✗    |

## Route Access

Routes are protected based on the user's role. The following routes are accessible by each role:

### Superadmin
- All routes

### Admin
- /admin/*
- Limited access to some system settings

### Manager
- /manager/*
- Team and project management
- Calendar management

### User
- /user/*
- Profile management
- Personal calendar
- Documentation

## Notes on Role Implementation

- User roles are stored in the `user_type` field of the user object
- Role-based access control is implemented in the router guards
- Permissions are checked using the `hasPermission` method in the auth store
- The superadmin role has implicit access to all permissions