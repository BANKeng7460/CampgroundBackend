const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: "nettruefree@gmail.com",
        pass: "sqct wumj fafu xyvu"
    }
});

async function sendConfirmationEmail(toEmail, userName , campgroundName , bookingDate, nights){
    const formattedDate = new Date(bookingDate).toLocaleDateString("en-GB", { 
        day: "2-digit", 
        month: "long", 
        year: "numeric",
        hour: "2-digit", 
        minute: "2-digit", 
        timeZoneName: "short"
    });
    const mailOptions ={
        from : "nettruefree@gmail.com",
        to : toEmail,
        subject:"Booking Confirmation",
        text: `Dear ${userName},\n\nYour booking for ${campgroundName} from ${formattedDate} for ${nights} night(s) has been confirmed!\n\nThank you for choosing us.\n\nBest regards,\nCampground Booking Team`
    }


try{

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to :",toEmail);
}catch(err){
    console.log("error sending email:" ,err);

}}

module.exports = sendConfirmationEmail;