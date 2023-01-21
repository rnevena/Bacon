window.onload=function(){

    // scroll to top dugme
        $(window).scroll(function(){
            if ($(this).scrollTop() > 100) {
                $('#scrollbtn').fadeIn();
            } else {
                $('#scrollbtn').fadeOut();
            }
        });

        //Click event to scroll to top
        $('#scrollbtn').click(function(){
            $('html, body').animate({scrollTop : 0},800);
            return false;
        });

    //dinamicki header

    var ispisNav="<ul>";
    var nav =[{href:"index.html", opis:"home"}, {href:"shop.html", opis:"shop"}, {href:"contact.html", opis:"contact"}];

    for(let i=0; i<nav.length; i++) {
        ispisNav+="<li><a href='"+nav[i].href+"'><span>"+nav[i].opis+"</span></a></li>";
    }
    ispisNav+="<li><span id='modal_klik'>author</span></li></ul>";
    document.getElementById("right").innerHTML=ispisNav;

    // responsive navigacija

    $(".hidden").click(function() {
        $("#right ul").slideToggle();
        $("#right").css("float", "none");
    });

    $("#right ul li").click(function () {
        $("#right ul ul").slideUp();
        $(this).find('ul').stop().slideToggle();
       });

    $(window).resize(function(){
        if($(window).width()>822) {
            $("#right ul").removeAttr('style');
            $("#right").css("float", "right");
        }
    });

    // text shadow animacija (header, box shadow u galeriji, span u modalu, footer)

    $(function(){
        $("#right ul").on('mouseover', 'li', function(){
            this.style.textShadow = '-10px 10px #81A2B2';
        }).on('mouseout', 'li', function(){
            this.style.textShadow = '0 0 0';
        })
    });

    $(function(){
        $("#zatvori").on('mouseover', function(){
            this.style.textShadow = '-5px 0px #B7A6AB';
        }).on('mouseout', function(){
            this.style.textShadow = '0 0 0';
        })
    });

    $(function(){
        $("#social a").on('mouseover', function(){
            this.style.textShadow = '-10px 10px #81A2B2';
        }).on('mouseout', function(){
            this.style.textShadow = '0 0 0';
        })
    });

    $(function(){
        $("#gallery img").on('mouseover', function(){
            this.style.boxShadow = "10px 10px #DB7093";
        }).on('mouseout', function(){
            this.style.boxShadow = "0 0 0 0";
        })
    });

    //modal za autora

    var modal = document.getElementById("modalautor");
    var zatvoribtn = document.getElementById("zatvori");
    var klikni = document.getElementById("modal_klik");

    klikni.addEventListener('click', otvori);
    zatvoribtn.addEventListener('click', zatvori);

    function otvori(){
        modal.style.display = "block";
    }

    function zatvori(){
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
    }

    //animacija teksta na index stranici

    $( document ).ready(function() {
        $("#containerindex1 h1").animate({"marginLeft": "+=30%"}, "slow");
    });
    var scrolled=false;
    $( document ).scroll(function() {
        if(scrolled==false){
            $("#containerindextext").stop().animate({"marginLeft": "+=7%"}, "slow");
            scrolled=true;
        }
    });

    // dinamicka galerija

    // glavna funkcija za dohvatanje slika i arrow functions

    const dohvatiSlike = (sl) => {
        var ispisSlike = '';
        for(let s of sl) {
          ispisSlike += `<div class="slika">
            <a href="${s.srcbig}" data-lightbox="group" data-title="${s.caption}">
                <img src="${s.srcsmall}" alt="${s.alt}">
            </a>
          </div>
          `;
        };
        document.getElementById('gallery').innerHTML = ispisSlike;
        return ispisSlike;
    }

    function sveslike(){
        $.ajax('./data/gallery.json', {
            method: 'GET',
            dataType: 'json',
            success: (slike) => {
                dohvatiSlike(slike);
            },
            error: (xlr, status, error) => {
                console.log(error);
            }
          });
    }

    sveslike();

    // shop : json, ajax, arrow functions

    // glavna funkcija za dohvatanje proizvoda

    const dohvatiProizvode = (pr) => {
        var ispis = '';
        for(let p of pr) {
          ispis += `
          <div class="product">
          <div class="pictureBlock">`
              if(p.newInStore){
                  ispis+=`<span class="newInStore"> new in store </span>`;
              }
          ispis+=`<img src="${p.picture.src}" alt="${p.picture.alt}"/>
          </div>
          <div class="descriptionBlock">
            <h1>${p.name}</h1>
            <p><span><strike>${p.price.old}</strike></span>&nbsp;&nbsp;${p.price.new}€</p>
            <button class="addtobasket" data-id=${p.id}>Add to basket</button>
            <div class="cleaner"></div>
          </div>
            <div class="cleaner"></div>
        </div > `;
        };
        document.getElementById('containershop').innerHTML = ispis;
        pozoviAddToCartGlavnu();
        return ispis;
    }

    function pozoviAddToCartGlavnu() {
        var buttonsAddToCart = document.getElementsByClassName("addtobasket");
        for (var i=0; i<buttonsAddToCart.length; i++) {
            var dugme = buttonsAddToCart[i];
            dugme.addEventListener("click", addToCartGlavna);
        }
    }

    // dohvatanje proizvoda

    function sviproizvodi(){
    $.ajax('./data/products.json', {
        method: 'GET',
        dataType: 'json',
        success: (proizvodi) => {
            dohvatiProizvode(proizvodi);
        },
        error: (xlr, status, error) => {
            console.log(error);
        }
      });
    }

    sviproizvodi();

    // local storage, glavna funkcija za dodavanje u korpu

    function proizvodiUKorpi() {
        return JSON.parse(localStorage.getItem("products"));
    }

    function addToCartGlavna() {
    let id = $(this).data("id");

    var products = proizvodiUKorpi();

    if(products) {
        if(proizvodVecUKorpi()) {
            azuriranjeKolicine();
        } else {
            dodajULocalStorage()
        }
    } else {
        dodajPrviProizvodULS();
    }

    function proizvodVecUKorpi() {
        return products.filter(p => p.id == id).length;
    }

    function dodajULocalStorage() {
        let products = proizvodiUKorpi();
        products.push({
            id : id,
            quantity : 1
        });
        localStorage.setItem("products", JSON.stringify(products));
    }

    function azuriranjeKolicine() {
        let products = proizvodiUKorpi();
        for(let i in products)
        {
            if(products[i].id == id) {
                products[i].quantity++;
                break;
            }      
        }

        localStorage.setItem("products", JSON.stringify(products));
    }

    function dodajPrviProizvodULS() {
        let products = [];
        products[0] = {
            id : id,
            quantity : 1
        };
        localStorage.setItem("products", JSON.stringify(products));
    }
}

    // sortiranje

    // po kategoriji

    const filtrirajPoKategoriji = (kat) => {
    $.ajax('./data/products.json', {
        method: 'GET',
        dataType: 'json',
        success: (data) => {
            data = data.filter(p => p.categoryId == kat);
            dohvatiProizvode(data);
        },
        error: (xlr, status, error) => {
            console.log(error);
        }
        });
    }

    // div za filtriranje, dropdown lista za kategorije

    $.ajax('./data/categories.json', {
        method: 'GET',
        dataType: 'json',
        success: (kategorije) => {
            var ispisSort =`
            <a href="basket.html" id="basketlink"><i class="fas fa-shopping-cart"></i></a>
            <input type="button" id="btnpriceasc" value="sort by price">
            <select id="dropdownKat" name="dropdownKat">
            <option value="0">All</option>`;
            for(let c of kategorije){
                ispisSort+=`<option value="${c.id}">${c.category}</option>`;
            }
            ispisSort+=`</select>
            <div id="searchbox">
            <input type="text" id="textsearch" placeholder="search..">
            </div>`;
            document.getElementById("filtershop").innerHTML+=ispisSort;

            $("#dropdownKat").change(function() {
                Number(this.value) ? filtrirajPoKategoriji(this.value) : sviproizvodi();
            });

            document.getElementById("btnpriceasc").addEventListener("click", sortAsc);
            document.getElementById("textsearch").addEventListener("keyup", filterSearch);

        },
        error: (xlr, status, error) => {
            console.log(error);
        }
    });

    // po ceni rastucoj

    function sortAsc () {
        $.ajax('./data/products.json',{
        method: "GET",
        dataType: "json",
        success: (data) => {
            if(document.querySelector("#dropdownKat").value==0) {
                data.sort( (a,b) => {
                if(a.price.new == b.price.new)
                return 0;
                return a.price.new > b.price.new ? 1 : -1;
                });
            }
            else {
                data = data.filter(p => p.categoryId == document.querySelector("#dropdownKat").value);
                data.sort( (a,b) => {
                    if(a.price.new == b.price.new)
                    return 0;
                    return a.price.new > b.price.new ? 1 : -1;
                });
            }
        dohvatiProizvode(data);
       },
        error: (xlr, status, error) => {
        console.log(error);
        }
       });
    }

    // search

    function filterSearch() {
        $.ajax('./data/products.json', {
        method : "GET",
        type : "json",
        success : (data) => {
            var vrednost = document.getElementById("textsearch").value;
            var podaci = data.filter(p=> p.name.toUpperCase().indexOf(vrednost.trim().toUpperCase()) != -1);
            dohvatiProizvode(podaci);
        },
        error: (xlr, status, error) => {
            console.log(error);
        }
        });
    }
}
    //footer

    var ispisFooter = "";

    var ikonice = [{href:"https://www.facebook.com/francisbaconartist/", class:"fab fa-facebook-f"},
    {href:"https://www.instagram.com/francisbaconartist/?hl=en", class:"fab fa-instagram"},
    {href:"https://www.youtube.com/watch?v=MgrO5za0lSY", class:"fab fa-youtube"},
    {href:"sitemap.xml", class:"fa fa-sitemap"},
    {href:"dokumentacija.pdf", class:"fa fa-file"}];

    for(let i=0; i<ikonice.length; i++){
        ispisFooter+="<a href='"+ikonice[i].href+"'><i class='"+ikonice[i].class+"'></i></a>";
    }

    document.getElementById("social").innerHTML=ispisFooter;

    //dinamicka forma prva (slanje mejla)

    var f1 = document.createElement("form");
    f1.setAttribute('action',"obrada.php");
    f1.setAttribute('method',"get");

    var label1 = document.createElement("label");
    label1.setAttribute('class', "all-labels");
    label1.innerHTML = "You can send us an e-mail:";

    var item1 = document.createElement("input");
    item1.setAttribute('type', "text");
    item1.setAttribute('id', "full-name");
    item1.setAttribute('class', "form1items");
    item1.setAttribute('placeholder', "full name");

    var item1Error = document.createElement("span");
    item1Error.setAttribute('id', "full-name-error");
    item1Error.setAttribute ('class', "all-errors");

    var item2 = document.createElement("input");
    item2.setAttribute('type', "text");
    item2.setAttribute('id', "email");
    item2.setAttribute('class', "form1items");
    item2.setAttribute('placeholder', "your e-mail address");

    var item2Error = document.createElement("span");
    item2Error.setAttribute('id', "email-error");
    item2Error.setAttribute ('class', "all-errors");

    var item3 = document.createElement("textarea");
    item3.setAttribute('cols', 65);
    item3.setAttribute('rows', 7);
    item3.setAttribute('style', "resize:none");
    item3.setAttribute('id', "tekstpolje");
    item3.setAttribute('class', "form1items");
    item3.setAttribute('placeholder', "the message");

    var item3Error = document.createElement("span");
    item3Error.setAttribute('id', "message-error");
    item3Error.setAttribute ('class', "all-errors");

    var item4 = document.createElement("input");
    item4.setAttribute('type', "button");
    item4.setAttribute('id', "btnsend");
    item4.setAttribute('value', "send");

    this.document.getElementById('contact-container').appendChild(f1);
    this.document.getElementById('contact-container').appendChild(label1);
    this.document.getElementById('contact-container').appendChild(item1);
    this.document.getElementById('contact-container').appendChild(item1Error);
    this.document.getElementById('contact-container').appendChild(item2);
    this.document.getElementById('contact-container').appendChild(item2Error);
    this.document.getElementById('contact-container').appendChild(item3);
    this.document.getElementById('contact-container').appendChild(item3Error);
    this.document.getElementById('contact-container').appendChild(item4);
    this.document.getElementById('btnsend').addEventListener('click',provera1);

    function provera1 (){
        var inputFullName = document.getElementById("full-name");
        var reName = /^([A-Z][a-z]{2,15})(\s[A-Z][a-z]{2,15})+$/;

        if (!reName.test(inputFullName.value) || inputFullName.length==0) {
            inputFullName.classList.add("error");
            document.getElementById("full-name-error").innerHTML="Please enter first and last name in a valid format";
        }
        else {
            inputFullName.classList.remove("error");
            document.getElementById("full-name-error").innerHTML=" ";
        }

        var inputEmail = document.getElementById("email");
        var reEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

        if(!reEmail.test(inputEmail.value) || inputEmail.length==0) {
            inputEmail.classList.add("error");
            document.getElementById("email-error").innerHTML="Please enter a valid email address";
        }
        else {
            inputEmail.classList.remove("error");
            document.getElementById("email-error").innerHTML=" ";
        }

        var inputMessage = document.getElementById("tekstpolje");
        var reMessage = /^.{10,500}$/;

        if(!reMessage.test(inputMessage.value) || inputMessage.length==0) {
            inputMessage.classList.add("error");
            document.getElementById("message-error").innerHTML="Message must be between 10 and 500 characters long"
        }
        else {
            inputMessage.classList.remove("error");
            document.getElementById("message-error").innerHTML=" ";
        }
    }

    // dinamicka forma druga (prijavljivanje za newsletter)

    var f2 = document.createElement("form");
    f2.setAttribute('action',"obrada.php");
    f2.setAttribute('method',"get");

    var label2 = document.createElement("label");
    label2.setAttribute('class', "all-labels");
    label2.innerHTML = "...or you can subscribe to our newsletter, and we'll notify you about the latest exibitions and public classes:";

    var item5 = document.createElement("input");
    item5.setAttribute('type', "text");
    item5.setAttribute('id', "emailOpet");
    item5.setAttribute('class', "form2items");
    item5.setAttribute('placeholder', "your e-mail address");

    var item5Error = document.createElement("span");
    item5Error.setAttribute('id', "email-error-opet");
    item5Error.setAttribute ('class', "all-errors");

    var label3 = document.createElement("label");
    label3.setAttribute('class', "all-labels");
    label3.innerHTML = "How often do you want us to send you e-mails?";

    var options = ["Select","Weekly digest", "Monthly", "Only the most important events"];
    var optionList = document.createElement("select");
    optionList.setAttribute('id', "newsletter-option");
    optionList.setAttribute('class', "form2items");

    for (var i=0; i<options.length; i++) {
        var option = document.createElement("option");
        option.value = options[i];
        option.text = options[i];
        optionList.appendChild(option);
    }

    var item6 = document.createElement("input");
    item6.setAttribute('type', "button");
    item6.setAttribute('id', "btnsubscribe");
    item6.setAttribute('value', "sign me up");

    var optionListError = document.createElement("span");
    optionListError.setAttribute('id', "list-error");
    optionListError.setAttribute('class', "all-errors");

    this.document.getElementById('newsletter-container').appendChild(f2);
    this.document.getElementById('newsletter-container').appendChild(label2);
    this.document.getElementById('newsletter-container').appendChild(item5);
    this.document.getElementById('newsletter-container').appendChild(item5Error);
    this.document.getElementById('newsletter-container').appendChild(label3);
    this.document.getElementById('newsletter-container').appendChild(optionList);
    this.document.getElementById('newsletter-container').appendChild(optionListError);
    this.document.getElementById('contact').appendChild(item6);
    this.document.getElementById('btnsubscribe').addEventListener('click',provera2);

    function provera2(){

        var inputEmailOpet = document.getElementById("emailOpet");
        var reEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

        if(!reEmail.test(inputEmailOpet.value) || inputEmailOpet.length==0) {
            inputEmailOpet.classList.add("error");
            document.getElementById("email-error-opet").innerHTML="Please enter a valid email address";
        }
        else {
            inputEmailOpet.classList.remove("error");
            document.getElementById("email-error-opet").innerHTML=" ";
        }

        var izabranaOpcija = document.getElementById("newsletter-option");
        var selectedOption = izabranaOpcija.options[izabranaOpcija.selectedIndex].text;

        if (selectedOption=="Select") {
            izabranaOpcija.classList.add("error");
            document.getElementById("list-error").innerHTML="Select a valid option.";
        }
        else {
            izabranaOpcija.classList.remove("error");
            document.getElementById("list-error").innerHTML=" ";
        }
    }