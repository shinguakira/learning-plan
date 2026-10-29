-- CreateEnum
CREATE TYPE "employment_type" AS ENUM ('full-time', 'contract', 'part-time', 'internship');

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "employment_type" "employment_type" NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "summary" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jobs_user_id_idx" ON "jobs"("user_id");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
