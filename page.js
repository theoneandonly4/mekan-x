/* Mekan-X page display script
* By Pierre-Etienne ALBINET
* Started 20181026
* Changed 20181203
*/

function pageClear(except) {
  var main = document.getElementById('main')
  var divs = main.getElementsByTagName('div')
  var i
  for (i = 0; i < divs.length; i++) {
    if (divs[i].id != except) {
      divs[i].style.display = 'none'
    }
  }
}

function pageStatus(status) {
  document.getElementById('status').innerHTML = ' - ' + status
}

function pageUser(userName) {
  item = document.getElementById('userName')
  item.innerHTML = ' - Logged in as ' + userName + ' '
  item.style.display = 'inline-block'
}

function pageSessionTime(s) {
  item = document.getElementById('sessionTime')
  item.innerHTML = '(' + s + ') '
  item.style.display = 'inline-block'
}

function pageShow(id, clear) {
  if (clear) {
    pageClear(id)
  }
  item = document.getElementById(id)
  item.style.display = 'inline-block'
}

function pageHide(id) {
  item = document.getElementById(id)
  item.style.display = 'none'
}

function pageTree(tree, levels) {
  var content = document.getElementById('content')
  var table = document.createElement('table')
  var i, j
  for (i = 0; i <= levels; i++) {
    var row = document.createElement('tr')
    for (j = 0; j < tree.length; j++) {
      if (tree[j].level == i) {
        var col = document.createElement('td')
        col.innerHTML = tree[j].item.type + ':<br />' + tree[j].item.value
        row.appendChild(col)
      }
    }
    table.appendChild(row)
  }
  content.appendChild(table)
  pageShow('content', true)
}
