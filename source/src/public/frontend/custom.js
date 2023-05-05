var localpath      = window.location.pathname
var clearlocalpath = localpath.replace('/', '');

$('ul.menu-container li a').map(function() {
    if ($(this).attr("href") === localpath || $(this).attr("href") === clearlocalpath){
        if ($(this).parent().parent().parent().parent().parent().parent().prop('className') === "menu-item mega-menu mega-menu-full"){
            $(this).parent().parent().parent().parent().parent().parent().addClass("current")
        }
        else $(this).parent().addClass("current")
    }
})

$('div.blog_category div.blog_category_sub a').map(function() {
    if ($(this).attr("href") === localpath || $(this).attr("href") === clearlocalpath){
        $(this).parent().addClass("current")
    }
})



//---show List category product ---//
function showList() {
    document.getElementById("showList").classList.toggle("show");
}

//---set time notify ---//
const myTimeout = setTimeout(notifies, 5000);

function notifies() {
    $('div.alert').css('display','none');
}

//----submit search ---//
$(document).ready(function() {
    $('input[name=search]').keyup(function(event) {
        if (event.code === 'Enter')
        {
            event.preventDefault();
            $('form#searchProductHome').submit();
        }
    });
});

//----submit form đơn hàng ---//

$('form[name="donhang"]').on( "submit", function( event ) {
    event.preventDefault();
    let flag = false;
    let data = {}
    let city = $("#city option:selected").text()
    let district = $("#district option:selected").text()
    let ward = $("#ward option:selected").text()
    if (city !== "Chọn tỉnh thành" && district !== "Chọn quận huyện" && ward !== "Chọn phường xã"){
        flag = true
        data.tinh = city
        data.huyen = district
        data.xa = ward
    }
    if(!flag){
        $('span[class="form-message"]').text("Vui lòng điền đầy đủ thông tin địa chỉ nhận hàng") 
    }
    if (flag) {
        $('input[name="diachi"]').val(JSON.stringify(data))
        localStorage.removeItem('cart')
        $('form[name="donhang"]')[0].submit();
    }
});

//--------------- Ajax -------------------///
//-------add Cart start ----------//
let cart = []
const addCart = (id, name, avatar, price) => {

    let storage = localStorage.getItem('cart')

    if (storage) {
        cart = JSON.parse(storage)
    }

    let product = {
        product: {id, name, avatar, price},
        quantity: 1
    }

    let item = cart.find(c => c.product.id == id)
    if (item) {
        item.quantity += 1
    } else {
        cart.push(product)
    }


    localStorage.setItem('cart', JSON.stringify(cart))

    showCart(cart)
}

const removeItem = (id) => {
    let storage = localStorage.getItem('cart')

    if (storage) {
        cart = JSON.parse(storage)
    }

    cart = cart.filter(item => item.product.id !== id)

    localStorage.setItem('cart', JSON.stringify(cart))

    showCart(cart)
}

window.onload = function() {

    let storage = localStorage.getItem('cart')

    if (storage) {
        cart = JSON.parse(storage)
    }

    showCart(cart)

}

