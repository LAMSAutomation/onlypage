import { sendEmail } from "../_lib/email";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { site_id, store_name, name, email, phone, custom_welcome_subject, custom_welcome_body } = req.body;

  if (!site_id || !email) {
    return res.status(400).json({ error: "Missing site_id or customer email." });
  }

  const resolvedStoreName = store_name || "Store";
  const customerName = name || email.split("@")[0];
  const subject = (custom_welcome_subject || "Welcome to {{store_name}}! 🎉 Here is your 10% discount code")
    .replace(/\{\{store_name\}\}/g, resolvedStoreName)
    .replace(/\{\{customer_name\}\}/g, customerName);

  const body = (custom_welcome_body || "Hi {{customer_name}},\n\nThank you for signing up with {{store_name}}!")
    .replace(/\{\{store_name\}\}/g, resolvedStoreName)
    .replace(/\{\{customer_name\}\}/g, customerName);

  const welcome = await sendEmail({ to: email, subject, text: body });

  return res.json({
    success: welcome.dispatched,
    customer: { name: customerName, email, phone: phone || "" },
    email_dispatched: welcome.dispatched,
    whatsapp_dispatched: false,
    email_error: welcome.dispatched ? undefined : welcome.reason,
    subject,
    body,
  });
}
