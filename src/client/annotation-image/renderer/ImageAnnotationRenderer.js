import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg';
import {  getAnnotationImageFilePath} from "../utils/path-utils";

const HIGH_PRIORITY = 1500;

export default class ImageAnnotationRenderer {
  constructor(eventBus, bpmnRenderer, textRenderer) {
    this._eventBus = eventBus;
    this._bpmnRenderer = bpmnRenderer;
    this._textRenderer = textRenderer;

    // Register renderer with high priority
    eventBus.on('render.shape', HIGH_PRIORITY, (event) => {
        console.log("render.shape event", event);
      const { element, gfx } = event;
      
      if (element.type === 'bpmn:TextAnnotation') {
        console.log("Rendering image annotation for element", element);
        const imagePath = this._getImagePath(element);
        console.log("Image path:", imagePath);
        if (imagePath) {
          return this._renderImageAnnotation(element, gfx, imagePath);
        }
      }
    });
  }

  _getImagePath(element) {
    const bo = element.businessObject;
    const extensionElements = bo.extensionElements;
    console.log("_getImagePath Extension elements:", extensionElements);
    if (!extensionElements || !extensionElements.values) {
      return null;
    }
    
    // Find the image extension element
    const imageExtension = extensionElements.values.find(
      ext => ext.$type === 'annotationsPlugin:Image'
    );

    console.log("Found image extension:", imageExtension);
    let imagePath = imageExtension ? imageExtension.path : null;
    console.log("Raw image path from bpmn:", imagePath);

   imagePath = getAnnotationImageFilePath(imagePath)
   
    
    return imagePath;
  }

  _renderImageAnnotation(element, gfx, imagePath) {
    const { width, height } = element;
    
    // Clear existing content
    svgAttr(gfx, { display: 'block' });
    
    // Create the annotation shape (border)
    const shape = this._bpmnRenderer.drawShape(gfx, element);
    
    // Create image element
    const image = svgCreate('image');
    
    // Calculate image dimensions with padding
    const padding = 10;
    const imageWidth = width - (padding * 2);
    const imageHeight = height - (padding * 2);
    
    svgAttr(image, {
      x: padding,
      y: padding,
      width: imageWidth,
      height: imageHeight,
      href: imagePath,
      preserveAspectRatio: 'xMidYMid meet'
    });
    
    // Add image to the graphics element
    svgAppend(gfx, image);
    
    return shape;
  }
}

ImageAnnotationRenderer.$inject = [
  'eventBus',
  'bpmnRenderer',
  'textRenderer'
];