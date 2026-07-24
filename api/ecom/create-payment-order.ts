export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { site_id, amount, currency, gateway, items, customer } = req.body;

  if (!site_id || !amount || !items || !customer) {
    return res.status(400).json({ error: "Missing required order parameters (site_id, amount, items, customer)." });
  }

  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const selectedGateway = gateway || "razorpay";

  if (selectedGateway === "razorpay") {
    const razorpayOrderId = `order_rzp_${Date.now()}_${orderNumber}`;
    return res.json({
      success: true,
      gateway: "razorpay",
      order_id: razorpayOrderId,
      key_id: req.body.razorpay_key_id || "rzp_test_onlypage_default",
      amount: Math.round(amount * 100),
      currency: currency || "INR",
      notes: { site_id, customer_email: customer.email },
    });
  } else if (selectedGateway === "stripe") {
    const stripeClientSecret = `pi_stripe_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
    return res.json({
      success: true,
      gateway: "stripe",
      client_secret: stripeClientSecret,
      amount: Math.round(amount * 100),
      currency: currency || "USD",
    });
  } else if (selectedGateway === "upi") {
    const upiVpa = req.body.upi_vpa || "merchant@upi";
    const upiPayLink = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=OnlyPage%20Store&am=${amount}&cu=INR&tn=Order%20${orderNumber}`;
    return res.json({
      success: true,
      gateway: "upi",
      upi_vpa: upiVpa,
      upi_link: upiPayLink,
      order_number: orderNumber,
    });
  }

  return res.status(400).json({ error: "Unsupported payment gateway requested." });
}
