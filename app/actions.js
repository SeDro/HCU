exports.updateItem = (item) => {
  return {
    type: 'UPDATE_ITEM',
    item
  }
}

exports.createItem = (item) => {
  return {
    type: 'CREATE_ITEM',
    item
  }
}

exports.deleteItem = (item) => {
  return {
    type: 'DELETE_ITEM',
    item
  }
}
