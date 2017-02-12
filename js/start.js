$(function () {

	var recognizing = false;
	var ignore_onend;
	var final_transcript = '';
	var start_timestamp;
	if (!('webkitSpeechRecognition' in window)){
		console.log("no webkit");
	} else {
		console.log("starting")
		
  		var recognition = new webkitSpeechRecognition();
  		recognition.continuous = true;
  		recognition.interimResults = true;
  		recognition.onstart = function() {
    	recognizing = true;
    	$("#status_label").html("Listening... Press mic again to compute")
    	
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
    console.log(final_transcript);
  };
	}


	$("#listen-btn").click(function (){

		console.log(recognizing);
		if (recognizing) {
			$("#listen-btn").removeClass("red");
			recognition.stop();
		} else{
			$("#listen-btn").addClass("red");
			final_transcript = '';
			$("#equation_field").val("");
			recognition.start();
			
		}
		

	});





});