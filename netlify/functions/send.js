const nodemailer = require("nodemailer");

console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL_PASSWORD LENGTH:", process.env.EMAIL_PASSWORD?.length);

exports.handler = async function (event) {
  try {
    const data = new URLSearchParams(event.body);

    // -------------------------
    // Honeypot Spam Protection
    // -------------------------
    if (data.get("company")) {
      return {
        statusCode: 200,
        body: "OK"
      };
    }

    // -------------------------
    // Extract Fields
    // -------------------------
    const name = data.get("name");
    const email = data.get("email");
    const phone = data.get("phone") || "Not provided";
    const idea = data.get("idea");
    const size = data.get("size");
    const placement = data.get("placement");
    const budget = data.get("budget") || "Not specified";
    const contactMethods = data.getAll("contact_method").join(", ");

    // -------------------------
    // Transporter
    // -------------------------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // -------------------------
    // Email Formatting
    // -------------------------
    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Tattoo Inquiry</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preferred Contact:</strong> ${contactMethods}</p>

        <hr />

        <p><strong>Tattoo Idea</strong></p>
        <p>${idea}</p>

        <p><strong>Size:</strong> ${size}</p>
        <p><strong>Placement:</strong> ${placement}</p>
        <p><strong>Budget:</strong> ${budget}</p>
      </div>
    `;

    // -------------------------
    // Send Email
    // -------------------------
    await transporter.sendMail({
      from: `"Tattoo Booking" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      replyTo: email,
      subject: `Tattoo Inquiry — ${name}`,
      html: htmlEmail
    });

    return {
      statusCode: 200,
      body: "Message sent"
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Error sending message"
    };
  }
};
