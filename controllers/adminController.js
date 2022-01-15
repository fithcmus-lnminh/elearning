const getUserInfo = require("../utils/get-user");
const { User } = require("../models/user.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Courses = require("../models/course.model");

exports.getManagement = (req, res) => {
  return res.redirect("/management/accounts");
};

exports.getAccountsManagement = async (req, res) => {
  const user = getUserInfo(req.user);
  const errors = validationResult(req);

  const users_data = await User.find();
  let users = [];
  for (u of users_data)
    users.push({
      _id: u._id,
      first_name: u.first_name,
      last_name: u.last_name,
      email: u.email,
      phone: u.phone,
      DOB: u.DOB.toISOString().split("T")[0],
      permission: u.permission,
    });

  return res.render("admin/account", {
    cssP: () => "css",
    headerP: () => "header",
    footerP: () => "footer",
    isLoggedIn: req.user,
    user: user,
    users: users.reverse(),
    totalUsers: users.length,
    title: "Account Management",
  });
};

exports.getCoursesManagement = async (req, res) => {
  const user = getUserInfo(req.user);
  const allcourses = await Courses.getAllCourse();
  const courses = [];

  for (let i = 0; i < allcourses.length; i++) {
    const ts = await User.find({ permission: "Teacher" });
    let teacher;
    for (let t of ts) {
      for (let c of t.courses) {
        if (c._id.toString() === allcourses[i]._id.toString()) {
          teacher = t;
          break;
        }
      }
    }
    courses.push({
      _id: allcourses[i]._id,
      courseName: allcourses[i].courseName,
      des: allcourses[i].des,
      studentAmount: allcourses[i].studentAmount,
      rating: allcourses[i].rating,
      price: allcourses[i].price,
      teacher: teacher.first_name + " " + teacher.last_name,
    });
  }

  return res.render("admin/course", {
    cssP: () => "css",
    headerP: () => "header",
    footerP: () => "footer",
    isLoggedIn: req.user,
    totalCourse: courses.length,
    courses: courses.reverse(),
    user: user,
    title: "Course Management",
  });
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  User.findByIdAndRemove(userId)
    .then(() => {
      return res.redirect("/management");
    })
    .catch((err) => console.log(err));
};

exports.addUser = async (req, res) => {
  const user = getUserInfo(req.user);
  const errors = validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const phone = req.body.phone;
  const dob = req.body.dob;

  const users_data = await User.find();
  let users = [];
  for (u of users_data)
    users.push({
      _id: u._id,
      first_name: u.first_name,
      last_name: u.last_name,
      email: u.email,
      phone: u.phone,
      DOB: u.DOB.toISOString().split("T")[0],
      permission: u.permission,
    });

  let us = await User.findOne({ email: email });

  if (us) {
    errors.errors.push({
      value: req.body.email,
      msg: "Email already exists",
      param: "email",
      location: "body",
    });
  }

  if (!errors.isEmpty()) {
    return res.render("admin/account", {
      cssP: () => "css",
      headerP: () => "header",
      footerP: () => "footer",
      isLoggedIn: req.user,
      email: email,
      role: role,
      fname: fname,
      lname: lname,
      phone: phone,
      dob: dob,
      autoshow: true,
      user: user,
      users: users.reverse(),
      totalUsers: users.length,
      errorMessage: errors.array(),
      title: "Account Management",
    });
  }

  const hasedPassword = await bcrypt.hash(password, 12);

  us = new User({
    email: email,
    password: hasedPassword,
    permission: role,
    first_name: fname,
    last_name: lname,
    phone: phone,
    DOB: dob,
  });

  us.save()
    .then(() => {
      return res.redirect("/management");
    })
    .catch((err) => console.log(err));
};

exports.deleteCourse = (req, res) => {
  const courseId = req.params.courseId;

  Courses.deleteCourse(courseId)
    .then(() => res.redirect("/management/courses"))
    .catch((err) => console.log(err));
};
