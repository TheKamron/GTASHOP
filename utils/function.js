import moment from "moment";

export default {
    formatDate(date) {
        return moment(date).format("DD.MM.YYYY")
    },
    formatDate_2(date) {
        return moment(date).format("DD-MMM, YYYY")
    },
    ifequal(a, b, options) {
        if(a == b) {
            return options.fn(this)
        }

        return options.inverse(this)
    }

}
