$(document).ready(function () {

    //START
    console.log("Załadowało jQuery");
    var main = $("#main");
    var control = $("#control");
    var num = 0;
    var nuLoc = 0;
    var board = [];
    var nam = 0;
    var wh = "wall";
    var levelIl;

    //SELECT
    var select = $("<select>");
    for (var o = 1; o <= 10; o++) {
        var option = $("<option>");
        option.text(o);
        if (o == 3) {
            option.attr("selected", "selected");
        }
        select.append(option);
    }
    control.append(select);
    var rozmiar = 130;
    create(select.val(), rozmiar);

    //LEVELE PO ODŚWIEŻENIU
    if ($(".levele")) {
        $(".levele").remove();
    }

    //POKAZYWANIE PRZYCISKÓW
    function show() {
        $.ajax({
            url: "",
            data: {
                action: "SHOW",
            },
            type: "POST",
            success: function (data) {
                console.log(JSON.parse(data));
                if ($(".levele")) {
                    $(".levele").remove();
                }
                var p = $("<p>");
                p.text("Wybierz level do edycji:");
                var level = $("<select>");
                level.addClass("levele");
                level.attr("id", "levele");
                p.addClass("levele");
                levelIl = JSON.parse(data);
                for (let i = 0; i < levelIl; i++) {
                    var option = $("<option>");
                    option.text(i);
                    level.append(option);
                }
                var button = $("<button>");
                button.addClass("levele");
                button.attr("id", "levelBt");
                button.on("click", function () {
                    wczytaj(level.val());
                });
                button.text("Wczytaj dany level");
                control.append(p);
                control.append(level);
                control.append(button);

            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    show();

    //CHANGE SELECT
    select.on("change", function () {
        main.empty();
        $("#table").empty();
        board = [];
        console.log(select.val());
        create(select.val(), rozmiar);
    })

    //TWORZENIE DIV
    function create(val, rozmiar) {
        if (board.length == 0) {
            nuLoc = 0;
            for (let j = 0; j < val; j++) {
                for (let i = 0; i < val; i++) {
                    var div = $("<div>");
                    div.addClass("hex");
                    div.attr("id", nuLoc);
                    main.append(div);
                    div.on("click", function () {
                        click($(this), j, i);
                    });
                    div.css("left", i * (rozmiar - 40));
                    div.css("top", j * (rozmiar - 20));
                    if (i % 2 == 1) div.css("top", j * (rozmiar - 20) + (rozmiar / 2 - 15));
                    nuLoc++;
                }
            }
        }
        else{
            nuLoc = 0;
            for (let j = 0; j < val; j++) {
                for (let i = 0; i < val; i++) {
                    var div = $("<div>");
                    div.addClass("hex");
                    div.attr("id", nuLoc);
                    main.append(div);
                    div.on("click", function () {
                        click($(this), j, i);
                    });
                    div.css("left", i * (rozmiar - 40));
                    div.css("top", j * (rozmiar - 20));
                    if (i % 2 == 1) div.css("top", j * (rozmiar - 20) + (rozmiar / 2 - 15));
                    nuLoc++;
                    for(let k = 0; k < board.length; k++){
                        if(div.attr("id") == board[k].id){
                            console.log("działa")
                            num = board[k].dirOut;
                            div.text(num + "↑");
                            div.css("transform", "rotate(" + num * 60 + "deg)"); 
                        }
                    }
                }
            } 
        }

    }

    //KLIK
    function click(div, z, x) {
        var check
        $("#table").empty();

        //ISTNIEJACY NIE Z SERWERA
        if (div.text()) {
            num = div.text()[0];
            if (num == 5) num = 0;
            else num++;
            div.text(num + "↑");
            div.css("transform", "rotate(" + num * 60 + "deg)");
            for (let i = 0; i < board.length; i++) {
                if (board[i].id == div.attr("id")) {
                    board[i].dirOut = num;
                    nam = num + 3;
                    if (nam > 5) nam = nam - 6;
                    board[i].dirIn = nam;
                    board[i].what = wh;
                }
            }
        }

        else {
            //NOWY POZIOM
            if (board.length == 0) {
                num = 0;
                nam = num + 3;
                div.text(num + "↑");
                var loc = new Location(div.attr("id"), z, x, num, nam, wh);
                board.push(loc);
            }

            //WCZYTANY Z SERWERA
            else {
                for (let i = 0; i < board.length; i++) {
                    if (board[i].id == div.attr("id")) {
                        check = true;
                        board[i].dirOut = num;
                        num = 0;
                        div.text(num + "↑");
                        nam = num + 3;
                        if (nam > 5) nam = nam - 6;
                        board[i].dirIn = nam;
                        board[i].what = wh;
                    }
                }
                if (check == true) { }
                else {
                    num = 0;
                    nam = num + 3;
                    div.text(num + "↑");
                    var loc = new Location(div.attr("id"), z, x, num, nam, wh);
                    board.push(loc);
                }
            }
        }

        $("#table").text(" level: " + JSON.stringify(board));
    }

    //HEX DANE
    function Location(id, z, x, dirOut, dirIn, what) {
        this.id = id;
        this.z = z;
        this.x = x;
        this.dirOut = dirOut;
        this.dirIn = dirIn;
        this.what = what;
    }

    $("#wall").on("click", function () {
        wh = "wall";
    })

    $("#enemy").on("click", function () {
        wh = "allies";
    })

    $("#light").on("click", function () {
        wh = "light";
    })
    $("#items").on("click", function () {
        wh = "items";
    })

    //ZAPISZ LEVEL
    $("#bt1").on("click", function () {
        $.ajax({
            url: "",
            data: {
                action: "DODAJ_POZIOM",
                board: JSON.stringify(board)
            },
            type: "POST",
            success: function (data) {
                console.log(board);
                board = [];
                console.log(JSON.parse(data));
                if ($(".levele")) {
                    $(".levele").remove();
                }
                var p = $("<p>");
                p.text("Wybierz level do edycji:");
                var level = $("<select>");
                level.addClass("levele");
                p.addClass("levele");
                levelIl = JSON.parse(data);
                for (let i = 0; i < levelIl; i++) {
                    var option = $("<option>");
                    option.text(i);
                    level.append(option);
                }
                var button = $("<button>");
                button.addClass("levele");
                button.attr("id", "levelBt");
                button.on("click", function () {
                    console.log("klik");
                    wczytaj(level.val());
                });
                button.text("Wczytaj dany level");
                control.append(p);
                control.append(level);
                control.append(button);
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });

        //CZYSZCZENIE
        nulock = 0;
        main.empty();
        $("#table").empty();
        create(select.val(), rozmiar);
    })

    //WCZYTYWANNIE LEVELI
    function wczytaj(val) {
        if ($(".E")) {
            $(".E").remove();
        }
        var buttonE = $("<button>");
        buttonE.addClass("E");
        buttonE.on("click", function () {
            console.log("klik");
            edytuj(val);
        });
        buttonE.text("Edytuj level");
        control.append(buttonE);
        console.log(val);
        $.ajax({
            url: "",
            data: {
                action: "WCZYTAJ",
                level: val,
            },
            type: "POST",
            success: function (data) {
                obj = JSON.parse(data);
                $("#table").text(" level: " + JSON.stringify(obj));
                board = obj;
                create(select.val(), rozmiar);
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    //EDYCJA LEVELI
    function edytuj(val) {
        console.log(val);
        $.ajax({
            url: "",
            data: {
                action: "EDYTUJ",
                board: JSON.stringify(board),
                index: val,
            },
            type: "POST",
            success: function (data) {
                console.log("sukces");
                $("#table").empty();
                board = [];
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }


})