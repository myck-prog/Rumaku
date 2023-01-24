// Replace anything in current db just for testing the setup.
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Rumaku = require("../models/rumaku");

mongoose.connect("mongodb://localhost:27017/rumaku", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Rumaku.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 45) + 10;
    const camp = new Rumaku({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://source.unsplash.com/random/300x300?camping,${i}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo vero voluptate exercitationem nulla saepe debitis deserunt accusantium voluptas. Labore, sit!",
      price,
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
