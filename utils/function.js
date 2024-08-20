import moment from "moment";

export default {
    formatDate(date) {
        return moment(date).format("DD.MM.YYYY")
    },
    formatDate_2(date) {
        return moment(date).format("DD-MMM, YYYY")
    },
}