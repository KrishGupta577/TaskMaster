import nodemailer from "nodemailer";

export const scheduleMail = (email,targetDate) => {

    console.log(targetDate)

    const auth = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_SENDER_PASSWORD
        },
        tls: {
            rejectUnauthorized: false, // Disable certificate validation
        },
    });

    const receiver = {
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: "Reminder: Upcoming Event in Finance Tracker",
        text: `Dear,

This is a friendly reminder that your scheduled event is happening soon.

Date: ${targetDate}

We're sending you this email 1 hour before your event. If you have any questions, feel free to reach out.

Best regards,  
The Finance Tracker Team  
${process.env.EMAIL_SENDER}`
    };

    // Improved date parsing for YYYY-MM-DD format
    const parseDate = (dateString) => {
        // Split the date string and convert to numbers
        const [year, month, day] = dateString.split("-").map(Number);
        
        // Create a date at midnight in the LOCAL timezone
        // This prevents potential UTC conversion issues
        return new Date(year, month - 1, day, 0, 0, 0);
    };

    // Parse the target date
    const eventDate = parseDate(targetDate);
    
    // Set reminder time to 1 hour before the event's start of day
    const reminderTime = new Date(eventDate.getTime() - 3600000); // Subtract 1 hour

    const currentTime = new Date();
    const delay = reminderTime.getTime() - currentTime.getTime();

    console.log(`Event Date:`, eventDate);
    console.log(`Reminder Time:`, reminderTime);
    console.log(`Current Time:`, currentTime);
    console.log(`Delay in ms:`, delay);

    if (delay > 0) {
        console.log(`Email to ${email} will be sent in ${(delay / 1000 / 60).toFixed(2)} minutes.`);

        setTimeout(() => {
            auth.sendMail(receiver, (error, response) => {
                if (error) {
                    console.error("Error sending email:", error);
                } else {
                    console.log("Email sent:", response.envelope);
                }
            });
        }, delay);
    } else {
        console.log("The target time is in the past. Cannot schedule email.");
    }
};