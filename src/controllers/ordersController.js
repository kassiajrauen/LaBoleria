import connection from "../database.js";
import ordersSchema from "../schemas/ordersSchema.js";

export async function postOrder(req, res) {
  const { clientId, cakeId, quantity, totalPrice } = req.body;

  const validation = ordersSchema.validate({
    clientId,
    cakeId,
    quantity,
    totalPrice,
  });
  if (validation.error) {
    console.log(validation.error);
    return res.sendStatus(400);
  }

  const existCake = await connection.query(
    `
        SELECT id FROM cakes
        WHERE id=$1
    `,
    [cakeId]
  );
  if (existCake.rowCount === 0) {
    return res.sendStatus(404);
  }

  const existClient = await connection.query(
    `
        SELECT id FROM clients
        WHERE id=$1
    `,
    [clientId]
  );
  if (existClient.rowCount === 0) {
    return res.sendStatus(404);
  }

  try {
    await connection.query(
      `
            INSERT INTO
            orders ("clientId", "cakeId", quantity, "totalPrice", "createdAt")
            VALUES ($1, $2, $3, $4, NOW())
            `,
      [clientId, cakeId, quantity, totalPrice]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getOrders(req, res) {
  const { date } = req.query;

  try {
    if (!date) {
      const orders = await connection.query(`
       SELECT orders.*,
       clients.id AS "clientId",
       clients.name AS "clientName",
       clients.address AS "clientAddress",
       clients.phone AS "clientPhone",
       cakes.id AS "cakeId",
       cakes.name AS "cakeName",     
       cakes.price AS "cakePrice",
       cakes.image AS "cakeImage",
       cakes.description AS "cakeDescription"
       FROM orders
         JOIN clients ON clients.id=orders."clientId"
         JOIN cakes ON cakes.id=orders."cakeId"`);

      const orderResult = orders.rows.map((order) => ({
        id: order.id,
        client: {
          id: order.clientId,
          name: order.clientName,
          address: order.clientAddress,
          phone: order.clientPhone,
        },
        cake: {
          id: order.cakeId,
          name: order.cakeName,
          price: order.cakePrice,
          image: order.cakeImage,
          description: order.cakeDescription,
        },
        createdAt: order.createdAt,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
      }));
      res.send(orderResult);
    } else {
      const orders = await connection.query(
        `
      SELECT orders.*,
      clients.id AS "clientId",
      clients.name AS "clientName",
      clients.address AS "clientAddress",
      clients.phone AS "clientPhone",
      cakes.id AS "cakeId",
      cakes.name AS "cakeName",     
      cakes.price AS "cakePrice",
      cakes.image AS "cakeImage",
      cakes.description AS "cakeDescription"
      FROM orders
        JOIN clients ON clients.id=orders."clientId"
        JOIN cakes ON cakes.id=orders."cakeId"
        WHERE "createdAt" = $1
        `,
        [`${date}`]
      );

      const orderResultOfDate = orders.rows.map((order) => ({
        id: order.id,
        client: {
          id: order.clientId,
          name: order.clientName,
          address: order.clientAddress,
          phone: order.clientPhone,
        },
        cake: {
          id: order.cakeId,
          name: order.cakeName,
          price: order.cakePrice,
          image: order.cakeImage,
          description: order.cakeDescription,
        },
        createdAt: order.createdAt,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
      }));

      if (orderResultOfDate.length === 0) {
        return res.status(404).send([]);
      } else {
        res.send(orderResultOfDate);
      }
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getOrdersId(req, res) {
  const { id } = req.params;

  try {
    const orders = await connection.query(
      `
      SELECT orders.*,
      clients.id AS "clientId",
      clients.name AS "clientName",
      clients.address AS "clientAddress",
      clients.phone AS "clientPhone",
      cakes.id AS "cakeId",
      cakes.name AS "cakeName",     
      cakes.price AS "cakePrice",
      cakes.image AS "cakeImage",
      cakes.description AS "cakeDescription"
      FROM orders
        JOIN clients ON clients.id=orders."clientId"
        JOIN cakes ON cakes.id=orders."cakeId"
        WHERE orders.id=$1
        `,
      [id]
    );

    const orderResultOfId = orders.rows.map((order) => ({
      id: order.id,
      client: {
        id: order.clientId,
        name: order.clientName,
        address: order.clientAddress,
        phone: order.clientPhone,
      },
      cake: {
        id: order.cakeId,
        name: order.cakeName,
        price: order.cakePrice,
        image: order.cakeImage,
        description: order.cakeDescription,
      },
      createdAt: order.createdAt,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
    }));

    if (orderResultOfId.length === 0) {
      return res.sendStatus(404);
    } else {
      res.send(orderResultOfId);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

// psql -h ec2-3-208-121-149.compute-1.amazonaws.com -p 5432 -U zppnkwlnpvmdaj d71c2nkmolro5m
