var Randomnum1=Math.floor(Math.random()*6)+1;
var Randomdice1="images/dice" +Randomnum1+ ".png";
var image1=document.querySelectorAll("img")[0].setAttribute("src",Randomdice1);
var Randomnum2=Math.floor(Math.random()*6)+1;
var Randomdice2="images/dice" +Randomnum2+ ".png";
var image2=document.querySelectorAll("img")[1].setAttribute("src",Randomdice2);
if (Randomnum1>Randomnum2)
{
    document.querySelector("h1").innerHTML="Player 1 Wins";
}
else if (Randomnum2>Randomnum1)
{
    document.querySelector("h1").innerHTML="Player 2 Wins";
}
else{
    document.querySelector("h1").innerHTML="Its a tie";
}