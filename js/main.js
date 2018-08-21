// The Main Process in Keio EC Barcode Point System
// 作者　和田

//値送信用のクラス
//id:バーコードの値 point:加算するポイント jquery:jqueryのオブジェクト logarea:ログを書き込むdivのDOM
//logは "Success id:{id} {加算されたpoint}pt--HH:MM:SS" の形式でHTML上に出力される
class Session {
	constructor(id, point, jquery, logarea) {
		this.ID = id;
		this.point = point;
		this.$ = jquery;
		this.logarea = logarea;
	}

	start() {
		$.ajax({
			url: "https://script.google.com/macros/s/AKfycbz7GBmXEky8aCJCkbzz6FiWKWGWCT3lgbyywf7zLlpK9wfx-EU/exec",
			dataType: "jsonp",
			data: {
				id: this.ID,
				value: this.point,
				mode: true
			},
			jsonp: "callback"
		}).then((json) => {
				var time = new window.Date();
				var log = this.logarea.insertBefore(window.document.createElement("p"), this.logarea.firstChild);
				log.innerHTML = "Success id:" + this.ID + " " + json.value + "pt--" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
			},
			() => {
				var log = this.logarea.insertBefore(window.document.createElement("p"), this.logarea.firstChild);
				log.innerHTML = "Error id:" + this.ID;
			});
	}
}

// 送信処理(Sessionクラスのインスタンス化及びStartメソッドの実行)をする関数
// これはいらない気もするから今後削除する
// 下のコメントはSessionクラスを導入する前の送信処理
function sender(result) {
	console.log(result);
	var point = parseInt($("#Value").val()) || 0;

	var sessions = [];

	var logarea = document.getElementById("log");

	for (var i = 0; i < result.length; i++) {
		sessions[i] = new Session(result[i].Value, point, $, logarea);
		sessions[i].start();
	}

	for (var j = 0; j < result.length; j++) {
		delete sessions[i];
	}



	// for (var i = 0; i < result.length; i++)(function (result) {

	//     request[i] = new XMLHttpRequest();
	//     request[i].num = result[i].Value;

	//     request[i].logarea = logarea.insertBefore(document.createElement("p"), logarea.firstChild);


	//     if (result == 0) result = 1000;
	//     request[i].open('GET', "https://script.google.com/macros/s/AKfycbz7GBmXEky8aCJCkbzz6FiWKWGWCT3lgbyywf7zLlpK9wfx-EU/exec?id=" + result[i].Value + "&value=" + point + "&mode=true");
	//     request[i].send("");
	//     request[i].onreadystatechange = function () {
	//         if (this.readyState != 4) {
	//             this.logarea.innerHTML = "Sending...";
	//         } else if (this.status != 200) {
	//             this.logarea.innerHTML = "Error id:" + this.num;
	//         } else {

	//             var json = this.responseText;
	//             var data = JSON.parse(json);
	//             if (data.value == undefined) {
	//                 this.logarea.innerHTML = "Error id:" + this.num;
	//             } else {
	//                 var date = new Date();
	//                 this.logarea.innerHTML = "Success id:" + this.num + " " + data.value + "pt--" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

	//             }
	//         }
	//     };
	// }(result));
}

// JOBの処理
// JOB.SetImageCallback内のsender(result)のみJOBのexampleから加筆
// resultは配列で、それぞれ {Code:バーコードの種類,Value:バーコードの値} のオブジェクトが入る
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