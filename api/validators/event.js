const { check } = require("express-validator");

export const eventListValidator = [
  check("contractId")
    .optional()
    .isNumeric()
    .withMessage("Invalid contractId"),
  check("limit")
    .optional()
    .isNumeric()
    .withMessage("Invalid should be a number"),
  check("page")
    .optional()
    .isNumeric()
    .withMessage("page should be a number")
];

export const eventCreateValidator = [
  check("contractId")
    .optional()
    .isNumeric()
    .withMessage("Invalid contractId"),
  check("premium")
    .optional()
    .isNumeric()
    .withMessage("Invalid premium"),
  check("startDate")
    .optional()
    .isDate()
    .withMessage("invalid startDate format, should be a Date")
];

export const eventTerminateValidator = [
  check("contractId")
    .not()
    .isEmpty()
    .withMessage("contractId is required"),
  check("contractId")
    .isNumeric()
    .withMessage("Invalid contractId"),
  check("terminationDate")
    .optional()
    .isDate()
    .withMessage("invalid terminationDate format, should be a Date")
];
