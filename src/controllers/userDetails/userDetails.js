import School from "../../models/school.js";
import {
  Class,
  Subject,
  Location,
  Pincode,
  Board,
} from "../../models/userDetail.js";

export const getClasses = async (req, reply) => {
  try {
    const classes = await Class.find();
    return reply.send(classes);
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

export const getSubjects = async (req, reply) => {
  try {
    const subjects = await Subject.find();
    return reply.send(subjects);
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};



export const getPincodes = async (req, reply) => {
  try {
    const pincodes = await Pincode.find().populate("city");
   
    return reply.send(pincodes);
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

export const getBoards = async (req, reply) => {
  try {
    const boards = await Board.find();
    return reply.send(boards);
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};
