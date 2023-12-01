import School from "../modal/school.modal.js";
import { errorHandler } from "../util/index.js";
export const createSchool = async (req, res, next) => {
  try {
    const newSchool = await School.create(req.body);
    res.status(201).json(newSchool);
  } catch (error) {
    next(error);
  }
};

export const getSchoolByApiKey = async (req, res, next) => {
  try {
    console.log(req.params.apiKey);
    const SchoolDetail = await School.find({ apiKey: req.params.apiKey });
    if (SchoolDetail.length === 0) {
      next(errorHandler(401, "School Not Found"));
    } else {
      res.status(201).json(SchoolDetail);
    }
  } catch (error) {
    next(error);
  }
};

export const getSchools = async (req, res, next) => {
  try {
    const SchoolDetails = await School.find();
    if (SchoolDetails.length === 0) {
      res.status(404).json("No schools registered");
    } else {
      res.status(201).json(SchoolDetails);
    }
  } catch (error) {
    next(error);
  }
};
