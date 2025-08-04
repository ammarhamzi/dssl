# Google Workspace SSO Implementation Plan for jBoilerplate

This document outlines the implementation plan for integrating Google Workspace Single Sign-On (SSO) as the exclusive authentication method for the jBoilerplate application.

## 1. Environment Configuration

Add the following variables to your `.env` file:

```
# Google Workspace SSO Configuration
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_GOOGLE_WORKSPACE_DOMAIN=yourcompany.com
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project-id.iam.gserviceaccount.com
VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=your-private-key
VITE_GOOGLE_WORKSPACE_ADMIN_EMAIL=admin@yourcompany.com
```

## 2. Frontend Implementation

### 2.1 Update Login Page (src/pages/login.vue)

Replace the current login form with a Google Workspace SSO button:

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "vue-sonner";

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(true);
const isSubmitting = ref(false);
const isGoogleLoaded = ref(false);

// Check if the user is already authenticated on component mount
onMounted(() => {
  // Short delay to ensure auth store is initialized
  setTimeout(() => {
    if (authStore.isAuthenticated) {
      console.log("User already authenticated, redirecting to appropriate dashboard");
      redirectToDashboard();
    }
    isLoading.value = false;
    
    // Load Google Sign-In SDK
    loadGoogleSDK();
  }, 300);
});

// Utility function to redirect based on user role
function redirectToDashboard() {
  const userRole = authStore.user?.user_type;
  
  switch (userRole) {
    case "superadmin":
      router.replace("/superadmin/home");
      break;
    case "admin":
      router.replace("/admin/home");
      break;
    case "manager":
      router.replace("/manager/home");
      break;
    case "user":
      router.replace("/user/home");
      break;
    default:
      // Stay on login page if role is unknown
      break;
  }
}

// Initialize Google SDK
function loadGoogleSDK() {
  return new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        context: 'signin',
        ux_mode: 'popup',
        hosted_domain: import.meta.env.VITE_GOOGLE_WORKSPACE_DOMAIN, // Restrict to your Workspace domain
        cancel_on_tap_outside: true,
      });
      
      // Render the Google Sign-In button
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { 
          type: 'standard',
          theme: 'outline', 
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 280
        }
      );
      
      isGoogleLoaded.value = true;
      resolve();
    };

    document.head.appendChild(script);
  });
}

// Handle Google Sign-In response
async function handleGoogleCredentialResponse(response) {
  try {
    isSubmitting.value = true;
    
    // Send the ID token to your backend
    await authStore.loginWithWorkspace({
      token: response.credential
    });
    
    // Get the redirect path from query parameters or use role-based default
    const redirectPath = router.currentRoute.value.query.redirect as string;
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      redirectToDashboard();
    }
  } catch (error) {
    console.error("Google Workspace login error:", error);
    toast.error("Authentication failed. Please ensure you're using your company Google Workspace account.");
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center h-full">
    <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
  </div>
  
  <div v-else>
    <div class="flex flex-col space-y-2 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">
        Sign in with Google Workspace
      </h1>
      <p class="text-sm text-muted-foreground">
        Use your company Google Workspace account to sign in
      </p>
    </div>

    <Card>
      <CardContent class="pt-6 pb-6">
        <div class="flex flex-col items-center justify-center space-y-6">
          <!-- Google Sign-In Button -->
          <div id="google-signin-button" class="w-full flex justify-center"></div>
          
          <!-- Loading indicator -->
          <div v-if="isSubmitting" class="flex items-center justify-center">
            <svg
              class="animate-spin h-5 w-5 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>

    <p class="text-center text-sm text-muted-foreground mt-6">
      Only company email addresses are allowed.
    </p>
  </div>
</template>
```

### 2.2 Update Auth Store (src/stores/auth.ts)

Add a new method to handle Google Workspace authentication:

```typescript
/**
 * Login with Google Workspace
 */
async function loginWithWorkspace(credentials: { token: string }): Promise<void> {
  isLoading.value = true;
  error.value = null;

  try {
    // Get CSRF token first
    await fetchCSRFToken();
    
    // Call the workspace authentication endpoint
    const data = await ofetch<AuthResponse>(
      `${getApiUrl()}/auth/workspace`,
      {
        method: 'POST',
        body: {
          token: credentials.token,
        },
        headers: {
          'X-CSRF-TOKEN': csrfToken.value || '',
        },
        credentials: 'include',
      }
    );

    // Set authentication data
    accessToken.value = data.tokens.access_token;
    user.value = data.user;

    // Store data
    if (accessToken.value) {
      localStorage.setItem('access_token', accessToken.value);
      localStorage.setItem('user', JSON.stringify(user.value));
    }
  } catch (e: any) {
    console.error('Workspace login error:', e);
    error.value = e.data?.message || 'Workspace login failed';
    throw e;
  } finally {
    isLoading.value = false;
  }
}

// Make sure to include this in the returned object
return {
  // Existing returns...
  loginWithWorkspace,
};
```

### 2.3 Update Global Type Definitions (src/types/global.d.ts)

Add the Google Sign-In types:

```typescript
interface Window {
  google: {
    accounts: {
      id: {
        initialize: (config: any) => void;
        renderButton: (element: HTMLElement, options: any) => void;
        prompt: () => void;
      };
    };
  };
}
```

## 3. Backend Implementation

### 3.1 Create Google Workspace Authentication Endpoint

```javascript
// server/routes/auth.js
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const router = express.Router();

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Workspace authentication endpoint
router.post('/workspace', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    // Get user payload from the Google token
    const payload = ticket.getPayload();
    
    // Verify user belongs to your Google Workspace domain
    const userDomain = payload.hd; // 'hd' contains the hosted domain (Workspace domain)
    if (userDomain !== process.env.GOOGLE_WORKSPACE_DOMAIN) {
      return res.status(403).json({ 
        error: 'Access restricted to organization members only' 
      });
    }
    
    // Find or create user in your database
    let user = await findUserByEmail(payload.email);
    if (!user) {
      // Create new user if they don't exist
      user = await createUser({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        // Map Google Workspace roles to your application roles
        role: await determineUserRole(payload)
      });
    } else {
      // Update existing user's role based on current Google Workspace groups
      user.role = await determineUserRole(payload);
      await updateUser(user);
    }
    
    // Generate JWT token for your application
    const accessToken = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Return user info and tokens
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        user_type: user.role,
        picture: user.picture
      },
      tokens: {
        access_token: accessToken
      }
    });
    
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Helper function to determine user role based on Google Workspace directory
async function determineUserRole(googlePayload) {
  const { AdminDirectory } = require('googleapis').admin('directory_v1');
  
  try {
    // Create a JWT client using service account
    const jwtClient = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/admin.directory.group.readonly'],
      process.env.GOOGLE_WORKSPACE_ADMIN_EMAIL // Admin user to impersonate
    );
    
    // Authorize the client
    await jwtClient.authorize();
    
    // Create Admin Directory client
    const adminDirectory = new AdminDirectory({
      auth: jwtClient
    });
    
    // Get user's groups
    const response = await adminDirectory.groups.list({
      userKey: googlePayload.email
    });
    
    const groups = response.data.groups || [];
    
    // Map groups to roles
    if (groups.some(g => g.email === 'superadmins@' + process.env.GOOGLE_WORKSPACE_DOMAIN)) {
      return 'superadmin';
    } else if (groups.some(g => g.email === 'admins@' + process.env.GOOGLE_WORKSPACE_DOMAIN)) {
      return 'admin';
    } else if (groups.some(g => g.email === 'managers@' + process.env.GOOGLE_WORKSPACE_DOMAIN)) {
      return 'manager';
    }
    
    return 'user'; // Default role
  } catch (error) {
    console.error('Error determining user role:', error);
    return 'user'; // Default to basic user role on error
  }
}

