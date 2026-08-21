# Slotify — Coworking Reservation System (MicroSaaS)

## Description

Slotify is a SaaS web application focused on managing coworking space reservations. It allows multiple coworking organizations to manage their own workspaces, while users can check availability and make reservations based on date and time.

The system is designed as a multi-tenant solution, where each organization manages its own data independently within the same platform.

---

## Live Demo

Slotify is deployed on **Render** and can be tested directly from a web browser.

**Deployed application:**
`https://slotify-xgmu.onrender.com`

> **Note:** If the Render service is inactive, the first request may take a few seconds while the application starts again.

The accounts available for testing the different application flows are listed in the **Test Accounts** section of this README.

---

## Presentation Video

A presentation and demonstration video was created to showcase the complete functionality of Slotify.

The video includes, among other flows:

* Account creation.
* Email confirmation.
* Password recovery.
* Unconfirmed account handling.
* Inactive account handling.
* Two-Factor Authentication (2FA).
* Organization management.
* Member management.
* Email invitations.
* Amenity management.
* Workspace creation and management.
* Booking Rules.
* Custom Time Slots.
* Reservation creation, editing, and cancellation.
* Availability validation.
* Overlapping reservation prevention.
* Complete Member experience.
* Starter plan subscription.
* Upgrade from Starter to Pro.
* Stripe integration.
* Subscription-based restrictions.
* Pro to Starter downgrade scenario where the organization exceeds the new plan limits.
* Responsive design and user experience.

**Presentation video:**
`https://youtu.be/kfdYKqco2yU`

---

## Test Accounts

The following accounts were created exclusively to test different roles, account states, subscription plans, and business rules in Slotify.

### Password

All test accounts use the following password:

```text
Password123!
```

### Accounts

| Scenario                | Email                             | Main Purpose                                                                        |
| ----------------------- | --------------------------------- | ----------------------------------------------------------------------------------- |
| Manager — Pro           | `manager@slotify.test`            | Test the complete organization management flow with a Pro subscription              |
| Member — Pro            | `member@slotify.test`             | Test the Member experience, workspace browsing, and reservations                    |
| Inactive Member         | `inactive-member@slotify.test`    | Test access restrictions for a deactivated account                                  |
| Unconfirmed Member      | `unconfirmed-member@slotify.test` | Test the behavior of an account that has not yet confirmed its email                |
| Manager — Starter       | `starter-manager@slotify.test`    | Test Starter plan limits and available functionality                                |
| Member — Starter        | `starter-member@slotify.test`     | Test the Member experience inside a Starter organization                            |
| Manager — Pro → Starter | `downgraded-manager@slotify.test` | Test an organization that previously used Pro and now exceeds the limits of Starter |

### Pro → Starter Scenario

The account:

```text
downgraded-manager@slotify.test
```

belongs to an organization that previously used the **Pro** plan and later downgraded to the **Starter** plan.

While using Pro, the organization created more resources than Starter allows.

After the downgrade, Slotify **does not automatically delete existing data**.

Instead, it preserves the resources that were previously created and applies the restrictions of the new plan to future actions.

This scenario demonstrates that Slotify:

* Preserves existing data after a downgrade.
* Detects when an organization exceeds the limits of its current plan.
* Keeps existing workspaces accessible.
* Keeps existing users.
* Blocks the creation of new workspaces when the workspace limit has already been exceeded.
* Blocks new invitations when the user limit has already been exceeded.
* Allows the organization to upgrade again in order to restore growth capacity.

> These credentials exist exclusively for demonstration and testing purposes.

---

## Project Objective

The objective of Slotify is to develop a complete application using Ruby on Rails as the backend and React with Vite and Inertia as the frontend, applying concepts such as MVC architecture, authentication, authorization, database modeling, automated testing, and deployment.

---

## Problem Statement

Coworking reservations are often managed manually or through tools that are not designed specifically for this purpose.

This can create problems such as:

* Scheduling conflicts.
* Poor workspace organization.
* Lack of control over reservations.
* Difficulty checking workspace availability.

Slotify centralizes this process in a single platform, allowing each organization to manage its spaces, members, policies, and reservations in a structured and efficient way.

---

## Business Model

Slotify operates under a SaaS model where each coworking organization can subscribe to the platform to manage its workspaces, users, and reservations.

The primary customer of Slotify is the coworking organization.

Members use the platform within the organization they belong to, while the organization is responsible for the subscription.

