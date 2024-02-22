/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */ "use strict";
var kb;
var key;
var value;
var _ref = kb = require("./kb"), _ = _ref._, ko = _ref.ko;
var ALL_ORMS = {
    default: null,
    "backbone-orm": null,
    "backbone-associations": require("./orms/backbone-associations"),
    "backbone-relational": require("./orms/backbone-relational")
};
// @nodoc
kb.settings = {
    orm: ALL_ORMS.default
};
for(key in ALL_ORMS){
    value = ALL_ORMS[key];
    if (value && value.isAvailable()) {
        kb.settings.orm = value;
        break;
    }
}
// @nodoc
module.exports = function(options) {
    if (options == null) {
        options = {};
    }
    for(key in options){
        var orm;
        value = options[key];
        switch(key){
            case "orm":
                // set by name
                if (_.isString(value)) {
                    if (!ALL_ORMS.hasOwnProperty(value)) {
                        console.log("Knockback configure: could not find orm: ".concat(value, ". Available: ").concat(_.keys(ALL_ORMS).join(", ")));
                        continue;
                    }
                    if ((orm = ALL_ORMS[value]) && !orm.isAvailable()) {
                        console.log("Knockback configure: could not enable orm ".concat(value, ". Make sure it is included before Knockback"));
                        continue;
                    }
                    kb.settings.orm = orm;
                    continue;
                // set by functions
                }
                kb.settings.orm = value;
                break;
            default:
                kb.settings[key] = value;
        }
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }