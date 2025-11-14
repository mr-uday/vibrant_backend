import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Admin
  await prisma.user.create({
    data: {
      name: "Admin",
      role: "ADMIN",
      email: "admin@merilcare.com"
    }
  });

  // Sample doctors
  const doc1 = await prisma.user.create({
    data: {
      name: "Dr. Patel",
      role: "DOCTOR",
      city: "Surat",
      email: "drpatel@example.com"
    }
  });

  // Sample nurse
  const nurseUser = await prisma.user.create({
    data: {
      name: "Nurse A",
      role: "NURSE",
      city: "Surat",
      phone: "9998887771",
      languages: ["English", "Hindi"],
      verificationStatus: "VERIFIED"
    }
  });

  await prisma.caregiver.create({
    data: {
      id: nurseUser.id,
      bio: "5 years ICU experience",
      experienceYears: 5,
      hourlyRate: 300,
      skills: ["ICU", "Vitals", "Wound care"]
    }
  });

  // Availability slot
  await prisma.nurseSlot.create({
    data: {
      nurseId: nurseUser.id,
      slotType: "HOURLY",
      startAt: new Date("2025-01-10 09:00"),
      endAt: new Date("2025-01-10 17:00")
    }
  });

  // Devices
  const ventilator = await prisma.device.create({
    data: {
      name: "BiPAP Machine",
      category: "RESPIRATORY",
      dailyPrice: 900,
      locationCity: "Surat",
      condition: "GOOD",
      ownerId: doc1.id
    }
  });

  // Booking (sample)
  await prisma.deviceBooking.create({
    data: {
      deviceId: ventilator.id,
      renterId: doc1.id,
      startDate: new Date("2025-01-11"),
      endDate: new Date("2025-01-13"),
      totalAmount: 1800
    }
  });

  console.log("Seed completed successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
