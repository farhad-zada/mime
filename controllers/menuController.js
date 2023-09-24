const MenuItem = require('../models/menuItemModel')
const processJpegs = require('../utils/processJpegs')

const AppError = require(`${__dirname}/../utils/appError`)

const cathcAsync = require(`${__dirname}/../utils/catchAsync`)

// Add an items : done

// Archive items : done

// Delete an items : done

// Add sections : done

// Archive sections : done

// Delete sections : done

// Delete items/sections permanently : TODO:

// Delete nested items/sections : TODO:

const deletePreviousProfiles = async (urlToBeDeleted) => {
  try {
    const filePath = decodeURIComponent(
      urlToBeDeleted.match(/mime-mime(.*)$/)[1],
    )
    return media.deleteGS(filePath)
  } catch (err) {
    throw new Error(err.message)
  }
}

const menuSection = (data) => {
  const { name, section, isSection, period, belongs } = data

  if (!name || !section || !period) {
    throw Error('Ivalid request data')
  }
  return { name, section, isSection, period, belongs }
}

const menuItem = (data) => {
  return ({
    name,
    image,
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

//Get all period
exports.getMenu = cathcAsync(async (req, res, next) => {
  const period = req.query.period * 1 || 1
  const section = req.query.section || 'menu'
  // console.log(period, section)
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

// Get only one item {Already been found by midFindById}
exports.getOne = cathcAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      item: req.menuItem,
    },
  })
})

// The data comes with form-data as a string so we need first to parse it into JSON
exports.parseItems = cathcAsync(async (req, res, next) => {
  let items
  req.body.images = {}
  try {
    items = req.body.items.map((item, i) => {
      if (item.image) {
        // We save this so that we can access each item data in o(1) time complexity and not need to loop over it
        req.body.images[item.image] = i // we save the index so in the feature when we upload the file we will update the image url in o(1) tc
      }
      return JSON.parse(item)
    })
  } catch (err) {
    return next(
      new AppError(
        `Invalid input data at index: ${i}. If you cannot figure it out, please contact MiME team.`,

        400,
      ),
    )
  }
  req.body.items = items

  next()
})

// Use proccessImges before this
exports.checkItemsImages = cathcAsync(
  /** Checking:
   * 1. mimetype is __image__,
   * 2. image has an original name
   * */
  async (req, res, next) => {
    const images = req.files.menu

    req.media.jpegs = images.map((image, i) => {
      if (!image.mimetype.startsWith('image')) {
        return next(
          new AppError(
            `Only images can be added as menu item profile. But got ${image.mimetype} at index: ${i}.`,
            400,
          ),
        )
      }
      if (!image.originalName) {
        return next(
          new AppError(
            `Name must be specified for each image but got an unnamed one at index: ${i}`,
          ),
        )
      }
      const destination = `restaurant/menu/${
        req.params.restaurantId
      }-${Date.now()}.jpg`
      return {
        destination,
        contentType: image.mimetype,
        buffer: image.buffer,
        originalName: image.originalName,
      }
    })
    next()
  },
)

exports.uploadItemsImages = cathcAsync(
  async (req, res, next) => {
    // Proccess jpeg images
    req = await processJpegs(req)
    const filesGS = []

    await Promise.all(
      req.media.jpegs.map((jpeg) => {
        const { fileGS, promiseVoid } =
          mediaController.uploadGS(
            jpeg.buffer,
            jpeg.destination,
            jpeg.contentType,
          )
        filesGS.push({
          fileGS,
          originalName: jpeg.originalName,
        })
        return promiseVoid
      }),
    )

    await Promise.all(
      filesGS.map((file) => file.fileGS.makePublic()),
    )

    filesGS.forEach((file) => {
      const index = req.body.images[file.originalName]
      req.body.items[index].image = file.fileGS.publicUrl() // remember the index
    })

    // We have uploaded images and lets go to save items into MongoDB
    next()
  },
)
// Get all items ( by filter eg. ingreds contain)

