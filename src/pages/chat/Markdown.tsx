import type { ReactNode } from 'react'

/**
 * A tiny renderer covering the markdown a chat reply usually contains: fenced
 * code blocks, `inline code`, **bold**, and line breaks.
 * Swap in a real markdown library the moment more than that is needed.
 */

type Block = { kind: 'code'; lang: string; code: string } | { kind: 'text'; text: string }

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = []
  const fence = /```(\w*)\n([\s\S]*?)```/g
  let cursor = 0

  for (let match = fence.exec(source); match !== null; match = fence.exec(source)) {
    if (match.index > cursor) {
      blocks.push({ kind: 'text', text: source.slice(cursor, match.index) })
    }
    // Both groups are optional as far as the type system knows, so default them
    // rather than assert - an unmatched group is an empty block, not a crash.
    const [, lang = '', body = ''] = match
    blocks.push({ kind: 'code', lang, code: body.replace(/\n$/, '') })
    cursor = fence.lastIndex
  }
  if (cursor < source.length) blocks.push({ kind: 'text', text: source.slice(cursor) })
  return blocks
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    const key = `${keyPrefix}-${index}`
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={key} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={key}
          className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.85em] text-slate-700"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={key}>{part}</span>
  })
}

export function Markdown({ text }: { text: string }) {
  return (
    <>
      {parseBlocks(text).map((block, blockIndex) =>
        block.kind === 'code' ? (
          <pre
            key={blockIndex}
            className="scrollbar-slim my-2 overflow-x-auto rounded-lg bg-slate-900 px-3 py-2.5 text-[12px] leading-relaxed text-slate-100"
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
