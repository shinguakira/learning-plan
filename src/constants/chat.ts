import type { Topic } from '@/types/chat'

/** Cosmetic pause before a reply, so the typing indicator registers. */
export const REPLY_DELAY_MS = 300

/** Prompts offered on the empty chat screen. */
export const SUGGESTIONS = [
  'How should I learn React?',
  'Why is my SQL index not being used?',
  'How do I shrink a Docker image?',
  'I keep losing momentum studying',
] as const

/** Matched in order; the topic with the highest keyword score wins. */

export const TOPICS: readonly Topic[] = [
  {
    keywords: ['hello', 'hi ', 'hey', 'good morning', 'good evening'],
    reply:
      'Hi. I answer questions about learning software engineering.\n\n' +
      'Try something like "how should I learn React", "why is my SQL index not used",\n' +
      'or "how do I shrink a Docker image".',
  },
  {
    keywords: ['react', 'jsx', 'hooks', 'usestate', 'useeffect', 'component'],
    reply:
      'React goes down easiest in this order.\n\n' +
      '1. **JSX and props** - get used to building UI out of functions\n' +
      '2. **useState** - each time, ask which component should own the state\n' +
      '3. **Lists and keys** - using the array index as a key breaks on reorder\n' +
      '4. **useEffect** - it is for syncing with something outside React, not for computing\n' +
      '5. **Lifting state / Context** - only once prop drilling actually hurts\n\n' +
      'Step 4 is where most people get stuck. If you want to call `setState` inside\n' +
      '`useEffect`, you can usually compute the value during render instead.',
  },
  {
    keywords: ['typescript', 'types', 'generic', 'type system', 'tsconfig'],
    reply:
      'With TypeScript, aim to read it fluently before you try to write clever types.\n\n' +
      '- Start with `strict: true`. Turning it on later is painful\n' +
      '- When you reach for `any`, try `unknown` plus narrowing instead\n' +
      '- Discriminated unions do most of the real work\n\n' +
      '```ts\n' +
      'type Result<T> =\n' +
      '  | { ok: true; value: T }\n' +
      '  | { ok: false; error: string }\n\n' +
      'function unwrap<T>(result: Result<T>): T {\n' +
      '  if (!result.ok) throw new Error(result.error)\n' +
      '  return result.value // narrowed to ok: true here\n' +
      '}\n' +
      '```\n\n' +
      'type-challenges is the usual place to drill type puzzles.',
  },
  {
    keywords: ['javascript', 'async', 'await', 'promise', 'event loop', 'callback'],
    reply:
      'Async is where JavaScript trips people up. Work through it in this order.\n\n' +
      '1. Callbacks to Promises to async / await, and why each step happened\n' +
      '2. `await` does not block - it suspends the function and returns\n' +
      '3. For parallel work use `Promise.all`; sequential `await` runs in series\n' +
      '4. Handle errors with `try / catch`; `Promise.allSettled` covers partial failure\n\n' +
      '```js\n' +
      '// serial (slow)\n' +
      'const a = await fetchA()\n' +
      'const b = await fetchB()\n\n' +
      '// parallel (fast)\n' +
      'const [a, b] = await Promise.all([fetchA(), fetchB()])\n' +
      '```',
  },
  {
    keywords: ['css', 'tailwind', 'flex', 'grid', 'layout', 'responsive', 'style'],
    reply:
      'CSS gets much easier once a handful of layout patterns are automatic.\n\n' +
      '- Wrapping row: `display: flex; flex-wrap: wrap; gap`\n' +
      '- Equal columns: `display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))`\n' +
      '- Centering: `display: grid; place-items: center`\n' +
      '- Overflow fix: `min-width: 0` (flex children refuse to shrink by default)\n\n' +
      'Even with Tailwind, knowing the plain CSS underneath makes debugging far faster.',
  },
  {
    keywords: ['sql', 'database', 'index', 'postgres', 'mysql', 'query', 'normaliz'],
    reply:
      'SQL progress tracks almost exactly with your ability to read an execution plan.\n\n' +
      '- Make `EXPLAIN` / `EXPLAIN ANALYZE` a reflex\n' +
      '- A Seq Scan over many rows means the WHERE / JOIN / ORDER BY column wants an index\n' +
      '- A composite index is only usable **from its leftmost column onward**\n' +
      '- Wrapping a column in a function kills the index (`WHERE date(created_at) = ...`)\n' +
      '- N+1 queries are obvious the moment you look at the ORM log\n\n' +
      'Third normal form is far enough for almost all real work.',
  },
  {
    keywords: ['docker', 'container', 'kubernetes', 'k8s', 'compose', 'image'],
    reply:
      'Four things cover nearly all day-to-day Docker.\n\n' +
      '1. Image vs container - the blueprint and the running thing\n' +
      '2. Layer caching - put the lines that rarely change near the top\n' +
      '3. Multi-stage builds - separate build from runtime to shrink the image\n' +
      '4. `docker compose` to bring up app plus database together\n\n' +
      '```dockerfile\n' +
      'FROM node:22-slim AS build\n' +
      'WORKDIR /app\n' +
      'COPY package*.json ./\n' +
      'RUN npm ci            # cached until dependencies change\n' +
      'COPY . .\n' +
      'RUN npm run build\n\n' +
      'FROM nginx:alpine\n' +
      'COPY --from=build /app/dist /usr/share/nginx/html\n' +
      '```\n\n' +
      'Kubernetes can wait until Docker feels automatic.',
  },
  {
    keywords: ['aws', 'cloud', 'gcp', 'azure', 'infra', 'ec2', 's3', 'vpc', 'lambda'],
    reply:
      'AWS makes more sense when you sort services by layer instead of memorising names.\n\n' +
      '- Network: VPC, subnets, security groups, route tables\n' +
      '- Compute: EC2, ECS, Lambda\n' +
      '- Storage: S3, EBS, RDS\n' +
      '- Access: IAM roles and policies - the most common source of confusion\n\n' +
      'Deploy one small app yourself, wiring the VPC by hand, and the relationships\n' +
      'between the services click quickly.',
  },
  {
    keywords: ['network', 'tcp', 'http', 'https', 'dns', 'tls', 'cors', 'cookie'],
    reply:
      'For web work, this is roughly the whole surface area.\n\n' +
      '- DNS resolves a name to an IP (caching and TTL cause most surprises)\n' +
      '- TCP connects, TLS encrypts - the handshake round trips are your latency\n' +
      '- HTTP methods, status codes, headers\n' +
      '- Cookies, CORS and cache control - the three that come up constantly at work\n\n' +
      'The fastest study material is the Network tab in DevTools: read real requests\n' +
      'one at a time.',
  },
  {
    keywords: ['algorithm', 'data structure', 'leetcode', 'binary search', 'dynamic programming', 'complexity'],
    reply:
      'The goal with algorithms is for the common patterns to become muscle memory.\n\n' +
      '- Feel the difference between O(n), O(n log n) and O(n squared)\n' +
      '- Arrays, hash maps, stacks, queues\n' +
      '- Binary search, two pointers, sliding window\n' +
      '- BFS and DFS\n' +
      '- Dynamic programming (leave it for last)\n\n' +
      'Put a 25-minute timer on each problem. Reading the solution when time is up\n' +
      'beats grinding on it indefinitely.',
  },
  {
    keywords: ['test', 'unit test', 'vitest', 'jest', 'tdd', 'e2e', 'coverage'],
    reply:
      'Write tests in order of how much it hurts when the code breaks.\n\n' +
      '1. Pure functions - cheapest to write, highest return\n' +
      '2. Component behaviour - assert on user interaction, not on markup\n' +
      '3. End to end - two or three critical paths only; more gets slow and flaky\n\n' +
      'Tests that reach into internals (private helpers, state variable names)\n' +
      'break on every refactor and turn into a liability.',
  },
  {
    keywords: ['git', 'github', 'branch', 'merge', 'conflict', 'rebase', 'pull request'],
    reply:
      'Roughly ten Git commands cover daily use.\n\n' +
      '- `git switch -c feat/xxx` to branch\n' +
      '- `git add -p` to split changes into meaningful commits\n' +
      '- `git rebase -i` to tidy history (be careful once it is pushed)\n' +
      '- On a conflict: `git status`, open the files, resolve, `git add`\n\n' +
      'When something goes wrong, `git reflog`. Almost every state is recoverable.',
  },
  {
    keywords: ['certification', 'exam', 'saa', 'certified', 'pass the'],
    reply:
      'Certifications work best as a deadline.\n\n' +
      '- Book the exam first so the date is fixed\n' +
      '- Take one practice exam up front to see which areas you are losing points in\n' +
      '- Go back to the material only for the weak areas; do not read cover to cover\n' +
      '- In the last two weeks, run practice exams and keep a one-page mistake list\n\n' +
      'They are no substitute for experience, but they are good at closing gaps\n' +
      'systematically.',
  },
  {
    keywords: ['study', 'plan', 'motivation', 'habit', 'schedule', 'stuck', 'give up', 'burn'],
    reply:
      'When studying stops sticking, the unit of work is usually too big.\n\n' +
      '- Split tasks until one sitting is 60 to 90 minutes\n' +
      '- Define done as an artifact ("learn React" becomes "ship a todo app")\n' +
      '- Run at most two threads at once; the third one stalls everything\n' +
      '- Review once a week and re-date whatever did not finish\n\n' +
      'Check the timeline on the first page - overlapping bars are usually the cause.',
  },
  {
    keywords: ['portfolio', 'job', 'interview', 'resume', 'career', 'hired'],
    reply:
      'For a portfolio, one deep project beats several shallow ones.\n\n' +
      '- Build something you actually use, so you can explain why it exists\n' +
      '- In the README: what it is, why those technologies, what was hard\n' +
      '- Tests and CI alone change the impression noticeably\n' +
      '- Deploy it and give out the URL - a running thing is persuasive\n\n' +
      'Interviewers always ask why you designed it that way, so keep notes on the\n' +
      'options you rejected and why.',
  },
]

/** Returned when nothing matches. */
export const FALLBACK =
  'I only know a handful of topics.\n\n' +
  'Try React, TypeScript, JavaScript, CSS, SQL, Docker, AWS, networking,\n' +
  'algorithms, testing, Git, certifications, study habits or portfolios.'
