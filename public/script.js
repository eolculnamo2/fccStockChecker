document.getElementById('get-one').addEventListener('click',() => {
    getOne();
});
document.getElementById('get-two').addEventListener('click',() => {
    getTwo();
});


function getOne() {
    let url = '/api/stock-prices?stock='+document.getElementById('one-co').value;
    
    if(document.getElementById('liked-one-co').checked) {
        url+='&like=true';
    }
    console.log(decodeURIComponent(url))
    window.location.href = 'http://localhost:3000'+decodeURIComponent(url);
}

function getTwo() {
    let url = '/api/stock-prices?stock='+document.getElementById('two-co1').value+'&stock='+document.getElementById('two-co2').value;
    
    if(document.getElementById('liked-two-co').checked) {
        url+='&like=true';
    }
    window.location.href = 'http://localhost:3000'+decodeURIComponent(url);
}