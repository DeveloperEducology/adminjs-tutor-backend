import City from "../../models/city.js";


export const getCities = async (req, reply) => {
  try {
    const cities = await City.find();
    return reply.send(cities);
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

