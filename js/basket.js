$(document).ready(function () {
    ispisiTabelu();
});

function ispisiTabelu() {
    let proizvodi = proizvodiUKorpi();

    $.ajax({
        url : "./data/products.json",
        success: (data) => {
            data = data.filter(p => {
                for(let pr of proizvodi)
                {
                    if(p.id == pr.id) {
                        p.quantity = pr.quantity;
                        return true;
                    }
                }
                return false;
            });
            ispisiProizvode(data)
        }
    });
}

const ispisiProizvode = (pr) => {
    var ispis = `
    <table id="cartitems">
    <tr>
    <th colspan="2">item &nbsp</th>
    <th>price &nbsp;</th>
    <th colspan="2">quantity</th>
    </tr>`;
    for(let p of pr) {
      ispis += `
        <tr class="basketRow">
        <td><img src="${p.picture.src}" alt="${p.picture.alt}" style="width:100px; height: 100px"/></td>
        <td>${p.name}</td>
        <td class="basketElementPrice">${p.price.new}</td>
        <td class="basketElementQuantity">${p.quantity}</td>
        <td><button type="button" class="btnremove" onclick='obrisiIzKorpe(${p.id})'>remove</button></td>
        </tr>
      `;
    };
    ispis+=`</table><h1 id="ukupnoIspis">Total sum of your order: </h1>`;
    document.getElementsByClassName('basket')[0].innerHTML = ispis;
    ukupnaCena();
    return ispis;
}

function ukupnaCena() {
    var basketContainer = document.getElementsByClassName("basket")[0];
    var basketRows = basketContainer.getElementsByClassName("basketRow");
    var ukupno = 0;
    for(var i=0; i<basketRows.length; i++){
        var basketRow = basketRows[i];
        var priceElement = basketRow.getElementsByClassName("basketElementPrice")[0];
        var quantityElement = basketRow.getElementsByClassName("basketElementQuantity")[0];
        var price = parseInt(priceElement.innerText);console.log(typeof(price));
        var quantity = parseInt(quantityElement.innerText);console.log(typeof(quantity))
        ukupno += price * quantity; console.log(typeof(ukupno))
    }
    document.getElementById("ukupnoIspis").innerText+=ukupno +`€`;
}


function proizvodiUKorpi() {
    return JSON.parse(localStorage.getItem("products"));
}

function obrisiIzKorpe(id) {
    let products = proizvodiUKorpi();
    let filtered = products.filter(p => p.id != id);

    localStorage.setItem("products", JSON.stringify(filtered));

    ispisiTabelu();
}