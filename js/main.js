function sender(result) {
    console.log(result);
    var point = parseInt($("#Value").val()) || 0;

    var request = [];

    var logarea = document.getElementById("log");

    for (var i = 0; i < result.length; i++)(function (result) {

        request[i] = new XMLHttpRequest();
        request[i].num = result[i].Value;

        request[i].logarea = logarea.appendChild(document.createElement("p"));


        if (result == 0) result = 1000;
        request[i].open('GET', "https://script.google.com/macros/s/AKfycbz7GBmXEky8aCJCkbzz6FiWKWGWCT3lgbyywf7zLlpK9wfx-EU/exec?id=" + result[i].Value + "&value=" + point + "&mode=true");
        request[i].send("");
        request[i].onreadystatechange = function () {
            if (this.readyState != 4) {
                this.logarea.innerHTML = "Sending...";
            } else if (this.status != 200) {
                this.logarea.innerHTML = "senderror";
            } else {

                var json = this.responseText;
                var data = JSON.parse(json);
                if (data.value == undefined) {
                    this.logarea.innerHTML = "senderror";
                } else {
                    this.logarea.innerHTML = "Success " + this.num + " " + data.value + "pt";

                }
            }
        };
    }(result));
}


$(function () {

    var takePicture = document.querySelector("#Take-Picture"),
        showPicture = document.createElement("img");
    Result = document.querySelector("#textbit");
    var canvas = document.getElementById("picture");
    var ctx = canvas.getContext("2d");
    JOB.Init();
    JOB.SetImageCallback(function (result) {
        if (result.length > 0) {
            var tempArray = [];
            for (var i = 0; i < result.length; i++) {
                tempArray.push(result[i].Format + " : " + result[i].Value);
            }

            Result.innerHTML = tempArray.join("<br />");
            sender(result);
        } else {
            if (result.length === 0) {
                Result.innerHTML = "Decoding failed.";
            }
        }
    });
    JOB.PostOrientation = true;
    JOB.OrientationCallback = function (result) {
        canvas.width = result.width;
        canvas.height = result.height;
        var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < data.data.length; i++) {
            data.data[i] = result.data[i];
        }
        ctx.putImageData(data, 0, 0);
    };
    JOB.SwitchLocalizationFeedback(true);
    JOB.SetLocalizationCallback(function (result) {
        ctx.beginPath();
        ctx.lineWIdth = "2";
        ctx.strokeStyle = "red";
        for (var i = 0; i < result.length; i++) {
            ctx.rect(result[i].x, result[i].y, result[i].width, result[i].height);
        }
        ctx.stroke();
    });
    if (takePicture && showPicture) {
        takePicture.onchange = function (event) {
            var files = event.target.files;
            if (files && files.length > 0) {
                file = files[0];
                try {
                    var URL = window.URL || window.webkitURL;
                    showPicture.onload = function (event) {
                        Result.innerHTML = "";
                        JOB.DecodeImage(showPicture);
                        URL.revokeObjectURL(showPicture.src);
                    };
                    showPicture.src = URL.createObjectURL(file);
                } catch (e) {
                    try {
                        var fileReader = new FileReader();
                        fileReader.onload = function (event) {
                            showPicture.onload = function (event) {
                                Result.innerHTML = "";
                                JOB.DecodeImage(showPicture);
                            };
                            showPicture.src = event.target.result;
                        };
                        fileReader.readAsDataURL(file);
                    } catch (e) {
                        Result.innerHTML = "Neither createObjectURL or FileReader are supported";
                    }
                }
            }
        };
    }

});