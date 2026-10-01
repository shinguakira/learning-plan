# Branches

## Where a branch starts

Always from an up-to-date `develop`.

```bash
git switch develop
git pull
git switch -c fix/42-failed-chat-replies-in-history
```

`main` is the released state. `develop` is what the next release is being built from.
Neither is a place to work.

## What never happens

**No commit and no push goes directly to `develop` or `main`.** Every change is made
on its own branch and merged through a pull request:

```bash
git push -u origin fix/42-failed-chat-replies-in-history
gh pr create --base develop
```

`main` only ever receives `develop`. If you find yourself committed onto `develop`,
move the work off before pushing:

```bash
git switch -c fix/42-failed-chat-replies-in-history
git switch develop
git reset --hard origin/develop
```

## The name

```
<type>/<issue>-<what the task is>
```

`<type>` is the same word the commits on the branch will use:

| Type     | For                                            |
| -------- | ---------------------------------------------- |
| `add`    | something that was not there before            |
| `fix`    | something is wrong and this makes it right     |
| `update` | changing how something already working behaves |
| `del`    | taking something out                           |

`<issue>` is the GitHub issue number. Include it whenever an issue exists — it is what
links the branch, the pull request and the discussion together. Leave it out when
there is genuinely no issue; do not invent one.

`<what the task is>` is the task in a few words, lowercase, hyphen-separated:

- Name the task, not the files. `failed-chat-replies-in-history`, not `usechat-ts`.
- Three to five words. Long enough to recognise in a branch list a week later.
- Lowercase, hyphens only. No spaces, underscores, uppercase or extra slashes.
- No names, no dates, no ticket-tracker noise beyond the issue number.

## Examples

| Task                                                   | Branch                                         |
| ------------------------------------------------------ | ---------------------------------------------- |
| Failed replies were being sent back as assistant turns | `fix/42-failed-chat-replies-in-history`        |
| `.env.example` describes a fallback that was removed   | `fix/43-env-example-mentions-removed-fallback` |
| Rebuild the status toggle on the shadcn Button         | `update/44-status-toggle-uses-shadcn-button`   |
| Split the type check out of the build script           | `update/45-separate-type-check-from-build`     |
| Drop the localStorage persistence                      | `del/46-remove-localstorage`                   |
| Add the timeline view to the task page                 | `add/47-timeline-view-on-task-page`            |
| Write this document — no issue for it                  | `update/branch-naming-doc`                     |

Names to avoid, and why:

| Avoid                     | Why                                                 |
| ------------------------- | --------------------------------------------------- |
| `fix-bug`                 | which bug                                           |
| `feature/new`             | says nothing, and `feature` is not one of the types |
| `yourname/work`           | a branch belongs to the task, not to a person       |
| `update/StatusToggle.tsx` | the file will move; the task will not               |
| `42`                      | no type, no description                             |

## After the merge

The pull request merges into `develop` and the branch is deleted — on GitHub, and
locally:

```bash
git switch develop
git pull
git branch -d fix/42-failed-chat-replies-in-history
```
