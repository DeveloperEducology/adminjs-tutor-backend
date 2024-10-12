import School from "../../models/school.js";

export const getAllSchools = async (req, reply) => {
  try {
    const school = await School.find();
    return reply.send(school);
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

