import http from "../http-common";

class OtherService {
    createDataSystem() {
        return http.post(`/common/create/common`);
    }
    createFolderSystem() {
        return http.post(`/common/create/folder-system`);
    }
    checkBackend() {
        return http.get(`/test/check-backend`);
    }
    createAttendanceEvaluateRootFromDate(type, date, idSchool) {
        if (type == "attendanceType") {
            return http.post(`/common/create/attendance?idSchool=${idSchool}`, date);
        } else if (type == "evaluateType") {
            return http.post(`/common/create/evaluate?idSchool=${idSchool}`, date);
        }
    }
    getSchoolAllService() {
        return http.get(`/school/all`);
    }
    getAttendanceDuplicateService(date) {
        return http.get(`/common/attendance/duplicate?date=${date}`);
    }
    deleteAttendanceDuplicateService(date) {
        return http.delete(`/common/attendance/duplicate?date=${date}`);
    }
    getEvaluateDuplicateService(date) {
        return http.get(`/common/evaluate/duplicate?date=${date}`);
    }
    deleteEvaluateDuplicateService(date) {
        return http.delete(`/common/evaluate/duplicate?date=${date}`);
    }

}

export default new OtherService();