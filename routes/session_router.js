const express = require("express");
const router = express.Router();
const Session = require("../db/session_model");
const { check, validationResult } = require("express-validator");
const CustomError = require("../exceptions/custom_error");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     let parts = file.originalname.split(".");
//     let ext = parts.pop();
//     let name = parts.join(".");
//     parts = name.split(" ").join(".");
//     cb(null, +Date.now() + "." + ext);
//   },
// });
// const upload = multer({ storage: storage });

router.post(
  "/",
  [
    check("toAddress")
      .isString()
      .isLength({ min: 3, max: 400 })
      .withMessage("Invalid toAddress"),
    check("sessionId")
      .isString()
      .isLength({ min: 3, max: 400 })
      .withMessage("Invalid sessionId"),
    // TODO validate for the ethereum address specific
    check("peerId")
      .isString()
      .isLength({ min: 3, max: 400 })
      .withMessage("Invalid peerId"),
    check("perHourCost").isInt().withMessage("Invalid perHourCost"),
  ],
  async (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return next(
          new CustomError("Invalid fields", 400, "00002", errors.array())
        );
      }
      const { toAddress, sessionId, peerId, perHourCost } = request.body;
      const newSession = new Session({
        toAddress,
        sessionId,
        peerId,
        perHourCost,
      });
      await newSession.save();
      response.status(201).send("Ok");
    } catch (error) {
      console.log({ error });
      response.status(500).send({
        result: 0,
        message: "Something went wrong",
        payload: { error },
      });
    }
  }
);

router.get("/:sessionId", async (request, response) => {
  try {
    const { sessionId } = request.params;
    const { toAddress, peerId, perHourCost, fromAddress } =
      await Session.findOne({
        sessionId,
      });
    response
      .status(200)
      .send({ sessionId, toAddress, peerId, perHourCost, fromAddress });
  } catch (error) {
    console.log("Error : ", error);
    response.status(500).send({
      result: 0,
      message: "Something went wrong",
      payload: { error },
    });
  }
});
// update the from Address and the duration in seconds

router.put("/", async (request, response) => {
  try {
    const { sessionId, fromAddress } = request.body;
    await Session.findOneAndUpdate(
      {
        sessionId,
      },
      { fromAddress }
    );
    response.status(200).send({});
  } catch (error) {
    console.log("Error : ", error);
    response.status(500).send({
      result: 0,
      message: "Something went wrong",
      payload: { error },
    });
  }
});

// router.put("/upload", async (request, response) => {
//   try {
//     const { sessionId, fromAddress, durationInSeconds } = request.body;
//     await Session.findOneAndUpdate(
//       {
//         sessionId,
//       },
//       { fromAddress, durationInSeconds }
//     );
//     response.status(200).send({});
//   } catch (error) {
//     console.log("Error : ", error);
//     response.status(500).send({
//       result: 0,
//       message: "Something went wrong",
//       payload: { error },
//     });
//   }
// });
module.exports = router;
