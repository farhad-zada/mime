const Restaurant = require(`../../../models/restaurantModel`);

async function activateRestaurant(restaurantId) {
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    restaurant.active = true;
    await restaurant.save();
    return restaurant;
  } catch (error) {
    throw error;
  }
}

module.exports = activateRestaurant;
