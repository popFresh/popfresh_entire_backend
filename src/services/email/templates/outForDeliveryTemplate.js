import { baseEmail } from "./baseEmail.js";

export const outForDeliveryTemplate = ({
  receipt,
  trackingUrl,
}) =>
  baseEmail({
    badge: "OUT FOR DELIVERY",

    heading: "Today's the Day! 🎉",

    description:
      "Your Pop Fresh order is out for delivery and should reach your doorstep today. We hope you're as excited as we are! Get ready to enjoy the perfect crunch with every bite.",

    status: "Out for Delivery",

    delivery: "Expected Today",

    receipt,

    buttonText: "Track Live Order",

    buttonLink: trackingUrl,
  });