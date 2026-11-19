-- CreateEnum
CREATE TYPE "task_category" AS ENUM ('Frontend', 'Backend', 'Infra / Cloud', 'Database', 'CS Fundamentals', 'Certification');

-- CreateEnum
CREATE TYPE "task_status" AS ENUM ('todo', 'doing', 'done');

-- CreateEnum
CREATE TYPE "task_priority" AS ENUM ('low', 'mid', 'high');

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "task_category" NOT NULL,
    "status" "task_status" NOT NULL,
    "priority" "task_priority" NOT NULL,
    "estimatedHours" DOUBLE PRECISION NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_user_id_idx" ON "tasks"("user_id");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
