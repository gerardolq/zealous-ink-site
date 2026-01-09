const nodemailer = require("nodemailer");

exports.handler = async function (event) {
  try {
    const data = new URLSearchParams(event.body);

    // Honeypot spam protection
    if (data.get("company")) {
      return { statusCode: 200, body: "OK" };
    }

    const isTestEmail = process.env.SEND_TEST_BOOKING === "true";

    // Extract form fields
    const name = isTestEmail ? "TEST: Deployment Submission" : data.get("name");
    const email = isTestEmail ? process.env.EMAIL : data.get("email");
    const textNumber = data.get("phone") || "Not provided";
    const idea = isTestEmail
      ? "This is a test submission for deployment verification."
      : data.get("idea");
    const size = data.get("size") || "N/A";
    const placement = data.get("placement") || "N/A";
    const budget = data.get("budget") || "Not specified";
    const contactMethods = data.getAll("contact_method").join(", ") || "N/A";

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Build HTML email
    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px;">
        <h2 style="color: ${isTestEmail ? "red" : "#000"};">
          ${isTestEmail ? "TEST EMAIL — Deployment Submission" : "New Tattoo Inquiry"}
        </h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Text:</strong> ${textNumber}</p>
        <p><strong>Preferred Contact:</strong> ${contactMethods}</p>

        <hr />

        <p><strong>Tattoo Idea:</strong></p>
        <p>${idea}</p>

        <p><strong>Size:</strong> ${size}</p>
        <p><strong>Placement:</strong> ${placement}</p>
        <p><strong>Budget:</strong> ${budget}</p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Tattoo Booking" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      replyTo: isTestEmail ? process.env.EMAIL : data.get("email"),
      subject: isTestEmail
        ? "TEST: Deployment Submission"
        : `Tattoo Inquiry — ${name}`,
      html: htmlEmail
    });

    return { statusCode: 200, body: "Message sent" };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Error sending message" };
  }
};
