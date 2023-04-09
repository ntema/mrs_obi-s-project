const router = require("express").Router();
const { verifyToken } = require("../../middlewares/authMiddleware/verifyToken");
const verifyAdminAndUserToken = require("../../middlewares/authMiddleware/verifyUserAndAdmin");
const path = require("path");
const qr = require("qrcode")
const {readQRCode} = require("../../config/qrCodeReader")

router.get("/qrcode", (req, res, next) => {
    try {
      // let stJson = JSON.stringify(data)
      let stJson = "success";
      qr.toFile(
        // path.join(__dirname, "uploads/qrcode.png"),
        path.join(
          path.parse(path.parse(__dirname).dir).dir,
          "uploads/qrcode.png"
        ),
        stJson,
        { type: "png" },
        (err) => {
          console.log(
            path.join(
              path.parse(path.parse(__dirname).dir).dir,
              "uploads/qrcode.png"
            )
          );
          if (err) {
            return res.status(500).json({
              status: "error",
              data: "Error generating QR code",
            });
          } else {
            res.download(
              // path.join(__dirname, "uploads/qrcode.png"),
              path.join(
                path.parse(path.parse(__dirname).dir).dir,
                "uploads/qrcode.png"
              ),
              "qrcode.png",
              (err) => {
                if (err) {
                  return res.status(500).json({
                    status: "error",
                    data: "Error downloading QR code",
                  });
                } 
              }
            );
          }
        }
      );
    } catch(e) {
      next(e)
    }
});
router.get("/code_reader", async(req, res) => {
  try {
    // const filePath = path.join(__dirname, fileName);
    const filePath = path.join(
      path.parse(path.parse(__dirname).dir).dir,
      "uploads/qrcode.png"
    );
    // const filePath = require("../../uploads/qrcode.png");
    const readQR = readQRCode(filePath);
    readQR.then((result) => {
      console.log(result)
       return res.status(200).json({
         status: "success",
         data: result,
       });
    })
    readQR.catch((err) => {
      console.log(err.toString());
      return res.status(400).json({
        status: "success",
        data: err,
      });
    });
  } catch(e) {
    return e.message
  }

});

module.exports = router;
