let mobileAPI_v1 = "/main/mobileAPI/v1.php";
if (process.env.NODE_ENV == "development") {
  mobileAPI_v1 = "http://develop.hell0world.net/main/mobileAPI/v1.php";
} else {
  mobileAPI_v1 = "https://www.easyupclass.com/main/mobileAPI/v1.php";
}
const api_url = {
  mobileAPI_v1: mobileAPI_v1,
};

export default api_url;
