// deviceInfoSDK.js

class DeviceInfoSDK {
  getOSVersion() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    let os = null;
    let osVersion = null;

    if (/Mac/.test(platform)) {
      os = "Mac";
      osVersion = /Mac OS X ([._\d]+)/.exec(userAgent)[1].replace("_", ".");
    } else if (/Win/.test(platform)) {
      os = "Windows";
      osVersion = /Windows NT ([._\d]+)/.exec(userAgent)[1];
    } else if (/Linux/.test(platform)) {
      os = "Linux";
      osVersion = "";
    } else {
      os = "Unknown";
      osVersion = "";
    }    

    return { os, osVersion };
  }

  getBrowserInfo() {
    const ua = navigator.userAgent;
    let tem;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return { name: "IE", version: tem[1] || "" };
    }
    if (M[1] === "Chrome") {
      tem = ua.match(/\bOPR|Edge\/(\d+)/);
      if (tem != null) {
        return { name: "Opera", version: tem[1] };
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }
    return { name: M[0], version: M[1] };
  }

  fetchIPDetails(apiKey) {
    const url = `https://pro.ip-api.com/json/?fields=17035263&key=${String(apiKey)}`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const browserInfo = this.getBrowserInfo();
        const osInfo = this.getOSVersion();
        const info = {
          browserDetails: {
            browserName: browserInfo.name,
            browserMajorVersion: browserInfo.version.split(".")[0],
            browserFullVersion: browserInfo.version,
            os: osInfo.os,
            osVersion: osInfo.osVersion,
            userAgent: navigator.userAgent,
          },
          ip: data.query,
          mobile:data.mobile,
          proxy: data.proxy,
          hosting: data.hosting,
          ipLocation: {
            timezone: data.timezone,
            city: {
              name: data.city,
            },
            country: {
              code: data.countryCode,
              name: data.country,
            },
            continent: {
              code: data.continentCode,
            },
          },
        };

        return btoa(JSON.stringify(info));
      });
  }
}

export default new DeviceInfoSDK();
