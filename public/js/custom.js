jQuery('.btn.btn-danger').html('<span class="fas fa-trash"></span>');

function contactForm(){
    let phone = document.getElementById('phone').value;
    // console.log(phone);
   
    if(isNaN(phone)){
        alert('plz add valid phone numbers');
    }

}

