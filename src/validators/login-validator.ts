import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        trim: true,
        errorMessage: "Email is required!",
        notEmpty: true,
        isEmail: true,
    },
    password: {
        trim: true,
        errorMessage: "password is required!",
        notEmpty: true,
    },
});
// export default [body("email").notEmpty().withMessage("Email is required!")];
