import express from "express";
import jwt from "jsonwebtoken";
import jwtAuthGuard from "../middlewares/jwtGuard.js";
const router = express.Router();
import { User, Education, WorkExperience } from "../modals/user.js";

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

router.get("/me", jwtAuthGuard, async (req, res) => {
  try {
    // fetching user
    const user = await User.findById(req.user._id);

    if (user === null) {
      return res.status(404).json({
        success: false,
        message: "Failed to find user!",
      });
    }
    // fetchign the educations of the user if found
    const educations = Education.find({ user: user._id });

    // fetching the work experiences of the usr if found
    const workExperiences = WorkExperience.find({ user: user._id });

    const [edu, work] = await Promise.all([educations, workExperiences]);

    console.log(work);

    return res.status(200).json({
      data: { ...user._doc, education: edu, experience: work },
      success: true,
      message: "User Found!",
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
