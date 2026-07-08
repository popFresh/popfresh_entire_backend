import { baseEmail } from "./baseEmail.js";

export const orderDeliveredTemplate = ({
  receipt,
  orderLink,
}) =>
  baseEmail({
    badge: "ORDER DELIVERED",

    heading: "Enjoy Every Crunch! 🌿",

    description:
      "Your Pop Fresh order has been successfully delivered! We hope every bite brings you the perfect crunch and flavour you were looking forward to. Thank you for trusting us with your healthy snacking journey. We truly appreciate your support and can't wait to serve you again.",

    status: "Delivered",

    delivery: "Successfully Delivered 🎉",

    receipt,

    buttonText: "View Order",

    buttonLink: orderLink,
  });


// import { baseTemplate } from "./baseEmail.js";

// export const orderDeliveredTemplate=(order)=>
// baseTemplate({

// heading:"Delivered Successfully 🎉",

// content:`

// <p>Your order has been delivered successfully.</p>

// <p>We hope everything arrived fresh and exactly as expected.</p>

// <p>Thank you for shopping with PopFresh ❤️</p>

// `,

// buttonText:"Rate Your Experience",

// buttonUrl:`https://popfresh.in/review/${order.receipt}`

// });