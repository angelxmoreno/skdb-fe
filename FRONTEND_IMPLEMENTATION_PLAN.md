# Frontend Implementation Plan

This document captures our current decisions, clarifications, and planning details for the frontend of the Serial Killer Wiki. It ensures we have a clear reference point as we begin implementation.

---

## 1. API and JWT Handling

- **JWT Header Consistency:**
    - We will use a consistent header key for the JWT.
    - The API abstraction layer will automatically update the stored JWT on every response that contains a new token.
    - No UI triggers will occur on token refresh; however, logging in and logging out should prompt user confirmation.

---

## 2. Authentication Storage Strategy

- **Local Storage for Now:**
    - We will use local storage to manage JWTs initially.
    - The API abstraction layer will be designed to easily switch to cookie-based authentication later if needed.

- **Backend Changes for Cookies (For Future Reference):**
    - The backend would need to set HTTP-only cookies using the `Set-Cookie` header with options like `Secure`, `HttpOnly`, and `SameSite`.
    - Additional endpoints or logic may be required to handle token refresh via cookies and CSRF protection.

---

## 3. Routing and Global State

- **Protected Routes:**
    - Consider placing all protected routes under a single parent route (e.g., `/app`), based on how TanStack Router supports this pattern.
    - A simple placeholder mechanism for authentication-guarded routes will be implemented while evaluating the router’s options.

- **Global State:**
    - The only global state managed via Zustand will be the authentication state.
    - All other data (such as lists of serial killers) will be managed using TanStack Query.

---

## 4. UI Components, Search, and Error Handling

- **Search Debouncing:**
    - Start with a 500ms debounce for search inputs, with this value adjustable later.

- **Error Handling:**
    - All errors will include a basic `message` field.
    - For entity creation and update errors, the response will include an `errors` key (structured according to CakePHP EntityInterface errors) along with the message.

- **Design System:**
    - Use Bootstrap and ReactBootstrap as the design system for now.

---

## 5. Deployment Strategy

- **Current Process:**
    1. Build the app using our chosen tools.
    2. Move the build folder to the CakePHP webroot directory.
    3. Serve the HTML and assets via CakePHP.

- **Future Automation:**
    - Plan to create GitHub Actions for automated deployment once merged into main.
    - Document the deployment process thoroughly in the repository.

---

## 6. Project Management and Future Features

- **MVP Focus:**
    - Prioritize critical flows like authentication and listing serial killers.
    - CRUD operations for profiles, questions, and answers will be added in later phases.

- **Branching Strategy:**
    - Develop each feature on its own branch.
    - Open a pull request (PR) for review before merging into main.

- **Future Enhancements:**
    - Although planning to use AI to generate documentary-style blog articles based on our Q&A format is in mind, no feature flagging is needed at this stage.
    - No strict timelines for additional features at this time.

---

## Summary & Next Steps

1. **API Abstraction:**
    - Use a consistent header for the new JWT.
    - Update the stored JWT silently on receiving a new token in any response.

2. **Authentication Flow:**
    - Continue using local storage until switching to cookie-based authentication is needed.
    - Axios interceptors will manage token refresh logic, with user feedback when a token is revoked.

3. **Routing Implementation:**
    - Implement a simple mechanism for protecting routes and adjust based on TanStack Router’s options.

4. **Search and Error UI:**
    - Use a default debounce timing of 500ms for search inputs.
    - Implement error displays for both simple error messages and complex validation errors.

5. **Deployment Documentation:**
    - Create a deployment script and GitHub Actions workflow for future automation.
    - Document all manual deployment steps in the repository.

6. **Development Prioritization:**
    - Focus on authentication and serial killer listing for the MVP.
    - Plan subsequent phases for CRUD operations and additional features.

---

This document will serve as our guide throughout development to ensure we remain aligned on our architecture and implementation strategy.
