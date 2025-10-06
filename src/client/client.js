import {
  registerBpmnJSPlugin,
  registerBpmnJSModdleExtension,
  registerClientExtension
} from "camunda-modeler-plugin-helpers";

import ResizeAllRules from "./resize-all-rules";
import annotationCombinedModdleExtension from "./annotation-combined-moddle-extension.json";
import AnnotationImagePropertiesPanel from "./annotation-image/properties-panel";
import AnnotationMarkdownPropertiesPanel from "./annotation-markdown/properties-panel";
import Info from "./annotation-image/status-bar/info";
import ImageAnnotationRenderer from "./annotation-image/renderer";
import MarkdownAnnotationRenderer from "./annotation-markdown/renderer";

// Allow resizing all shapes
registerBpmnJSPlugin(ResizeAllRules);

// Register combined moddle extension for both image and markdown features
registerBpmnJSModdleExtension(annotationCombinedModdleExtension);

// Register custom properties panels
registerBpmnJSPlugin(AnnotationImagePropertiesPanel);
registerBpmnJSPlugin(AnnotationMarkdownPropertiesPanel);

// Register status bar info
registerClientExtension(Info);

// Register custom renderers
registerBpmnJSPlugin(ImageAnnotationRenderer);
registerBpmnJSPlugin(MarkdownAnnotationRenderer);