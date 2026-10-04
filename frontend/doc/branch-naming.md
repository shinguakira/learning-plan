# Branches

## Where a branch starts

Always from an up-to-date `develop`.

```bash
git switch develop
git pull
git switch -c add/hamburger-header-menu#48
```

`main` is the released state. `develop` is what the next release is being built from.
Neither is a place to work.

## What never happens

**No commit and no push goes directly to `develop` or `main`.** Every change is made
on its own branch and merged through a pull request:

```bash
git push -u origin add/hamburger-header-menu#48
gh pr create --base develop
```

`main` only ever receives `develop`. If you find yourself committed onto `develop`,
move the work off before pushing:

```bash
git switch -c add/hamburger-header-menu#48
git switch develop
git reset --hard origin/develop
```

## The name

```
<type>/<what the task is>#<issue>
```

The issue number goes at the **end**, after a `#`. It reads as the task first and the
ticket second, which is the order you scan a branch list in.

`<type>` is the same word the commits on the branch will use:

| Type     | For                                                         |
| -------- | ----------------------------------------------------------- |
| `add`    | something that was not there before                         |
| `fix`    | something is wrong and this makes it right                  |
| `update` | changing how something already working behaves              |
| `ref`    | moving or restructuring code that still does the same thing |
| `del`    | taking something out                                        |

`<what the task is>` is the task in a few words, lowercase, hyphen-separated:

- Name the task, not the files. `failed-chat-replies-in-history`, not `usechat-ts`.
- Three to five words. Long enough to recognise in a branch list a week later.
- Lowercase, hyphens only. No spaces, underscores, uppercase or extra slashes.
- Spell it correctly even when the issue title does not.
- No names, no dates, no ticket-tracker noise beyond the issue number.

`#<issue>` is the GitHub issue number. Include it whenever an issue exists — it is
what links the branch, the pull request and the discussion together. Leave the
suffix off entirely when there is genuinely no issue; do not invent one. Either way
the commits on the branch carry the number as a prefix: `#48 add:…`.

## Examples

| Task                                             | Branch                               |
| ------------------------------------------------ | ------------------------------------ |
| Hamburger header menu for the phone layout (#48) | `add/hamburger-header-menu#48`       |
| Add the task model (#2)                          | `update/add-task-model#2`            |
| Add pagination (#3)                              | `update/add-pagination#3`            |
| Run format and type-check in CI (#4)             | `update/ci-format-typecheck#4`       |
| Build the profile page — no issue for it         | `add/profile-page`                   |
| Make the chat work against the Claude API        | `fix/chat-api-for-claude`            |
| Move the source into a frontend/backend layout   | `ref/add-backend-monorepo-structure` |
| Drop the localStorage persistence (#46)          | `del/remove-localstorage#46`         |

Names to avoid, and why:

| Avoid                     | Why                                                 |
| ------------------------- | --------------------------------------------------- |
| `fix-bug`                 | which bug                                           |
| `feature/new`             | says nothing, and `feature` is not one of the types |
| `yourname/work`           | a branch belongs to the task, not to a person       |
| `update/StatusToggle.tsx` | the file will move; the task will not               |
| `48`                      | no type, no description                             |
| `add/48-hamburger-menu`   | the number belongs at the end, after `#`            |

## After the merge

The pull request merges into `develop` and the branch is deleted — on GitHub, and
locally:

```bash
git switch develop
git pull
git branch -d add/hamburger-header-menu#48
```
