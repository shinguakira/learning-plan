import type { Job } from '../types/job.js'

/** Every company and role here is invented. */
export const seedJobs: Job[] = [
  {
    id: '1',
    company: 'Marlow Retail',
    title: 'Senior Frontend Engineer',
    employmentType: 'full-time',
    startDate: '2024-04-01',
    endDate: null,
    summary: 'Online shop. Build the product and checkout pages in React.',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    company: 'Northgate Logistics',
    title: 'Full Stack Engineer',
    employmentType: 'full-time',
    startDate: '2021-07-01',
    endDate: '2024-03-31',
    summary: 'Freight company. Built the shipment tracking dashboard and the API behind it.',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    company: 'Riverbend Studio',
    title: 'Web Developer',
    employmentType: 'contract',
    startDate: '2020-02-01',
    endDate: '2021-06-30',
    summary: 'Web agency. Built marketing sites for clients.',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '4',
    company: 'Oakfield Systems',
    title: 'Software Engineer Intern',
    employmentType: 'internship',
    startDate: '2019-06-01',
    endDate: '2019-09-30',
    summary: 'Software vendor. Wrote internal tools for the test team.',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]
