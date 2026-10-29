-- CreateEnum
CREATE TYPE "skill_level" AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "skill_level" NOT NULL,
    "years_of_experience" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skills_user_id_name_key" ON "skills"("user_id", "name");

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
