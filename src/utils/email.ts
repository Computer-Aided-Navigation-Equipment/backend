import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendBasicEmail = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  // if (process.env.NODE_ENV === "development") {
  //   console.log("Email sending is disabled in development mode");
  //   return;
  // }

  if (!process.env.BREVO_API_KEY) {
    console.error("Brevo API key is not set in the environment variables.");
    throw new Error("Brevo API key is not set in the environment variables.");
  }
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = {
    email: "no-reply@aytji.com",
    name: "Smart Cane",
  };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent successfully to ${to}.`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email: " + error);
  }
};
