import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";

//create division-----------------------------------------
const createDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.createDivision(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Division created successfully",
    data: result,
  });
});
//get all division-----------------------------
const getAllDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.getAllDivision();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Division retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});
//Single Division -----------------------------
const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  let slug = req.params.slug;
  const result = await DivisionService.getSingleDivision(slug);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Division retrieved successfully",
    data: result,
  });
});

// update Division-------------------------------------------------------------------
const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DivisionService.updateDivision(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Division update successfully",
    data: result,
  });
});
//delete division----------------------------------------
const deleletDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.deleletDivision(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Division delete successfully",
    data: result,
  });
});

export const DivisionController = {
  createDivision,
  getAllDivision,
  updateDivision,
  deleletDivision,
  getSingleDivision,
};
