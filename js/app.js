
function changePic(i) {
  var pic;
  if (i == 1) {
    pic = "Jean.png"
  } else if (i == 2) {
    pic = "Zhong.png"
  } else {
    pic = "DilucArt.png"
  }
  document.getElementById('myImage').src = "img/"+ pic;
}
