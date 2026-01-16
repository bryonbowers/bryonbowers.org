import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

// Trigger when a new poem submission is created
export const onPoemSubmission = functions.firestore
  .document("poemSubmissions/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const docId = context.params.docId;

    const poemTitle = data.title || "Untitled";
    const poemContent = data.content || "";
    const userName = data.userName || "Anonymous";
    const userEmail = data.userEmail || "Not provided";
    const submittedAt = data.submittedAt?.toDate()?.toLocaleString() || "Unknown";

    // Get Gmail credentials from environment config
    const gmailEmail = functions.config().gmail?.email;
    const gmailPassword = functions.config().gmail?.password;

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
      } else {
        console.log("Gmail not configured. Skipping email notification.");
        console.log("Poem submission received:", {
          title: poemTitle,
          userName,
          userEmail,
          docId,
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }

    return null;
  });
