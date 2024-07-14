const mongoose = require('mongoose');
const axios = require('axios');

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

  // call unsplash and return small image
  async function seedImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'pWuHbd_xDvdG5mJfb7MBT8K_7wsnv2iNp8USUxZycls',
          //collections: 1114848,
        },
      })
      //console.log("resp ", resp)
      //console.log("resp ", resp.data)
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
  }


  const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 20; i++) {
      // setup
      const placeSeed = Math.floor(Math.random() * places.length)
      const descriptorsSeed = Math.floor(Math.random() * descriptors.length)
      const citySeed = Math.floor(Math.random() * cities.length)
   
      // seed data into campground
      const camp = new Campground({
        author: '5f5c330c2cd79d538f2c66d9',
        image: await seedImg(),
        title: `${descriptors[descriptorsSeed]} ${places[placeSeed]}`,
        location: `${cities[citySeed].city}, ${cities[citySeed].state}`,
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
      })
   
      await camp.save()
    }
  }

  seedDB().then(() => {
    mongoose.connection.close();
})
  

