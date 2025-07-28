import { IDivision } from "./division.interface";
import { Division } from "./division.model";

//create division----------------------------------------------------------
const createDivision = async (payload: IDivision) => {
  const existingDivision = await Division.findOne({ name: payload.name });

  if (existingDivision) {
    throw new Error("A division with this name already exists");
  }

  //slug create and join------------------
  /*  const baseSlug = payload.name.toLowerCase().split(" ").join("-");
  let slug = `${baseSlug}-division`;

  let counter = 0;
  while (await Division.exists({ slug })) {
    slug = `${slug}-${counter++}`;
  }
  payload.slug = slug; */

  const division = await Division.create(payload);

  return division;
};

//get all division--------------------------------------------------
const getAllDivision = async () => {
  const divisions = await Division.find({});
  const totalDivisions = await Division.countDocuments();
  return {
    data: divisions,
    meta: {
      total: totalDivisions,
    },
  };
};
// Single Division--------------------------------------------------
const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  if (!division) {
    throw new Error("Division not found");
  }
  return { data: division };
};


// update Division------------------------------------------------------
const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existingDivision = await Division.findById(id);
  if (!existingDivision) {
    throw new Error("Division is not found!");
  }
  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });
  if (duplicateDivision) {
    throw new Error("A division with this name already exist!");
  }

  /* if (payload.name) {
    const baseSlug = payload.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    payload.slug = slug;
  } */

  const updateDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updateDivision;
};

//delete division----------------------------------------------
const deleletDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);
  return null;
};

export const DivisionService = {
  createDivision,
  getAllDivision,
  updateDivision,
  deleletDivision,
  getSingleDivision,
};
