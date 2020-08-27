class CovidUI {
  constructor() {
    this.navLogos = document.querySelectorAll(".nav-logos");
    this.covidTracker = document.querySelector("#covid-tracker");
    this.githubUsers = document.querySelector("#github-users");
    this.speechRecognition = document.querySelector("#speech-recognition");
    this.btnTop = document.getElementById("btntop");
    this.details = document.querySelectorAll(".count");
    this.stateUI = document.getElementById("display-state");
    this.districtUI = document.getElementById("display-district");
    this.alert = document.getElementById("alert");
    this.alertMessage = document.getElementById("alert-message");
    this.saveBtn = document.getElementById("save-btn");
    this.sampel = 10;
  }

  scrollSection = (e) => {
    switch (true) {
      case e.target === this.navLogos[0].firstElementChild ||
        e.target === this.navLogos[0].firstElementChild.firstElementChild:
        this.covidTracker.scrollIntoView(true);
        break;

      case e.target === this.navLogos[1].firstElementChild ||
        e.target === this.navLogos[1].firstElementChild.firstElementChild:
        this.githubUsers.scrollIntoView(true);
        break;

      case e.target === this.navLogos[2].firstElementChild ||
        e.target === this.navLogos[2].firstElementChild.firstElementChild:
        this.speechRecognition.scrollIntoView(true);
        break;

      default:
        break;
    }
  };

  scrollTop = (e) => {
    document.documentElement.scrollTop = 0;
  };

  covidDetails = (data) => {
    this.districtUI.textContent = `${data.district
      .charAt(0)
      .toUpperCase()}${data.district.slice(1)}`;
    this.stateUI.textContent = `${data.state
      .charAt(0)
      .toUpperCase()}${data.state.slice(1)}`;
    this.details[0].textContent = data.data.active;
    this.details[1].textContent = data.data.confirmed;
    this.details[2].textContent = data.data.deceased;
    this.details[3].textContent = data.data.recovered;
  };

  showAlert = (message, color) => {
    switch (true) {
      case this.alert.classList.contains("bg-danger"):
        this.alert.classList.remove("bg-danger");
        break;
      case this.alert.classList.contains("bg-warning"):
        this.alert.classList.remove("bg-warning");
        break;
      case this.alert.classList.contains("bg-success"):
        this.alert.classList.remove("bg-success");
        break;
      default:
        break;
    }
    this.alert.classList.add(color);
    this.alertMessage.textContent = message;

    setTimeout(function () {
      $("#alert-modal").modal();
    }, 500);

    setTimeout(function () {
      $("#alert-modal").modal("hide");
    }, 2300);
  };
}

class GithubUI {
  constructor() {
    this.body = document.getElementById("git-body");
    this.infoDetail = document.querySelector(".github-info");
    this.text = document.querySelectorAll(".text");
    this.modeLogo = document.querySelector("#mode-logo");
    this.textTwo = document.getElementById("for");
    this.mainContainer = document.getElementById("main-container");
    this.modeState = false;
  }

  paint = (data) => {
    const output = `
    <div class="row my-5">
    <div class="col-lg-3 text-center">
      <div class="card">
        <div class="card-header">
          <div class="card-subtitle text-muted">${data.user.login}</div>
        </div>
        <img
          src="${data.user.avatar_url}"
          alt="Profile Image"
          class="img-fluid mb-3"
        />
        <a
          href="${data.user.html_url}"
          class="btn btn-outline-success"
          id="view-btn"
          target="_blank"
          >View Profile</a
        >
      </div>
    </div>
    <div class="col-lg-6 my-3 my-lg-0">
      <div class="pb-3">
        <div class="badge badge-success"><span>Followers : </span>${data.user.followers}</div>
        <div class="badge badge-info"><span>Following : </span>${data.user.following}</div>
        <div class="badge badge-warning"><span>Repositories : </span>${data.user.public_repos}</div>
        <div class="badge badge-secondary"><span>Gists : </span>${data.user.public_gists}</div>
      </div>
      <ul class="list-group" id="user-details">
        <li class="list-group-item"><span class="text-info">NAME : </span>${data.user.name}</li>
        <li class="list-group-item"><span class="text-info">Location : </span>${data.user.location}</li>
        <li class="list-group-item"><span class="text-info">Email : </span>${data.user.email}</li>
        <li class="list-group-item"><span class="text-info">Hireable : </span>${data.user.hireable}</li>
      </ul>
    </div>
    <div class="col-lg-3">
      <ul class="latest-repos list-group">
        <h5>Latest Repos</h5>
      </ul>
    </div>
  </div>
    `;
    this.body.innerHTML = output;

    let latestRepos = document.querySelector(".latest-repos");

    if (data.user.public_repos == 0) {
      let item = document.createElement("a");
      item.className =
        "norepos list-group-item d-flex justify-content-between align-items-center";
      item.href = "javascript:;";
      item.innerHTML = `<span>No repos Found</span><span class="repospill badge badge-primary badge-pill">${data.user.public_repos}</span>`;
      latestRepos.appendChild(item);
    } else {
      data.userRepos.forEach((repo) => {
        let item = document.createElement("a");
        item.className = "list-group-item";
        item.target = "_blank";
        item.href = `${repo.html_url}`;
        item.textContent = `${repo.name}`;
        latestRepos.appendChild(item);
      });
    }

    this.gitInfo(data.rateLimit);
  };

  clearProfile = () => {
    this.body.innerHTML = `
    <div class="m-auto text-muted">
      <span class="fa fa-search mr-1"></span>No results found
    </div>
    `;
  };

  gitInfo = (rateData) => {
    this.infoDetail.setAttribute(
      "data-content",
      `remaining ${rateData.rate.remaining} of ${
        rateData.rate.limit
      }. Renews in ${new Date(rateData.rate.reset * 1000)}`
    );
  };

  mode = (state) => {
    if (state) {
      const linkTag = document.createElement("link");
      linkTag.rel = "stylesheet";
      linkTag.href = "css/bootstrap.mindark.css";
      linkTag.id = "darkmode";
      document.querySelector("head").appendChild(linkTag);
      this.modeLogo.classList.remove("fa-moon-o");
      this.modeLogo.classList.add("fa-circle");
      this.modeLogo.setAttribute("title", "light mode");
      this.text.forEach((element) => {
        element.classList.remove("text-primary");
        element.classList.add("text-white");
      });
      this.textTwo.classList.remove("text-secondary");
      this.textTwo.classList.add("text-white");
      this.mainContainer.style.boxShadow = "none";
    } else {
      try {
        document.querySelector("#darkmode").remove();
      } catch (error) {
        null;
      }
      this.modeLogo.classList.remove("fa-circle");
      this.modeLogo.classList.add("fa-moon-o");
      this.modeLogo.setAttribute("title", "dark mode");
      this.text.forEach((element) => {
        element.classList.remove("text-white");
        element.classList.add("text-primary");
      });
      this.textTwo.classList.remove("text-white");
      this.textTwo.classList.add("text-secondary");
      this.mainContainer.style.boxShadow = "0px 0px 20px gray";
    }
  };
}
