$(document).ready(function(){
	// $('.materialboxed').materialbox();
	
	function newImg(type) {
		$('.fixed-action-btn').closeFAB();
		actionBtn.blur()
		actionBtn.classList.remove('done')
		actionBtn.classList.add('load')
		loadBtn.classList.remove('hide')
		$.ajax({
			url: '/' + type,
			success: function (e) {
				cardImg.src = e.img
				actionBtn.classList.remove('load')
				actionBtn.classList.add('done')
				loadBtn.classList.add('hide')
			}
		});
	}
	
	var actionBtn = document.querySelector('[data-btn-action="true"]')
	var loadBtn = document.querySelector('[data-btn-load="true"]')
	var cardImg = document.querySelector('[data-card-img="true"]')

	var reload = document.querySelector('[data-reload="true"]')
	reload.addEventListener('click', function (e) {
		newImg('reload')
	})

	var sharpness = document.querySelector('[data-reload-sharpness="true"]')
	sharpness.addEventListener('click', function (e) {
		newImg('sharpness')
	})

	var brightness = document.querySelector('[data-reload-brightness="true"]')
	brightness.addEventListener('click', function (e) {
		newImg('brightness')
	})

	var saturation = document.querySelector('[data-reload-saturation="true"]')
	saturation.addEventListener('click', function (e) {
		newImg('saturation')
	})
});