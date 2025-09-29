import {
  registerBpmnJSPlugin,
  registerBpmnJSModdleExtension,
  registerClientExtension
} from "camunda-modeler-plugin-helpers";

import ResizeAllRules from "./resize-all-rules";
import annoationImageModdleExtension from "./annotation-image/annoation-image-moddle-extension.json";
import AnnotationImagePropertiesPanel from "./annotation-image/properties-panel";
import Info from "./annotation-image/status-bar/info";

// Allow resizing all shapes
registerBpmnJSPlugin(ResizeAllRules);

// Register custom moddle extiension <annotationImage:image path="./assets/images/my-image.png" />
registerBpmnJSModdleExtension(annoationImageModdleExtension);

// Register custom properties panel
registerBpmnJSPlugin(AnnotationImagePropertiesPanel);

// Resgister status bar info
registerClientExtension(Info);