const showCart = (shoppingCart) => {
    let arrSanPham = []
    let totalCart = 0
    let numberCart = 0

    let cartBody = document.getElementById('top-add-cart')
    let checkOut = document.getElementById('check-out')

    if (checkOut !== null)     checkOut.innerHTML = ''
    cartBody.innerHTML = ''
    shoppingCart.map(item => {
        let data = {}
        data.id = item.product.id
        data.sl = item.quantity
        data.price = item.product.price
        arrSanPham.push(JSON.stringify(data))

        totalCart += Number(item.product.price) * Number(item.quantity)
        numberCart += 1
        let price = priceHelper(item.product.price)
        let totalOneProduct = priceHelper(Number(item.product.price) * Number(item.quantity))
        cartBody.innerHTML += `<div class="top-cart-item">
                                    <div class="top-cart-item-image border-0">
                                        <a href="#"><img src="/uploads/products/${item.product.avatar}" alt="Cart Image 1" /></a>
                                    </div>
                                    <div class="top-cart-item-desc">
                                        <div class="top-cart-item-desc-title">
                                            <a href="#" class="fw-medium">${item.product.name}</a>
                                            <span class="top-cart-item-price d-block"><del>$29.99</del> ${price}</span>
                                            <div class="d-flex mt-2">
                                                <a href="/thanh-toan" class="fw-normal text-black-50 text-smaller"><u>Edit</u></a>
                                                <a  class="fw-normal text-black-50 text-smaller ms-3"><u onclick="removeItem('${item.product.id}')">Remove</u></a>
                                            </div>
                                        </div>
                                        <div class="top-cart-item-quantity">x ${item.quantity}</div>
                                    </div>
                               </div>`
        
        if (checkOut !== null) {
            checkOut.innerHTML += `<tr class="cart_item">
                                        <td class="cart-product-remove">
                                            <a class="remove" title="Remove this item">
                                            <i class="icon-trash2" onclick="removeItem('${item.product.id}')"></i>
                                            </a>
                                        </td>

                                        <td class="cart-product-thumbnail">
                                            <a href="#"><img width="64" height="64" src="/uploads/products/${item.product.avatar}"
                                                    alt="Pink Printed Dress"></a>
                                        </td>

                                        <td class="cart-product-name">
                                            <a href="#">${item.product.name}</a>
                                        </td>

                                        <td class="cart-product-price">
                                            <span class="amount">${price}</span>
                                        </td>

                                        <td class="cart-product-quantity">
                                            <div class="quantity">
                                                <input type="button" value="-" class="minus">
                                                <input type="text" name="quantity" value="${item.quantity}" class="qty" />
                                                <input type="button" value="+" class="plus">
                                            </div>
                                        </td>

                                        <td class="cart-product-subtotal">
                                            <span class="amount">${totalOneProduct}</span>
                                        </td>
                                    </tr>`
        }
    })

    let cartNumber = document.getElementById('top-cart-title')
    let cartNumberHeader = document.getElementById('top-cart-number')
    cartNumber.innerHTML = ''
    cartNumberHeader.innerHTML = ''
    cartNumber.innerHTML += `${numberCart}`
    cartNumberHeader.innerHTML += `${numberCart}`

    let cartTotal = document.getElementById('totalCart')
    let productTotal = document.getElementById('totalProduct')
    let totalPrice = priceHelper(totalCart)

    cartTotal.innerHTML = `${totalPrice}`
    if (productTotal !== null) productTotal.innerHTML = `${totalPrice}`

    //----Xử lý thanh toán---//
    tongThanhToan()
    //----Đưa thông tin lên server---//
    getSanpham(arrSanPham)
}

const priceHelper = (price) => {
    let USDollar = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    let newprice = USDollar.format(price)

    return newprice;
}
//-------add Cart End ----------//
let phiVanChuyen = 0
//-------phiVanChuyen start ----------//
$('select#city').change(function() {
    var e = document.getElementById("city");
    var value = e.value;
    var text = e.options[e.selectedIndex].text;

    link = "admin/phiVanChuyen/sotien/" + value

    $.get(link,
        function (data, textStatus, jqXHR) {
            let { success, soTien } = data;
            if (success === true) {
                phiVanChuyen = soTien
                tongThanhToan()
                let soTienVND = priceHelper(soTien)
                $('span.Free_Delivery').html(soTienVND)
            }
        },
        "json"
    );
})
//-------phiVanChuyen end ----------//

//-------Tính Tổng Thanh Toán start ----------//
const tongThanhToan = () => {
    let tongTienHang = $('span#totalProduct').text().replace(/\D/g, '')
    let tongThanhToan = priceHelper(Number(tongTienHang) + Number(phiVanChuyen))

    $('strong.TongThanhToan').text(tongThanhToan)

}
//-------Tính Tổng Thanh Toán end ----------//

//-------- Đưa thông tin lên server ---------//

const getSanpham = (arrSanPham) => {
    $('input[name="sanpham"]').val(JSON.stringify(arrSanPham))
    $('input[name="tongthanhtoan"]').val($('strong.TongThanhToan').text().replace(/\D/g, ''))
}




