const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ message: "All users fetched", users });
  } catch (error) {
    next(error);
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User fetched", user });
  } catch (error) {
    next(error);
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User role updated", user });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product");
    res.status(200).json({ message: "All orders fetched", orders });
  } catch (error) {
    next(error);
  }
};

// Get order statistics (admin only)
exports.getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      message: "Order statistics fetched",
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get product statistics (admin only)
exports.getProductStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
    const totalValue = await Product.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$stock"] } } } },
    ]);

    res.status(200).json({
      message: "Product statistics fetched",
      stats: {
        totalProducts,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        totalInventoryValue: totalValue[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get dashboard data (admin only)
exports.getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    res.status(200).json({
      message: "Dashboard data fetched",
      dashboard: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};


// Update order status (admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus, status, location, description } = req.body;
    
    // Accept both orderStatus and status
    const newStatus = orderStatus || status;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update status
    order.status = newStatus;

    // Add to tracking history
    order.trackingHistory.push({
      status: newStatus,
      location: location || 'Warehouse',
      description: description || `Order status updated to ${newStatus}`,
      timestamp: new Date(),
      updatedBy: req.user.id,
    });

    // Set estimated delivery if status is shipped
    if (newStatus === 'shipped' && !order.estimatedDelivery) {
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + 5); // 5 days from now
      order.estimatedDelivery = estimatedDate;
    }

    // Set actual delivery date if delivered
    if (newStatus === 'delivered') {
      order.actualDelivery = new Date();
    }

    await order.save();
    await order.populate("user", "name email");

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    next(error);
  }
};

// Add tracking update (admin only)
exports.addTrackingUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { location, description, status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Add tracking update
    order.trackingHistory.push({
      status: status || order.status,
      location: location || 'In Transit',
      description: description || 'Package is in transit',
      timestamp: new Date(),
      updatedBy: req.user.id,
    });

    await order.save();
    await order.populate("user", "name email");

    res.status(200).json({ 
      message: "Tracking update added", 
      order,
      trackingHistory: order.trackingHistory 
    });
  } catch (error) {
    next(error);
  }
};

// Get order tracking details (admin only)
exports.getOrderTracking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product")
      .populate("trackingHistory.updatedBy", "name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ 
      message: "Order tracking fetched",
      tracking: {
        orderId: order._id,
        trackingNumber: order.trackingNumber,
        status: order.status,
        estimatedDelivery: order.estimatedDelivery,
        actualDelivery: order.actualDelivery,
        trackingHistory: order.trackingHistory,
        shippingAddress: order.shippingAddress,
      }
    });
  } catch (error) {
    next(error);
  }
};
