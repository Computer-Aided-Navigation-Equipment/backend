import { INotification } from "../models/NotificationModel.js";
import User, { IUser } from "../models/UserModel.js";
import { IChallenge } from "../models/ChallengeModel.js";
import { IItem } from "../models/ItemModel.js";
import SibApiV3Sdk from "sib-api-v3-sdk";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { IWithdraw } from "../models/WithdrawModel.js";

// Initialize the Brevo API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const loadEmailTemplate = async (
  templateName: string,
  replacements: Record<string, string>
) => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const emailsDir =
      process.env.NODE_ENV === "development"
        ? "../emailTemplates"
        : "../../src/emailTemplates";

    const filePath = path.join(__dirname, emailsDir, `${templateName}.html`);

    let htmlContent = await fs.readFile(filePath, "utf-8");

    // Replace placeholders with actual values
    for (const [key, value] of Object.entries(replacements)) {
      htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, "g"), value);
    }

    return htmlContent;
  } catch (error) {
    console.error(`Error loading email template: ${error}`);
    throw new Error("Failed to load email template");
  }
};

export const sendEmail = async (
  notificationType:
    | INotification["type"]
    | "direct-challenge"
    | "accept-challenge",
  user: IUser,
  item?: IItem,
  challenge?: IChallenge,
  withdraw?: IWithdraw
) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Email sending is disabled in development mode");
      return;
    }
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    switch (notificationType) {
      case "item-sold": {
        const templateName = "item-sold";
        const replacements = {
          username: user.username,
          itemName: item?.title,
          buyerContactLink: `${process.env.FRONTEND_URL}/chat/${item?._id}`,
          imageLink: `${process.env.FRONTEND_URL}/assets/logo.png`,
        };
        const htmlContent = await loadEmailTemplate(templateName, replacements);

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = {
          email: "no-reply@aytji.com",
          name: "Aytji",
        };
        sendSmtpEmail.to = [{ email: user.email, name: user.username }];
        sendSmtpEmail.subject = `Your item "${item?.title}" has been sold!`;
        sendSmtpEmail.htmlContent = htmlContent;

        try {
          await apiInstance.sendTransacEmail(sendSmtpEmail);
          console.log("Email sent successfully.");
        } catch (error) {
          console.error("Error sending email:", error);
        }
        break;
      }
      case "item-outbid": {
        const templateNameOutbid = "item-outbid";
        const replacementsOutbid = {
          username: user.username,
          itemName: item?.title,
          itemLink: `${process.env.FRONTEND_URL}/auction/${item?._id}`,
          imageLink: `${process.env.FRONTEND_URL}/assets/logo.png`,
        };
        const htmlContentOutbid = await loadEmailTemplate(
          templateNameOutbid,
          replacementsOutbid
        );

        const sendSmtpEmailOutbid = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmailOutbid.sender = {
          email: "no-reply@aytji.com",
          name: "Aytji",
        };
        sendSmtpEmailOutbid.to = [{ email: user.email, name: user.username }];
        sendSmtpEmailOutbid.subject = `You've Been Outbid on "${item?.title}"`;
        sendSmtpEmailOutbid.htmlContent = htmlContentOutbid;

        try {
          await apiInstance.sendTransacEmail(sendSmtpEmailOutbid);
          console.log("Outbid email sent successfully.");
        } catch (error) {
          console.error("Error sending outbid email:", error);
        }
        break;
      }
      case "item-purchase":
        const templateNamePurchase = "item-purchase";
        const replacementsPurchase = {
          username: user.username,
          itemName: item?.title,
          sellerContactLink: `${process.env.FRONTEND_URL}/chat/${item?._id}`,
          imageLink: `${process.env.FRONTEND_URL}/assets/logo.png`,
        };
        const htmlContentPurchase = await loadEmailTemplate(
          templateNamePurchase,
          replacementsPurchase
        );

        const sendSmtpEmailPurchase = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmailPurchase.sender = {
          email: "no-reply@aytji.com",
          name: "Aytji",
        };
        sendSmtpEmailPurchase.to = [{ email: user.email, name: user.username }];
        sendSmtpEmailPurchase.subject = `You've Won the Item: "${item?.title}"`;
        sendSmtpEmailPurchase.htmlContent = htmlContentPurchase;

        try {
          await apiInstance.sendTransacEmail(sendSmtpEmailPurchase);
          console.log("Item purchase email sent successfully.");
        } catch (error) {
          console.error("Error sending item purchase email:", error);
        }
        break;
      case "direct-challenge":
        const templateNameChallenge = "direct-challenge";
        const challenger = await User.findById(challenge?.challengerId);
        if (!challenger) {
          return;
        }
        const replacementsChallenge = {
          username: user.username,
          challengerName: challenger.username,
          challengeLink: `${process.env.FRONTEND_URL}/chat/${challenge?._id}`,
          imageLink: `${process.env.FRONTEND_URL}/assets/logo.png`,
        };
        const htmlContentChallenge = await loadEmailTemplate(
          templateNameChallenge,
          replacementsChallenge
        );

        const sendSmtpEmailChallenge = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmailChallenge.sender = {
          email: "no-reply@aytji.com",
          name: "Aytji",
        };
        sendSmtpEmailChallenge.to = [
          { email: user.email, name: user.username },
        ];
        sendSmtpEmailChallenge.subject = `Challenge Invitation from ${challenger.username}`;
        sendSmtpEmailChallenge.htmlContent = htmlContentChallenge;

        try {
          await apiInstance.sendTransacEmail(sendSmtpEmailChallenge);
          console.log("Challenge invitation email sent successfully.");
        } catch (error) {
          console.error("Error sending challenge invitation email:", error);
        }
        break;
      case "accept-challenge":
        const templateNameAcceptChallenge = "accept-challenge";
        const otherUserId =
          user._id === challenge.challengerId
            ? challenge.challengedId
            : challenge.challengerId;
        const acceptor = await User.findById(otherUserId);
        if (!acceptor) {
          return;
        }
        const replacementsAcceptChallenge = {
          username: user.username,
          acceptorName: acceptor.username,
          challengeLink: `${process.env.FRONTEND_URL}/chat/${challenge?._id}`,
          imageLink: `${process.env.FRONTEND_URL}/assets/logo.png`,
        };
        const htmlContentAcceptChallenge = await loadEmailTemplate(
          templateNameAcceptChallenge,
          replacementsAcceptChallenge
        );

        const sendSmtpEmailAcceptChallenge = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmailChallenge.sender = {
          email: "no-reply@aytji.com",
          name: "Aytji",
        };
        sendSmtpEmailChallenge.to = [
          { email: user.email, name: user.username },
        ];
        sendSmtpEmailChallenge.subject = `Challenge Accepted by ${acceptor.username}`;
        sendSmtpEmailChallenge.htmlContent = htmlContentAcceptChallenge;

        try {
          await apiInstance.sendTransacEmail(sendSmtpEmailAcceptChallenge);
          console.log("Challenge acceptance email sent successfully.");
        } catch (error) {
          console.error("Error sending challenge acceptance email:", error);
        }

      case "withdrawal-completed": {
        const templateName = "withdrawal-completed";
        const replacements = {
          amount: withdraw.amount.toString(),
          email: withdraw.email.toString(),
          username: user.username,
          imageLink: `${process.env.FRONTEND_URL}/assets/logo.png`,
        };
        const htmlContent = await loadEmailTemplate(templateName, replacements);

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = {
          email: "no-reply@aytji.com",
          name: "Aytji",
        };
        sendSmtpEmail.to = [{ email: user.email, name: user.username }];
        sendSmtpEmail.subject = `Your withdrawal request has been completed`;
        sendSmtpEmail.htmlContent = htmlContent;

        try {
          await apiInstance.sendTransacEmail(sendSmtpEmail);
          console.log(" Withdrawal request completed email sent successfully.");
        } catch (error) {
          console.error("Error sending challenge acceptance email:", error);
        }
        break;
      }
      default:
        console.error("Unknown notification type.");
    }
  } catch (error) {
    console.log(error);
  }
};

export const sendBasicEmail = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  // if (process.env.NODE_ENV === "development") {
  //   console.log("Email sending is disabled in development mode");
  //   return;
  // }
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = {
    email: "no-reply@aytji.com",
    name: "Aytji",
  };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent successfully to ${to}.`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
