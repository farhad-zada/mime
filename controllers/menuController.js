const MenuItem = require('../models/menuItemModel')
const AppError = require(`${__dirname}/../utils/appError`)

// const MenuSection = require(`${__dirname}/../models/menuSectionModel`)
const cathcAsync = require(`${__dirname}/../utils/catchAsync`)

// Add an item

const menuSection = (data) => {
  const { name, section, isSection, period, belongs } = data

  if (!name | !section | !period) {
    throw Error('Ivalid request data')
  }
  return { name, section, isSection, period, belongs }
}

const menuItem = (data) => {
  return ({
    name,
    section,
    isSection,
    period,
    belongs,
    description,
    readyTime,
    ingreds,
    cuisine,
    price,
    available,
    allergens,
  } = data)
}

exports.filterRequestData = cathcAsync(
  async (req, res, next) => {
    req.body.belongs = req.params.restaurantId
    if (!req.body.belongs) {
      return next(
        new AppError('Something went wrong!', 400),
      )
    }

    let data
    if (req.body.isSection) {
      data = menuSection(req.body)
    } else {
      data = menuItem(req.body)
    }
    console.log({
      belongs: data.belongs,
      name: data.section,
      period: data.period - 1,
    })
    const belongy = await MenuItem.findOne({
      belongs: data.belongs,
      name: data.section,
      period: data.period - 1,
    })
    console.log(belongy)
    if (!belongy) {
      return next(
        new AppError(
          `Invalid request data. Either section {${data.section}} or period {${data.period}} is wrong.`,
          400,
        ),
      )
    }
    req.data = data
    req.validate = !req.body.isSection
    next()
  },
)

exports.addOne = cathcAsync(async (req, res, next) => {
  console.log(req.data)
  const result = await MenuItem(req.data).save({
    validateBeforeSave: req.validate,
  })
  res.status(201).json({
    status: 'success',
    data: {
      result,
    },
  })
})

//Get all period
exports.getMenu = cathcAsync(async (req, res, next) => {
  const period = req.query.period * 1 || 1
  const section = req.query.section || 'menu'
  console.log(period, section)
  const items = await MenuItem.find({
    period,
    section,
  })

  res.status(200).json({
    status: 'success',
    data: {
      results: items.length,
      items,
    },
  })
})

// Get only one item

exports.getOne = cathcAsync(async (req, res, next) => {
  const item = await MenuItem.findById(req.params.itemId)
  res.status(200).json({
    status: 'success',
    data: {
      item,
    },
  })
})

// Remove an item

exports.deleteOne = cathcAsync(async (req, res, next) => {
  await MenuItem.findByIdAndDelete(req.params.itemId)

  res.status(204).json({
    message: 'Item deleted successfully',
  })
})
// Update an itemd

exports.updateOne = cathcAsync(async (req, res, next) => {
  req.body.belongs = req.params.restaurantId

  if (!req.body.belongs) {
    return next(new AppError('Something went wrong!', 400))
  }
  const { isSection } = req.body
  let result
  console.log(req.params.itemId)
  if (isSection) {
    result = await MenuItem.findByIdAndUpdate(
      req.params.itemId,
      menuSection(req.body),
      { new: true },
    )
  } else {
    result = await MenuItem.findByIdAndUpdate(
      req.params.itemId,
      menuItem(req.body),
    )
  }
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  })
})

// Get all items ( by filter )

// Get a single item
