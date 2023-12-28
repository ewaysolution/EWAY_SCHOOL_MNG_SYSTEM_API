import { generateApiKey } from "generate-api-key";
import School from "../modal/school.modal.js";
import { errorHandler } from "../util/error.js";
import bcryptjs from "bcryptjs";

export const signupSchool = async (req, res, next) => {
  const { schoolID, password } = req.body;

  try {
    const SchoolDetail = await School.find({ schoolID: schoolID });

    if (SchoolDetail && SchoolDetail.length > 0) {
      next(errorHandler(401, "School Already Exists"));
    } else {
      req.body.apiKey = generateApiKey({ method: "bytes" }) + "_" + schoolID;
      req.body.password = bcryptjs.hashSync(password, 10);
      const newSchool = await School.create(req.body);
      res.status(201).json(newSchool);
    }
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
