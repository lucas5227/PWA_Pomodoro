const currentDate = new Date();
var workTime = 45 * 60; // 45분 (초)
var workTime_input = 45 * 60;
var breakTime = 15 * 60; // 15분 (초)
var breakTime_input = 15 * 60;
var workTimerRunning = false;
var breakTimerRunning = false;
var volume = 1;
var sfx_work = new Audio('assets/sfx/work.mp3'); // 워크 MP3 파일 경로 지정
var sfx_break = new Audio('assets/sfx/break.mp3'); // 브레이크 MP3 파일 경로 지정

// init
$('#date').text(currentDate.toLocaleDateString());
$('#time').text(currentDate.toLocaleTimeString());
$('#work').text(formatTime(workTime)); // 초기 값 설정
$('#break').text(formatTime(breakTime)); // 초기 값 설정

// 1초마다 시간을 업데이트
setInterval(function () {
    // 현재 시간 업데이트
    const currentTime = new Date();
    $('#date').text(currentTime.toLocaleDateString());
    $('#time').text(currentTime.toLocaleTimeString());
}, 1000);

// 워크 타이머 입력 값 변경
$('#workTimeInput').on('input', function () {
    let inputValue = $(this).val().split(':');
    let hour = parseInt(inputValue[0], 10) || 0;
    let minute = parseInt(inputValue[1], 10) || 0;
    workTime = (hour * 60 + minute); // 입력된 값을 분 단위로 변경
    workTime_input = (hour * 60 + minute);
    $('#work').text(formatTime(workTime)); // 화면에 새 값 표시
});

// 브레이크 타이머 입력 값 변경
$('#breakTimeInput').on('input', function () {
    let inputValue = $(this).val().split(':');
    let hour = parseInt(inputValue[0], 10) || 0;
    let minute = parseInt(inputValue[1], 10) || 0;
    breakTime = (hour * 60 + minute); // 입력된 값을 분 단위로 변경
    breakTime_input = (hour * 60 + minute);
    $('#break').text(formatTime(breakTime)); // 화면에 새 값 표시
});

$('#timerSwitch').on('change', function () {
    if (this.checked) {
        if (!breakTimerRunning) workTimerRunning = true;
        if (!workTimerRunning) breakTimerRunning = true;
        runTimer();
    } else {
        workTimerRunning = false;
        breakTimerRunning = false;
        $('#work').removeClass('blink');
        $('#break').removeClass('blink');
        if (timerInterval) clearInterval(timerInterval); // 인터벌을 멈추기
    }
});

// mute 버튼이 체크되었을 때 MP3 재생
$('#muteSwitch').on('change', function () {
    if (this.checked) {
        volume = 0;
    } else {
        adjustVolume();
    }
});

$('#volumeControl').on('input', function () {
    adjustVolume();
});

$('#resetButton').on('click', function () {
    workTime = workTime_input;
    breakTime = breakTime_input;
    $('#work').text(formatTime(workTime));
    $('#break').text(formatTime(breakTime));
});

// 초를 "MM:SS" 형식으로 변환하는 함수
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

let timerInterval; // 인터벌을 관리할 변수

function runTimer() {
    if (timerInterval) {
        clearInterval(timerInterval); // 기존 인터벌 지우기
    }
    timerInterval = setInterval(function () {
        if (workTimerRunning === true && workTime > 0) {
            // 워크 타이머 업데이트
            $('#work').addClass('blink');
            $('#break').removeClass('blink');
            workTime--;
            $('#work').text(formatTime(workTime));
        }
        if (workTime === 0) {
            sfx_break.volume = volume;
            sfx_break.play();
            workTime = workTime_input;
            workTimerRunning = false;
            breakTimerRunning = true;
            $('#work').text(formatTime(workTime_input));
        }

        if (breakTimerRunning === true && breakTime > 0) {
            // 브레이크 타이머 업데이트
            $('#break').addClass('blink');
            $('#work').removeClass('blink');
            breakTime--;
            $('#break').text(formatTime(breakTime));
        }

        if (breakTime === 0) {
            sfx_work.volume = volume;
            sfx_work.play();
            breakTime = breakTime_input;
            breakTimerRunning = false;
            workTimerRunning = true;
            $('#break').text(formatTime(breakTime_input));
        }
    }, 1000);
}

function adjustVolume() {
    let volumeInput = $('#volumeControl').val();
    $('#volumeValue').text( volumeInput);
    volume =  volumeInput / 100; // 볼륨을 0-1 범위로 조정
}
