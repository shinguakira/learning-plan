# Snackbars

A snackbar is a small notification (that gives feedback about an action without
interrupting the user's work.) In this project, snackbars use Sonner through the
shadcn/ui `Toaster` component.

## Position

The application displays snackbars at the **top center** of the screen. One shared
`Toaster` in [`App.tsx`](../frontend/src/App.tsx) keeps their position consistent
across pages:

```tsx
<Toaster position="top-center" richColors closeButton />
```

Snackbars appear without replacing the page or requiring a dialog to be dismissed.
The close button lets users dismiss them manually.

## Content

Each message briefly describes the result of an action. For example, adding a task
shows “Task added successfully.” Profile actions also confirm when a skill,
strength, job, or certificate has been added or updated.

```tsx
toast.success("Task added successfully.")
```

Skill creation and editing also show error notifications when the request fails.
They display the error's message when available, with a fallback such as
“Could not update the skill.”

Success and error notifications have distinct icons and colors. Their text explains
the outcome, so color is not the only way to understand the message.

## Duration

The project does not set a custom duration, so ordinary success and error
notifications use the installed Sonner version's default of **4,000 milliseconds
(4 seconds)**. This is the automatic dismissal timer, rather than a guarantee that
every notification disappears exactly four seconds after appearing; interaction
can pause the timer.

A duration can be set for an individual notification in milliseconds. For example,
this would keep a notification visible for six seconds before automatic dismissal,
unless its timer is paused or the user closes it:

```tsx
toast.success("Task added successfully.", { duration: 6000 })
```

This example illustrates an optional override; the current project uses the default.
