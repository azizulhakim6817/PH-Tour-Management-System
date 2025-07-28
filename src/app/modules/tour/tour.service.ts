import { Query } from "mongoose";
import { excludeField } from "../../utils/constants";
import { tourSeachableFields } from "./tour.contant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.module";
import { QueryBuilder } from "../../utils/QueryBuilder";

//! create tour-------------------------------------
const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("A tour with this title already exists!");
  }
  //slug add -title add-
  const baseSlug = payload.title.toLowerCase().split(" ").join("-");
  let slug = `${baseSlug}`;

  let counter = 0;
  while (await Tour.exists({ slug })) {
    slug = `${slug}-${counter++}`;
  }
  payload.slug = slug;

  const tour = await Tour.create(payload);

  return tour;
};

//!get tour -------------------------------------
/* const getAllTourOld = async (query: Record<string, string>) => {
  //filter = location = Dhaka
  //Search = partial marth = gogle, fb, yt
  //field filtering ---------
  //skip --> (page-1) * 10 = 20
  const filter = query;
  const searchTerm = query.searchTerm || "";
  const sort = query.sort || "-createdAt";
  const fields = query.fields?.split(",").join(" ") || "";

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  for (const field of excludeField) {
    delete filter[field];
  }

  const searchQuery = {
    $or: tourSeachableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  };

  //[remove][remove][remove][Skip][][][][][][][][][][]
  //[][][][][][][][remove][remove][remove][remove][remove][remove][remove]

  //1-page ---> [1]1[1][1][1][1][1][1][1][10]--skip--> limint(10)
  //2-page ---> [2][2][2][2] -->Skip---> [2][2][2][2][2][10]---> limit()--skip--limit(20)
  //3-page ---> [3][3][3] -->Skip---> [][][][][][]--limint(10)---skip(30)

  //skip --> (page-1) * 10 = 20
  /* 
  const tour = await Tour.find(searchQuery)
    .find(filter)
    .sort(sort)
    .select(fields)
    .skip(skip)
    .limit(limit); */

/* const filterQuery = Tour.find(filter);
  const tours = filterQuery.find(searchQuery);
  const allTours = await tours
    .sort(sort)
    .select(fields)
    .skip(skip)
    .limit(limit); */

//finding data counting----------
/* const totalTours = await Tour.countDocuments();
 */
//const totalPage = 21/10 = 2.1 -> ciel(2.1) --> 2.
/*   const totalPage = Math.ceil(totalTours / limit);

  const meta = {
    page: page,
    total: totalTours,
    limit: limit,
    totalPage: totalPage,
  };
  return {
    meta: meta,
    data: allTours,
  };
};  
*/

//get all Toure-------------------------------------------------
const getAllTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);
  const tours = await queryBuilder
    .search(tourSeachableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMate(),
  ]);

  return {
    meta,
    data,
  };
};

//!update tour-----------------------------------------------------------
const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour) {
    throw new Error("Tour not found!");
  }
  //slug add -title add
  if (payload.title) {
    const baseSlug = payload.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    payload.slug = slug;
  }

  const updateTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  return updateTour;
};

//!delete Tour--------------------------------------------------------
const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};

/*--------------------tour-type-------------------------- */
//! create tour types
const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }
  return await TourType.create({ name: payload.name });
};

//! get all tour types----------------------
const getAllTourType = async () => {
  return await TourType.find({});
};

//! update Tour Type----------------------
const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};
//! delete tour types---------------------
const deleteTourType = async (id: string) => {
  return await TourType.findByIdAndDelete(id);
};

//! update tour types----------------
export const TourService = {
  createTour,
  getAllTour,
  updateTour,
  deleteTour,
  createTourType,
  getAllTourType,
  updateTourType,
  deleteTourType,
};
