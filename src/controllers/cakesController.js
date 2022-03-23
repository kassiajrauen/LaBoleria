import connection from "../database.js";
import cakesSchema from "../schemas/cakesSchema.js";

export async function postCakes(req, res) {
  const { name, price, description, image } = req.body;

  const validation = cakesSchema.validate({
    name,
    price,
    description,
    image,
  });
  if (validation.error) {
    return res.sendStatus(422);
  }

  try {
    if (name.length < 2 || price < 0) {
      return res.sendStatus(400);
    }

    const result = await connection.query(
      `
        SELECT id FROM cakes 
        WHERE name=$1
    `,
      [name]
    );
    if (result.rowCount > 0) {
      return res.sendStatus(409);
    }

    await connection.query(
      `
            INSERT INTO
            cakes (name, price, description, image)
            VALUES ($1, $2, $3, $4)
            `,
      [name, price, description, image]
    );
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
