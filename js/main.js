var globalScale = 3.0;

var editFrame = null;
var cdwFrame = null;

var CreateEdit = function () {
    var div = document.createElement( "DIV" );
    var imageField = document.createElement( "INPUT" );
    var loadButton = document.createElement( "BUTTON" );

    div.style.display = "block";
    div.innerHTML = "You can change da world!";
    imageField.type = "file";
    imageField.accept = "image/*";
    loadButton.imageField = imageField;
    loadButton.innerHTML = "Lets Change da world.";
    loadButton.onclick = function() {
        if ( this.imageField.files[ 0 ] ) {
            HideEdit ();
            ShowCDW ( this.imageField.files[ 0 ] );
        }
    };

    div.appendChild( document.createElement( "BR" ) );
    div.appendChild( imageField );
    div.appendChild( document.createElement( "BR" ) );
    div.appendChild( loadButton );
    document.body.appendChild( div );
    
    editFrame = div;
};

var ShowEdit = function () {
    editFrame.style.display = "block";
};

var HideEdit = function () {
    editFrame.style.display = "none";
};

var CreateCDW = function () {
    var div = document.createElement( "DIV" );
    var background = document.createElement( "DIV" );
    var center = document.createElement( "IMG" );
    var foreground = document.createElement( "DIV" );
    var imgBackground = document.createElement( "IMG" );
    var audio = document.createElement( "AUDIO" );

    div.style.display = "block";
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.top = "0px";

    background.style.position = "absolute";
    background.style.left = "0px";
    background.style.top = "0px";
    background.style.backgroundImage = "url(./img/background.png)";
    background.style.backgroundSize = "100%";
    background.style.display = "block";

    center.style.position = "absolute";
    center.style.left = "0px";
    center.style.top = "0px";
    center.style.display = "block";
    
    foreground.style.position = "absolute";
    foreground.style.left = "0px";
    foreground.style.top = "0px";
    foreground.style.backgroundImage = "url(./img/foreground.png)";
    foreground.style.backgroundSize = "100%";
    
    imgBackground.back = background;
    imgBackground.fore = foreground;
    imgBackground.center = center;
    imgBackground.onload = function () {
        this.back.style.width = `${this.naturalWidth * globalScale}px`;
        this.back.style.height = `${this.naturalHeight * globalScale}px`;
        this.fore.style.width = `${this.naturalWidth * globalScale}px`;
        this.fore.style.height = `${this.naturalHeight * globalScale}px`;
        this.center.style.width = `${this.naturalWidth * globalScale}px`;
        this.center.style.height = `${this.naturalHeight * globalScale}px`;
    };
    imgBackground.src = "./img/background.png";

    audio.src = "./audio/cdw.mp3";

    div.appendChild( background );
    div.appendChild( center );
    div.appendChild( foreground );
    div.appendChild( audio );

    div.center = center;
    div.audio = audio;
    div.currentOpacity = 1.0;
    div.timer = null;
    document.body.appendChild( div );
    cdwFrame = div;
};

var ShowCDW = function ( file ) {
    var path = window.URL.createObjectURL( file );
    cdwFrame.center.onload = function () {
        var audio = cdwFrame.audio;
        audio.currentTime = 0;
        audio.play ();
        cdwFrame.currentOpacity = 1.0;
        cdwFrame.center.style.opacity = 1.0;
        setTimeout( function() {
            cdwFrame.timer = setInterval( function () {
                cdwFrame.currentOpacity -= 0.05;
                if ( cdwFrame.currentOpacity <= 0 ) {
                    cdwFrame.currentOpacity = 0;
                    clearInterval( cdwFrame.timer );
                    cdwFrame.center.style.opacity = cdwFrame.currentOpacity;
                } else {
                    cdwFrame.center.style.opacity = cdwFrame.currentOpacity;
                }
            }, 100 );
        }, 7800);
        setTimeout( function () {
            cdwFrame.audio.pause ();
            HideCDW ();
            ShowEdit ();
        }, 14000 );
    };
	cdwFrame.center.src = path;
    cdwFrame.style.display = "block";
};

var HideCDW = function () {
    cdwFrame.style.display = "none";
};

var Start = function () {
    document.body.style.backgroundColor = "#222222";
    CreateEdit ();
    CreateCDW ();
    HideCDW ();
};

window.onload = Start;