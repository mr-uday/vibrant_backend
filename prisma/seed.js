import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Helpers
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function addDays(d, days) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

async function main() {
  console.log("Seeding...");

  const cities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata"];

  // 1. Admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin Owner",
      email: "admin@vibrant.test",
      phone: "9000000001",
      role: "ADMIN",
      verified: true,
    },
  });

  // 2. Doctors
  const doctors = [];
  for (let i = 1; i <= 10; i++) {
    const u = await prisma.user.create({
      data: {
        name: `Doctor ${i}`,
        email: `doctor${i}@vibrant.test`,
        phone: `90000000${20 + i}`,
        role: "DOCTOR",
        city: pick(cities),
        verified: true,
      },
    });

    const d = await prisma.doctor.create({
      data: {
        id: u.id,
        specialization: pick(["Cardiology", "Pulmonology", "ENT", "Orthopedics", "Paediatrics", "General Medicine"]),
        experienceYears: randInt(2, 20),
        qualifications: "MBBS, MD",
        consultationFee: randInt(200, 2000),
      },
    });

    doctors.push({ userId: u.id, doctorId: d.id });
  }

  // 3. Nurses (caregivers)
  const caregivers = [];
  for (let i = 1; i <= 10; i++) {
    const u = await prisma.user.create({
      data: {
        name: `Nurse ${i}`,
        email: `nurse${i}@vibrant.test`,
        phone: `90000001${30 + i}`,
        role: "NURSE",
        city: pick(cities),
        verified: true,
      },
    });

    const c = await prisma.caregiver.create({
      data: {
        id: u.id,
        bio: `Experienced nurse with ${randInt(1, 10)} years`,
        experienceYears: randInt(1, 12),
        hourlyRate: randInt(150, 600),
        dailyRate: randInt(1200, 4500),
        skills: { list: ["basic life support", "wound care", "vital monitoring"] },
        travelRadiusKm: randInt(5, 30),
        backgroundCheckStatus: true,
      },
    });

    caregivers.push({ userId: u.id, caregiverId: c.id });
  }

  // 4. Patients
  const patients = [];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "O+", "O-"];
  for (let i = 1; i <= 20; i++) {
    const u = await prisma.user.create({
      data: {
        name: `Patient ${i}`,
        email: `patient${i}@vibrant.test`,
        phone: `90000002${40 + i}`,
        role: "PATIENT",
        city: pick(cities),
      },
    });

    const p = await prisma.patient.create({
      data: {
        id: u.id,
        age: randInt(1, 85),
        gender: pick(["Male", "Female", "Other"]),
        bloodGroup: pick(bloodGroups),
        allergies: randInt(0, 1) ? "None" : "Penicillin",
        medicalHistory: { conditions: randInt(0, 1) ? ["hypertension"] : [] },
      },
    });

    patients.push({ userId: u.id, patientId: p.id });
  }

  // 5. Devices (50)
  const baseDeviceNames = [
    "Multi-parameter patient monitor",
    "Vital signs monitor",
    "Tabletop pulse oximeter",
    "Portable ECG machine",
    "12-channel ECG machine",
    "Holter monitor",
    "Ambulatory BP monitor",
    "Spirometer",
    "Audiometer",
    "Auto-refractometer",
    "Portable ultrasound",
    "Standard ultrasound",
    "Digital X-ray machine",
    "C-arm mobile image intensifier",
    "Electrosurgical unit",
    "Defibrillator monitor",
    "Anesthesia workstation",
    "Infusion pump",
    "Syringe pump",
    "ICU ventilator",
    "BiPAP / CPAP machine",
    "Crash cart",
    "Radiant warmer",
    "Infant incubator",
    "Ultrasound therapy unit",
    "TENS / NMES unit",
    "ENT diagnostic set",
    "Flexible nasopharyngoscope",
    "Slit lamp",
    "Applanation tonometer",
    "Dental chair",
    "Intraoral dental X-ray",
    "Hospital bed",
    "Wheelchair",
  ];

  const deviceOwners = [admin.id, ...doctors.map(d => d.userId), ...caregivers.map(c => c.userId)];

  const devicesCreated = [];
  for (let i = 0; i < 50; i++) {
    const name = baseDeviceNames[i % baseDeviceNames.length];
    const catArr = ["MONITORING","RESPIRATORY","CARDIAC","PROCEDURE","ICU","NEONATAL","PHYSIO","ENDOSCOPY","DENTAL","IMAGING","INFRASTRUCTURE"];
    const condArr = ["GOOD","FAIR","POOR"];

    const dev = await prisma.device.create({
      data: {
        name: name,
        description: `${name} - available for rent.`,
        category: pick(catArr),
        condition: pick(condArr),
        dailyPrice: randInt(100, 5000),
        locationCity: pick(cities),
        available: true,
        images: { urls: [] },
        ownerId: pick(deviceOwners),
      },
    });

    devicesCreated.push({ id: dev.id });
  }

  // 6. Nurse Slots (30)
  for (let i = 0; i < 30; i++) {
    const nurse = pick(caregivers);
    const start = addDays(new Date(), randInt(1, 20));
    start.setHours(randInt(8, 18), 0, 0, 0);
    const end = new Date(start);
    end.setHours(start.getHours() + pick([2, 4, 8]));

    await prisma.nurseSlot.create({
      data: {
        nurseId: nurse.caregiverId,
        startAt: start,
        endAt: end,
        slotType: pick(["HOURLY", "DAILY"]),
        maxHours: 8,
        isRecurring: false,
        locationZone: pick(["Zone A","Zone B","Zone C"]),
      },
    });
  }

  // 7. Caregiver Bookings (20)
  for (let i = 0; i < 20; i++) {
    const caregiver = pick(caregivers);
    const requester = pick(patients);

    const start = addDays(new Date(), randInt(1, 15));
    const end = addDays(start, randInt(0, 2));

    const booking = await prisma.caregiverBooking.create({
      data: {
        caregiverId: caregiver.caregiverId,
        requesterId: requester.userId,
        dateFrom: start,
        dateTo: end,
        hours: randInt(1, 12),
        status: pick(["REQUESTED","RESERVED","ACTIVE","COMPLETED"]),
        totalAmount: randInt(300, 5000),
        notes: "Mock caregiver booking",
      },
    });

    // Tasks
    for (let t = 0; t < randInt(1, 3); t++) {
      await prisma.bookingTask.create({
        data: {
          bookingId: booking.id,
          title: `Task ${t + 1}`,
          done: Math.random() > 0.5,
        },
      });
    }
  }

  // 8. Device bookings (40)
  for (let i = 0; i < 40; i++) {
    const device = pick(devicesCreated);
    const user = pick(patients);

    const start = addDays(new Date(), randInt(1, 20));
    const end = addDays(start, randInt(1, 7));

    await prisma.deviceBooking.create({
      data: {
        deviceId: device.id,
        userId: user.userId,
        dateFrom: start,
        dateTo: end,
        status: pick(["REQUESTED","ACTIVE","COMPLETED","CANCELLED"]),
        totalPrice: randInt(150, 8000),
        notes: "Mock device booking",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
