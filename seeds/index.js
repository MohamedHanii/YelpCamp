
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

// takes array then produce random element
const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10)
        const camp = new Campground({
            author: '6061cc5ce424370690c1dd54',
            location: `${cities[random].city}, ${cities[random].city}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/ds2pvxp2d/image/upload/v1617116129/YelpCamp/mn6is9nzqcbrqqsbggiu.jpg',
                    filename: 'YelpCamp/mn6is9nzqcbrqqsbggiu'
                },
                {

                    url: 'https://res.cloudinary.com/ds2pvxp2d/image/upload/v1617116130/YelpCamp/b6mo2e8t4qercieo2vdh.png',
                    filename: 'YelpCamp/b6mo2e8t4qercieo2vdh'
                },
                {
                    url: 'https://res.cloudinary.com/ds2pvxp2d/image/upload/v1617116133/YelpCamp/krj6ztzb21mm2zz3zv6k.jpg',
                    filename: 'YelpCamp/krj6ztzb21mm2zz3zv6k'
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero ut iure labore voluptatem cum ab architecto eum perferendis repellat in consectetur quam id tenetur molestiae reprehenderit, alias eveniet debitis. Perferendis.",
            price: price
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})