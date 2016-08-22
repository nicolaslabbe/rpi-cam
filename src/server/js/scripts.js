$(document).ready(function(){
	// $('.materialboxed').materialbox();
	
	function newImg(type) {
		var imagesHolder = document.querySelector('[data-image="true"]')
		$('.fixed-action-btn').closeFAB();
		actionBtn.blur()
		actionBtn.classList.remove('done')
		actionBtn.classList.add('load')
		loadBtn.classList.remove('hide')
		$.ajax({
			url: '/' + type,
			success: function (e) {
				// cardImg.src = e.img
				console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * *')
				console.log('e', e)
				actionBtn.classList.remove('load')
				actionBtn.classList.add('done')
				loadBtn.classList.add('hide')
				var source = document.querySelector('#image-template').innerHTML
				var template = Handlebars.compile(source);
				var context = {path: "/screenshot/cam-1471250849612.jpg"};
				var html    = template(e);

				var span = document.createElement('span')
				span.innerHTML = html
				
				var firstChild = imagesHolder.firstElementChild
				if(typeof firstChild !== 'undefined' && firstChild !== null) {
					imagesHolder.insertBefore(span, firstChild)
				}else {
					imagesHolder.appendChild(span)
				}
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