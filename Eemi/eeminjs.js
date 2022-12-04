const button = document.querySelectorAll('.btn')
button.forEach(btn => {
    btn.addEventListener('mouseleave', function (){
        btn.blur()
      })
    })