import type { ReactNode } from "react"
import { Link } from "react-router-dom"

/**
 * A tiny renderer covering the markdown a chat reply usually contains: fenced
 * code blocks, `inline code`, **bold**, task links, and line breaks.
 * Swap in a real markdown library the moment more than that is needed.
 */

type Block = { kind: "code"; lang: string; code: string } | { kind: "text"; text: string }

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = []
  const fence = /```(\w*)\n([\s\S]*?)```/g
  let cursor = 0

  for (let match = fence.exec(source); match !== null; match = fence.exec(source)) {
    if (match.index > cursor) {
      blocks.push({ kind: "text", text: source.slice(cursor, match.index) })
    }
    // Both groups are optional as far as the type system knows, so default them
    // rather than assert - an unmatched group is an empty block, not a crash.
    const [, lang = "", body = ""] = match
    blocks.push({ kind: "code", lang, code: body.replace(/\n$/, "") })
    cursor = fence.lastIndex
  }
  if (cursor < source.length) blocks.push({ kind: "text", text: source.slice(cursor) })
  return blocks
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]\n]+\]\(\/tasks\?taskid=seed-[1-9]\d*\))/g)
    .map((part, index) => {
      const key = `${keyPrefix}-${index}`
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={key} className="text-foreground font-semibold">
            {renderInline(part.slice(2, -2), key)}
          </strong>
        )
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code key={key} className="bg-muted rounded px-1 py-0.5 font-mono text-[0.85em]">
            {part.slice(1, -1)}
          </code>
        )
      }
      const taskLink = /^\[([^\]\n]+)\]\((\/tasks\?taskid=seed-[1-9]\d*)\)$/.exec(part)
      if (taskLink?.[1] && taskLink[2]) {
        return (
          <Link
            key={key}
            to={taskLink[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary rounded-sm underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {renderInline(taskLink[1], key)}
          </Link>
        )
      }
      return <span key={key}>{part}</span>
    })
}

export function Markdown({ text }: { text: string }) {
  return (
    <>
      {parseBlocks(text).map((block, blockIndex) =>
        block.kind === "code" ? (
          <pre
            key={blockIndex}
            className="scrollbar-slim bg-muted my-2 overflow-x-auto rounded-lg px-3 py-2.5 text-[12px] leading-relaxed"
          >
            <code>{block.code}</code>
          </pre>
        ) : (
          <p key={blockIndex} className="whitespace-pre-wrap">
            {renderInline(block.text, `b${blockIndex}`)}
          </p>
        ),
      )}
    </>
  )
}
