{{{
    "title"    : "Creating a Background that Fades on Scroll",
    "tags"     : [ "jquery", "web development" ],
    "date"     : "3-3-2014",
    "preview"  : "I am going to walk through how to get a simple background image fade-out on scroll."

}}}

I am going to walk through how to get a simple background image fade-out on scroll. It's an easy technique that adds an element of interactivity. The end result is:


    $(window).scroll(function() {
        var background = $('.header');    
        var offset = background.offset();  
        var opacity = ( ((offset.top * 1.5) - background.height() -100) /1000 ) * -1.2;
        $('.header').css('opacity', opacity );
    });

Here my div.header is a fixed position background image. The offset method gets the position of the header realative to the document. I multiply it by 1.5 to make it into a larger number because by it self it will be a fraction. Subract that number by the height of the element. The exact numbers will change depending on where you want the opacity to begin fading out. The laster number, * -1.2, will determine how quickly the opacity fades out. I chose -1.2 because I want a gradual fade.

The background could either fade to the background body color or you could even fade to another background image. The possibilities are endless!

