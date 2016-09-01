import Handlebars from 'handlebars'

$(document).ready(function(){
	// $('.materialboxed').materialbox();
	
	var imagesHolder = document.querySelector('[data-image="true"]')

	function addImg(context) {
		var source = document.querySelector('#image-template').innerHTML
		var template = Handlebars.compile(source);
		var html    = template(context);

		var span = document.createElement('span')
		span.innerHTML = html

		var firstChild = imagesHolder.firstElementChild
		if(typeof firstChild !== 'undefined' && firstChild !== null) {
			imagesHolder.insertBefore(span, firstChild)
		}else {
			imagesHolder.appendChild(span)
		}
	}
	
	function newImg(type) {
		$('.fixed-action-btn').closeFAB();
		actionBtn.blur()
		actionBtn.classList.remove('done')
		actionBtn.classList.add('load')
		loadBtn.classList.remove('hide')
		$.ajax({
			url: service.replace(/\/$/, '') + '/' + type,
			success: function (e) {
				actionBtn.classList.remove('load')
				actionBtn.classList.add('done')
				loadBtn.classList.add('hide')
				addImg(e)
			}
		});
	}
	
	var overlaySettings = document.querySelector('[data-overlay-settings="true"]')
	var body = document.querySelector('body')
	function showOverlay() {
		if (body.classList.contains('hide-setting')) {
			body.classList.remove('hide-setting')
			body.classList.add('show-setting')
		}else {
			body.classList.remove('show-setting')
			body.classList.add('hide-setting')
		}
	}
	
	var actionBtn = document.querySelector('[data-btn-action="true"]')
	var loadBtn = document.querySelector('[data-btn-load="true"]')
	// var cardImg = document.querySelector('[data-card-img="true"]')

	var actionBtn = document.querySelector('[data-btn-action="true"]')
	actionBtn.addEventListener('click', function (e) {
		// newImg('take')
		showOverlay()
	})

	addImg({images: images})
});