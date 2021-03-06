import joi from "joi";

const cakesSchema = joi.object({
  name: joi.string().min(0).required(),
  price: joi.required(),
  description: joi.allow("").required(),
  image: joi.string().uri().required(),
});

export default cakesSchema;
