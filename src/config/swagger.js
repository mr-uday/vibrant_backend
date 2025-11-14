import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MerilCare API",
      version: "1.0.0",
      description: "MerilCare — Nurse, Device & Booking APIs",
    },
    servers: [
    {
        url: "http://10.11.7.87:5000",
        description: "LAN server",
    },
    {
        url: "http://localhost:5000",
        description: "Local dev",
    },{
        url: "https://vibrant-backend-4.onrender.com",
        description: "live server",
    }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Nurse A" },
            email: { type: "string", example: "nurse@example.com" },
            phone: { type: "string", example: "9998887771" },
            role: { type: "string", example: "NURSE" },
            city: { type: "string", example: "Surat" },
          },
        },
        CaregiverProfile: {
          type: "object",
          properties: {
            id: { type: "integer" },
            bio: { type: "string" },
            experienceYears: { type: "integer" },
            hourlyRate: { type: "number" },
            skills: { type: "array", items: { type: "string" } },
            travelRadiusKm: { type: "integer" },
            verificationStatus: { type: "string", example: "VERIFIED" },
          },
        },
        NurseSlot: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nurseId: { type: "integer" },
            startAt: { type: "string", format: "date-time" },
            endAt: { type: "string", format: "date-time" },
            slotType: { type: "string", example: "HOURLY" },
            isRecurring: { type: "boolean" },
            recurrence: { type: "object", nullable: true },
            locationZone: { type: "string", nullable: true },
          },
        },
        CaregiverBooking: {
          type: "object",
          properties: {
            id: { type: "integer" },
            caregiverId: { type: "integer" },
            requesterId: { type: "integer" },
            dateFrom: { type: "string", format: "date-time" },
            dateTo: { type: "string", format: "date-time" },
            hours: { type: "integer" },
            status: { type: "string", example: "REQUESTED" },
            totalAmount: { type: "number" },
            notes: { type: "string", nullable: true },
          },
        },
        Device: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            category: { type: "string" },
            dailyPrice: { type: "number" },
            locationCity: { type: "string" },
            available: { type: "boolean" },
            condition: { type: "string" },
          },
        },
        DeviceBooking: {
          type: "object",
          properties: {
            id: { type: "integer" },
            deviceId: { type: "integer" },
            renterId: { type: "integer" },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date" },
            status: { type: "string", example: "REQUESTED" },
            totalAmount: { type: "number" },
          },
        },
        BookingTask: {
          type: "object",
          properties: {
            id: { type: "integer" },
            bookingId: { type: "integer" },
            title: { type: "string" },
            done: { type: "boolean" },
            notes: { type: "string" },
            photoUrls: { type: "array", items: { type: "string" } },
          },
        },
        OTPRequest: {
          type: "object",
          properties: {
            phone: { type: "string" },
            email: { type: "string" },
          },
        },
        OTPVerify: {
          type: "object",
          properties: {
            phone: { type: "string" },
            otp: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
