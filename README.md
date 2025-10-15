# 🎨 Camunda Modeler Annotations Plugin
Enhance your BPMN documentation with visual richness while maintaining process clarity and standards compliance.

![GitHub Downloads](https://img.shields.io/github/downloads/marcinbien/camunda-modeler-annotations-plugin/total)


## 📋 Overview
This plugin extends the standard text annotation functionality in  [Camunda Modeler](https://github.com/camunda/camunda-modeler), allowing users to embed and display images inline with their documentation. Perfect for adding visual context, screenshots, icons, or reference materials directly into your process models.

## 🖼️ Examples

### Diagram in Camunda Modeler 
![Diagram in Camunda Modeler](/resources/examples/diagram1-modeler.png)

### Diagram exported to png file
![Diagram exported to png file](/resources/examples/diagram1.png)

## 📐 Definition of diagram
Part of the bpmn [diagram1.bpmn](/resources/examples/diagram1.bpmn) file where image annotation is added.
```xml
<bpmn:textAnnotation id="TextAnnotation_0a7rtgj">
  <bpmn:extensionElements>
    <annotationsPlugin:image path="./personal-details.png" />
  </bpmn:extensionElements>
</bpmn:textAnnotation>

```

## ✨ Key Features
- 🖼️ Inline Image Display: Embed images directly within text annotations
- 📁 Multiple Format Support: Compatible with common image formats including PNG, JPG, GIF, and SVG
- ✅ BPMN Compatibility: Maintains full BPMN 2.0 standard compliance - images are stored as extension properties

## 💡 Use Cases
- 📚 Process Documentation: Add screenshots of UI elements, forms, or system interfaces relevant to specific process steps
- 🏢 Branding: Add company logos or department identifiers to process documentation
- 🎓 Training Materials: Create more engaging and self-explanatory process models for onboarding

## 📥 Installation
- Download [camunda-modeler-annotations-plugin-v0.0.2.zip
](https://github.com/marcinbien/camunda-modeler-annotations-plugin/releases/latest/download/camunda-modeler-annotations-plugin-v0.0.2.zip) from [releases page](https://github.com/marcinbien/camunda-modeler-annotations-plugin/releases/latest) [![Latest Release](https://img.shields.io/github/v/release/marcinbien/camunda-modeler-annotations-plugin)](https://github.com/marcinbien/camunda-modeler-annotations-plugin/releases/latest).
- Unpack the repository. You should see the `camunda-modeler-annotations-plugin` directory
- Copy the entire directory to the Camunda Modeler plugins directory
    - Windows `%APPDATA%\camunda-modeler\plugins`
    - MacOS `~/Library/Application\ Support/camunda-modeler/plugins`

The directory structure should look like this
```
%APPDATA% or ~/Library/Application\ Support/

└──camunda-modeler
   └── resources
       └── plugins
           └── camunda-modeler-annotations-plugin
               ├── index.js
               └── annotations-plugin.js
```
