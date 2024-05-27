import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateApiKey } from "generate-api-key";
const prisma = new PrismaClient();

export const signupSchool = async (req, res, next) => {
  const { schoolID, type, name, password, contact } = req.body;
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
      res.status(400).json({
        success: false,
        message: "School already exists",
      });
      return;
    }
    //--

    const apiKey = generateApiKey({ method: "bytes" }) + "_" + schoolID;
    const hashedPassword = bcryptjs.hashSync(password, 10);

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
      },
    });

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

// export const deleteSchool = async (req, res, next) => {
//   const { schoolID } = req.params;
//   try {
//     const SchoolDetails = await prisma.school.delete({
//       where: {
//         schoolID: schoolID,
//       },
//     });
//     res.status(201).json(SchoolDetails);
//   } catch (error) {
//     next(error);
//   }

// }

//   export const getSchoolByApiKey = async (req, res, next) => {
//     try {
//       // console.log(req.params.apiKey);
//       const SchoolDetail = await School.find({ apiKey: req.params.apiKey });
//       if (SchoolDetail.length === 0) {
//         next(errorHandler(401, ""));
//       } else {
//         res.status(201).json(SchoolDetail);
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
// export const inActiveSchoolById = async (req, res, next) => {
//   try {
//     // console.log(req.params.schID);
//     const SchoolDetail = await School.find({ schoolID: req.params.schID });
//     // console.log(SchoolDetail)
//     if (SchoolDetail.length === 0) {
//       next(errorHandler(401, "School Not Found"));
//     } else {
//       const updatedSchoolDetail = await School.findOneAndUpdate(
//         { schoolID: req.params.schID },
//         { active: false },
//         {
//           new: true,
//         }
//       );
//       res.status(201).json(updatedSchoolDetail);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// export const getAllSchools = async (req, res, next) => {
//   try {
//     const SchoolDetails = await School.find();
//     if (SchoolDetails.length === 0) {
//       res.status(404).json("No schools registered");
//     } else {
//       res.status(201).json({
//         message: "Get School Details Successfully",
//         schools: SchoolDetails,
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// export const getSchoolBySchoolID = async (req, res, next) => {
//   try {
//     const schoolDetail = await School.findOne({
//       schoolID: req.params.schoolID,
//     });

//     if (!schoolDetail) {
//       // If no matching document is found, return an error
//       return next(errorHandler(401, ""));
//     }

//     res.status(201).json(schoolDetail);
//   } catch (error) {
//     next(error);
//   }
// };
