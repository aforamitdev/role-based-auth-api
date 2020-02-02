const router = require("express").Router();

const { userRegistration,checkRolse, userLogin,userAuth,serializeUser } = require("../utils/Auth");
// Users registration route
router.post("/register-user", async (req, res) => {
  await userRegistration(req.body, "user", res);
});

// Admin registration route
router.post("/register-admin", async (req, res) => {
  await userRegistration(req.body, "admin", res);
});

// Super adnmin registration

router.post("/register-super-admin", async (req, res) => {
  await userRegistration(req.body, "superadmin", res);
});

// Users login  route
router.post("/login-user", async (req, res) => {
  await userLogin(req.body, "user", res);
});

// Admin login route
router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, "admin", res);
});

// Super admin login
router.post("/login-superadmin", async (req, res) => {
  await userLogin(req.body, "superadmin", res);
});

// profile route
router.get("/profile", userAuth,async (req, res) => {
  res.json(serializeUser(req.user))
});

// user Protected Router
router.get("/user-protected", checkRolse(["user"]), userAuth, async (req, res) => {

  res.json({message:"user here "})
});

// admin proteced router
router.get(
  "/admin-protected",
  checkRolse(["admin"]),
  userAuth,
  async (req, res) => {
      res.json({ message: "admin here " });

  }
);

// super admin protected router
router.get(
  "/superadmin-protected",
  checkRolse(["superadmin"]),
  userAuth,
  async (req, res) => {
      res.json({ message: "superuser here " });

  }
);

module.exports = router;
