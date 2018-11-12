function keyPressed(){
  if(key === 'c'){
    clears();
  }
	if(key === 't'){
		trains();
	}
	if(key === 's'){
		if(tImages.length > 0) saves();
	}
	if(key === 'g'){
		gets();
	}
}

function mousePressed(){
	if(x > 0 && y > 0 && x < resolution && y < resolution){
		if(!cPixels.includes(pixels[x][y])){
		  cPixels[cPixels.length] = pixels[x][y];
		  cPixels[cPixels.length - 1].show();
		}
		else{
		  cPixels[cPixels.indexOf(pixels[x][y])].clear();
		  cPixels.splice(cPixels.indexOf(pixels[x][y]), 1);
		}
		console.log(cPixels);
	}
}
function mouseDragged(){
	if(x > 0 && y > 0 && x < resolution && y < resolution){
		if(!cPixels.includes(pixels[x][y])){
		  cPixels[cPixels.length] = pixels[x][y];
		  cPixels[cPixels.length - 1].show();
		}
		console.log(cPixels);
	}
}