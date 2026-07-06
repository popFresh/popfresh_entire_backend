import { baseTemplate } from "./baseTemplate.js";

export const welcomeTemplate = (name) =>
baseTemplate({
heading:`Welcome to PopFresh 🥬`,
content:`
<p>Hi <strong>${name}</strong>,</p>

<p>Welcome to the PopFresh family! We're excited to bring fresh groceries and everyday essentials right to your doorstep.</p>

<p>Enjoy a fast, reliable, and hassle-free shopping experience with carefully selected products and timely deliveries.</p>

<p>Thank you for choosing PopFresh.</p>
`,
buttonText:"Start Shopping",
buttonUrl:"https://popfresh.in"
});