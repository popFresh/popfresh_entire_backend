import { baseTemplate } from "./baseTemplate.js";

export const orderPackedTemplate = (order)=>
baseTemplate({
heading:"Your Order Has Been Packed 📦",

content:`

<p>Good news!</p>

<p>Your order is carefully packed and ready for dispatch.</p>

<p><strong>Order:</strong> ${order.receipt}</p>

<p>Our delivery partner will pick it up shortly.</p>

`,

buttonText:"Track Order",
buttonUrl:`https://popfresh.in/orders/${order.receipt}`

});