module.exports = router;
```

## 4. Google Workspace Admin Setup

### 4.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Identity Platform API and Admin SDK API

### 4.2 Configure OAuth Consent Screen

1. Set up an Internal application type (for Workspace users only)
2. Add necessary scopes: `email`, `profile`, `openid`
3. Add your app name, support email, and other required information

### 4.3 Create OAuth Credentials

1. Create OAuth 2.0 Client ID for Web Application
2. Add authorized JavaScript origins (your app URL)
3. Add authorized redirect URIs (if needed)
4. Copy the Client ID for your `.env` file

### 4.4 Create Service Account

1. Create a service account with Domain-wide Delegation
2. Generate and download the service account key file
3. In Google Workspace Admin Console:
   - Go to Security > API controls > Domain-wide Delegation
   - Add the service account client ID
   - Authorize with the following scope:
     - `https://www.googleapis.com/auth/admin.directory.group.readonly`

### 4.5 Set Up Google Groups for Role Mapping

1. Create groups in Google Workspace Admin Console:
   - `superadmins@yourdomain.com`
   - `admins@yourdomain.com`
   - `managers@yourdomain.com`
2. Add users to appropriate groups based on their roles

## 5. Security Considerations

### 5.1 Domain Restriction

Always verify the `hd` claim in the Google ID token to ensure users belong to your organization. Reject authentication attempts from non-company domains.

### 5.2 JWT Security

- Use strong, randomly generated secrets for JWT signing
- Set appropriate token expiration times (1 hour recommended)
- Store refresh tokens in HTTP-only cookies
- Implement token refresh logic

### 5.3 Role-Based Access Control

- Map Google Workspace groups to application roles
- Implement proper authorization checks throughout the application
- Regularly audit role assignments

### 5.4 Audit Logging

- Log all authentication events
- Track role changes and permission updates
- Monitor for suspicious activity

## 6. Testing Plan

1. **Unit Testing**:
   - Test Google Sign-In button rendering
   - Test token validation logic
   - Test role mapping functionality

2. **Integration Testing**:
   - Test end-to-end authentication flow
   - Test role-based access control
   - Test token refresh mechanism

3. **User Acceptance Testing**:
   - Verify domain restriction works properly
   - Test with users from different Google Groups
   - Verify proper redirection after authentication

## 7. Deployment Checklist

- [ ] Update environment variables in production
- [ ] Configure Google Cloud project for production
- [ ] Update authorized JavaScript origins for production domain
- [ ] Test authentication flow in production environment
- [ ] Monitor authentication logs for errors
- [ ] Communicate change to users

## 8. Maintenance and Monitoring

- Regularly review authentication logs
- Monitor for failed authentication attempts
- Keep Google API libraries updated
- Rotate service account keys periodically
- Review and update Google Workspace group memberships