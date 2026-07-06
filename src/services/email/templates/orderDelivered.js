import { baseTemplate } from "./baseTemplate.js";

export const orderDeliveredTemplate=(order)=>
baseTemplate({

heading:"Delivered Successfully 🎉",

content:`

<p>Your order has been delivered successfully.</p>

<p>We hope everything arrived fresh and exactly as expected.</p>

<p>Thank you for shopping with PopFresh ❤️</p>

`,

buttonText:"Rate Your Experience",

buttonUrl:`https://popfresh.in/review/${order.receipt}`

});