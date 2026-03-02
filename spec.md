# Specification

## Summary
**Goal:** Fix the admin panel login page so it is clear that only a password is required (no username), and ensure the correct hardcoded password is accepted.

**Planned changes:**
- Remove the username field from the admin login form, leaving only a password field.
- Add a visible hint/label on the login page stating that no username is needed — only a password is required.
- Verify the backend `verifyAdminPassword` function's hardcoded password and ensure the login form submits the correct value.
- Display a clear error message when an incorrect password is entered.

**User-visible outcome:** The admin login page shows a single password field with a helper hint. Entering the correct password grants access to the admin dashboard, and entering a wrong password shows an error.
