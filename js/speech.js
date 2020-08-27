class SpeechRecog {
  constructor() {
    this.engine = webkitSpeechRecognition || window.SpeechRecognition;
    this.recognition = new this.engine();
    this.recognition.continuous = true;
    this.recognition.lang = "en-US";
    this.recognition.interimResults = false;
    this.status = false;
    this.micBtn = document.getElementById("mic");
    this.covidTracker = document.querySelector("#covid-tracker");
    this.githubUsers = document.querySelector("#github-users");
    this.speechRecognitionSection = document.querySelector(
      "#speech-recognition"
    );
    this.changeLoc = document.getElementById("change-loc");
    this.stateIN = document.getElementById("state-name");
    this.districtIN = document.getElementById("district-name");
  }

  // start = () => {
  //   this.recognition.onstart = (event) => {
  //     console.log("started");
  //     console.log(event);
  //   };
  // };

  // end = () => {
  //   this.recognition.onend = (event) => {
  //     console.log(event);
  //   };
  // };

  result = () => {
    this.recognition.onresult = (event) => {
      const command = event.results[event.resultIndex][0].transcript
        .toLowerCase()
        .trim();
      //command functions
      if (command.includes("scroll")) {
        this.scroll(command);
      } else if (command.includes("microphone")) {
        this.microphone(command);
      } else if (
        command.includes("go") &&
        command.replace(/\s+/g, "").includes("goto")
      ) {
        console.log("gosection");
        this.goTo(command);
      } else if (command.includes("change") && command.includes("location")) {
        this.changeLoc.scrollIntoView(false);
        setTimeout(() => {
          this.changeLoc.click();
        }, 700);
      } else if (
        command.includes("dark") ||
        (command.includes("light") && command.includes("mode"))
      ) {
        document.getElementById("mode-logo").click();
      } else if (command.includes("select")) {
        if (command.includes("state")) {
          this.stateIN.focus();
        } else if (command.includes("district")) {
          this.districtIN.focus();
        }
      }
    };
  };

  scroll = (command) => {
    const features = ["top", "bottom", "up", "down"];
    const scrollFunctions = {
      top: () => {
        document.documentElement.scrollTop = 0;
      },
      bottom: () => {
        window.scrollTo(0, document.body.scrollHeight);
      },
      down: () => {
        window.scrollBy(0, 420);
      },
      up: () => {
        window.scrollBy(0, -420);
      },
    };

    features.forEach((element) => {
      if (command.includes(element)) {
        scrollFunctions[element]();
      }
    });
  };

  microphone = (command) => {
    const features = ["disable"];
    const micFunctions = {
      disable: () => {
        this.micBtn.click();
      },
    };

    features.forEach((element) => {
      if (command.includes(element)) {
        micFunctions[element]();
      }
    });
  };

  goTo = (command) => {
    this.scroll(command);
    const features = ["covid", "github", "mike", "speech"];
    const gotoFunctions = {
      covid: () => {
        this.covidTracker.scrollIntoView();
      },
      github: () => {
        this.githubUsers.scrollIntoView();
      },
      speech: () => {
        this.speechRecognitionSection.scrollIntoView();
      },
      mike: () => {
        this.speechRecognitionSection.scrollIntoView();
      },
    };
    features.forEach((element) => {
      if (command.includes(element)) {
        gotoFunctions[element]();
      }
    });
  };
  error = () => {
    var error;
    this.recognition.onerror = (error) => {
      //console.log(error, "pragi");
      error = error;
    };
    return error;
  };
}
