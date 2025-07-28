import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    discription: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    this.slug = slug;
  }
  next();
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<IDivision>;

  if (update.name) {
    const baseSlug = update.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;
    let counter = 1;
    while (await Division.exists({ slug })) {
      slug = `${baseSlug}-division-${counter++}`;
    }
    update.slug = slug;
    this.setUpdate(update);
  }
  return next();
});

export const Division = model<IDivision>("Division", divisionSchema);
