import { useState } from "react"
import type { FormEvent } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SKILL_LEVELS, SKILL_LEVEL_LABEL, YEARS_OF_EXPERIENCE } from "@/constants/skill"
import { OTHER_SKILL_OPTION } from "@/constants/technology"
import { useSkillDraft } from "@/hooks/useSkillDraft"
import { useTechnologies } from "@/hooks/useTechnologies"
import { FormField } from "@/components/form/FormField"
import type { SkillDraft, SkillLevel } from "@/types/skill"

export function SkillForm({
  existingNames,
  onSubmit,
}: {
  existingNames: readonly string[]
  onSubmit: (draft: SkillDraft) => void
}) {
  const { technologies, loading, error } = useTechnologies()
  const [selectedOption, setSelectedOption] = useState("")
  const isOther = selectedOption === OTHER_SKILL_OPTION
  const { draft, patch, nameError, touched, submit } = useSkillDraft(existingNames, "")

  const options = [...technologies.map((technology) => technology.name), OTHER_SKILL_OPTION]

  const handleSelect = (value: string) => {
    setSelectedOption(value)
    patch({ name: value === OTHER_SKILL_OPTION ? "" : value })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const ready = submit()
    if (ready) {
      setSelectedOption("")
      onSubmit(ready)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
        <FormField
          label="Skill"
          htmlFor="skill-option"
          error={touched && !isOther ? nameError : null}
        >
          <Select value={selectedOption} onValueChange={handleSelect} disabled={loading}>
            <SelectTrigger id="skill-option" aria-label="Skill" className="w-full">
              <SelectValue placeholder={loading ? "Loading skills…" : "Select a skill"} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error !== null && (
            <p className="text-muted-foreground mt-1 text-xs">
              Skill list unavailable. Use {OTHER_SKILL_OPTION} to type one.
            </p>
          )}
        </FormField>

        {isOther && (
          <FormField
            label="Custom skill"
            htmlFor="skill-name"
            error={touched ? nameError : null}
            className="min-w-0"
          >
            <Input
              id="skill-name"
              value={draft.name}
              placeholder="e.g. Zig"
              onChange={(event) => patch({ name: event.target.value })}
            />
          </FormField>
        )}

        <FormField label="Level" htmlFor="skill-level">
          <Select
            value={draft.level}
            onValueChange={(value) => patch({ level: value as SkillLevel })}
          >
            <SelectTrigger id="skill-level" aria-label="Level" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SKILL_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {SKILL_LEVEL_LABEL[level]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Experience" htmlFor="skill-experience">
          <Select
            value={String(draft.yearsOfExperience)}
            onValueChange={(value) => patch({ yearsOfExperience: Number(value) })}
          >
            <SelectTrigger id="skill-experience" aria-label="Experience" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS_OF_EXPERIENCE.map((years) => (
                <SelectItem key={years} value={String(years)}>
                  {years} {years === 1 ? "year" : "years"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">
          <Plus />
          Add skill
        </Button>
      </div>
    </form>
  )
}
