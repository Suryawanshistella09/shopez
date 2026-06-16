const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Please add items to order" });
    }

    let totalPrice = 0;
    const itemsWithPrice = [];
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      const itemPrice = product.price;
      totalPrice += itemPrice * item.quantity;
      itemsWithPrice.push({ product: product._id, quantity: item.quantity, price: itemPrice });
    }

    // Normalize payment method to allowed enum values
    let pm = paymentMethod;
    const allowed = ["card", "bank_transfer", "cash_on_delivery"];
    if (!allowed.includes(pm)) {
      const pmLower = (pm || "").toLowerCase();
      if (pmLower.includes("card")) pm = "card";
      else if (pmLower.includes("bank")) pm = "bank_transfer";
      else if (pmLower.includes("cash") || pmLower.includes("cod")) pm = "cash_on_delivery";
      else pm = "cash_on_delivery";
    }

    const order = await Order.create({
      user: userId,
      items: itemsWithPrice,
      totalPrice,
      shippingAddress,
      paymentMethod: pm,
    });

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate("items.product");
    res.status(200).json({ message: "Orders fetched", orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order fetched", order });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated", order });
  } catch (error) {
    next(error);
  }
};


exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    next(error);
  }
};
