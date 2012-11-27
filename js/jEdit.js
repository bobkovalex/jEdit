/*
*
*	Author: Alexandr Bobkov
*	URL: http://lilalex.comuv.com/projects/jedit/demo.html
*	Version: 1.1.0
*	Copyright 2012
*
*/
var range;
(function($){
  $.fn.jedit = function(params){
	params = $.extend( {width:0, height: 469, txt:''}, params);
	init(this, params);
    
	$('#jEdit-control-buttons button').live('click', function(event){
		var eID = event.target.id;
		switch(eID){
			case 'jEdit-bold':		document.execCommand('bold',null,false);
									break;
			case 'jEdit-italic':	document.execCommand('italic',null,false);
									break;
			case 'jEdit-underline':	document.execCommand('underline',null,false);
									break;
			case 'jEdit-list':		document.execCommand('insertunorderedlist',null,false);
									break;
			case 'jEdit-html':		if($(this).attr('class') == 'jEdit-html'){
										$('#jEdit').html($('#jEdit-html-view').val());
									}else{
										$('#jEdit-html-view').val($('#jEdit').html());
									}
									$('#jEdit').toggle();
									$('#jEdit-html-view').toggle();
									$(this).toggleClass('jEdit-html');
									break;
			case 'jEdit-img':		setRange();
									loadPopup('#jEdit-image-popup');
									break;
			case 'jEdit-youtube':	setRange();
									loadPopup('#jEdit-video-popup');
									break;
			case 'jEdit-link':		setRange();
									loadPopup('#jEdit-link-popup');
									break;
			case 'jEdit-unlink':	document.execCommand('unlink',null,false);
									break;
			case 'jEdit-table':		setRange();
									loadPopup('#jEdit-table-popup');
									break;
		}
	});
	/* Picture */
	$('.jEdit-image-popup-close').live('click',function(){
		loadPopup('#jEdit-image-popup');
		clearInputVal('jEdit-image-url');
	});
	$('#jEdit-insert-image').live('click',function(){
		var selectionContents = range.extractContents();
		var img = document.createElement("img");
		img.src = $('#jEdit-image-url').val();
		img.width = $('#jEdit-image-width').val();
		img.height = $('#jEdit-image-height').val();
		img.appendChild(selectionContents);
		range.insertNode(img);
		loadPopup('#jEdit-image-popup');
		clearInputVal('jEdit-image-popup');
	});
	/* YouTube Video */
	$('.jEdit-video-popup-close').live('click',function(){
		loadPopup('#jEdit-video-popup');
		clearInputVal('jEdit-video-url');
	});
	$('#jEdit-insert-video').live('click',function(){
		var youTubeVideo = getVideoHtml($('#jEdit-video-url').val(), $('#jEdit-video-width').val(), $('#jEdit-video-height').val());
		var selectionContents = range.extractContents();
		var span = document.createElement("span");
		span.innerHTML = youTubeVideo;
		span.appendChild(selectionContents);
		range.insertNode(span);
		loadPopup('#jEdit-video-popup');
		clearInputVal('jEdit-video-popup');
	});
	/* Hyperlink */
	$('.jEdit-link-popup-close').live('click',function(){
		loadPopup('#jEdit-link-popup');
		clearInputVal('jEdit-link-url');
	});
	$('#jEdit-insert-link').live('click',function(){
		var linkUrl = $('#jEdit-link-url').val();
		var selectionContents = range.extractContents();
		var href = document.createElement("a");
		href.href = linkUrl;
		href.appendChild(selectionContents);
		range.insertNode(href);
		loadPopup('#jEdit-link-popup');
		clearInputVal('jEdit-link-popup');
	});
	/* Table */
	$('.jEdit-table-popup-close').live('click',function(){
		loadPopup('#jEdit-table-popup');
		clearInputVal('jEdit-table-popup');
	});
	$('#jEdit-insert-table').live('click',function(){
		var rows = $('#jEdit-table-rows').val();
		var cols = $('#jEdit-table-cols').val();
		var selectionContents = range.extractContents();
		var table = document.createElement("table");
		table.cellPadding = 0;
		table.cellSpacing = 0;
		for(var i=0; i<cols; i++){
			var tr = document.createElement("tr");
			for(var j=0; j<rows; j++){
				var td = document.createElement("td");
				td.appendChild(selectionContents);
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		range.insertNode(table);
		loadPopup('#jEdit-table-popup');
		clearInputVal('jEdit-table-popup');
	});
  };
})(jQuery);
function init(elem, params){
	var formID = '#jEdit-wrapper';
	var form = '<div id="jEdit-wrapper"></div>';
	var controlButtons = '<div id="jEdit-control-buttons"><button id="jEdit-html" title="html"></button><button id="jEdit-bold" title="bold"></button><button id="jEdit-italic" title="italic"></button><button id="jEdit-underline" title="underline"></button><button id="jEdit-list" title="list"></button><button id="jEdit-img" title="picture"></button><button id="jEdit-youtube" title="video"></button><button id="jEdit-link" title="link"></button><button id="jEdit-unlink" title="unlink"></button><button id="jEdit-table" title="table"></button></div>';
	var formTextArea = '<div id="jEdit" contenteditable="true">'+params.txt+'</div><textarea id="jEdit-html-view"></textarea>';
	var imagePopup = '<div class="popup-wrapper jEdit-popup" id="jEdit-image-popup"><div class="popup-content-wrapper"><h4>Copy/Past image url.</h4><ul class="popup-content"><li><label>Width:</label><input type="text" id="jEdit-image-width"/></li><li><label>Height:</label><input type="text" id="jEdit-image-height"/></li><li><label>Url:</label><input type="text" id="jEdit-image-url"/></li></ul></div><hr/><div class="popup-footer-wrapper"><div><input type="button" id="jEdit-insert-image" value="Insert"/><div class="styledButtonOverlay"></div></div><div><input type="button" class="jEdit-image-popup-close" value="Cancel"/><div class="styledButtonOverlay"></div></div></div></div>';
	var videoPopup = '<div class="popup-wrapper jEdit-popup" id="jEdit-video-popup"><div class="popup-content-wrapper"><h4>Copy/Past youtube video url.</h4><ul class="popup-content"><li><label>Width:</label><input type="text" id="jEdit-video-width"/></li><li><label>Height:</label><input type="text" id="jEdit-video-height"/></li><li><label>Url:</label><input type="text" id="jEdit-video-url"/></li></ul></div><hr/><div class="popup-footer-wrapper"><div><input type="button" id="jEdit-insert-video" value="Insert"/><div class="styledButtonOverlay"></div></div><div><input type="button" class="jEdit-video-popup-close" value="Cancel"/><div class="styledButtonOverlay"></div></div></div></div>';
	var linkPopup = '<div class="popup-wrapper jEdit-popup" id="jEdit-link-popup"><div class="popup-content-wrapper"><h4>Copy/Past link url.</h4><ul class="popup-content"><li><label>Url:</label><input type="text" id="jEdit-link-url"/></li></ul></div><hr/><div class="popup-footer-wrapper"><div><input type="button" id="jEdit-insert-link" value="Insert"/><div class="styledButtonOverlay"></div></div><div><input type="button" class="jEdit-link-popup-close" value="Cancel"/><div class="styledButtonOverlay"></div></div></div></div>';
	var tablePopup = '<div class="popup-wrapper jEdit-popup" id="jEdit-table-popup"><div class="popup-content-wrapper"><h4>Specify rows and colums for the table.</h4><ul class="popup-content"><li><label>Rows:</label><input type="text" id="jEdit-table-rows"/></li><li><label>Colums:</label><input type="text" id="jEdit-table-cols"/></li></ul></div><hr/><div class="popup-footer-wrapper"><div><input type="button" id="jEdit-insert-table" value="Insert"/><div class="styledButtonOverlay"></div></div><div><input type="button" class="jEdit-table-popup-close" value="Cancel"/><div class="styledButtonOverlay"></div></div></div></div>';
	
	$(elem).append(form);
	$(formID).append(controlButtons);
	$(formID).append(imagePopup);
	$(formID).append(videoPopup);
	$(formID).append(linkPopup);
	$(formID).append(tablePopup);
	$(formID).append(formTextArea);
	
	if(params.width > 0){
		$('#jEdit-wrapper').css('width', params.width+'px')
	}
	$('#jEdit-wrapper').css('height', params.height+'px');
	$('#jEdit').css('height', (params.height-69)+'px');
	$('#jEdit-html-view').css('height', (params.height-47)+'px');
}
function setRange(){
	var obj = document.getElementById('jEdit');
	if(obj.setActive){
		obj.setActive();
	}else if(obj.focus){
		obj.focus();
	}
	range = window.getSelection().getRangeAt(0);
}
function clearInputVal(wrapper){
	$('#'+wrapper).find('input[type="text"]').val('');
}
function getVideoHtml(videoUrl, width, height){
	var videoID = videoUrl.split('v=')[1];
	var ampersandPosition = videoID.indexOf('&');
	if(ampersandPosition != -1) {
	  videoID = videoID.substring(0, ampersandPosition);
	}
	var youTubeVideo = '<object width="425" height="344"><param name="movie" value="http://youtube.googleapis.com/v/'+videoID+'&hl=en&fs=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://youtube.googleapis.com/v/'+videoID+'&hl=en&fs=1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="'+width+'" height="'+height+'"></embed></object>';
	return youTubeVideo;
}
function loadPopup(popUpID){
	$('.jEdit-popup').each(function(){
		var currentID = '#' + $(this).attr('id');
		if(currentID != popUpID){
			$(this).slideUp('fast');
		}
	});
	$(popUpID).slideToggle('fast');
}