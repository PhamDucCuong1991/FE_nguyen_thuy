import http from "../http-common";
class DashboardService {
  getStatisticalInSchool() {
    return http.get("/home/statistical");
  }
  getStatisticalInClass() {
    return http.get("/home/statistical/class");
  }
  getLearnFutureService() {
    return http.get("/home/learn/future");
  }
}

export default new DashboardService();