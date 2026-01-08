const fetch = require("node-fetch");

async function sendTestBooking() {
  if (process.env.SEND_TEST_BOOKING !== "true") {
    console.log("Test booking disabled.");
    return;
  }

  const SEND_FUNCTION_URL = process.env.NETLIFY_SITE_URL + "/.netlify/functions/send";

  const formData = new URLSearchParams();
  formData.append("name", "TEST: Deployment Submission");
  formData.append("email", process.env.EMAIL); // Send to yourself
  formData.append("phone", "000-000-0000");
  formData.append("idea", "This is a test submission for deployment verification.");
  formData.append("size", "N/A");
  formData.append("placement", "N/A");
  formData.append("budget", "N/A");
  formData.append("contact_method", "email");
  formData.append("terms", "on");
  formData.append("company", ""); // honeypot empty

  try {
    const res = await fetch(SEND_FUNCTION_URL, {
      method: "POST",
      body: formData
    });
    console.log("Test booking sent, status:", res.status);
  } catch (err) {
    console.error("Error sending test booking:", err);
  }
}

sendTestBooking();
