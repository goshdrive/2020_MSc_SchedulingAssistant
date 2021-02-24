/*
email module
*/
const nodemailer = require('nodemailer');
//create sender object
let transporter = nodemailer.createTransport({
    service: 'qq', // 
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "576390402@qq.com", // sender's email
        pass: 'ottrsxsgenafbdgc' //   pop3 
    }
});

//邮件内容
let mail = {
    transporter: transporter,
    send(mail, content, callback) {
        
        let mailOptions = {
            from:'576390402@qq.com', //sender's email
            to:mail,//mail, // list of receivers
            subject: 'Welcome to registration', // Subject line
            text:`${content}`, // plain text body
            html: `You have registered successfully: click: <a href=${content}>Here</a> to login` // html body   
        }

        //发送邮件
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                callback(-1); // fail
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            callback(1); // successfully
        });
    }
}
module.exports = mail;
