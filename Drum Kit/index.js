var numberofdrums=document.querySelectorAll(".drum").length;
for (var i=0;i<numberofdrums;i++)
{
    document.querySelectorAll(".drum")[i].addEventListener("click",function() {
        alert("I got clicked");
    });
}