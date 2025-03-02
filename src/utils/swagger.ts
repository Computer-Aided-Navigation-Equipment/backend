import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "This is the API documentation for our Node.js app.",
  },
  servers: [
    {
      url: "http://localhost:6001/api",
      description: "Development server",
    },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          username: { type: "string" },
          email: { type: "string", format: "email" },
          phoneNumber: { type: "string" },
          walletBalance: { type: "number" },
          bonusBalance: { type: "number" },
          blockedBonusBalance: { type: "number" },
          blockedWalletBalance: { type: "number" },
          totalGamesPlayed: { type: "number" },
          totalWins: { type: "number" },
          totalLosses: { type: "number" },
          winRate: { type: "number" },
          currentStreak: { type: "number" },
          userType: { type: "string", enum: ["user", "admin"] },
        },
      },
      Challenge: {
        type: "object",
        properties: {
          gameId: { type: "string", format: "uuid" },
          challengerId: { type: "string", format: "uuid" },
          betAmount: { type: "number", default: 5 },
          challengedId: { type: "string", format: "uuid", nullable: true },
          status: {
            type: "string",
            enum: ["pending", "accepted", "declined", "completed"],
            default: "pending",
          },
          type: { type: "string", enum: ["open", "direct"], default: "open" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Dispute: {
        type: "object",
        properties: {
          matchId: { type: "string", format: "uuid" },
          disputedBy: { type: "string", format: "uuid" },
          disputedTo: { type: "string", format: "uuid" },
          reason: { type: "string" },
          status: {
            type: "string",
            enum: ["pending", "resolved"],
            default: "pending",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Game: {
        type: "object",
        properties: {
          name: { type: "string" },
          image: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      GameStats: {
        type: "object",
        properties: {
          userId: { type: "string", format: "uuid" },
          gameId: { type: "string", format: "uuid" },
          totalGamesPlayed: { type: "number", default: 0 },
          totalWins: { type: "number", default: 0 },
          totalLosses: { type: "number", default: 0 },
          winRate: { type: "number", default: 0.0 },
          currentStreak: { type: "number", default: 0 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Match: {
        type: "object",
        properties: {
          gameId: { type: "string", format: "uuid" },
          challengeId: { type: "string", format: "uuid" },
          challengerId: { type: "string", format: "uuid" },
          challengedId: { type: "string", format: "uuid" },
          betAmount: { type: "number" },
          challengerBalanceType: { type: "string", enum: ["wallet", "bonus"] },
          challengedBalanceType: { type: "string", enum: ["wallet", "bonus"] },
          suggestedScore: { type: "string" },
          finalScore: { type: "string" },
          scoreSubmittedBy: { type: "string" },
          cancelRequestedBy: { type: "string" },
          winnerId: { type: "string", format: "uuid", nullable: true },
          status: {
            type: "string",
            enum: [
              "playing",
              "pendingCancelApproval",
              "pendingScoreApproval",
              "completed",
              "cancelled",
              "disputed",
            ],
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Message: {
        type: "object",
        properties: {
          chatId: { type: "string", format: "uuid" },
          chatType: {
            type: "string",
            enum: ["Challenge", "Dispute"],
            default: "Challenge",
          },
          content: { type: "string" },
          senderId: { type: "string", format: "uuid" },
          attachments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                url: { type: "string" },
                key: { type: "string" },
                mimeType: { type: "string" },
              },
            },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          userId: { type: "string", format: "uuid" },
          type: {
            type: "string",
            enum: [
              "cancel-bonus-bet",
              "bonus-bet",
              "cancel-wallet-bet",
              "wallet-bet",
              "win",
              "wallet-lose",
              "deposit",
              "withdrawal",
              "admin-bonus",
            ],
          },
          amount: { type: "number" },
          description: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};
export const swaggerSpec = swaggerJSDoc(options);
