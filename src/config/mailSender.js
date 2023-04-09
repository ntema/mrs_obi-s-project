
// send email to user function
const nodemailer = require("nodemailer")
const handlebars = require("handlebars")
const path = require("path")
const fs = require("fs");
const { MAIL_PASS, MAIL } = require("../config/constants");
global.appRoot = path.resolve(__dirname);

module.exports = async function sendEmailToUser(
    {tempPath,replacements, mailTo, subject}
) {
    if(!MAIL || !MAIL_PASS) return
    const filePath = path.join(appRoot, tempPath);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const htmlToSend = template(replacements);
    try {
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: MAIL,
                pass: MAIL_PASS
            }
        })        
        let details = {
            from: MAIL,
            to: mailTo,
            subject,
            html:htmlToSend
        }
        try {
            mailTransporter.sendMail(details)
            
        } catch (error) {
            console.log({error})            
        }
    } catch (e) {
        console.log(e.message)
        return  e.message
    }
    return
};

//path root
// global.appRoot = path.resolve(__dirname);









