const today = new Date(); 
const year = today.getFullYear(); 
const month = (today.getMonth() + 1).toString().padStart(2, '0');  
const day = (today.getDate() -1).toString().padStart(2, '0'); 

const yyyymmdd = `${year}${month}${day}`;
console.log(yyyymmdd);

let week = (today.getDate() -7).toString().padStart(2, '0'); 
if(week < 0) {week = '00'};

const yyyymmWeek = `${year}${month}${week}`;
console.log(yyyymmWeek);

let dailyDateInfo = `| 기준일: ${year}-${month}-${day}`;
if(day == '00') {
  dailyDateInfo = `| 기준일: ${year}. ${month}. 01`;
}else{
  dailyDateInfo = `| 기준일: ${year}. ${month}. ${day}`;
};
$("#dailyDate").append(dailyDateInfo);

$.ajax({
  method: "GET",
  url: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
  data: { key: "78c30f0f607a72b6f3d5c9a5bfc7db00", targetDt: yyyymmdd },
}).done(function (msg) {
  let dailyMov = msg.boxOfficeResult.dailyBoxOfficeList;

  let downIcon = `<img class="upDown" src="data/down.svg" alt="">`
  let upIcon = `<img class="upDown" src="data/up.svg" alt="">`
  let midIcon = `<img class="upDown" src="data/mid.svg" alt="">`

  for(let i=0; i<dailyMov.length; i++){
    let cardContent = `
    <div class="cardContainer" id="dailyCard${[i]}">
  
      <div class="cardInfo">
          <div class="cardInfoMain">
              <div class="rankTitle">
                  <div class="ranking">
                    ${[i+1]}
                  </div>
                  <div class="title" id="cardTitle${[i]}">
                    ${dailyMov[i].movieNm}
                  </div>
              </div>
              <div class="rating" id="dailyRating${[i]}">
                  <div class="ratingNum" id="dailyRatingNum${[i]}">${dailyMov[i].rankInten}</div>
              </div>
          </div>
          <div class="cardInfoSub">
              <div>
                  개봉일 : ${dailyMov[i].openDt}
              </div>
              <div>
                  누적 관객수 : ${dailyMov[i].audiAcc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}명
              </div>
          </div>
      </div>
    </div>
    `;

    $("#dailyCards").append(cardContent);
    
    if(dailyMov[i].rankInten > 0){
      document.getElementById(`dailyRatingNum${[i]}`).style.color = "#00E86B"
      document.getElementById(`dailyRating${[i]}`).insertAdjacentHTML("beforeend", upIcon);
    }else if(dailyMov[i].rankInten < 0){
      document.getElementById(`dailyRatingNum${[i]}`).style.color = "#ED2222"
      document.getElementById(`dailyRating${[i]}`).insertAdjacentHTML("beforeend", downIcon);
    } else {
      document.getElementById(`dailyRatingNum${[i]}`).style.color = "#C9C9C9"
      document.getElementById(`dailyRating${[i]}`).insertAdjacentHTML("beforeend", midIcon);
    }
  };


  function dailyMovieImg(rank) {

    $.ajax({
      method: "GET",
      url: "https://dapi.kakao.com/v2/search/image",
      headers: { Authorization: "KakaoAK 0c914d06e7b07c027a9992eaa89ad62b" },
      data: { query: `${dailyMov[rank].movieNm} 영화 포스터` },
    }).done(function (msg) {
      const dailyImg = `<img class="card" src="${msg.documents[0].image_url}">`;

      document.getElementById(`dailyCard${[rank]}`).insertAdjacentHTML("afterbegin", dailyImg);
    });
  }
  dailyMovieImg(0);
  dailyMovieImg(1);
  dailyMovieImg(2);
  dailyMovieImg(3);
  dailyMovieImg(4);
  dailyMovieImg(5);
  dailyMovieImg(6);
  dailyMovieImg(7);
  dailyMovieImg(8);
  dailyMovieImg(9);
});

$.ajax({
  method: "GET",
  url: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json",
  data: { key: "78c30f0f607a72b6f3d5c9a5bfc7db00", targetDt: yyyymmWeek, weekGb: "0"},
}).done(function (msg) {
  let weeklyMov = msg.boxOfficeResult.weeklyBoxOfficeList;
  console.log(msg.boxOfficeResult);

  let downIcon = `<img class="upDown" src="data/down.svg" alt="">`
  let upIcon = `<img class="upDown" src="data/up.svg" alt="">`
  let midIcon = `<img class="upDown" src="data/mid.svg" alt="">`

  const dateRange = msg.boxOfficeResult.showRange;
  const dateSlice = [dateRange.slice(0,4),".",dateRange.slice(4,6),
  ".",dateRange.slice(6,8),dateRange.slice(8,13),".",dateRange.slice(13,15),
  ".",dateRange.slice(15,17)].join('');
  $("#weeklyDate").append(`| ${dateSlice}`);


  for(let i=0; i<weeklyMov.length; i++){
    let cardContent = `
    <div class="cardContainer" id="weeklyCard${[i]}">
  
      <div class="cardInfo">
          <div class="cardInfoMain">
              <div class="rankTitle">
                  <div class="ranking">
                    ${[i+1]}
                  </div>
                  <div class="title" id="cardTitle${[i]}">
                    ${weeklyMov[i].movieNm}
                  </div>
              </div>
              <div class="rating" id="weeklyRating${[i]}">
                  <div class="ratingNum" id="weeklyRatingNum${[i]}">${weeklyMov[i].rankInten}</div>
              </div>
          </div>
          <div class="cardInfoSub">
              <div>
                  개봉일 : ${weeklyMov[i].openDt}
              </div>
              <div>
                  누적 관객수 : ${weeklyMov[i].audiAcc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}명
              </div>
          </div>
      </div>
    </div>
    `;

    $("#weeklyCards").append(cardContent);
    
    if(weeklyMov[i].rankInten > 0){
      document.getElementById(`weeklyRatingNum${[i]}`).style.color = "#00E86B"
      document.getElementById(`weeklyRating${[i]}`).insertAdjacentHTML("beforeend", upIcon);
    }else if(weeklyMov[i].rankInten < 0){
      document.getElementById(`weeklyRatingNum${[i]}`).style.color = "#ED2222"
      document.getElementById(`weeklyRating${[i]}`).insertAdjacentHTML("beforeend", downIcon);
    } else {
      document.getElementById(`weeklyRatingNum${[i]}`).style.color = "#C9C9C9"
      document.getElementById(`weeklyRating${[i]}`).insertAdjacentHTML("beforeend", midIcon);
    }
  };

  function weeklyMovieImg(rank) {
    $.ajax({
      method: "GET",
      url: "https://dapi.kakao.com/v2/search/image",
      headers: { Authorization: "KakaoAK 0c914d06e7b07c027a9992eaa89ad62b" },
      data: { query: `${weeklyMov[rank].movieNm} 영화 포스터` },
    }).done(function (msg) {
      const weeklyImg = `<img class="card" src="${msg.documents[0].image_url}">`;

      document.getElementById(`weeklyCard${[rank]}`).insertAdjacentHTML("afterbegin", weeklyImg);
    });
  }
  weeklyMovieImg(0);
  weeklyMovieImg(1);
  weeklyMovieImg(2);
  weeklyMovieImg(3);
  weeklyMovieImg(4);
  weeklyMovieImg(5);
  weeklyMovieImg(6);
  weeklyMovieImg(7);
  weeklyMovieImg(8);
  weeklyMovieImg(9);
});
