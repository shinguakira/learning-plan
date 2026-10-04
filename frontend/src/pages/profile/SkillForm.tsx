import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SKILL_LEVELS, SKILL_LEVEL_LABEL } from '@/constants/skill'
import { useSkillDraft } from '@/hooks/useSkillDraft'
import { FormField } from '@/components/form/FormField'
import type { SkillDraft, SkillLevel } from '@/types/skill'

const SKILL_OPTIONS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'HTML / CSS',
  'Python',
  'Go',
  'Rust',
  'Java',
  'C#',
  'SQL',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'Kubernetes',
  'AWS',
  'Git',
  'Linux',
  'Other',
] as const

const DEFAULT_SKILL: string = SKILL_OPTIONS[0]

export function SkillForm({
  existingNames,
  onSubmit,
}: {
  existingNames: readonly string[]
  onSubmit: (draft: SkillDraft) => void
}) {
  const [selectedOption, setSelectedOption] = useState(DEFAULT_SKILL)
  const isOther = selectedOption === 'Other'
  const { draft, patch, nameError, touched, submit } = useSkillDraft(existingNames, DEFAULT_SKILL)

  const handleSelect = (value: string) => {
    setSelectedOption(value)
    patch({ name: value === 'Other' ? '' : value })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const ready = submit()
    if (ready) {
      setSelectedOption(DEFAULT_SKILL)
      onSubmit(ready)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Add a skill</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-end gap-3">
            <FormField
              label="Skill"
              htmlFor="skill-option"
              error={touched && !isOther ? nameError : null}
            >
              <Select value={selectedOption} onValueChange={handleSelect}>
                <SelectTrigger id="skill-option" aria-label="Skill" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {isOther && (
              <FormField
                label="Custom skill"
                htmlFor="skill-name"
                error={touched ? nameError : null}
                className="min-w-48 flex-1"
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
                <SelectTrigger id="skill-level" aria-label="Level" className="w-40">
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

            <Button type="submit">
              <Plus />
              Add skill
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
