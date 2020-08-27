class Github {
  constructor() {
    this.username = "pragadesh-k";
    this.repos_count = 5;
    this.repos_sort = "created";
    this.direction = "desc";
  }

  // initialDisplay = (callback) => {
  //   const data = this.getData(this.username).then((data) => {
  //     if (data.user.message == "Not Found") {
  //       console.log("User not found initially");
  //       console.log(data);
  //     } else {
  //       callback(data);
  //     }
  //   });
  // };

  getData = async (username) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const responseUser = await fetch(
      `https://api.github.com/users/${username}`,
      requestOptions,
      true
    );
    const responseUserData = await responseUser.json();

    const responseRepos = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}&direction=${this.direction}`,
      requestOptions,
      true
    );
    const responseReposData = await responseRepos.json();

    const responseRate = await fetch(
      "https://api.github.com/rate_limit",
      requestOptions,
      true
    );

    const rateLimit = await responseRate.json();

    if (localStorage.getItem("github") !== null) {
      localStorage.removeItem("github");
      localStorage.setItem(
        "github",
        JSON.stringify({
          user: responseUserData,
          userRepos: responseReposData,
          rateLimit,
        })
      );
    } else {
      localStorage.setItem(
        "github",
        JSON.stringify({
          user: responseUserData,
          userRepos: responseReposData,
          rateLimit,
        })
      );
    }
    return {
      user: responseUserData,
      userRepos: responseReposData,
      rateLimit,
    };
  };
}
