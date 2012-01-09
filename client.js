var played = 0;

var songInfo = function() {
  if (typeof Grooveshark === 'undefined' || !Grooveshark._lastStatus) {
    return null;
  }
  return {
    music: Grooveshark._lastStatus.activeSong.SongName,
    artist: Grooveshark._lastStatus.activeSong.ArtistName
  };
};

var sameMusic = function(current, old){
	if (!old) return false;
	return current.music == old.music && played > 0;
};

var old = songInfo();
var adjusted = false;

var adjustStyles = function(){
	$('#capital').css('width', '280px');
	$('body').resize(function(){
		$('#application').css('width', $('body').width() - $('#capital').width());	
	});
	$('#application').css('width', $('body').width() - $('#capital').width()); 
	$('#remove_capital_button').remove();
	$('#mainContainer').css('background', 'none');
	$('#capital_header').css('text-align', 'center');
	$('#capitalPane').css('height', $('#main').height() - 50);
	$('#main').resize(function() {
  		$('#capitalPane').css('height', $('#main').height() - 50);
	});
	$('#capitalPane').css('overflow', 'auto');
	adjusted = true;
};

(setInterval(function(){
	var currentSong = songInfo();
	if (!currentSong) return;
	
	if(!sameMusic(currentSong, old)){
		old = currentSong;
		played++;

		if (!adjusted) adjustStyles();
		
		$.ajax({
	    	url: 'http://lyrics-service.herokuapp.com/?music='+encodeURIComponent(currentSong.music)+'&artist='+encodeURIComponent(currentSong.artist),
				//url: 'http://localhost:3000/?music='+encodeURIComponent(currentSong.music)+'&artist='+encodeURIComponent(currentSong.artist),
	    	dataType: 'jsonp',
	    	crossDomain: true,
	    	jsonp: false,
	    	jsonpCallback: 'result',
	    	success: function(data) {
					var place = 'div#page_content_profile div.content';
					$(place).html('<h2>'+ data.artist + '</h2><h3><b>' + data.music + '</b></h3><p>'+data.lyrics+'</p>');
					$(place).css('margin', '10px');
					$(place).css('border', 'solid 2px grey');
	    	}
		});	

	}

}, 2000));
