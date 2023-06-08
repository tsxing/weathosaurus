function round(a,b){
return Math.round(a*(10**b))/(10**b)
};
var button = document.querySelector('.button');
var inputValue = document.querySelector('.inputValue');
console.log(button);
document.getElementById("textbox")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("buttonID").click();
    }
});


button.addEventListener('click',function(){

  fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputValue.value +'&appid=3f31ed6561e9e1d7da1c8ff1746c14b1')
  
  .then(response => response.json())
  //.then(data =>console.log(data))
  .then(data => {
    console.log(data);
    
    document.querySelector(".name").innerHTML=data.name + ", "+data.sys.country;
    
    document.querySelector(".temp").innerHTML= "Temperature: "+Math.round(data.main.temp- 273.15)+" °C (" +       Math.round(((data.main.temp- 273.15)*9/5)+32) + " °F)";
    document.querySelector(".dscp").innerHTML=data.weather.map(x => x.description)
    document.querySelector(".humidity").innerHTML="Humidity: "+data.main.humidity +"%";
    document.querySelector(".vis").innerHTML="Visibility: "+(round(data.visibility*0.0006213712,1)) +" mi";
    document.querySelector(".pressure").innerHTML="Pressure: "+data.main.pressure+" milibars";
    document.querySelector(".wind").innerHTML= "Wind: "+round((((data.wind.speed)*3.6/1.852))*1.150779,1)+" mph, "+Math.round((data.wind.speed)*3.6) + "km/hr or "+ Math.round((data.wind.speed)*3.6/1.852)+" knots "+data.wind.deg+"° from the North, with gusts up to "+round((((data.wind.gust)*3.6/1.852))*1.150779,1)+" mph, "+Math.round((data.wind.gust)*3.6) + "km/hr or "+ Math.round((data.wind.gust)*3.6/1.852)+" knots ";
    document.querySelector(".feels-like").innerHTML= "Feels like: "+Math.round(data.main.feels_like- 273.15)+" °C (" +       Math.round(((data.main.feels_like- 273.15)*9/5)+32) + " °F)";
    
    
    
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

    //side numbers
    var visibility = round(data.visibility*0.0006213712,1)
    var pressure_len = String(data.main.pressure).length;
    var pressure = String(data.main.pressure)[pressure_len-2] + String(data.main.pressure)[pressure_len-1] +"0";
    console.log(pressure);
    var temp_in_F = Math.round((Math.round(data.main.temp- 273.15)*9/5)+32); 
    var humidity = data.main.humidity; 
    var coeff = Math.log(humidity/100)+(17.625*temp_in_F)/(243.04+temp_in_F)
    var dewPoint = Math.round(243.04*coeff/(17.625-coeff) );

    //wind data
    var wind_ang = data.wind.deg+ 90;
  
    ctx.beginPath();
    ctx.arc(125, 125, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.font = "10px Arial";
    ctx.fillText("Weather Model not very accurate!",60,170);
    ctx.fillText(data.name, 110,100); //location
    ctx.fillText(temp_in_F+ " (°F)", 70, 115); //temp
    ctx.fillText(dewPoint +" (°F)", 70, 145);  //dewpoint
    ctx.fillText(pressure +" (mb)", 150, 115);
    ctx.fillText(visibility +" (mi)", 50, 130);
    // ctx.fillText(wind_ang,50,50); wind degree
    
    rads = wind_ang*(Math.PI/180);   
    knots_rads = wind_ang*(Math.PI/180) +270*(Math.PI/180);
    ctx.moveTo(125-Math.cos(rads)*20, 125-Math.sin(rads)*20);  
    ctx.lineTo(125-Math.cos(rads) * 80, 125-Math.sin(rads) * 80);  
    ctx.stroke();
    
    // wind speed graph
    var wind_knots = Math.round(data.wind.speed *3.6/1.852); 
    if (wind_knots<10 && wind_knots>0){
      var x1= 125-Math.cos(rads) * 70;
      var y1= 125-Math.sin(rads) * 70
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1-Math.cos(knots_rads) * 20, y1- Math.sin(knots_rads) * 20);
      ctx.stroke();
    }
  
    if (wind_knots>=10 && wind_knots<=50){
      var knots_ten = Math.floor(wind_knots/10);
      //tens
      var counter_ten = 80;
      for (i=0; i<knots_ten;i++){
        var x1 = 125-Math.cos(rads) * counter_ten;
        var y1 = 125-Math.sin(rads) * counter_ten;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1-Math.cos(knots_rads)*30, y1-Math.sin(knots_rads) * 30);
        ctx.stroke();
        var counter_ten = counter_ten - 10;
      }

      var knots_five= Math.floor((wind_knots-10*knots_ten)/5);
      //fives
      var counter_five = 70;
      for (i=0; i<knots_five;i++){
        var x1 = 125-Math.cos(rads) * counter_five;
        var y1 = 125-Math.sin(rads) * counter_five;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1-Math.cos(knots_rads) * 20, y1-Math.sin(knots_rads) * 20);
        ctx.stroke();
        var counter_five = counter_five- 10;
      }
      
    }

    // cloud cover
    var cloud_cover = data.clouds.all; 
    console.log(cloud_cover);
    var cloud_percents = [0,25, 50, 75,100];
    
    var closest = cloud_percents.reduce(function(prev, curr) {
      return (Math.abs(curr - cloud_cover) < Math.abs(prev - cloud_cover) ? curr : prev);
    });
    console.log("closest: "+closest);
    if (cloud_cover>0 && cloud_cover <12){
      ctx.moveTo(125,110);
      ctx.lineTo(125,145);
    }
    if (closest==25){
      ctx.beginPath();
      ctx.moveTo(125,125);
      ctx.arc(125, 125, 20, 270*Math.PI/180, 0*Math.PI/180, false);
      ctx.fill();
    }
    if (closest==50){
      ctx.beginPath();
      ctx.moveTo(125,125);
      ctx.arc(125, 125, 20, 270*Math.PI/180, 90*Math.PI/180, false);
      ctx.fill();
    }
    if (closest==75){
      ctx.beginPath();
      ctx.moveTo(125,125);
      ctx.arc(125, 125, 20, 270*Math.PI/180, 180*Math.PI/180, false);
      ctx.fill();
    }
    if (closest==100){
      ctx.beginPath();
      ctx.moveTo(125,125);
      ctx.arc(125, 125, 20, 0, 2 * Math.PI);
      ctx.fill();
    }
    

    
  })


})
