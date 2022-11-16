// workaround for https://github.com/erosson/freecbt/issues/19
// see also https://github.com/storybookjs/react-native/issues/20
const finally_ = Promise.prototype.finally;
export default require("./main").default
Promise.prototype.finally = Promise.prototype.finally || finally_;
