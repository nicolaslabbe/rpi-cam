$(document).ready(function(){
	// $('.materialboxed').materialbox();
	
	var actionBtn = document.querySelector('[data-btn-action="true"]')
	var loadBtn = document.querySelector('[data-btn-load="true"]')

	var reload = document.querySelector('[data-reload="true"]')
	var cardImg = document.querySelector('[data-card-img="true"]')
	reload.addEventListener('click', function (e) {
		actionBtn.classList.remove('active')
		actionBtn.classList.remove('done')
		actionBtn.classList.add('load')
		loadBtn.classList.remove('hide')
		$.ajax({
			url: '/reload',
			success: function (e) {
				cardImg.src = e.img
				actionBtn.classList.remove('load')
				actionBtn.classList.add('done')
				loadBtn.classList.add('hide')
			}
		});
	})

	reload.addEventListener('click', function (e) {
		$.ajax({
			url: '/reload',
			success: function (e) {
				 cardImg.src = e.img
			}
		});
	})
});