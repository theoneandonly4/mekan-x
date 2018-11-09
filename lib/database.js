/* Mekan-X database communication script
* By Pierre-Etienne ALBINET
* Started 20181104
* Changed 20181109
*
* To-Do
* > Create Cloud DB
* > Connect Cloud DB
* > Edit all calls to Cloud DB
*/

//Constructors
// ID Generation function for items
function generateItemId() {
// TODO: get next ID from server Mekan-X or Company
  if(!localStorage.items) {
    return 0
  }
  else {
    var items = JSON.parse(localStorage.items)
    var i
    var ids =[]
    var check = true
    for (i = 0; i < items.length; i++) {
      ids.push(items[i].id)
    }
    i = 0
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
}

//Local CRUD - items
function createItem(parent, type, value) {
  var item = new Item(parent, type, value)
}

// function dataInit() {
//   if (!localStorage.items) {
//     items = []
//     localStorage.items = JSON.stringify(items)
//   }
//   else {
//     items = JSON.parse(localStorage.items)
//   }
//   if (!localStorage.links) {
//     links = []
//     localStorage.links = JSON.stringify(links)
//   }
//   else {
//     links = JSON.parse(localStorage.links)
//   }
// }

function dbUserData() {

}
