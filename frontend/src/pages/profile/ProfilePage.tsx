import { Award, Briefcase, Code, Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDownloadProfileCsv } from "@/hooks/useDownloadProfileCsv"
import { useProfile } from "@/hooks/useProfile"
import { JobForm } from "@/pages/profile/JobForm"
import { JobList } from "@/pages/profile/JobList"
import { SkillForm } from "@/pages/profile/SkillForm"
import { SkillList } from "@/pages/profile/SkillList"
import { CertificateForm } from "@/pages/profile/CertificateForm"
import { CertificateList } from "@/pages/profile/CertificateList"
import { StrengthForm } from "@/pages/profile/StrengthForm"
import { StrengthList } from "@/pages/profile/StrengthList"
import { ProfileSectionLoading } from "@/pages/profile/ProfileSectionLoading"
import { ProfileFormDialog } from "@/pages/profile/ProfileFormDialog"

/**
 * Every section is a stack of the same card, so four of them in a column were
 * impossible to tell apart. Each one is now a full-bleed colour zone and the
 * hue is the section's identity.
 *
 * The hue stays on the zone chrome - top rule, tint, icon tile, heading, add
 * button. It never reaches the rows, because the colours in there already mean
 * something: skill level in `SKILL_LEVEL_CHIP`, employment type in
 * `EMPLOYMENT_TYPE_CHIP`.
 */
export function ProfilePage() {
  const {
    skills,
    jobs,
    certificates,
    strengths,
    loading,
    error,
    addSkill,
    removeSkill,
    addJob,
    removeJob,
    addCertificate,
    removeCertificate,
    addStrength,
    removeStrength,
  } = useProfile()
  const { status: csvStatus, download: downloadCsv } = useDownloadProfileCsv()

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b pb-5">
        <div>
          <h1 className="text-lg font-semibold">Profile</h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            What goes on your resume. Edits here are not saved.
          </p>
        </div>
        <div>
          {/* Solid, where the section buttons are tinted: this one acts on the whole page. */}
          <Button
            type="button"
            size="sm"
            onClick={downloadCsv}
            disabled={csvStatus === "downloading"}
          >
            <Download />
            Download CSV
          </Button>
          <p className="text-muted-foreground mt-1 max-w-xs text-xs">
            Exports sample skills, strengths, jobs and certificates. Unsaved edits are not included.
          </p>
          {csvStatus === "error" && (
            <p className="text-destructive mt-1 text-xs">Could not download the CSV.</p>
          )}
        </div>
      </div>

      {error && <p className="text-destructive mb-4 text-xs">{error}</p>}

      <section
        aria-labelledby="skills-heading"
        className="-mx-4 border-t-4 border-t-blue-600 bg-blue-50/70 px-4 py-6 sm:-mx-6 sm:px-6 dark:bg-blue-950/20"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Code className="size-5" />
            </span>
            <div>
              <h2
                id="skills-heading"
                className="text-xl font-bold tracking-tight text-blue-800 dark:text-blue-300"
              >
                Skills
              </h2>
              <p className="mt-0.5 text-xs text-blue-900/70 dark:text-blue-200/70">
                {skills.length === 0
                  ? "The technologies you can work with."
                  : `${skills.length} technical skill${skills.length === 1 ? "" : "s"}.`}
              </p>
            </div>
          </div>
          <ProfileFormDialog
            title="Add skill"
            triggerClassName="border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
          >
            {(close) => (
              <SkillForm
                existingNames={skills.map((skill) => skill.name)}
                onSubmit={(draft) => {
                  addSkill(draft)
                  close()
                }}
              />
            )}
          </ProfileFormDialog>
        </div>

        <div className="mt-5">
          {loading ? (
            <ProfileSectionLoading label="Loading skills…" />
          ) : (
            <SkillList skills={skills} onRemove={removeSkill} />
          )}
        </div>
      </section>

      <section
        aria-labelledby="strengths-heading"
        className="-mx-4 border-t-4 border-t-purple-600 bg-purple-50/70 px-4 py-6 sm:-mx-6 sm:px-6 dark:bg-purple-950/20"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h2
                id="strengths-heading"
                className="text-xl font-bold tracking-tight text-purple-800 dark:text-purple-300"
              >
                Strengths
              </h2>
              <p className="mt-0.5 text-xs text-purple-900/70 dark:text-purple-200/70">
                What you do well and how you put it into practice.
              </p>
            </div>
          </div>
          <ProfileFormDialog
            title="Add strength"
            triggerClassName="border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:text-white"
          >
            {(close) => (
              <StrengthForm
                onSubmit={(draft) => {
                  addStrength(draft)
                  close()
                }}
              />
            )}
          </ProfileFormDialog>
        </div>

        <div className="mt-5">
          {loading ? (
            <ProfileSectionLoading label="Loading strengths…" />
          ) : (
            <StrengthList strengths={strengths} onRemove={removeStrength} />
          )}
        </div>
      </section>

      <section
        aria-labelledby="jobs-heading"
        className="-mx-4 border-t-4 border-t-teal-600 bg-teal-50/70 px-4 py-6 sm:-mx-6 sm:px-6 dark:bg-teal-950/20"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
              <Briefcase className="size-5" />
            </span>
            <div>
              <h2
                id="jobs-heading"
                className="text-xl font-bold tracking-tight text-teal-800 dark:text-teal-300"
              >
                Job history
              </h2>
              <p className="mt-0.5 text-xs text-teal-900/70 dark:text-teal-200/70">
                {jobs.length === 0
                  ? "Where you have worked."
                  : `${jobs.length} role${jobs.length === 1 ? "" : "s"}, most recent first.`}
              </p>
            </div>
          </div>
          <ProfileFormDialog
            title="Add job"
            triggerClassName="border-teal-600 bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
          >
            {(close) => (
              <JobForm
                onSubmit={(draft) => {
                  addJob(draft)
                  close()
                }}
              />
            )}
          </ProfileFormDialog>
        </div>

        <div className="mt-5">
          {loading ? (
            <ProfileSectionLoading label="Loading job history…" />
          ) : (
            <JobList jobs={jobs} onRemove={removeJob} />
          )}
        </div>
      </section>

      <section
        aria-labelledby="certificates-heading"
        className="-mx-4 border-t-4 border-t-orange-600 bg-orange-50/70 px-4 py-6 sm:-mx-6 sm:px-6 dark:bg-orange-950/20"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-white">
              <Award className="size-5" />
            </span>
            <div>
              <h2
                id="certificates-heading"
                className="text-xl font-bold tracking-tight text-orange-800 dark:text-orange-300"
              >
                Certificates
              </h2>
              <p className="mt-0.5 text-xs text-orange-900/70 dark:text-orange-200/70">
                {certificates.length === 0
                  ? "What you have earned."
                  : `${certificates.length} earned.`}
              </p>
            </div>
          </div>
          <ProfileFormDialog
            title="Add certificate"
            triggerClassName="border-orange-600 bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
          >
            {(close) => (
              <CertificateForm
                onSubmit={(draft) => {
                  addCertificate(draft)
                  close()
                }}
              />
            )}
          </ProfileFormDialog>
        </div>

        <div className="mt-5">
          {loading ? (
            <ProfileSectionLoading label="Loading certificates…" />
          ) : (
            <CertificateList certificates={certificates} onRemove={removeCertificate} />
          )}
        </div>
      </section>
    </div>
  )
}
