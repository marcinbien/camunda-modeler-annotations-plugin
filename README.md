# Camunda Modeler Annotations Plugin
Enhance your BPMN documentation with visual richness while maintaining process clarity and standards compliance.

## Overview
This plugin extends the standard text annotation functionality in Camunda Modeler, allowing users to embed and display images inline with their documentation. Perfect for adding visual context, screenshots, icons, or reference materials directly into your process models.

## Key Features
- Inline Image Display: Embed images directly within text annotations
- Multiple Format Support: Compatible with common image formats including PNG, JPG, GIF, and SVG
- BPMN Compatibility: Maintains full BPMN 2.0 standard compliance - images are stored as extension properties

## Use Cases
- Process Documentation: Add screenshots of UI elements, forms, or system interfaces relevant to specific process steps
- Branding: Add company logos or department identifiers to process documentation
- Training Materials: Create more engaging and self-explanatory process models for onboarding

## Installation
Build the project and then simply drop the plugin into your Camunda Modeler plugins directory and restart the application. The image annotation functionality will automatically become available for all text annotations in your diagrams.

- `npm install`
- `npm run bundle`
- copy the entire directory to the plugins directory
    - Windows `%APPDATA%\camunda-modeler\plugins`
    - MacOS `~/Library/Application\ Support/camunda-modeler/plugins`

## Moddle extension
```xml
<bpmn:definitions 
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:custom="http://custom/schema/1.0"
  ...>
  
  <bpmn:process id="Process_1">
    <bpmn:textAnnotation id="TextAnnotation_1q2zfno">
      <bpmn:text>Sample text</bpmn:text>
      <bpmn:extensionElements>
        <annotationsPlugin:image path="./assets/images/my-image.png" />
      </bpmn:extensionElements>
    </bpmn:textAnnotation>
  </bpmn:process>
  
</bpmn:definitions>
```