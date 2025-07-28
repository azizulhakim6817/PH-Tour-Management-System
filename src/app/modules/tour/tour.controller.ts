import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourService } from "./tour.service";

//! create tour--------------------------
const createTour = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.createTour(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

//! get tour---------------------------
const getAllTour = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TourService.getAllTour(query as Record<string, string>);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour get All successfully",
    data: result.data,
    meta: result.meta,
  });
});

//! update tour-----------------
const updateTour = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.updateTour(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});

//! delete tour--------------------
const deleteTour = catchAsync(async (req: Request, res: Response) => {
  let { id } = req.params;
  const result = await TourService.deleteTour(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour deteted successfully",
    data: result,
  });
});

/*--------------------tour-type-------------------------- */
const createTourType = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await TourService.createTourType(payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour Type created successfully",
    data: result,
  });
});

//get all tour types------------------------
const getAllTourType = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.getAllTourType();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour Type get all  successfully",
    data: result,
  });
});
//! update Tour Type
const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await TourService.updateTourType(id, { name });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type updated successfully",
    data: result,
  });
});
const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.deleteTourType(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type updated successfully",
    data: result,
  });
});
export const TourController = {
  createTour,
  getAllTour,
  deleteTour,
  updateTour,
  createTourType,
  getAllTourType,
  updateTourType,
  deleteTourType,
};
