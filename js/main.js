
$(function () {

  var startTime=0;
	var currentTime=0;
  var numberOfChars=0;
	var correctChars;
	var timerInterval;
	var speedInterval;

  var ctx = $("#myChart");

  var chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: [],
          datasets: [{
              label: "Speed chart",
              borderColor: 'rgb(255, 99, 132)',
              data: [],
              pointRadius: 0
          }]
      },
      options: {
        scales: {
          xAxes: [{
            gridLines: {
              display:false
            }
          }],
          yAxes: [{
            gridLines: {
              display:false
            }
          }]
        }
      }
  });

$("#test-text").on("dblclick", function() {
  $(this).attr("contenteditable","true").focus();
  $(this).removeClass();
  $(this).find("span").removeClass();
});

$("#test-text").on("input paste", function(e) {
  if(e.originalEvent.type=="paste") {
    e.preventDefault();
    var tempText=e.originalEvent.clipboardData.getData('text').trim();
    $(this).text(tempText);
    reset();
  } else {
    reset();
  }
});

$("#test-text").on("blur", function() {
  $(this).removeAttr("contenteditable");
});

$("#input-text").on("input", function(e) {
  let input = $("#input-text").val();
  let test = $("#test-text").text();
  if(input.length>test.length && test!=="") {
    input = input.substring(0, test.length);
    $("#input-text").val(input);
    return;
  }
  if($("#test-text").text()==="") {
    alert("Please enter text for test.");
    $("#input-text").val("").blur();
  } else if (startTime===0) {
    timerInterval = setInterval(startTimer, 10);
    speedInterval = setInterval(updateChart, 1000);
    checkResult();
  } else {
    checkResult();
  }
});

function startTimer() {
  var minutes=0;
  var seconds=0;
  var centiseconds=0;

  if(startTime===0) {
    startTime = new Date().getTime();
  } else {
    currentTime = new Date().getTime() - startTime;
    minutes = String(parseInt(currentTime/60000));
    seconds = String(parseInt((currentTime%60000)/1000));
    centiseconds = String(((currentTime%60000)%1000));

    if(minutes.length<2) {
      minutes = "0" + minutes;
    }

    if(seconds.length<2) {
      seconds = "0" + seconds;
    }

    if(centiseconds.length==3){
      centiseconds = centiseconds.slice(0,2);
    } else if(centiseconds.length==2) {
      centiseconds = "0" + centiseconds;
      centiseconds = centiseconds.slice(0,2);
    } else {
      centiseconds="00";
    }

    $("#timer").html(minutes+":"+seconds+":"+centiseconds);
  }
}

function checkResult() {
  var input = $("#input-text").val().split("");
  var test = $("#test-text").text().split("");
  var mistakes=0;

  if($("#test-text").text()==$("#input-text").val()) {
    test = "<span class='correct'>" + test.join("") + "</span>";
    $("#test-text").html(test);
    clearInterval(timerInterval);
    clearInterval(speedInterval);
    $("#input-text").attr("readonly", "true");
    $("#test-text").addClass("correct");
    updateChart();
    $("#test-text").addClass("correct");
    correctChars++;

  } else if(input.length<=test.length){
    correctChars=0;
    for(var i=0; i<input.length;i++) {
      let temp;
      if(input[i]===test[i]){
        temp = "<span class='correct'>" + test[i] + "</span>";
        test[i] = temp;
        $("#mistakes span").html(mistakes);
        correctChars++;
      } else if(input[i]!=test[i]){
        temp = "<span class='wrong'>" + test[i] + "</span>";
        test[i] = temp;
        mistakes++;
        $("#mistakes span").html(mistakes);
      }
  }
    $("#test-text").html(test.join(""));
  }
}

function updateChart () {
  let currentTime = new Date().getTime();
  let speed = parseInt((60000/(currentTime-startTime))*correctChars);
  $("#speed span").html(speed);

  let labelsLength = chart.data.labels.length;
  let dataLength = chart.data.datasets[0].data.length;

  chart.data.labels[labelsLength]="";
  chart.data.datasets[0].data[dataLength]=speed;
  chart.update();
}

$("#reset-button").on("click", function(){
  reset();
});

function reset() {
  $("#timer").html("00:00:00");
  $("#speed span").html("");
  $("#input-text").val("").removeAttr("readonly");
  $("#test-text span").removeClass("correct");
  clearInterval(timerInterval);
  clearInterval(speedInterval);
  chart.data.labels=[];
  chart.data.datasets[0].data = [];
  chart.update();
  startTime=0;
  counter=0;
  numberOfChars=0;
  correctChars=0;
}

});
