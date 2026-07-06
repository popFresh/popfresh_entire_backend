import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import healthRoutes from "./routes/api/v1/health.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import categoryRoutes from "./routes/api/v1/category.routes.js";
import productRoutes from "./routes/api/v1/product.routes.js";
import checkoutRoutes from "./routes/api/v1/checkout.routes.js";
import shippingRuleRoutes from "./routes/api/v1/shippingRule.routes.js";
import shippingRulePublicRoutes from "./routes/api/v1/public/shippingRule.routes.js"
import couponRoutes from "./routes/api/v1/coupon.routes.js"
import couponPublicRoutes from "./routes/api/v1/public/coupon.routes.js"
import pricingRoutes from "./routes/api/v1/public/pricing.route.js";
import orderRoutes from "./routes/api/v1/order.routes.js";
import customerRoutes from "./routes/api/v1/customer.routes.js"
import paymentRoutes from "./routes/api/v1/payment.routes.js";
import logisticsRoutes from "./routes/api/v1/logistics.routes.js";
import emailRoutes from "./routes/api/v1/email.routes.js";
import whatsappRoutes from "./routes/api/v1/whatsapp.routes.js";
import shippingRoutes from "./routes/api/v1/shipping.routes.js";


dotenv.config();

const app = express();

app.use(helmet());

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/shipping-rules",shippingRuleRoutes);
app.use("/api/v1/public/shipping-rule",shippingRulePublicRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/public/coupons",couponPublicRoutes);


app.use(
  "/api/v1/public/pricing",
  pricingRoutes
);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/logistics", logisticsRoutes);
app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/whatsapp", whatsappRoutes);
app.use(
    "/api/v1/shipping",
    shippingRoutes
);

app.use(errorHandler);

export default app;