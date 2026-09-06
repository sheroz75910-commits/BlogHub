import { body } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const loginValidationRules = [
    body('identifier')
        .exists().withMessage('Username or email is required')
        .toLowerCase()
        .isString()
        .trim()
        .notEmpty().withMessage('Username must be provided')
        .custom((value) => {
            const isEmail = value.includes('@')
            if (isEmail && !/^\S+@\S+\.\S+$/.test(value)) {
                throw new ApiError("the email formate is invalid");
            }

            return true;
        }),


    body('password')
        .exists()
        .withMessage('Password is required')
];

export default loginValidationRules;