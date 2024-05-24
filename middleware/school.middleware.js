import Joi from "joi";

// Define schema for ContactDetails
const contactDetailsSchema = Joi.object({
  email: Joi.string().email().required(),
  address: Joi.string().allow(null),
  phone: Joi.string().required(),
  schoolID: Joi.string().allow(null),
});

// Define schema for School
const schoolSchema = Joi.object({
  schoolID: Joi.string().required(),
  // censusNumber:Joi.string().allow(null),
  type: Joi.string().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  // zone: Joi.string().allow(null),
  contact: contactDetailsSchema.allow(null),
  studentCount:  Joi.string().allow(null),
  apiKey: Joi.string().allow(null),
  userType: Joi.string().default("Admin"),
  avatar: Joi.string().allow(null),
  active: Joi.boolean().default(true),
  verificationToken: Joi.string().allow(null),
  resetToken: Joi.string().allow(null),
  emailVerified: Joi.boolean().default(false),
  createdAt: Joi.date()
    .iso()
    .default(() => new Date()),
  updatedAt: Joi.date()
    .iso()
    .default(() => new Date()),
});

// Middleware function to validate user registration data
export const validateSchoolReg = (req, res, next) => {
  const { error } = schoolSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }
  next();
};

