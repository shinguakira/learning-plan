import { describe, expect, it } from "vitest"
import type { ISODate } from "@/types/date"
import { addDays, diffDays, isWeekend } from "@/utils/date"

const iso = (value: string) => value as ISODate

describe("diffDays", () => {
  it("is positive when a comes before b", () => {
    expect(diffDays(iso("2026-01-01"), iso("2026-01-10"))).toBe(9)
  })

  it("is negative when a comes after b", () => {
    expect(diffDays(iso("2026-01-10"), iso("2026-01-01"))).toBe(-9)
  })

  it("is 0 when a and b are the same date", () => {
    expect(diffDays(iso("2026-01-01"), iso("2026-01-01"))).toBe(0)
  })
})

describe("addDays", () => {
  it("adds days inside the same month", () => {
    expect(addDays(iso("2026-01-05"), 3)).toBe("2026-01-08")
  })

  it("rolls over into the next month", () => {
    expect(addDays(iso("2026-01-31"), 1)).toBe("2026-02-01")
  })

  it("negative number", () => {
    expect(addDays(iso("2026-01-31"), -1)).toBe("2026-01-30")
  })
})

describe("isWeekend", () => {
  it("is true on a Saturday", () => {
    expect(isWeekend(iso("2026-01-03"))).toBe(true)
  })

  it("is true on a Sunday", () => {
    expect(isWeekend(iso("2026-01-04"))).toBe(true)
  })

  it("is false on a Weekday", () => {
    expect(isWeekend(iso("2026-01-05"))).toBe(false)
  })
})
