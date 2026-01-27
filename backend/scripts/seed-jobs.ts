import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const connectionString = `${process.env.DIRECT_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface JobData {
  _id: { $oid: string };
  company: { companyId: number; companyName: string };
  jobTitle: string;
  location: [number, number]; // [lng, lat]
  skills: string[];
  formattedAddress: string;
}

async function main() {
  await prisma.$connect();
  console.log("Seeding jobs from jobs-data.json...");

  // Create mock admin user if not exists
  let adminUser = await prisma.user.findFirst({
    where: { role: "admin" },
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        fullName: "Mock Admin",
        email: "admin@mock.com",
        password: "$2b$10$mockhashedpassword", // dummy hash
        role: "admin",
      },
    });
    console.log("Created mock admin user");
  }

  // Read and parse jobs-data.json (JSON Lines format)
  const filePath = path.join(__dirname, "..", "jobs-data.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n").filter((line) => line.trim());

  const jobs: JobData[] = lines.map((line) => JSON.parse(line));

  console.log(`Found ${jobs.length} jobs to seed`);

  for (const jobData of jobs.slice(0, 50)) {
    // Limit to 50 for demo
    const description = generateMarkdownDescription(jobData);

    try {
      await prisma.job.create({
        data: {
          title: jobData.jobTitle,
          description,
          location: jobData.formattedAddress,
          salary: Math.floor(Math.random() * 100000) + 50000, // Random salary
          status: "open",
          createdBy: adminUser.id,
        },
      });
    } catch (error) {
      console.error(`Failed to create job ${jobData.jobTitle}:`, error);
    }
  }

  console.log("Seeding completed");
}

// fake markdown description generator because original data doesnt have descriptions
function generateMarkdownDescription(jobData: JobData): string {
  const { jobTitle, skills, company } = jobData;

  let description = `# ${jobTitle}\n\n`;
  description += `**Company:** ${company.companyName}\n\n`;
  description += `**Location:** ${jobData.formattedAddress}\n\n`;

  if (skills.length > 0) {
    description += `## Required Skills\n\n`;
    description += skills.map((skill) => `- ${skill}`).join("\n") + "\n\n";
  }

  description += `## Job Description\n\n`;
  description += `We are looking for a talented professional to join our team at ${company.companyName}.\n\n`;
  description += `### Responsibilities\n\n`;
  description += `- Develop and maintain high-quality software\n`;
  description += `- Collaborate with cross-functional teams\n`;
  description += `- Participate in code reviews and best practices\n\n`;

  description += `### Requirements\n\n`;
  description += `- Experience with the technologies listed above\n`;
  description += `- Strong problem-solving skills\n`;
  description += `- Excellent communication abilities\n\n`;

  description += `### Benefits\n\n`;
  description += `- Competitive salary\n`;
  description += `- Health insurance\n`;
  description += `- Professional development opportunities\n\n`;

  description += `Apply now to be part of our innovative team!`;

  return description;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
