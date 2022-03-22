import connection from "../database.js";
import clientsSchema from "../schemas/clientsSchema.js";

export async function postClients(req, res) {
  const { name, address, phone } = req.body;

  const validation = clientsSchema.validate({
    name,
    address,
    phone,
  });
  if (validation.error) {
    return res.sendStatus(400);
  }

  try {
    await connection.query(
      `
            INSERT INTO
            clients (name, address, phone)
            VALUES ($1, $2, $3)
            `,
      [name, address, phone]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
