class Covid {
  constructor() {
    this.state = "tamilnadu";
    this.district = "erode";
    this.data = {
      data: undefined,
      state: undefined,
      district: undefined,
      error: undefined,
    };
  }

  //FETCH the data
  getData = async (state, district) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const dataResponse = await fetch(
      "https://data.covid19india.org/state_district_wise.json",
      requestOptions,
      true
    );

    var data = await dataResponse.json();

    this.replaceKeys(data);

    data = this.analyseData(state, district, data);

    if (localStorage.getItem("covid") !== null) {
      localStorage.removeItem("covid");
      localStorage.setItem("covid", JSON.stringify(data));
    } else {
      localStorage.setItem("covid", JSON.stringify(data));
    }

    return data;
  };

  //CHECK the stae aand district is prensent in data or not
  analyseData = (state, district, data) => {
    let dataSeparated;
    let finalData;

    try {
      dataSeparated = data[state]["districtdata"][district];
      finalData = [dataSeparated, state, district];
    } catch (error) {
      finalData = [dataSeparated];
    }

    if (finalData[0] === undefined) {
      this.data.data = undefined;
      this.data.state = undefined;
      this.data.district = undefined;
      this.data.error = "Give the correct location or check the spell out!";
      return this.data;
    } else {
      this.data.data = finalData[0];
      this.data.state = finalData[1];
      this.data.district = finalData[2];
      this.data.error = undefined;
      return this.data;
    }
  };

  //REMOVE space in keys and making it lower case
  replaceKeys = (object) => {
    var self = this;

    Object.keys(object).forEach(function (key) {
      var newKey = key.replace(/\s+/g, "");
      newKey = newKey.toLocaleLowerCase();

      if (object[key] && typeof object[key] === "object") {
        self.replaceKeys(object[key]);
      }

      if (key !== newKey) {
        object[newKey] = object[key];
        delete object[key];
      }
    });
  };

  // defaultLocation = (callbackone) => {
  //   this.getData(this.state, this.district)
  //     .then((data) => data)
  //     .then((data) => {
  //       callbackone(data);

  //       this.dataVizz({
  //         values: [
  //           data.data.active,
  //           data.data.confirmed,
  //           data.data.deceased,
  //           data.data.recovered,
  //         ],
  //         district: data.district,
  //       });
  //     });
  // };

  //DATA VIZZULATION
  dataVizz = (prop) => {
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Active", "Confirmed", "Deceased", "Recovered"],
        datasets: [
          {
            label: prop.district,
            data: prop.values,
            backgroundColor: [
              "rgba(19, 45, 59, 0.438)",
              "rgba(251, 255, 15, 0.438)",
              "rgba(255, 15, 55, 0.438)",
              "rgba(6, 167, 14, 0.438)",
            ],
            borderColor: [
              "rgba(19, 45, 59, 1)",
              "rgba(251, 255, 15, 1)",
              "rgba(255, 15, 55, 1)",
              "rgba(6, 167, 14, 1)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  };
}
