const mongoose = require('mongoose')
const fs = require('fs')
require('dotenv').config()

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
)

mongoose.connect(DB, {})

const Restaurant = require('../models/restaurantModel')

const deleteData = async () => {
  try {
    await Restaurant.deleteMany()
  } catch (e) {
    console.log(e)
  }
  await mongoose.disconnect()
  process.exit()
}

const importData = async () => {
  let data = fs.readFileSync(`${__dirname}/data/data.json`)
  data = JSON.parse(data)
  let formatted_data = []
  console.log('Getting data ready ⚙️')
  for (let el of data) {
    if (el.name === 'Bottega Louie') {
      continue
    }
    formatted_data.push({
      name: el.name,
      weelchairEnterance: el.wheelchair_accessible_entrance,
      paymentMmethods: el.features.payment_options,
      profileImage: el.profile_image_url,
      images: el.images,
      dressCode: el.dress_code,
      phones: el.phones,
      location: {
        coordinates: [el.location.geo_point.lng, el.location.geo_point.lat],
        formatted_address: el.location.formatted_address,
      },
    })
  }
  // for (let r of data){
  //   if (r.name === "Terry Black's Barbecue"){
  //     console.log(r);
  //   }
  // }
  console.log('Importing data ⛓️')
  await Restaurant.create(formatted_data)
  await mongoose.disconnect()
  console.log('Data imported successfully! ✨')

  // console.log(formatted_data.length);
  // console.log(formatted_data[0]);
  process.exit()
}

const readData = (x) => {
  let data = fs.readFileSync(`${__dirname}/data/data.json`)
  data = JSON.parse(data)
  console.log(data[x * 1].features.payment_options)
  process.exit()
}

if (process.argv[2] === '--delete') {
  deleteData()
} else if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] == '--read') {
  readData(process.argv[3] * 1)
} else {
  console.log('Please use either `--import` or `--delete`')
  process.exit()
}
