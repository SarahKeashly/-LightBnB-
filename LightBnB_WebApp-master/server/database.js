const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */


const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()])

    .then(res => res.rows[0])

    .catch((err) => {
      console.log(err.message)
    });

}

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])

    .then(res => res.rows[0])

    .catch((err) => {
      console.log(err.message);
    });

}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {

  console.log(user);
  console.log(user.name);
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING*;`, [user.name, user.email, user.password])

    .then(res => res.rows[0])

    .catch((err) => {
      console.log(err.message);
    });


}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  console.log(`guest_id: ${guest_id}`);
  console.log(`limit ${limit}`)
  return pool

    .query('SELECT properties.*, reservations.*, avg(rating) as average_rating FROM reservations JOIN properties ON reservations.property_id = properties.id JOIN property_reviews ON properties.id = property_reviews.property_id WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date GROUP BY properties.id, reservations.id ORDER BY reservations.start_date LIMIT $2;', [guest_id, limit])

    .then(res => res.rows)

    .catch((err) => {
      console.log(err.message);
    });

}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {


const getAllProperties = (options, limit = 10) => {

  const queryParams = [];


  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1 = 1
  `;


  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND city LIKE $${queryParams.length} `;
  }

  // if an owner_id is passed in, only return properties belonging to that owner.
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    // not totally sure how owner_id is linked up
    queryString += `AND owner_id = $${queryParams.length} `;
  }

  // if a minimum_price_per_night and a maximum_price_per_night, only return properties within that price range. (HINT: The database stores amounts in cents, not dollars!)
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    queryString += `AND properties.cost_per_night/100 <= $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    queryString += `AND properties.cost_per_night/100 >= $${queryParams.length} `;
  }

  queryString += `GROUP BY properties.id `

  // if a minimum_rating is passed in, only return properties with a rating equal to or higher than that.
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
 
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams).then((res) => {
    console.log("RES.ROWS", res.rows);
    return res.rows


  });
};

//     .then((result) => {
//       return result.rows;
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// }
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(properties) {

  return pool
    .query(`INSERT INTO properties (
      owner_id,
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      street,
      city,
      province,
      post_code,
      country,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING*;`, [properties.owner_id, properties.title, properties.description, properties.thumbnail_photo_url, properties.cover_photo_url, properties.cost_per_night, properties.street, properties.city, properties.province, properties.post_code, properties.country, properties.parking_spaces, properties.number_of_bathrooms, properties.number_of_bedrooms])

    .then(res => res.rows[0])

    .catch((err) => {
      console.log(err.message);
    });

}


// const propertyId = Object.keys(properties).length + 1;
// property.id = propertyId;
// properties[propertyId] = property;
// return Promise.resolve(property);


exports.addProperty = addProperty;
