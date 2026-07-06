import { baseTemplate } from "./baseTemplate.js";

export const orderConfirmationTemplate = (order) =>
baseTemplate({
heading:"Order Confirmed ✅",
content:`

<p>Your order has been confirmed successfully.</p>

<p><strong>Order ID:</strong> ${order.receipt}</p>

<p><strong>Total:</strong> ₹${order.total}</p>

<p>We'll start preparing your order shortly.</p>

`,
buttonText:"Track Order",
buttonUrl:`https://popfresh.in/orders/${order.receipt}`
});