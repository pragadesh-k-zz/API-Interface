//fixed top problem
// document.body.style.paddingTop = `${
//   document.getElementsByTagName("nav")[0].clientHeight
// }px`;

//UI elements

const modeLogo = document.querySelector("#mode-logo");

//covid UI ELEMENTS
const navUl = document.querySelector(".nav-ul");
const html = document.getElementsByTagName("html")[0];
const btnTop = document.getElementById("btntop");
const saveBtn = document.getElementById("save-btn");
const stateIN = document.getElementById("state-name");
const districtIN = document.getElementById("district-name");

//github UI ELEMENTS
const search = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");

//speech recognition
const mic = document.getElementById("mic");
const micState = document.getElementById("mic-state");
const micLogo = document.getElementById("mic-logo");
const toast = document.querySelector(".toast");

//init classes
const covidUI = new CovidUI();
const githubUI = new GithubUI();
const covid = new Covid();
const github = new Github();
const recog = new SpeechRecog();

//LOADERS
// covid.defaultLocation(covidUI.covidDetails);
// github.initialDisplay(githubUI.paint);

//EVENT LISTENERS

document.addEventListener("DOMContentLoaded", retrive);

//covid event listeners
navUl.addEventListener("click", covidUI.scrollSection);
btnTop.addEventListener("click", covidUI.scrollTop);
saveBtn.addEventListener("click", changeLocation);
stateIN.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    saveBtn.click();
    githubUI.mode(false);
  }
});
districtIN.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    saveBtn.click();
  }
});

//darkmode event
modeLogo.addEventListener("click", (e) => {
  //darkmode
  if (!githubUI.modeState) {
    githubUI.mode(true);
    githubUI.modeState = true;
    if (localStorage.getItem("mode") !== null) {
      localStorage.removeItem("mode");
      localStorage.setItem("mode", JSON.stringify(githubUI.modeState));
    } else {
      localStorage.setItem("mode", JSON.stringify(githubUI.modeState));
    }
  }
  //light mode
  else {
    githubUI.mode(false);
    githubUI.modeState = false;
    if (localStorage.getItem("mode") !== null) {
      localStorage.removeItem("mode");
      localStorage.setItem("mode", JSON.stringify(githubUI.modeState));
    } else {
      localStorage.setItem("mode", JSON.stringify(githubUI.modeState));
    }
  }
});

//github event listeners
searchBtn.addEventListener("click", getUser);
search.addEventListener("keyup", (e) => {
  console.log();
  if (e.keyCode === 13) {
    searchBtn.click();
  }
});

//speech recogniton event listeners
mic.addEventListener("click", speechCheck);
micLogo.addEventListener("click", speechCheck);

//ON Events
document.body.onscroll = (ev) => {
  if (html.scrollTop > 1625) {
    btnTop.style.display = "inline";
  } else {
    btnTop.style.display = "none";
  }
};

// FUNCTIONS FOR EVENT LISTENERS

//retrive data on reload
function retrive(e) {
  if (localStorage.getItem("covid") !== null) {
    const data = JSON.parse(localStorage.getItem("covid"));
    if (!data.error) {
      covidUI.covidDetails(data);
      covid.dataVizz({
        values: [
          data.data.active,
          data.data.confirmed,
          data.data.deceased,
          data.data.recovered,
        ],
        district: data.district,
      });
    }
  }
  if (localStorage.getItem("github") !== null) {
    const gitData = JSON.parse(localStorage.getItem("github"));
    if (gitData.user.message !== "Not Found") {
      githubUI.paint(gitData);
    }
  }

  if (localStorage.getItem("mode") !== null) {
    githubUI.mode(JSON.parse(localStorage.getItem("mode")));
    githubUI.modeState = JSON.parse(localStorage.getItem("mode"));
  }
}

//COVID-19
function changeLocation(e) {
  const state = stateIN.value.replace(" ", "").toLocaleLowerCase();
  const district = districtIN.value.replace(" ", "").toLocaleLowerCase();

  if (state.length == 0 || district.length == 0) {
    //show ALERT
    covidUI.showAlert("No Location Given!", "bg-warning");
  } else {
    //get DATA
    covid
      .getData(state, district)
      .then((data) => data)
      .then((data) => {
        if (data.error) {
          //show Alert
          covidUI.showAlert(data.error, "bg-danger");
          console.log(data.error);
        } else {
          //SHOW alert
          covidUI.showAlert("Location Saved!", "bg-success");
          covidUI.covidDetails(data);
          covid.dataVizz({
            values: [
              data.data.active,
              data.data.confirmed,
              data.data.deceased,
              data.data.recovered,
            ],
            district: data.district,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  //CLEAR INPUTS
  stateIN.value = "";
  districtIN.value = "";
}

//GITHUB USERS
function getUser() {
  let username = search.value;
  if (!username.length) {
    //SHOW alert
    covidUI.showAlert("No Username Given", "bg-warning");
    setTimeout(() => {
      githubUI.clearProfile();
    }, 500);
  } else {
    github.getData(username).then((data) => {
      if (data.user.message == "Not Found") {
        //Show Alert
        covidUI.showAlert("User not Found", "bg-danger");
        setTimeout(() => {
          githubUI.clearProfile();
        }, 500);
      } else {
        setTimeout(() => {
          githubUI.paint(data);
        }, 500);

        //show alert
        covidUI.showAlert("User Found", "bg-success");
      }
    });
  }

  //CLEAR INPUTS
  search.value = "";
}

// Speech Recognition
function speechCheck(e) {
  if (recog.status) {
    recog.recognition.stop();
    recog.status = false;
    micState.textContent = "Microphone off";
    micLogo.style.color = "white";
    //recog.end();
  } else {
    recog.recognition.start();
    recog.status = true;
    recog.result();
    micState.textContent = "Microphone on";
    micLogo.style.color = "rgb(252, 82, 82)";
    setTimeout(() => {
      toast.classList.add("show");

      // speech synthesis
      let synth = window.speechSynthesis;
      let msg = new SpeechSynthesisUtterance(
        "Hello there, voice command enabled"
      );
      msg.lang = "en-US";
      synth.speak(msg);
      setTimeout(() => {
        toast.classList.remove("show");
      }, 2500);
    }, 550);

    //recog.start();
  }
}

//JQuery for Bootstrap
$(function () {
  $('[data-toggle="popover"]').popover();
});
$(".popover-dismiss").popover({
  trigger: "focus",
});
