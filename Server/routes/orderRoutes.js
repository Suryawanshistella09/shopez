const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, orderController.createOrder);
router.get("/", authMiddleware, orderController.getOrders);
router.get("/:id", authMiddleware, orderController.getOrderById);
router.put("/:id", authMiddleware, orderController.updateOrderStatus);
router.delete("/:id", authMiddleware, orderController.deleteOrder);

// Order tracking routes
router.get("/:id/tracking", authMiddleware, orderController.getOrderTracking);
router.get("/track/:trackingNumber", orderController.trackByNumber);

module.exports = router;