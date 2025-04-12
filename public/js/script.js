// Example starter JavaScript for disabling form submissions if there are invalid fields

(() => {
        'use strict'
      
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')
      
        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
          form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
              event.preventDefault()
              event.stopPropagation()
            }
      
            form.classList.add('was-validated')
          }, false)
        })
      })()




// TAX SWITCH FUN....

let tax_toggle = document.querySelector("#flexSwitchCheckDefault")
let taxinfo = document.querySelectorAll(".taxinfo")

tax_toggle.addEventListener("click" , ()=>{
    for (const element of taxinfo) {
      if(element.style.display == "block"){
        element.style.display = "none"
      }else{
         element.style.display = "block"
      }
    }
})

// ----------------------------------------------------------------------------------------

