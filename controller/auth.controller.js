import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../util/error.js";
 
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const schoolLogin = async (req, res, next) => {
  const { schoolID, password } = req.body;
  try {
    const school = await prisma.school.findUnique({
      where: {
        schoolID: schoolID,
      },
      // Foreign table include
      select: {
        schoolID: true,
        apiKey: true,
        avatar: true,
        site: true,
        studentCount: true,
        name: true,
        userType: true,
        avatar: true,
        apiKey: true,
        password: true,
        zone: true,
        emailVerified: true,
        contact: {
          select: {
            email: true,
            address: true,
            phone: true,
          },
        },
      },
    });

    if (school) {
      const isMatch = bcryptjs.compareSync(password, school.password);
      if (isMatch) {
        const { password, ...updatedSchool } = school;

        if (school.emailVerified === false) {
          return next(errorHandler(401, "Please verify your email address."));
        }

        const token = jwt.sign(
          {
            apiKey: school.apiKey,
            schoolID: schoolID,
          },
          process.env.JWT_SECRET
          // {
          //   expiresIn: "30s",
          // }
        );
        return res
          .cookie("token", token, {
            path: "/",
            // expires: new Date(Date.now() + 10000 * 30),
            httpOnly: true,
            sameSite: "lax",
          })
          .status(200)
          .json({
            Message: "Successfully Login",
            SchoolDetails: updatedSchool,
            token,
          });
      } else {
        return next(errorHandler(401, "Please check your credentials."));
      }
    } else {
      return next(errorHandler(401, "Please check your credentials."));
    }
  } catch (error) {
    next(error);
  }
};

export const teacherLogin = async (req, res, next) => {
  const { teacherID, password } = req.body;
  try {
    const teacher = await prisma.teacher.findUnique({
      where: {
        teacherID: teacherID,
      },
      // Foreign table include
      select: {
        teacherID: true,
        password: true,
        avatar: true,
        medium: true,
        initial: true,
        fname: true,
        lname: true,
        fullName: true,
        gender: true,
        religion: true,
        DOB: true,
        NIC: true,
        marriageStatus: true,
        residentialAddress: true,
        permanentAddress: true,
        mobile: true,
        home: true,
        email: true,
        userType: true,
        shortBIO: true,
        schoolID: true,
        school: {
          select: {
            name: true,
            avatar: true,
            apiKey: true,
          },
        },
      },
    });

    if (teacher) {
      const isMatch = bcryptjs.compareSync(password, teacher.password);
      if (isMatch) {
        const token = jwt.sign(
          {
            teacherID: teacherID,
          },
          process.env.JWT_SECRET
          // {
          //   expiresIn: "30s",
          // }
        );
        const { password, ...updatedTeacher } = teacher;

        return res
          .cookie("token", token, {
            path: "/",
            // expires: new Date(Date.now() + 10000 * 30),
            httpOnly: true,
            sameSite: "lax",
          })
          .status(200)
          .json({
            Message: "Successfully Login",
            TeacherDetails: updatedTeacher,
            token,
          });
      } else {
        return next(errorHandler(401, "Please check your credentials."));
      }
    } else {
      return next(errorHandler(401, "Please check your credentials."));
    }
  } catch (error) {
    next(error);
  }
};

export const studentLogin = async (req, res, next) => {
  const { studentID, password } = req.body;
  try {
    const student = await prisma.student.findUnique({
      where: {
        studentID: studentID,
      },
    });

    if (student) {
      const isMatch = bcryptjs.compareSync(password, student.password);
      if (isMatch) {
        const token = jwt.sign(
          {
            studentID: studentID,
          },
          process.env.JWT_SECRET
          // {
          //   expiresIn: "30s",
          // }
        );
        return res
          .cookie("token", token, {
            path: "/",
            // expires: new Date(Date.now() + 10000 * 30),
            httpOnly: true,
            sameSite: "lax",
          })
          .status(200)
          .json({
            Message: "Successfully Login",
            StudentDetails: student,

            token,
          });
      } else {
        return next(errorHandler(401, "Please check your credentials."));
      }
    } else {
      return next(errorHandler(401, "Please check your credentials."));
    }
  } catch (error) {
    next(error);
  }
};









