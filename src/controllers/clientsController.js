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
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getOrdersByClientId(req, res) {
  const { id } = req.params;

  try {
    const orders = await connection.query(
      `
      SELECT 
      orders.id AS "orderId",
      orders.quantity,
      orders."createdAt",
      orders."totalPrice",
      cakes.name AS "cakeName"
      FROM clients
      JOIN orders ON clients.id=orders."clientId"
      JOIN cakes ON orders."cakeId"=cakes.id
      WHERE clients.id=$1
    `,
      [id]
    );

    const ordersByClientId = orders.rows.map((client) => ({
      orderId: client.orderId,
      quantity: client.quantity,
      createdAt: client.createdAt,
      totalPrice: client.totalPrice,
      cakeName: client.cakeName,
    }));

    if (ordersByClientId.length === 0) {
      return res.sendStatus(404);
    } else {
      res.status(200).send(ordersByClientId);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
}
