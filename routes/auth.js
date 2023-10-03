import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();
import { User } from "../modals/user.js";
router.get("/activate-email/:token", async (req, res) => {
  try {
    const token = req.params.token;
    var { _id } = jwt.verify(token, process.env.SECRET);
    let user = await User.findById(_id);
    if (user) {
      if (user.emailVerified)
        return res.json({ success: true, data: "Account is Already Verified" });

      user.emailVerified = true;
      await user.save();

      // redirect to login page
      res.redirect(`${process.env.HOSTINGURL}/login`);
    } else return { success: false, data: "Link Expired!" };
  } catch (err) {
    return res.json({ success: false, data: err.message });
  }
});

export default router;
