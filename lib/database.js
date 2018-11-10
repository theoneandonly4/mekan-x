/* Mekan-X database communication script
* By Pierre-Etienne ALBINET
* Started 20181104
* Changed 20181110
*
* To-Do
* > Create Cloud DB
* > Connect Cloud DB
* > Edit all calls to Cloud DB
*/

//Initialize Local Storage
// TODO: get values from server (M|C) or local file
function dbDataInit() {
  if (!localStorage.items) {
    items = []
    localStorage.items = JSON.stringify(items)
  }
  else {
    items = JSON.parse(localStorage.items)
  }
  if (!localStorage.links) {
    links = []
    localStorage.links = JSON.stringify(links)
  }
  else {
    links = JSON.parse(localStorage.links)
  }
}

//Constructors
// ID Generation function for items
function generateItemId() {
// TODO: get next ID from server Mekan-X or Company
  if(!localStorage.items) {
    return 1
  }
  else {
    var items = JSON.parse(localStorage.items)
    var i
    var ids =[]
    var check = true
    for (i = 0; i < items.length; i++) {
      ids.push(items[i].id)
    }
    i = 1
    while (check) {
      if (ids.indexOf(i) > -1) {
        i++
      }
      else {
        check = false
      }
    }
    return i
  }
}

// Item Constructor
function Item(parent, type, value) {
  if (!parent || !type || !value) {
    return false
  }
  this.id = generateItemId()
  this.parent = parent
  this.type = type
  this.value = value
  this.change = 'add'
}

//CRUD - items
function dbCreateItem(parent, type, value) {
  var item = new Item(parent, type, value)


  //server
  // TODO: add server creation (M|C)


  //local
  var items = JSON.parse(localStorage.items)
  items.push(item)
  localStorage.items = JSON.stringify(items)
}

function dbGenUserID() {
  //local
  var items = JSON.parse(localStorage.items)
  var i
  var userIDs = []
  for (i = 0; i < items.length; i++) {
    if (items[i].type == 'User') {
      userIDs.push(items[i].value)
    }
  }
  i = 1
  while (userIDs.indexOf(i) > -1) {
    i++
  }
  return i
}

function dbGetID(type, value) {
  var items = JSON.parse(localStorage.items)
  var i
  for (i = 0; i < items.length; i++) {
    if (items[i].type == type && items[i].value == value) {
      return items[i].parent
    }
  }
}

function dbGetValue(parent, type) {
  var items = JSON.parse(localStorage.items)
  var i
  for (i = 0; i < items.length; i++) {
    if (items[i].parent == parent && items[i].type == type) {
      return items[i].value
    }
  }
}


function dbUserData() {

}
