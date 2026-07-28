import { sendEmail } from "../_lib/email";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { store_name, customer_email, store_owner_email, order_number, total_amount, items } = req.body;

  const orderNo = order_number || 1001;
  const resolvedStore = store_name || "your store";
  const itemLines = Array.isArray(items)
    ? items.map((it: any) => `- ${it.name || "Item"} x${it.quantity || 1}`).join("\n")
    : "";

  const customer = await sendEmail({
    to: customer_email,
    subject: `Order #${orderNo} confirmed - ${resolvedStore}`,
    text: `Thank you for your order from ${resolvedStore}!\n\nOrder #${orderNo}\nTotal: ${total_amount ?? ""}\n\n${itemLines}\n\nWe'll let you know when it ships.`,
  });

  const owner = store_owner_email
    ? await sendEmail({
        to: store_owner_email,
        subject: `New sale - Order #${orderNo}`,
        text: `You made a sale on ${resolvedStore}.\n\nOrder #${orderNo}\nCustomer: ${customer_email || "unknown"}\nTotal: ${total_amount ?? ""}\n\n${itemLines}`,
        replyTo: customer_email,
      })
    : ({ dispatched: false, reason: "No store owner email provided." } as const);

  return res.json({
    success: customer.dispatched || owner.dispatched,
    customer_notified: customer.dispatched,
    owner_notified: owner.dispatched,
    order_number: orderNo,
    customer_error: customer.dispatched ? undefined : customer.reason,
    owner_error: owner.dispatched ? undefined : owner.reason,
    message: `Notifications processed for Order #${orderNo}`,
  });
}
