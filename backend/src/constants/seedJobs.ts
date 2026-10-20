import { MOCK_USERS } from './user.js'
import type { Job } from '../types/job.js'
import type { MockUser } from '../types/user.js'

const at = '2026-01-01T00:00:00.000Z'

/** Every company and role here is invented. */
export const seedJobsByUser: Record<MockUser, Job[]> = {
  Sanjar: [
    {
      id: 'sanjar-job-1',
      company: 'Marlow Retail',
      title: 'Senior Frontend Engineer',
      employmentType: 'full-time',
      startDate: '2024-04-01',
      endDate: null,
      summary: 'Online shop. Build the product and checkout pages in React.',
      createdAt: at,
    },
    {
      id: 'sanjar-job-2',
      company: 'Northgate Logistics',
      title: 'Full Stack Engineer',
      employmentType: 'full-time',
      startDate: '2021-07-01',
      endDate: '2024-03-31',
      summary: 'Freight company. Built the shipment tracking dashboard and the API behind it.',
      createdAt: at,
    },
    {
      id: 'sanjar-job-3',
      company: 'Riverbend Studio',
      title: 'Web Developer',
      employmentType: 'contract',
      startDate: '2020-02-01',
      endDate: '2021-06-30',
      summary: 'Web agency. Built marketing sites for clients.',
      createdAt: at,
    },
    {
      id: 'sanjar-job-4',
      company: 'Oakfield Systems',
      title: 'Software Engineer Intern',
      employmentType: 'internship',
      startDate: '2019-06-01',
      endDate: '2019-09-30',
      summary: 'Software vendor. Wrote internal tools for the test team.',
      createdAt: at,
    },
  ],
  Akira: [
    {
      id: 'akira-job-1',
      company: 'Halden Grid',
      title: 'Platform Engineer',
      employmentType: 'full-time',
      startDate: '2022-09-01',
      endDate: null,
      summary: 'Energy metering. Run the Kubernetes clusters and the deploy pipeline.',
      createdAt: at,
    },
    {
      id: 'akira-job-2',
      company: 'Pinewell Systems',
      title: 'Backend Engineer',
      employmentType: 'full-time',
      startDate: '2018-04-01',
      endDate: '2022-08-31',
      summary: 'Warehouse software. Wrote the order service and its Postgres schema.',
      createdAt: at,
    },
  ],
  Mike: [
    {
      id: 'mike-job-1',
      company: 'Calder Analytics',
      title: 'Data Engineer',
      employmentType: 'full-time',
      startDate: '2023-02-01',
      endDate: null,
      summary: 'Consultancy. Build and maintain client reporting pipelines.',
      createdAt: at,
    },
    {
      id: 'mike-job-2',
      company: 'Thornby Insurance',
      title: 'Analyst',
      employmentType: 'full-time',
      startDate: '2017-10-01',
      endDate: '2023-01-31',
      summary: 'Insurer. Built the claims reporting the pricing team worked from.',
      createdAt: at,
    },
    {
      id: 'mike-job-3',
      company: 'Westmoor College',
      title: 'Research Assistant',
      employmentType: 'part-time',
      startDate: '2016-09-01',
      endDate: '2017-06-30',
      summary: 'Cleaned and prepared survey data for a transport study.',
      createdAt: at,
    },
  ],
  John: [
    {
      id: 'john-job-1',
      company: 'Brackley Digital',
      title: 'Junior Frontend Developer',
      employmentType: 'full-time',
      startDate: '2025-03-01',
      endDate: null,
      summary: 'Small agency. Build landing pages and fix layout bugs across browsers.',
      createdAt: at,
    },
    {
      id: 'john-job-2',
      company: 'Brackley Digital',
      title: 'Frontend Intern',
      employmentType: 'internship',
      startDate: '2024-09-01',
      endDate: '2025-02-28',
      summary: 'Converted designs into HTML and CSS under review.',
      createdAt: at,
    },
  ],
}

export const seedJobs: Job[] = MOCK_USERS.flatMap((user) => seedJobsByUser[user])
