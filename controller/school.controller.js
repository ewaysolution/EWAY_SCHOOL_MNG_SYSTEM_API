import { generateApiKey } from "generate-api-key";
import School from "../modal/school.modal.js";
import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";

export const signupSchool = async (req, res, next) => {
  try {
    const { schoolID, email, password,contact } = req.body;

    const existingSchool = await School.findOne({ schoolID });
    const existingEmail = await School.findOne({ email });
    const existingContact = await School.findOne({ contact });

    if (existingSchool) {
      return next(errorHandler(401, "School Already Exists"));
    }

    if (existingEmail) {
      return next(errorHandler(401, "Email Already Exists. Please Enter different Email."));
    }
    if (existingContact) {
      return next(errorHandler(401, "Contact Number Already Exists. Please Enter different Contact Number."));
    }

    const apiKey = generateApiKey({ method: "bytes" }) + "_" + schoolID;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newSchool = await School.create({
      ...req.body,
      apiKey,
      password: hashedPassword,
    });

    res.status(201).json(newSchool);
  } catch (error) {
    next(error);
  }
};

export const getSchoolByApiKey = async (req, res, next) => {
  try {
    // console.log(req.params.apiKey);
    const SchoolDetail = await School.find({ apiKey: req.params.apiKey });
    if (SchoolDetail.length === 0) {
      next(errorHandler(401, ""));
    } else {
      res.status(201).json(SchoolDetail);
    }
  } catch (error) {
    next(error);
  }
};

export const inActiveSchoolById = async (req, res, next) => {
  try {
    // console.log(req.params.schID);
    const SchoolDetail = await School.find({ schoolID: req.params.schID });
    // console.log(SchoolDetail)
    if (SchoolDetail.length === 0) {
      next(errorHandler(401, "School Not Found"));
    } else {
      const updatedSchoolDetail = await School.findOneAndUpdate(
        { schoolID: req.params.schID },
        { active: false },
        {
          new: true,
        }
      );
      res.status(201).json(updatedSchoolDetail);
    }
  } catch (error) {
    next(error);
  }
};

export const getAllSchools = async (req, res, next) => {
  try {
    const SchoolDetails = await School.find();
    if (SchoolDetails.length === 0) {
      res.status(404).json("No schools registered");
    } else {
      res.status(201).json({
        message: "Get School Details Successfully",
        schools: SchoolDetails,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getSchoolBySchoolID = async (req, res, next) => {
  try {
    const schoolDetail = await School.findOne({
      schoolID: req.params.schoolID,
    });

    if (!schoolDetail) {
      // If no matching document is found, return an error
      return next(errorHandler(401, ""));
    }

    res.status(201).json(schoolDetail);
  } catch (error) {
    next(error);
  }
};
