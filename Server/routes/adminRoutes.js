const express = require("express");
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Protect all admin routes with auth and admin middleware
router.use(authMiddleware, adminMiddleware);

// User management routes
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);

// Order management routes
router.get("/orders", adminController.getAllOrders);
router.get("/orders/stats", adminController.getOrderStats);
router.put("/orders/:id", adminController.updateOrderStatus);

// Order tracking routes
router.get("/orders/:id/tracking", adminController.getOrderTracking);
router.post("/orders/:id/tracking", adminController.addTrackingUpdate);

// Product statistics
router.get("/products/stats", adminController.getProductStats);

// Dashboard
router.get("/dashboard", adminController.getDashboard);

module.exports = router;
