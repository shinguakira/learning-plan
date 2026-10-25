import PDFDocument from 'pdfkit'
import {
  PDF_BODY_SIZE,
  PDF_HEADING_SIZE,
  PDF_MARGIN,
  PDF_TITLE_SIZE,
} from '../constants/profilePdf.js'
import type { Profile } from '../types/profile.js'
import type { MockUser } from '../types/user.js'

/**
 * The standard fonts encode WinAnsi only; anything outside it would not render.
 * Line breaks are kept, because the strength and job textareas accept them and
 * pdfkit breaks the line on them.
 */
function toWinAnsi(value: string): string {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[^\n\x20-\x7e\xa0-\xff]/g, '?')
}

/** Render the profile the browser posted, so unsaved page edits are included. */
export function toPdf(profile: Profile, user: MockUser): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: PDF_MARGIN })
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const section = (title: string, lines: string[]) => {
      doc.moveDown(1).font('Helvetica-Bold').fontSize(PDF_HEADING_SIZE).text(toWinAnsi(title))
      doc.moveDown(0.4).font('Helvetica').fontSize(PDF_BODY_SIZE)
      for (const line of lines.length === 0 ? ['None recorded.'] : lines) {
        doc.text(toWinAnsi(line))
      }
    }

    doc.font('Helvetica-Bold').fontSize(PDF_TITLE_SIZE).text(toWinAnsi(`${user} - profile`))

    section(
      'Skills',
      profile.skills.map((item) => `${item.name} - ${item.level}, ${item.yearsOfExperience} years`),
    )
    section(
      'Strengths',
      profile.strengths.map((item) => `${item.name} - ${item.description}`),
    )
    section(
      'Work history',
      profile.jobs.flatMap((item) => [
        `${item.title}, ${item.company} (${item.employmentType})`,
        `${item.startDate} to ${item.endDate ?? 'Present'} - ${item.summary}`,
      ]),
    )
    section(
      'Certificates',
      profile.certificates.map((item) => {
        const credential = item.credentialUrl === undefined ? '' : ` - ${item.credentialUrl}`
        return `${item.name} - ${item.issuer}, ${item.dateEarned}${credential}`
      }),
    )

    doc.end()
  })
}
