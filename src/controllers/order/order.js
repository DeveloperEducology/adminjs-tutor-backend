import Branch from "../../models/branch.js";
import { Student } from "../../models/user.js";
import { Tutor } from "../../models/user.js";
import Order from "../../models/order.js";

// import { Branch, Student, Tutor, Order } from "../../models";

export const createOrder = async (req, reply) => {
  try {
    const { userId } = req.user;

    const { items, branch, totalPrice } = req.body;

    const StudentData = await Student.findById(userId);
    const brachData = await Branch.findById(branch);

    if (!StudentData) {
      return reply.status(404).send({ message: "Student not found" });
    }

    const newOrder = new Order({
      Student: userId,
      items: items.map((item) => ({
        id: item.id,
        item: item.item,
        count: item.count,
      })),
      branch,
      totalPrice,
      deliveryLocation: {
        latitude: StudentData.liveLocation.latitude,
        longitude: StudentData.liveLocation.longitude,
        address: StudentData.address || "",
      },
      pickupLocation: {
        latitude: brachData.location.latitude,
        longitude: brachData.location.longitude,
        address: brachData.address || "",
      },
    });

    const savedOrder = await newOrder.save();
    return reply.status(201).send(savedOrder);
  } catch (err) {
    return reply.status(500).send({ message: "Failed to create order", error });
  }
};

export const confirmOrder = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { deliveryPersonLocation } = req.body;

    const deliveryPerson = await Tutor.findById(userId);
    if (!deliveryPerson) {
      return reply.status(404).send({ message: "delivery person not found" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return reply.status(404).send({ message: "order not found" });
    }
    if (order.status !== "available") {
      return reply.status(400).send({ message: "order is not available" });
    }
    order.status = "confirmed";

    order.Tutor = userId;
    order.deliveryPersonLocation = {
      latitude: deliveryPersonLocation.latitude,
      longitude: deliveryPersonLocation.longitude,
      address: deliveryPersonLocation.address || "",
    };

    order.save();

    return reply.send(order);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "failed to confirm order", error });
  }
};

export const updateOrderStatus = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { status, deliveryPersonLocation } = req.body;

    const deliveryPerson = Tutor.findById(userId);

    if (!deliveryPerson) {
      return reply.status(404).send({ message: "Delivery Person not found" });
    }

    const order = await Order.findById(orderId);
    if (!order) return reply.status(404).send({ message: "Order not found" });

    if (["cancelled", "delivered"].includes(order.status)) {
      return reply.status(400).send({ message: "Order cannot be updated" });
    }

    if (order.Tutor.toString() !== userId) {
      return reply.status(403).send({ message: "Unauthorized" });
    }

    order.status = status;
    order.Tutor = userId;
    order.deliveryPersonLocation = deliveryPersonLocation;
    order.save();

    return reply.send(order);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "failed to update order status", error });
  }
};

export const getOrders = async (req, reply) => {
  try {
    const { status, StudentId, TutorId, branchId } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (StudentId) {
      query.Student = StudentId;
    }

    if (TutorId) query.Tutor = status;

    query.branch = branchId;
    const orders = await Order.find(query).populate(
      "Student branch items.item Tutor"
    );

    reply.send(orders);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "failed to confirm order", error });
  }
};

export const getOrderById = async (req, reply) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      "Student branch items.item Tutor"
    );
    if (!order) {
      return reply.status(500).send({ message: "order not found" });
    }

    reply.send(order);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "failed to confirm order", error });
  }
};
