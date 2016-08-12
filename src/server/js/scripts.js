$(document).ready(function(){
	// $('.materialboxed').materialbox();
	
	var reload = document.querySelector('[data-reload="true"]')
	var cardImg = document.querySelector('[data-card-img="true"]')
	reload.addEventListener('click', function (e) {
		$.ajax({
			url: '/reload',
			success: function (e) {
				 cardImg.src = e.img
			}
		});
	})
});