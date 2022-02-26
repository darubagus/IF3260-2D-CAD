export function download(data, filename, type) {
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

/*
    Find nearest point
*/

export function findNearestPoint (mousePos, error, allData) {
  let smallestTemp = 999;
  let selectedObj = -1; // shape id

  // nearest point / vertex
  let selectedVert = {}
  selectedVert.x = -1
  selectedVert.y = -1

  // search through newData array and get the object
  for (let i = 0; i < allData.length; i++) {
      // iterate through all vertex of a shape with index i
      for (let j = 0; j < allData[i].count; j++) {
          // calculate the distance between mouse position and vertex (x,y)
          let dist = Math.sqrt(
              Math.pow(mousePos.x - allData[i].vertex[j * 2], 2) +
              Math.pow(mousePos.y - allData[i].vertex[j * 2 + 1], 2)
          );
  
          if (dist < smallestTemp && dist < error) {
              smallestTemp = dist;
              selectedObj = i; // index of selected data of allData
              selectedVert = { x: j * 2, y: j * 2 + 1 }; // index of selected vertex of allData[].vertex
          }
      }
  }

  return { selectedObj, selectedVert };
}