Subscription plans also control limits and functionality available throughout the application.

---

## Technologies Used

### Backend

* Ruby on Rails
* PostgreSQL
* Devise
* Active Storage
* ActionMailer
* ROTP
* Stripe

### Frontend

* React
* TypeScript
* Vite
* Inertia.js
* Tailwind CSS
* Motion
* Lucide React

### Deployment and Integrations

* Render
* PostgreSQL
* Stripe Checkout
* Stripe Customer Portal
* Stripe Webhooks
* SendGrid

---

## Architecture

Slotify uses Ruby on Rails as its primary backend.

Rails is responsible for:

* Routing.
* Models.
* Controllers.
* Validations.
* Authentication.
* Authorization.
* Business rules.
* Reservations.
* Subscriptions.
* External integrations.

React with TypeScript is used to build the user interface.

Inertia.js acts as the bridge between Rails and React, providing an SPA-like user experience without requiring a separate REST API for the current version of the project.

PostgreSQL stores the application's relational business data.

---

## Main Models

The main models in the system include:

* User
* Role
* Organization
* Workspace
* Amenity
* Reservation
* BookingRule
* TimeSlot
* Subscription
* Payment
* OrganizationInvitation

---

## System Roles

### Manager

The Manager operates a coworking organization.

A Manager can manage:

* Workspaces.
* Amenities.
* Booking Rules.
* Custom Time Slots.
* Members.
* Invitations.
* Reservations.
* Subscription information.
* Organization settings.

### Member

The Member primarily uses Slotify to reserve workspaces.

A Member can:

* Browse active workspaces.
* Review workspace information.
* Check availability.
* Create reservations.
* Edit their own reservations when allowed by the organization's rules.
* Cancel their own reservations when allowed by the cancellation policy.
* Review their reservation history.
* Manage their profile and security settings.

---

## Authentication and Security

Slotify uses **Devise** to manage authentication.

The application includes:

* Sign Up.
* Sign In.
* Sign Out.
* Email confirmation.
* Password recovery.
* Inactive account handling.
* Password validations.
* Two-Factor Authentication.

Two-factor authentication uses time-based one-time passwords generated by TOTP-compatible authenticator applications.

The authenticator code is verified by the backend before access is granted.

---

## Organization and Multi-Tenancy

Slotify uses an organization-based architecture.

Each coworking company operates as an independent organization within the same application.

The main resources are associated with an organization, including:

* Users.
* Workspaces.
* Reservations.
* Booking Rules.
* Time Slots.
* Invitations.
* Subscriptions.

This architecture allows multiple coworking organizations to use Slotify while keeping their data isolated.

A Manager operates only within their own organization, while Members interact only with the organization they belong to.

---

## Workspaces and Amenities

Managers can create and manage the reservable spaces available within their coworking organization.

Each workspace can include information such as:

* Name.
* Type.
* Capacity.
* Floor.
* Zone.
* Location.
* Description.
* Hourly rate.
* Active or inactive status.
* Amenities.
* Main image.
* Additional gallery images depending on the subscription plan.

Amenities are reusable resources and can be assigned to multiple workspaces.

Examples include:

* High-Speed WiFi.
* Projector.
* Whiteboard.
* Soundproofing.
* Air Conditioning.
* Natural Light.

---

## Reservation System

Slotify allows users to create reservations for available workspaces.

Before storing a reservation, the backend validates several business rules.

These include:

* The workspace must belong to the correct organization.
* The workspace must be active.
* The attendee count cannot exceed the workspace capacity.
* The end time must be later than the start time.
* The reservation must comply with the organization's Booking Rules.
* The reservation must comply with Custom Time Slots when applicable.
* The workspace must be available.
* Another confirmed reservation cannot overlap the requested time range.

### Overlapping Reservation Prevention

Slotify determines that two reservations overlap when:

```text
existing_start < new_end
AND
existing_end > new_start
```

This allows back-to-back reservations.

For example:

```text
09:00 - 10:00
10:00 - 11:00
```

is valid.

However:

```text
09:00 - 11:00
10:00 - 12:00
```

represents an overlap and is rejected.

The frontend helps guide the user by displaying availability information, but the backend remains responsible for enforcing the actual reservation rules.

---

## Booking Rules

Each organization can define policies that control how reservations are created and managed.

These rules include:

* Maximum reservation duration.
* Minimum advance booking notice.
* Cancellation deadline.
* Weekend booking policy.

