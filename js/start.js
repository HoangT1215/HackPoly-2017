$(function () {

	var recognizing = false;
	var ignore_onend;
	var final_transcript = '';
	var start_timestamp;
  var apiKey = 'E7V5U9-LPU643H76T'
  var baseURL = 'http://api.wolframalpha.com/v1/simple?appid='+apiKey + "&i=";
  //var baseURL = 'http://api.wolframalpha.com/v2/query?';//appid=' + apiKey + '&mode=default&i=';
  //var wolfram = require('wolfram-alpha').createClient(apiKey,opts);
  
  //var baseURL = 'http://api.wolframalpha.com/v2/query?appid=' + apiKey + '&input=';
  //var restURL = '&format=plaintext&async=false&reinterpret=true';
  $('.modal').modal();

	if (!('webkitSpeechRecognition' in window)){
		console.log("no webkit");
	} else {
		console.log("starting")
		
  		var recognition = new webkitSpeechRecognition();
  		recognition.continuous = true;
  		recognition.interimResults = true;
  		recognition.onstart = function() {
    	recognizing = true;
    	$("#status_label").html('Listening <img src="img/listening.svg"</img> <br/> Press mic again or say "search" to compute <br/> Say "cancel" to abort');
    	
    };
    recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      
      console.log('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      
      console.log('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        console.log('info_blocked');
      } else {
        console.log('info_denied');
      }
      ignore_onend = true;
    }
  };
    recognition.onend = function() {
   	$("#status_label").html("Press the mic and speak");
    
    //$("#img_result").attr("src", "img/loading.svg");
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    
    if (!final_transcript) {
      console.log('info_start');
      return;
    }
    
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      upgrade();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    $("#equation_field").val(final_transcript);
    if (final_transcript.toLowerCase().endsWith("cancel")) {
      console.log("canceling");
      cancelRequest();
    }
    else if (final_transcript.toLowerCase().endsWith("search")) {
      console.log("searching");
      StartSearching();

    }

    else if (final_transcript === "hack poly" || final_transcript === "hackpoly") {
      updateStatusForMeme("img/hackpolymeme.png");
    }
    else if (final_transcript.toLowerCase() === "president trump") {
      updateStatusForMeme("img/trumpmeme.jpg");
    }
    else if (final_transcript.toLowerCase() === "etcetera" || final_transcript.toLowerCase() === "etc" || final_transcript.toLowerCase() === "et cetera"){
      updateStatusForMeme("img/etcmeme.jpg");
    }

  };
	}


	$("#listen-btn").click(function (){
    $("#meme").hide();
    $("#img_result").hide(); 

		if (recognizing) {
			$("#listen-btn").removeClass("red");
      if (final_transcript.length != 0){
        var query = encodeURIComponent(final_transcript.toLowerCase());
        $("#loading_gif").show();
        $("#img_result").show();
        $("#img_result").attr("src", baseURL+query);
        $("#img_result")
            .on('load', function() { $("#loading_gif").hide(); })
            .on('error', function() { 
              $("#loading_gif").hide();
              $("#img_result").hide(); 
              $("#error_message").show();});
      }
      
   
			recognition.stop();
      recognizing = false;
		} else {
      $("#error_message").hide();
      $("#loading_gif").hide();
			$("#listen-btn").addClass("red");
			final_transcript = '';
			$("#equation_field").val("");
			recognition.start();
			
		}
		

	});

  function updateStatusForMeme(memeSrc) {
      $("#loading_gif").hide();
      recognition.stop();
      $("#listen-btn").removeClass("red");
      $("#meme").attr('src', memeSrc);
      $("#meme").fadeIn(800);
      recognizing = false;
      $('html,body').animate({scrollTop: $("#top_div").offset().top + "px"}, 800);
      $("#img_result").hide();
  }
  function cancelRequest() {
    recognition.stop();
    $("#listen-btn").removeClass("red");
    recognizing = false;
  }
  function StartSearching() {
    recognition.stop();
    $("#listen-btn").removeClass("red");
    recognizing = false;
    var n = final_transcript.length;
      final_transcript = final_transcript.substring(0,n-7);
      console.log(final_transcript);
      var query = encodeURIComponent(final_transcript.toLowerCase());
        $("#loading_gif").show();
        $("#img_result").show();
        $("#img_result").attr("src", baseURL+query);
        $("#img_result")
            .on('load', function() { $("#loading_gif").hide(); })
            .on('error', function() { 
              $("#loading_gif").hide();
              $("#img_result").hide(); 
              $("#error_message").show();
            });
  }
  $(window).scroll(function() {
    if ($(this).scrollTop()) {
        $('#top_btn:hidden').stop(true, true).fadeIn();
    } else {
        $('#top_btn').stop(true, true).fadeOut();
    }
  });

  $("#top_btn").click(function(){
    $('html, body').animate({scrollTop: '0px'}, 800);

  });




});