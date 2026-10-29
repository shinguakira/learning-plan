import { Award, Briefcase, Code, Download, FileText, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useDownloadProfileCsv } from "@/hooks/useDownloadProfileCsv"
import { useDownloadProfilePdf } from "@/hooks/useDownloadProfilePdf"
import { useMockUser } from "@/hooks/useMockUser"
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
  const { user } = useMockUser()
  const {
    skills,
    jobs,
    certificates,
    strengths,
    loading,
    error,
    addSkill,
    editSkill,
    removeSkill,
    addJob,
    editJob,
    removeJob,
    addCertificate,
    editCertificate,
    removeCertificate,
    addStrength,
    editStrength,
    removeStrength,
  } = useProfile(user)
  const { status: csvStatus, download: downloadCsv } = useDownloadProfileCsv()
  const { status: pdfStatus, download: downloadPdf } = useDownloadProfilePdf(user, {
    skills,
    jobs,
    certificates,
    strengths,
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b pb-5">
        <div>
          <h1 className="text-lg font-semibold">Profile</h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            What goes on your resume. Skills, strengths, and certificates are saved when added or
            edited. Edits to saved jobs are persisted; other changes stay on this page.
          </p>
        </div>
        <div>
          {/* Solid, where the section buttons are tinted: these act on the whole page. */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={downloadCsv}
              disabled={csvStatus === "downloading"}
            >
              <Download />
              Download CSV
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={downloadPdf}
              disabled={pdfStatus === "downloading"}
            >
              <FileText />
              Download PDF
            </Button>
          </div>
          {csvStatus === "error" && (
            <p className="text-destructive mt-1 text-xs">Could not download the CSV.</p>
          )}
          {pdfStatus === "error" && (
            <p className="text-destructive mt-1 text-xs">Could not download the PDF.</p>
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
            key={user}
            title="Add skill"
            triggerClassName="border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
          >
            {(close) => (
              <SkillForm
                skill={null}
                existingNames={skills.map((skill) => skill.name)}
                onSubmit={(draft) =>
                  addSkill(draft)
                    .then(() => {
                      toast.success("Skill added successfully.")
                      close()
                    })
                    .catch((error: unknown) => {
                      toast.error(
                        error instanceof Error ? error.message : "Could not add the skill.",
                      )
                    })
                }
              />
            )}
          </ProfileFormDialog>
        </div>

        <div className="mt-5">
          {loading ? (
            <ProfileSectionLoading label="Loading skills…" />
          ) : (
            <SkillList skills={skills} onEdit={editSkill} onRemove={removeSkill} />
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
            key={user}
            title="Add strength"
            triggerClassName="border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:text-white"
          >
            {(close) => (
              <StrengthForm
                existingNames={strengths.map((strength) => strength.name)}
                onSubmit={async (draft) => {
                  await addStrength(draft)
                  toast.success("Strength added successfully.")
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
            <StrengthList
              key={user}
              strengths={strengths}
              onEdit={editStrength}
              onRemove={removeStrength}
            />
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
            key={user}
            title="Add job"
            triggerClassName="border-teal-600 bg-teal-600 text-white hover:bg-teal-700 hover:text-white"
          >
            {(close) => (
              <JobForm
                onSubmit={(draft) => {
                  addJob(draft)
                  toast.success("Job added successfully.")
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
            <JobList key={user} jobs={jobs} onEdit={editJob} onRemove={removeJob} />
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
            key={user}
            title="Add certificate"
            triggerClassName="border-orange-600 bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
          >
            {(close) => (
              <CertificateForm
                onSubmit={async (draft) => {
                  await addCertificate(draft)
                  toast.success("Certificate added successfully.")
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
            <CertificateList
              key={user}
              certificates={certificates}
              onEdit={editCertificate}
              onRemove={removeCertificate}
            />
          )}
        </div>
      </section>
    </div>
  )
}