exports.addMany = cathcAsync(async (req, res, next) => {
  let items = req.body.items
  /**
   * This code restricts new section and menu items to be created without a previous section exists
   * So for now we do not use it
  // A section must be previously created before adding any items to it
  const belongies = await Promise.all(
    items.map((item) => {
      // This returns promises and then we await them all
      return MenuItem.findOne({
        belongs: item.belongs,
        name: item.section,
        period: item.period - 1,
      })
    }),
  )

  // We check if all the items belongy sections are correct
  belongies.forEach((belongy, i) => {
    if (!belongy) {
      return next(
        new AppError(
          `Invalid item data at index: ${i}. The specified section for this item not found. You need to first create that section.`,
          400,
        ),
      )
    }
  })
   */

  items = items.map((item) => {
    if (item.isSection) {
      return menuSection(item)
    } else {
      return menuItem(item)
    }
  })

  items = await Promise.all(
    items.map((item) => {
      if (item.isSection) {
        return new MenuItem(item).save({
          validateBeforeSave: false,
        })
      } else {
        return MenuItem.create(item)
      }
    }),
  )

  res.status(200).json({
    status: 'success',
    results: items.length,
    data: {
      items,
    },
  })
})

exports.updateMany = cathcAsync(async (req, res, next) => {
  let items = req.body.items

  // A section must be previously created before adding any items to it
  const belongies = await Promise.all(
    items.map((item) => {
      // This returns promises and then we await them all
      return MenuItem.findOne({
        belongs: item.belongs,
        name: item.section,
        period: item.period - 1,
      })
    }),
  )

  // We check if all the items belongy sections are correct
  belongies.forEach((belongy, i) => {
    if (!belongy) {
      return next(
        new AppError(
          `Invalid item data at index: ${i}. The specified section for this item not found. You need to first create that section.`,
          400,
        ),
      )
    }
  })

  let menuItems = []

  items = items.map((item) => {
    const data = menuItem(item)
    const menuItem = MenuItem.findById(item.id)

    menuItems.push(menuItem)
    return data
  })

  menuItems = await Promise.all(menuItems)

  const errors = []
  const urlsToBeDeleted = []
  items = await Promise.all(
    items.map((item, i) => {
      if (menuItems[i]) {
        if (item.image && menuItems[i].image) {
          urlsToBeDeleted.push(menuItems[i].image)
        }
        return menuItems[i].save(item)
      } else {
        errors.push(`index: ${i} not found`) // In the front end it can be found to be which item
      }
    }),
  )

  // Here we send a request to the GS to delete this files
  await Promise.all(
    urlsToBeDeleted.map((url) =>
      deletePreviousProfiles(url),
    ),
  ) // TODO: we can implement mass delete for Google Storage

  res.status(200).json({
    status: 'success',
    results: items.length,
    data: {
      items,
      errors,
    },
  })
})

exports.midFindById = cathcAsync(async (req, res, next) => {
  req.menuItem = await MenuItem.findById(req.params.itemId)
  next()
})

exports.deleteMany = cathcAsync(async (req, res, next) => {
  const menuItems = await Promise.all(
    req.body.itemIds.map((id) => MenuItem.findById(id)),
  )

  await Promise.all(
    menuItems.map((item) =>
      item.save({ status: 'deleted' }),
    ),
  )
  return res.status(201).json({})
})

exports.deleteOne = cathcAsync(async (req, res, next) => {
  const item = await MenuItem.findById(req.params.itemId)
  // TODO: Delete documents that belong to the section
  await item.save({ status: 'deleted' })

  return res.status(201).json({})
})

exports.archiveMany = cathcAsync(async (req, res, next) => {
  const menuItems = await Promise.all(
    req.body.itemIds.map((id) => MenuItem.findById(id)),
  )

  await Promise.all(
    menuItems.map((item) =>
      item.save({ status: 'archived' }),
    ),
  )
  return res.status(201).json({})
})

exports.archiveOne = cathcAsync(async (req, res, next) => {
  const item = await MenuItem.findById(req.params.itemId)

  item.save({ status: 'archived' })

  return res.status(201).json({})
})
