import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/api/v1/auth.routes.js"
import healthRoutes from "./routes/api/v1/health.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import categoryRoutes from "./routes/api/v1/category.routes.js";
import productRoutes from "./routes/api/v1/product.routes.js";
import checkoutRoutes from "./routes/api/v1/checkout.routes.js";
import shippingRuleRoutes from "./routes/api/v1/shippingRule.routes.js";

import couponRoutes from "./routes/api/v1/coupon.routes.js"


import orderRoutes from "./routes/api/v1/order.routes.js";
import customerRoutes from "./routes/api/v1/customer.routes.js"
import paymentRoutes from "./routes/api/v1/payment.routes.js";
import logisticsRoutes from "./routes/api/v1/logistics.routes.js";
import shiprocketWebhookRoutes from "./routes/api/v1/shiprocketWebhook.routes.js";
import emailRoutes from "./routes/api/v1/email.routes.js";
import whatsappRoutes from "./routes/api/v1/whatsapp.routes.js";
import shippingRoutes from "./routes/api/v1/shipping.routes.js";
import teamRoutes from "./routes/api/v1/team.routes.js";
import dashboardRoutes from "./routes/api/v1/dashboard.routes.js";
import searchRoutes from "./routes/api/v1/search.routes.js";
import notificationRoutes from "./routes/api/v1/notification.route.js";


// PUBLIC ROUTES 
import couponPublicRoutes from "./routes/api/v1/public/coupon.routes.js";
import shippingRulePublicRoutes from "./routes/api/v1/public/shippingRule.routes.js"
import categoryPublicRoutes from "./routes/api/v1/public/category.routes.js"
import checkoutPublicRoutes from "./routes/api/v1/public/checkout.routes.js"
import pricingPublicRoutes from "./routes/api/v1/public/pricing.routes.js";
import productPublicRoutes from "./routes/api/v1/public/product.routes.js";

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
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/shipping-rules",shippingRuleRoutes);

app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/notifications", notificationRoutes);



app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/logistics", logisticsRoutes);
app.use("/api/v1/webhooks/shiprocket", shiprocketWebhookRoutes);
app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/whatsapp", whatsappRoutes);
app.use(
    "/api/v1/shipping",
    shippingRoutes
);

// ============================
// Public Routes
// ============================

app.use("/api/v1/public/products", productPublicRoutes);
app.use("/api/v1/public/categories", categoryPublicRoutes);
app.use("/api/v1/public/checkout", checkoutPublicRoutes);
app.use("/api/v1/public/coupons", couponPublicRoutes);
app.use("/api/v1/public/pricing", pricingPublicRoutes);
app.use("/api/v1/public/shipping-rules", shippingRulePublicRoutes);

app.use(errorHandler);

export default app;