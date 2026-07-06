import { baseTemplate } from "./baseTemplate.js";

export const orderShippedTemplate=(order)=>
baseTemplate({

heading:"Your Order is On the Way 🚚",

content:`

<p>Your order has been shipped.</p>

<p><strong>Tracking Number:</strong>
${order.trackingId}</p>

<p>Expected Delivery:
<strong>${order.expectedDelivery}</strong></p>

`,

buttonText:"Track Shipment",

buttonUrl:order.trackingUrl

});