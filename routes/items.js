const express = require('express')
const router = express.Router()

const { allItemsQuery, filteredItemsQuery, respondWithItems } = require( './items/item_response' )
const { buildTree } = require( './items/tree_creation' )
const findAllItems = require('./items/find_all_items')
const updateItem = require('./items/update_item')

router.get( '/', ( request, response ) => {
  const { Item } = request.app.get( 'models' )

  const { user, query } = request

  findAllItems( Item, user, query )
    .then( respondWithItems( user, data => response.render( 'items/index', data ) ) )
})

router.post( '/', ( request, response ) => {
  const { Item } = request.app.get( 'models' )

  const { title, description, parent_id } = request.body

  Item.create({ title, description, parent_id, user_id: request.user.id })
    .then( result => response.redirect( '/items' ))
})

router.post( '/:id', ( request, response ) => {
  const { Item } = request.app.get( 'models' )

  const { params, user, body } = request
  const callback = () => response.json({ success: true, item_id })

  updateItem( Item, params.id, user.id, body, callback )
    .catch( error =>
      response.json({ success: false, message: error.message })
    )
})

module.exports = router
