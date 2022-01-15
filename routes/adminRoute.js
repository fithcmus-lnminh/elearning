const router = require("express").Router();
const adminController = require("../controllers/adminController");
const isAdmin = require("../middleware/is-admin");
const { body } = require("express-validator");

router.get("/management", isAdmin, adminController.getManagement);
router.get(
  "/management/accounts",
  isAdmin,
  adminController.getAccountsManagement
);
router.get(
  "/management/courses",
  isAdmin,
  adminController.getCoursesManagement
);
router.get("/delete-user/:userId", isAdmin, adminController.deleteUser);
router.get(
  "/admin/delete-course/:courseId",
  isAdmin,
  adminController.deleteCourse
);
router.post(
  "/admin/add-user",
  [
    body("email", "Email can not be empty").isLength({ min: 1 }),
    body("password", "Password must have at least 6 characters long").isLength({
      min: 6,
    }),
    body("fname", "First name can not be empty").isLength({ min: 1 }),
    body("lname", "Last name can not be empty").isLength({ min: 1 }),
    body(
      "phone",
      "Phone must be a number and have at least 6 characters long"
    ).isLength({
      min: 6,
    }),
    body("dob", "Choose a day of birth").custom((value, { req }) => {
      if (value === "") return false;
      return true;
    }),
    body("dob", "Date must less than current date").custom((value, { req }) => {
      if (value === "") return true;
      const time = new Date();
      const current = new Date(
        time.getFullYear(),
        time.getMonth(),
        time.getDate()
      );
      const input = new Date(value);
      if (input > current) return false;
      return true;
    }),
  ],
  isAdmin,
  adminController.addUser
);

module.exports = router;
