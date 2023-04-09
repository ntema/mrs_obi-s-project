const Jimp = require("jimp");
const qrCodeReader = require("qrcode-reader");
const qr = require("qrcode");
const fs = require("fs");
const path = require("path");

module.exports = {
  readQRCode: async (fileName) => {
    const filePath = path.join(
      path.parse(path.parse(__dirname).dir).dir,
      "src/uploads/qrcode.png"
    );
    console.log(filePath)
    try {
      if (fs.existsSync(filePath)) {
        const img = Jimp.read(fs.readFileSync(filePath));
        const readQR = new qrCodeReader();
        const value = await new Promise((resolve, reject) => {
          readQR.callback = (err, v) =>
            err != null ? reject(err) : resolve(v);
          readQR.decode(img.bitmap);
        });
        return value.result;
      } else {
        console.log("path does not exist");
        return "path does not exist";
      }
    } catch (e) {
      return e.message;
    }
  },
  
  genQRCode: async (data) => {
    try {
      let stJson = JSON.stringify(data)
      qr.toFile(path.join(__dirname, "uploads/qrcode.png"), stJson , {type:"png"} , (err) => {
        if(err) {
          return res.status(500).json({
            status:"error",
            data:"Error generating QR code"
          })
        } else {
          res.download(path.join(__dirname, "uploads/qrcode.png"), "qrcode.png", (err) => {
            if (err) {
              return res.status(500).json({
                status: "error",
                data: "Error downloading QR code",
              });
            } 
          })
        }
      })
    } catch (e) {
      return e.message;
    }
  },
};