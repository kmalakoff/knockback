var LocalizedString;
LocalizedString = (function() {
  function LocalizedString(string_id) {
    this.string_id = string_id;
    if (!kb.locale_manager) {
      throw new Error("missing Knockback.locale_manager");
    }
    this.string = kb.locale_manager.get(this.string_id);
  }
  return LocalizedString;
})();