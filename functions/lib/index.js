"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPoemSubmission = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();
// Trigger when a new poem submission is created
exports.onPoemSubmission = functions.firestore
    .document("poemSubmissions/{docId}")
    .onCreate(async (snap, context) => {
    var _a, _b, _c, _d;
    const data = snap.data();
    const docId = context.params.docId;
    const poemTitle = data.title || "Untitled";
    const poemContent = data.content || "";
    const userName = data.userName || "Anonymous";
    const userEmail = data.userEmail || "Not provided";
    const submittedAt = ((_b = (_a = data.submittedAt) === null || _a === void 0 ? void 0 : _a.toDate()) === null || _b === void 0 ? void 0 : _b.toLocaleString()) || "Unknown";
    // Get Gmail credentials from environment config
    const gmailEmail = (_c = functions.config().gmail) === null || _c === void 0 ? void 0 : _c.email;
    const gmailPassword = (_d = functions.config().gmail) === null || _d === void 0 ? void 0 : _d.password;
    // Send email notification
    const mailOptions = {
        from: `"Bryon Bowers Website" <${gmailEmail}>`,
        to: "bryon.bowers@gmail.com",
        subject: `New Poem Submission: "${poemTitle}"`,
        html: `
        <h2>New Poem Submitted!</h2>
        <p><strong>Title:</strong> ${poemTitle}</p>
        <p><strong>Submitted by:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Time:</strong> ${submittedAt}</p>
        <hr/>
        <h3>Poem Content:</h3>
        <pre style="font-family: Georgia, serif; font-size: 14px; line-height: 1.6; white-space: pre-wrap; background: #f5f5f5; padding: 20px; border-radius: 8px;">${poemContent}</pre>
        <hr/>
        <p><a href="https://bryonbowers.org/admin">View in Admin Dashboard</a></p>
        <p><small>Submission ID: ${docId}</small></p>
      `,
        text: `
New Poem Submitted!

Title: ${poemTitle}
Submitted by: ${userName}
Email: ${userEmail}
Time: ${submittedAt}

Poem Content:
${poemContent}

View in Admin Dashboard: https://bryonbowers.org/admin
Submission ID: ${docId}
      `,
    };
    try {
        if (gmailEmail && gmailPassword) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: gmailEmail,
                    pass: gmailPassword,
                },
            });
            await transporter.sendMail(mailOptions);
            console.log("Email notification sent for poem submission:", docId);
        }
        else {
            console.log("Gmail not configured. Skipping email notification.");
            console.log("Poem submission received:", {
                title: poemTitle,
                userName,
                userEmail,
                docId,
            });
        }
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
    return null;
});
//# sourceMappingURL=index.js.map