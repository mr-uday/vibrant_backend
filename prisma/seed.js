import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔥 Seeding Nurses...");

  const nurses = [
    {
      id: 13,
      name: "Ananya Rao",
      email: "nurse13@example.com",
      role: "NURSE",
      city: "Mumbai",
      languages: ["English", "Hindi", "Kannada"],
      caregiver: {
        bio: "Former Kokilaben ICU lead nurse with ACLS, airway management, and ventilator weaning expertise.",
        experienceYears: 8,
        hourlyRate: 850,
        skills: ["Ventilator care", "Arterial line monitoring", "Proning"],
        travelRadiusKm: 10,
        backgroundCheckStatus: true,
      },
    },
    {
      id: 22,
      name: "Shreya Patel",
      email: "nurse22@example.com",
      role: "NURSE",
      city: "Ahmedabad",
      languages: ["English", "Gujarati", "Hindi"],
      caregiver: {
        bio: "NICU-trained pediatric nurse helping children transition from hospital to home.",
        experienceYears: 6,
        hourlyRate: 780,
        skills: ["IV cannulation", "Feeding tube care", "Vaccination support"],
        backgroundCheckStatus: true,
      },
    },
    {
      id: 14,
      name: "Devika Menon",
      email: "nurse14@example.com",
      role: "NURSE",
      city: "Bengaluru",
      languages: ["English", "Malayalam", "Hindi"],
      caregiver: {
        bio: "Oncology infusion specialist ensuring chemotherapy adherence, PICC management, and symptom tracking.",
        experienceYears: 10,
        hourlyRate: 980,
        skills: ["Chemo infusion", "Port flushing", "Pain management"],
        backgroundCheckStatus: true,
      },
    },
    {
      id: 15,
      name: "Ritika Sharma",
      email: "nurse15@example.com",
      role: "NURSE",
      city: "Delhi",
      languages: ["Hindi", "English", "Punjabi"],
      caregiver: {
        bio: "Holistic elder-care nurse focusing on fall prevention, dementia-friendly routines, and vitals monitoring.",
        experienceYears: 12,
        hourlyRate: 720,
        skills: ["Vitals tracking", "Mobility therapy", "Medication adherence"],
        backgroundCheckStatus: true,
      },
    },
    {
      id: 16,
      name: "Sahana Victor",
      email: "nurse16@example.com",
      role: "NURSE",
      city: "Chennai",
      languages: ["English", "Tamil"],
      caregiver: {
        bio: "Post-operative mobility specialist with robotics-assisted rehab.",
        experienceYears: 7,
        hourlyRate: 690,
        skills: ["Neuro physio", "Technique coaching", "Vitals monitoring"],
        backgroundCheckStatus: true,
      },
    },
    {
      id: 17,
      name: "Lena Fernandes",
      email: "nurse17@example.com",
      role: "NURSE",
      city: "Goa",
      languages: ["English", "Konkani"],
      caregiver: {
        bio: "Home ICU setups, ventilator care, and AI-supported documentation.",
        experienceYears: 9,
        hourlyRate: 920,
        skills: ["Tracheostomy care", "Ventilator titration", "Medication titration"],
        backgroundCheckStatus: true,
      },
    },
  ];

  for (const nurse of nurses) {
    await prisma.user.upsert({
      where: { id: nurse.id },
      update: {},
      create: {
        id: nurse.id,
        name: nurse.name,
        email: nurse.email,
        role: nurse.role,
        city: nurse.city,
        languages: nurse.languages,
        verified: true,
        verificationStatus: "VERIFIED",

        caregiverProfile: {
          create: {
            // ❗ DO NOT include id here
            bio: nurse.caregiver.bio,
            experienceYears: nurse.caregiver.experienceYears,
            hourlyRate: nurse.caregiver.hourlyRate,
            travelRadiusKm: nurse.caregiver.travelRadiusKm,
            skills: nurse.caregiver.skills,
            backgroundCheckStatus: nurse.caregiver.backgroundCheckStatus,
          },
        },
      },
    });
  }

  console.log("✅ Nurses seeded successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
