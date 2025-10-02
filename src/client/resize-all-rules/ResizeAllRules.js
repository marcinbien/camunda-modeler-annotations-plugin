import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";

export default class ResizeAllRules extends RuleProvider {
  static $inject = ["eventBus"];

  constructor(eventBus) {
    super(eventBus);
  }

  init() {
    this.addRule("shape.resize", 1500, function () {
      return true;
    });
  }
}