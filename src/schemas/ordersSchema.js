import joi from "joi";

const ordersSchema = joi.object({
  clientId: joi.number().integer().required(),
  cakeId: joi.number().integer().required(),
  quantity: joi.number().integer().min(0).max(5).required(),
  totalPrice: joi.number().min(0).required(),
});

export default ordersSchema;
