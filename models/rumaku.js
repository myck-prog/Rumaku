const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const RumakuSchema = new Schema({
  title: String,
  image: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point", "asdasd"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

RumakuSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Rumaku", RumakuSchema);