// for welcome message
// Create a transporter for Outlook
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // Outlook SMTP server
  port: 587, // Port for TLS/STARTTLS
  secure: false, // true for 465, false for other ports
  auth: {
    user: "help.cleverbit@outlook.com", // Your Outlook email address
    pass: "fsnjsmciunpmtbde", // Your Outlook password or application-specific password
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

async function welcomeMail(email) {
  // send mail with defined transport object
  const welcomeMailTemp = `<!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
      <title>
  
      </title>
      <!--[if !mso]><!-- -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
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
          @media only screen and (max-width:480px) {
              @-ms-viewport {
                  width: 320px;
              }
              @viewport {
                  width: 320px;
              }
          }
      </style>
      <!--<![endif]-->
      <!--[if mso]>
          <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
      <!--[if lte mso 11]>
          <style type="text/css">
            .outlook-group-fix { width:100% !important; }
          </style>
          <![endif]-->
  
  
      <style type="text/css">
          @media only screen and (min-width:480px) {
              .mj-column-per-100 {
                  width: 100% !important;
              }
          }
      </style>
  
  
      <style type="text/css">
      </style>
  
  </head>
  
  <body style="background-color:#f9f9f9;">
  
  
      <div style="background-color:#f9f9f9;">
  
  
          <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
        >
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
  
  
          <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">
  
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
                  <tbody>
                      <tr>
                          <td style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
          <tr>
        
          </tr>
        
                    </table>
                  <![endif]-->
                          </td>
                      </tr>
                  </tbody>
              </table>
  
          </div>
  
  
          <!--[if mso | IE]>
            </td>
          </tr>
        </table>
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
        >
          <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
  
  
          <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">
  
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%;">
                  <tbody>
                      <tr>
                          <td style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  
          <tr>
        
              <td
                 style="vertical-align:bottom;width:600px;"
              >
            <![endif]-->
  
                              <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
  
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">
  
                                      <tr>
                                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
  
                                              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                  <tbody>
                                                      <tr>
                                                          <td style="width:64px;">
  
                                                              <img height="auto" src="https://cleverbit.vercel.app/logo.png" style="border:0;display:block;outline:none;text-decoration:none;width:100%;" width="64" />
  
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
  
                                          </td>
                                      </tr>
  
                                      <tr>
                                          <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">
  
                                              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                  Welcome to Cleverbit School Management System
                                              </div>
  
                                          </td>
                                      </tr>
  
                                      <tr>
                                          <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
  
                                              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;">
                                                  Hello !<br></br>
                                                  Thank you for signing up for <b>CSMS</b>. We're really happy to have you! Click the link below to login to your account:
                                              </div>
  
                                          </td>
                                      </tr>
  
                                      <tr>
                                          <td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:50px;word-break:break-word;">
  
                                              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                  <tr>
                                                      <td   >
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
                                                             
                                                             
                                                              Login to Your Account
                                                          </button>
                                                        
                                                      </td>
                                                  </tr>
                                              </table>
  
                                          </td>
                                      </tr>
  
                                      <tr>
                                          <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
  
                                              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
                                                  Best regards, <p></p>
                                                 <span style="font-weight: bold;"> MAM. Aasim</span><br>Cleverbit, CEO and Founder<br>
                                                  <a href="https://www.htmlemailtemplates.net" style="color:#2F67F6">aasim782@outlook.com</a>
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
  
  
   
  
  
          <div style="Margin:0px auto;max-width:600px;">
  
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                  <tbody>
                      <tr>
                          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                             
  
                              <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
  
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                      <tbody>
                                          <tr>
                                              <td style="vertical-align:bottom;padding:0;">
  
                                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
  
                                                      <tr>
                                                          <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
  
                                                              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                  Nintavur, Ampara , Sri Lanka
                                                              </div>
  
                                                          </td>
                                                      </tr>
  
                                                      <tr>
                                                          <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
  
                                                              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                  <a href="#" style="color:#575757">Unsubscribe</a> from our emails
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
  
  </html>`;

  const info = await transporter.sendMail({
    from: '"Cleverbit team " <help.cleverbit@outlook.com>', // sender address
    to: email, // list of receivers
    subject: "Welcome", // Subject line
    // text: "Hello world?", // plain text body
    html: welcomeMailTemp, // html body
  });

  console.log("Message sent: %s", info.messageId);
}
// for welcome message

 

export const verifyEmail = async (req, res, next) => {
  const { verificationToken, email } = req.body;

  try {
    // Find the school using verificationToken and email
    const school = await prisma.school.findFirst({
      where: {
        verificationToken: verificationToken,
        contact: {
          email: email,
        },
      },
      include: {
        contact: true,
      },
    });

    if (!school) {
      return next(errorHandler(401, "Invalid verification token"));
    }
    // Update the school record to mark email as verified and clear verificationToken
    const updatedSchool = await prisma.school.update({
      where: {
        schoolID: school.schoolID, // Use schoolID as the unique identifier
      },
      data: {
        emailVerified: true,
        verificationToken: null, // Clear verificationToken
      },
      include: {
        contact: true,
      },
    });

    if (!updatedSchool) {
      return next(errorHandler(401, "Invalid verification token"));
    }
    welcomeMail(updatedSchool.contact.email);

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};
