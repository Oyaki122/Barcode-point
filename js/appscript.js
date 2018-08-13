

function doGet(e) {
    //doPost(e)にするとformからのpostデータを書き込むことが出来る
    //応用すれば、スプレッドシートをRestAPIもどきにしたり、フォームのDBにしたり、いろいろ出来ると思う
    //別名で使いたい場合の例
    //var name = e.parameter.p1;
    //var mail = e.parameter.p2;
    Logger.log("done");
    //JSONオブジェクト格納用の入れ物
    var rowData = {};
    Logger.log(e);
    if (Object.keys(e.parameter).length == 0) {

        //パラメータ不良の場合はundefinedで返す
        var getvalue = "undefined"
        Logger.log("error");
        //エラーはJSONで返すつもりなので
        rowData.value = getvalue;
        var result = JSON.stringify(rowData);
        return ContentService.createTextOutput(result);

    } else if (e.parameter.mode) {

        //書込先スプレッドシートのIDを入力
        var id = '1S93NcZGyEltmmQdnOF-D1lEJX2lnLRapMxHrU4rEz_s';

        //スプレッドシート名指定 "s0"
        var sheet = SpreadsheetApp.openById(id).getSheetByName("s0");

        //Getした値を配列にする
        //https://xxxxxxxxx/exec?p1=AAA&p2=BBB&p3=CCC&p4=DDDD
        //こんな感じなのを以下のように配列してappendRowで追記する
        var array = [e.parameter.id, e.parameter.value];

        //シートに配列を書き込み
        var targetCell = sheet.getRange(array[0], 1);
        var targetValue = targetCell.getValue();
        if (!targetCell.isBlank()) {
            targetCell.setValue(parseInt(targetValue) + parseInt(array[1]));
        } else {
            targetCell.setValue(0);
            targetCell.setValue(array[1]);
        }


        //書き込み終わったらOKを返す
        var getvalue = targetCell.getValue();

        //エラーはJSONで返すつもりなので
        rowData.value = getvalue;
        var result = JSON.stringify(rowData);
        return ContentService.createTextOutput(result);

    } else {


    }
}


