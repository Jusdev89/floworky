const updateItem = ( Item, item_id, user_id, body, callback ) => {

  const where = { item_id, user_id }

  return Item.update( Item.filterParameters( body ), { where })
    .then( result => callback )
}

module.exports = updateItem