These rules are validated by the backend whenever a reservation is created or modified.

The available configuration ranges can also depend on the organization's subscription plan.

---

## Custom Time Slots

Organizations with access to this functionality can define reusable booking blocks.

For example:

* Morning Session.
* Afternoon Session.
* Weekend Session.

This allows a coworking organization to control the schedule blocks that Members are allowed to reserve instead of allowing completely arbitrary times.

Custom Time Slots are also validated as part of the reservation workflow.

---

## Subscription System

Slotify uses Stripe to manage the subscription workflow.

### Stripe Checkout

When an organization does not yet have an active subscription, Slotify can create a **Stripe Checkout** session to activate a plan.

Stripe handles the secure payment process rather than Slotify directly processing sensitive payment information.

### Stripe Customer Portal

Organizations that already have an active Stripe subscription can use the **Stripe Customer Portal** to manage billing and subscription changes.

### Stripe Webhooks

Stripe Webhooks allow subscription lifecycle events to be synchronized back into Slotify.

These events allow the application to update the local subscription state when events such as subscription creation, updates, upgrades, downgrades, or cancellations occur.

Slotify then uses the subscription state to control application limits and feature access.

---

## Subscription Plans

Slotify includes different subscription levels.

### Starter

Starter includes the core functionality required to operate a coworking organization but applies limits to certain resources and features.

It is designed for smaller organizations that require standard workspace and reservation management functionality.

### Pro

Pro expands the capabilities of the platform and provides access to functionality such as:

* Custom Time Slots.
* Advanced Booking Rules.
* Usage Insights.
* Availability Command Center.
* Multiple Workspace Photos.
* Higher or unlimited resource limits.
* Additional operational capabilities.

The subscription plan is not only a visual label.

It directly affects what the organization can create, configure, and access throughout the application.

---

## Subscription Downgrade Protection

Slotify also handles organizations that downgrade from a higher plan to a more restrictive plan.

For example, an organization may create more workspaces and users while subscribed to Pro and later downgrade to Starter.

If the organization is now above the Starter limits, Slotify preserves the existing data instead of automatically deleting resources.

However, actions that would increase usage are blocked.

For example:

```text
Starter Workspace Limit: 10
Current Workspaces:       12
```

The existing 12 workspaces remain available, but another workspace cannot be created.

The same principle applies to member limits and invitations.

This design protects customer data while still enforcing the restrictions of the organization's current subscription plan.

---

## Main Use Cases

1. Manager and organization registration.
2. Email confirmation.
3. Sign in.
4. Password recovery.
5. Two-Factor Authentication.
6. Inactive account handling.
7. Member invitations.
8. Member registration through an invitation.
9. Organization management.
10. Amenity management.
11. Workspace management.
12. Availability validation.
13. Reservation creation.
14. Reservation editing.
15. Reservation cancellation.
16. Reservation history.
17. Booking Rules.
18. Custom Time Slots.
19. Stripe subscription.
20. Plan upgrade.
21. Plan downgrade.
22. Subscription-based limit enforcement.

---

## User Interface and Experience

The Slotify interface was developed using React and TypeScript.

User experience features include:

* Responsive design.
* Dark Mode.
* Loading skeletons.
* Toast notifications.
* Confirmation dialogs.
* Empty states.
* Animations and transitions.
* Reusable components.
* Different interfaces and workflows for Managers and Members.

The responsive interface allows Managers to operate the platform from desktop environments while Members can comfortably browse workspaces and manage reservations from smaller screens.

---

## Deployment

Slotify is deployed on **Render** using PostgreSQL as its relational database.

Sensitive configuration is managed through environment variables, including information such as:

* Database URL.
* Rails Secret Key Base.
* Stripe credentials.
* Email provider credentials.

Production secrets and credentials should never be stored directly in the source code.

---

## Project Checklist

* [x] Authentication implemented
* [x] Role-based authorization implemented
* [x] At least 5 models
* [x] At least 6 use cases
* [x] Rails backend
* [x] React frontend
* [x] Relational database
* [x] Functional CRUD operations
* [x] Validations
* [x] Automated tests
* [x] README
* [x] Final presentation

---

## Project Status

Final project developed as a **MicroSaaS for coworking workspace reservation management**.

Slotify integrates frontend, backend, relational database, authentication, authorization, business rules, reservation management, subscription billing, and deployment into a single application.
