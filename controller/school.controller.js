import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateApiKey } from "generate-api-key";
import nodemailer from "nodemailer";
import { token } from "morgan";
import crypto from "crypto";
import cryptoRandomString from "crypto-random-string";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
// Create a transporter for Outlook
const transporter = nodemailer.createTransport({
  host: process.env.HOST, // Outlook SMTP server
  port: process.env.PORT, // Port for TLS/STARTTLS
  service: process.env.SERVICE,
  // secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_NAME, // Your Outlook email address
    pass: process.env.PASSWORD, // Your Outlook password or application-specific password
  },
  tls: {
    // ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

// passwordResetMail('aasim782@gmail.com', '555sa');


async function emailVerificationMail(email, verificationToken) {
  // send mail with defined transport object
  const verificationMail = ` 
<!DOCTYPE html>
<html
xmlns="http://www.w3.org/1999/xhtml"
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
>
<head>
<title> </title>
<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style type="text/css">
  #outlook a {
    padding: 0;
  }

  .ReadMsgBody {
    width: 100%;
  }

  .ExternalClass {
    width: 100%;
  }

  .ExternalClass * {
    line-height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  table,
  td {
    border-collapse: collapse;
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
  }

  img {
    border: 0;
    height: auto;
    line-height: 100%;
    outline: none;
    text-decoration: none;
    -ms-interpolation-mode: bicubic;
  }

  p {
    display: block;
    margin: 13px 0;
  }
</style>
<!--[if !mso]><!-->
<style type="text/css">
  @media only screen and (max-width: 480px) {
    @-ms-viewport {
      width: 320px;
    }
    @viewport {
      width: 320px;
    }
  }
</style>

<style type="text/css">
  @media only screen and (min-width: 480px) {
    .mj-column-per-100 {
      width: 100% !important;
    }
  }
</style>

<style type="text/css"></style>
</head>

<body style="background-color: #f9f9f9">
<div style="background-color: #f9f9f9">
  <div
    style="
      background: #f9f9f9;
      background-color: #f9f9f9;
      margin: 0px auto;
      max-width: 600px;
    "
  >
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="background: #f9f9f9; background-color: #f9f9f9; width: 100%"
    >
      <tbody>
        <tr>
          <td
            style="
              border-bottom: #333957 solid 5px;
              direction: ltr;
              font-size: 0px;
              padding: 20px 0;
              text-align: center;
              vertical-align: top;
            "
          ></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    style="
      background: #fff;
      background-color: #fff;
      margin: 0px auto;
      max-width: 600px;
    "
  >
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="background: #fff; background-color: #fff; width: 100%"
    >
      <tbody>
        <tr>
          <td
            style="
              border: #dddddd solid 1px;
              border-top: 0px;
              direction: ltr;
              font-size: 0px;
              padding: 20px 0;
              text-align: center;
              vertical-align: top;
            "
          >
            <div
              class="mj-column-per-100 outlook-group-fix"
              style="
                font-size: 13px;
                text-align: left;
                direction: ltr;
                display: inline-block;
                vertical-align: bottom;
                width: 100%;
              "
            >
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="vertical-align: bottom"
                width="100%"
              >
                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      word-break: break-word;
                    "
                  >
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="border-collapse: collapse; border-spacing: 0px"
                    >
                      <tbody>
                        <tr>
                          <td style="width: 64px">
                            <img
                              height="auto"
                              src="https://cleverbit.vercel.app/logo.png"
                              style="
                                border: 0;
                                display: block;
                                outline: none;
                                text-decoration: none;
                                width: 100%;
                              "
                              width="64"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      padding-bottom: 40px;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 32px;
                        font-weight: bold;
                        line-height: 1;
                        text-align: center;
                        color: #555;
                      "
                    >
                      Please verify your email
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      font-size: 0px;
                      padding: 5px 25px;
                      padding-bottom: 0;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 16px;
                        line-height: 22px;
                        text-align: left;
                        color: #555;
                      "
                    >
                      Thanks for signing up at
                      <a
                        style="font-weight: bold; text-decoration: none"
                        href="https://eway-school-mng-system.vercel.app"
                        >Cleverbit School Management System.</a
                      >
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      padding-bottom: 20px;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 16px;
                        line-height: 22px;
                        text-align: left;
                        color: #555;
                      "
                    >
                      To complete your registration, please confirm your
                      email by clicking the following button:
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="">
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="border-collapse: separate; line-height: 100%"
                    >
                      <tr>
                        <td
                          align="center"
                          bgcolor="#2F67F6"
                          role="presentation"
                          style="border: none; color: #ffffff; cursor: auto"
                          valign="middle"
                        >
                          <a href="https://eway-school-mng-system.vercel.app/email-verification/confirm?email=${email}&token=${verificationToken}&mode=signup">
                            <button
                              style="
                                cursor: pointer;
                                padding: 15px 25px;
                                border: none;
                                border-radius: 3px;
                                background: #2f67f6;
                                color: #ffffff;
                                font-family: 'Helvetica Neue', Arial,
                                  sans-serif;
                                font-size: 15px;
                                font-weight: normal;
                                line-height: 120%;
                                margin: 0;
                                text-decoration: none;
                                text-transform: none;
                              "
                            >
                              Confirm Your Email
                            </button>
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      padding-bottom: 0;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 16px;
                        line-height: 22px;
                        text-align: center;
                        color: #555;
                      "
                    >
                      Or verify using this link:
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      padding-bottom: 10px;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 16px;
                        line-height: 22px;
                        text-align: center;
                        color: #555;
                      "
                    >
                      <a
                        href="https://eway-school-mng-system.vercel.app/email-verification/confirm?email=${email}&token=${verificationToken}&mode=signup"
                        style="color: #2f67f6"
                        >
                        https://eway-school-mng-system.vercel.app/email-verification/confirm?email=${email}&token=${verificationToken}&mode=signup
                        
                        </a
                      >
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 26px;
                        font-weight: bold;
                        line-height: 1;
                        text-align: center;
                        color: #555;
                      "
                    >
                      Need Help?
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 14px;
                        line-height: 22px;
                        text-align: center;
                        color: #555;
                      "
                    >
                      Please send and feedback or bug info<br />
                      to
                      <a
                        href="mailto:help.cleverbit@outlook.com"
                        style="color: #2f67f6"
                        >help.cleverbit@outlook.com</a
                      >
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="margin: 0px auto; max-width: 600px">
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="width: 100%"
    >
      <tbody>
        <tr>
          <td
            style="
              direction: ltr;
              font-size: 0px;
              padding: 20px 0;
              text-align: center;
              vertical-align: top;
            "
          >
            <div
              class="mj-column-per-100 outlook-group-fix"
              style="
                font-size: 13px;
                text-align: left;
                direction: ltr;
                display: inline-block;
                vertical-align: bottom;
                width: 100%;
              "
            >
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td style="vertical-align: bottom; padding: 0">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        width="100%"
                      >
                        <tr>
                          <td
                            align="center"
                            style="
                              font-size: 0px;
                              padding: 0;
                              word-break: break-word;
                            "
                          >
                            <div
                              style="
                                font-family: 'Helvetica Neue', Arial,
                                  sans-serif;
                                font-size: 12px;
                                font-weight: 300;
                                line-height: 1;
                                text-align: center;
                                color: #575757;
                              "
                            >
                              Nintavur, Ampara, Sri Lanka
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td
                            align="center"
                            style="
                              font-size: 0px;
                              padding: 10px;
                              word-break: break-word;
                            "
                          >
                            <div
                              style="
                                font-family: 'Helvetica Neue', Arial,
                                  sans-serif;
                                font-size: 12px;
                                font-weight: 300;
                                line-height: 1;
                                text-align: center;
                                color: #575757;
                              "
                            >
                              <a href="#" style="color: #575757"
                                >Unsubscribe</a
                              >
                              from our emails
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</body>
</html>

`;

  try {
    const info = await transporter.sendMail({
      from: `"Cleverbit team " <${process.env.FROM}>`, // sender address
      to: email, // list of receivers
      subject: "Account Verification", // Subject line
      // text: "Hello world?", // plain text body
      html: verificationMail, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    // Handle your error here, such as logging, sending a different email, etc.
  }
}

async function passwordResetMail(email, resetToken) {
  // send mail with defined transport object
  const verificationMail = ` 
<!DOCTYPE html>
<html
xmlns="http://www.w3.org/1999/xhtml"
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
>
<head>
<title> </title>
<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style type="text/css">
  #outlook a {
    padding: 0;
  }

  .ReadMsgBody {
    width: 100%;
  }

  .ExternalClass {
    width: 100%;
  }

  .ExternalClass * {
    line-height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  table,
  td {
    border-collapse: collapse;
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
  }

  img {
    border: 0;
    height: auto;
    line-height: 100%;
    outline: none;
    text-decoration: none;
    -ms-interpolation-mode: bicubic;
  }

  p {
    display: block;
    margin: 13px 0;
  }
</style>
<!--[if !mso]><!-->
<style type="text/css">
  @media only screen and (max-width: 480px) {
    @-ms-viewport {
      width: 320px;
    }
    @viewport {
      width: 320px;
    }
  }
</style>

<style type="text/css">
  @media only screen and (min-width: 480px) {
    .mj-column-per-100 {
      width: 100% !important;
    }
  }
</style>

<style type="text/css"></style>
</head>

<body style="background-color: #f9f9f9">
<div style="background-color: #f9f9f9">
  <div
    style="
      background: #f9f9f9;
      background-color: #f9f9f9;
      margin: 0px auto;
      max-width: 600px;
    "
  >
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="background: #f9f9f9; background-color: #f9f9f9; width: 100%"
    >
      <tbody>
        <tr>
          <td
            style="
              border-bottom: #333957 solid 5px;
              direction: ltr;
              font-size: 0px;
              padding: 20px 0;
              text-align: center;
              vertical-align: top;
            "
          ></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    style="
      background: #fff;
      background-color: #fff;
      margin: 0px auto;
      max-width: 600px;
    "
  >
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="background: #fff; background-color: #fff; width: 100%"
    >
      <tbody>
        <tr>
          <td
            style="
              border: #dddddd solid 1px;
              border-top: 0px;
              direction: ltr;
              font-size: 0px;
              padding: 20px 0;
              text-align: center;
              vertical-align: top;
            "
          >
            <div
              class="mj-column-per-100 outlook-group-fix"
              style="
                font-size: 13px;
                text-align: left;
                direction: ltr;
                display: inline-block;
                vertical-align: bottom;
                width: 100%;
              "
            >
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="vertical-align: bottom"
                width="100%"
              >
                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      word-break: break-word;
                    "
                  >
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="border-collapse: collapse; border-spacing: 0px"
                    >
                      <tbody>
                        <tr>
                          <td style="width: 64px">
                            <img
                              height="auto"
                              src="https://cleverbit.vercel.app/logo.png"
                              style="
                                border: 0;
                                display: block;
                                outline: none;
                                text-decoration: none;
                                width: 100%;
                              "
                              width="64"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      padding-bottom: 40px;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 32px;
                        font-weight: bold;
                        line-height: 1;
                        text-align: center;
                        color: #555;
                      "
                    >
                 Password change request
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      font-size: 0px;
                      padding: 5px 25px;
                      padding-bottom: 0;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 16px;
                        line-height: 22px;
                        text-align: left;
                        color: #555;
                      "
                    >
                      You have requested to change your password on  
                      <a
                        style="font-weight: bold; text-decoration: none"
                        href="https://eway-school-mng-system.vercel.app"
                        >Cleverbit School Management System.</a
                      >
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      padding-bottom: 20px;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 16px;
                        line-height: 22px;
                        text-align: left;
                        color: #555;
                      "
                    >
                    if it wasn't you please disregard this email and make sure 
                    still login to your account.if it was you please click on the button below
        
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="">
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="border-collapse: separate; line-height: 100%"
                    >
                      <tr>
                        <td
                          align="center"
                          bgcolor="#2F67F6"
                          role="presentation"
                          style="border: none; color: #ffffff; cursor: auto"
                          valign="middle"
                        >
                          <a  style="cursor: pointer;" href="https://eway-school-mng-system.vercel.app/resetpassword?email=${email}&token=${resetToken}&mode=resetpassword">
                            <button
                              style="
                                cursor: pointer;
                                padding: 15px 25px;
                                border: none;
                                border-radius: 3px;
                                background: #2f67f6;
                                color: #ffffff;
                                font-family: 'Helvetica Neue', Arial,
                                  sans-serif;
                                font-size: 15px;
                                font-weight: normal;
                                line-height: 120%;
                                margin: 0;
                                text-decoration: none;
                                text-transform: none;
                              "
                            >
                              Reset Password
                            </button>
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      padding-bottom: 0;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 16px;
                        line-height: 22px;
                        text-align: center;
                        color: #555;
                      "
                    >
                      Or verify using this link:
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      padding-bottom: 10px;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 16px;
                        line-height: 22px;
                        text-align: center;
                        color: #555;
                      "
                    >
                      <a
                        href="https://eway-school-mng-system.vercel.app/resetpassword?email=${email}&token=${resetToken}&mode=resetpassword"
                        style="color: #2f67f6"
                        >
                        https://eway-school-mng-system.vercel.app/resetpassword?email=${email}&token=${resetToken}&mode=resetpassword
                        
                        </a
                      >
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 26px;
                        font-weight: bold;
                        line-height: 1;
                        text-align: center;
                        color: #555;
                      "
                    >
                      Need Help?
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      font-size: 0px;
                      padding: 10px 25px;
                      word-break: break-word;
                    "
                  >
                    <div
                      style="
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 14px;
                        line-height: 22px;
                        text-align: center;
                        color: #555;
                      "
                    >
                      Please send and feedback or bug info<br />
                      to
                      <a
                        href="mailto:help.cleverbit@outlook.com"
                        style="color: #2f67f6"
                        >help.cleverbit@outlook.com</a
                      >
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="margin: 0px auto; max-width: 600px">
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="width: 100%"
    >
      <tbody>
        <tr>
          <td
            style="
              direction: ltr;
              font-size: 0px;
              padding: 20px 0;
              text-align: center;
              vertical-align: top;
            "
          >
            <div
              class="mj-column-per-100 outlook-group-fix"
              style="
                font-size: 13px;
                text-align: left;
                direction: ltr;
                display: inline-block;
                vertical-align: bottom;
                width: 100%;
              "
            >
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td style="vertical-align: bottom; padding: 0">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        width="100%"
                      >
                        <tr>
                          <td
                            align="center"
                            style="
                              font-size: 0px;
                              padding: 0;
                              word-break: break-word;
                            "
                          >
                            <div
                              style="
                                font-family: 'Helvetica Neue', Arial,
                                  sans-serif;
                                font-size: 12px;
                                font-weight: 300;
                                line-height: 1;
                                text-align: center;
                                color: #575757;
                              "
                            >
                              Nintavur, Ampara, Sri Lanka
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td
                            align="center"
                            style="
                              font-size: 0px;
                              padding: 10px;
                              word-break: break-word;
                            "
                          >
                            <div
                              style="
                                font-family: 'Helvetica Neue', Arial,
                                  sans-serif;
                                font-size: 12px;
                                font-weight: 300;
                                line-height: 1;
                                text-align: center;
                                color: #575757;
                              "
                            >
                              <a href="#" style="color: #575757"
                                >Unsubscribe</a
                              >
                              from our emails
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</body>
</html>

`;
  try {
    const info = await transporter.sendMail({
      from: `"Cleverbit team " <${process.env.FROM}>`, // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      // text: "Hello world?", // plain text body
      html: verificationMail, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
}

export const schoolPasswordResetRequest = async (req, res, next) => {
  const { email } = req.body;
  const school = await prisma.school.findFirst({
    where: {
      contact: {
        email: email,
      },
    },
    include: {
      contact: true,
    },
  });
  if (!school) {
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } else {
    const resetToken = crypto.randomBytes(32).toString("hex");

    const updatedUser = await prisma.school.update({
      where: {
        schoolID: school.schoolID,
        contact: {
          email: email,
        },
      },
      include: {
        contact: true,
      },
      data: {
        resetToken: resetToken,
      },
    });

    if (!updatedUser) {
      return next(errorHandler(500, "Failed to reset password"));
    }

    // send email
    passwordResetMail(email, resetToken);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  }
};

export const changePasswordResetToken = async (req, res, next) => {
  const { email, resetToken, newPassword } = req.body;
  console.log(email, resetToken, newPassword);
  const hashedPassword = bcryptjs.hashSync(newPassword, 10);

  const findSchool = await prisma.school.findFirst({
    where: {
      resetToken: resetToken,
      contact: {
        email: email,
      },
    },
  });
  if (!findSchool) {
    return next(errorHandler(404, "Token is invalid or expired"));
  }

  const updatedUser = await prisma.school.update({
    where: {
      schoolID: findSchool.schoolID,
      resetToken: resetToken,
      contact: {
        email: email,
      },
    },
    data: {
      password: hashedPassword,
      resetToken: null,
    },
  });

  if (!updatedUser) {
    return next(errorHandler(500, "Failed to reset password"));
  }

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

export const changePassword = async (req, res, next) => {
  const { email, schoolID, newPassword } = req.body;

  const hashedPassword = bcryptjs.hashSync(newPassword, 10);

  const findSchool = await prisma.school.findFirst({
    where: {
      schoolID: schoolID,
      contact: {
        email: email,
      },
    },
  });
  if (!findSchool) {
    return next(errorHandler(404, "Password update failed"));
  }

  const updatedUser = await prisma.school.update({
    where: {
      schoolID: findSchool.schoolID,
      contact: {
        email: email,
      },
    },
    data: {
      password: hashedPassword,
    },
  });

  if (!updatedUser) {
    return next(errorHandler(500, "Password update failed"));
  }

  res.status(200).json({
    success: true,
    message: "Password has been changed",
  });
};

export const signupSchool = async (req, res, next) => {
  const { schoolID, type, name, password, contact, avatar } = req.body;
  // console.log(req.body);
  try {
    // Check if email already exists
    const existingSchool = await prisma.school.findMany({
      where: {
        OR: [
          { schoolID: schoolID },
          {
            contact: {
              email: contact.email,
            },
          },
        ],
      },
    });

    // If email or contact already exists, return an error

    if (existingSchool.length > 0) {
      return next(errorHandler(401, "School already exists"));
    }
    //--

    const apiKey = generateApiKey({ method: "bytes" }) + "_" + schoolID;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const EmailVerificationToken = crypto.randomBytes(32).toString("hex");

    const SchoolDetails = await prisma.school.create({
      data: {
        schoolID: schoolID,
        // Provide the schoolId for the contact relation
        contact: {
          create: {
            // Use create option
            email: contact.email,
            address: contact.address,
            phone: contact.phone,
          },
        },
        type: type,
        name: name,
        password: hashedPassword,
        apiKey: apiKey,
        avatar: avatar,
        verificationToken: EmailVerificationToken,
      },
    });

    emailVerificationMail(contact.email, EmailVerificationToken);

    res.status(200).json({
      success: true,
      message: "School registered successfully",
      schoolInfo: {
        schoolID: SchoolDetails.schoolID,
        type: SchoolDetails.type,
        apiKey: SchoolDetails.apiKey,
        name: SchoolDetails.name,
      },
    });
  } catch (error) {
    console.error("Error creating school:", error);
  }
};

export const getSchools = async (req, res, next) => {
  try {
    const schools = await prisma.school.findMany({
      include: {
        contact: true,
      },
    });

    if (schools.length === 0) {
      // Assuming errorHandler is defined elsewhere and it correctly creates an error object
      return next(errorHandler(401, "No School Registered"));
    } else {
      res.status(200).json({
        message: "School Details Fetched",
        schools, // Sending the fetched schools in the response
      });
    }
  } catch (error) {
    // Passing the error message to the next middleware
    return next(error.message);
  }
};

export const getSchoolBySchoolID = async (req, res, next) => {
  const { schoolID } = req.params;

  try {
    const school = await prisma.school.findUnique({
      where: {
        schoolID: schoolID,
      },
      select: {
        schoolID: true,
        name: true,
        type: true,
        studentCount: true,
        avatar: true,
        contact: {
          select: {
            email: true,
            address: true,
            phone: true,
          },
        },
      },
    });

    if (!school) {
      // Assuming errorHandler is defined elsewhere and it correctly creates an error object
      return next(errorHandler(401, "School Not Found"));
    }
    res.status(200).json(school);
  } catch (error) {
    next(error);
  }
};

export const getSchoolByApiKey = async (req, res, next) => {
  const { apiKey } = req.params;

  try {
    const school = await prisma.school.findUnique({
      where: {
        apiKey: apiKey,
      },
      select: {
        schoolID: true,
        name: true,
        type: true,
        studentCount: true,
        avatar: true,
        apiKey: true,
        contact: {
          select: {
            email: true,
            address: true,
            phone: true,
          },
        },
      },
    });

    if (!school) {
      // Assuming errorHandler is defined elsewhere and it correctly creates an error object
      return next(errorHandler(401, "School Not Found"));
    }
    res.status(200).json(school);
  } catch (error) {
    next(error);
  }
};

export const UpdateSchoolBySchoolID = async (req, res, next) => {
  const { schoolID } = req.params;
  const { type, name, password, studentCount, avatar, contact, zone } =
    req.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const SchoolDetails = await prisma.school.update({
      where: {
        schoolID: schoolID,
      },
      data: {
        name: name,
        type: type,
        password: hashedPassword,
        studentCount: studentCount,
        avatar: avatar,
        zone: zone,
        contact: {
          update: {
            email: contact.email,
            address: contact.address,
            phone: contact.phone,
          },
        },
      },
    });
    res.status(201).json(SchoolDetails);
  } catch (error) {
    next(error);
  }
};
