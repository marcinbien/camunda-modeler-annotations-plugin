# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Camunda Modeler plugin that extends BPMN text annotations with multiple features:
1. **Image Annotations**: Display embedded images within text annotations
2. **Markdown Annotations**: Render annotation text using markdown syntax with HTML formatting
3. **Sticky Notes**: Render markdown annotations as colorful sticky notes with folded corner effects

The plugin allows users to add visual context, rich formatting, and visual styling to BPMN diagrams while maintaining full BPMN 2.0 standard compliance by storing configuration as extension properties.

## Development Commands

### Building and Development
- `npm run bundle` - Build the plugin for production (creates `annotations-plugin.js`)
- `npm run dev` - Build in development mode with file watching
- `npm run all` - Run full build pipeline

### Plugin Structure
The plugin is built using webpack and follows the Camunda Modeler plugin architecture:
- Entry point: `src/client/client.js`
- Output: `src/annotations-plugin.js` (bundled plugin file)
- Main plugin descriptor: `src/index.js`

## Architecture

### Core Components

1. **Plugin Registration** (`src/client/client.js`):
   - Registers BPMN.js plugins using `camunda-modeler-plugin-helpers`
   - Integrates moddle extension, properties panel, renderer, and status bar components

2. **Moddle Extension** (`src/client/annotation-combined-moddle-extension.json`):
   - Defines custom XML schema extensions for both features:
     - `<annotationsPlugin:image path="..." />` for image paths
     - `<annotationsPlugin:markdown renderAsMarkdown="true" />` for markdown toggle
   - Extends BPMN TextAnnotation with both image and markdown properties
   - Uses namespace `http://annotationsPlugin/schema/1.0`

3. **Main Plugin Modules**:
   - `ResizeAllRules` - Allows resizing all BPMN shapes
   - `AnnotationImagePropertiesPanel` - Properties panel for image path configuration
   - `AnnotationMarkdownPropertiesPanel` - Properties panel for markdown toggle, sticky note options, and color selection
   - `ImageAnnotationRenderer` - Custom renderer for displaying images in annotations
   - `MarkdownAnnotationRenderer` - Custom renderer for markdown HTML rendering with comment brackets or sticky note styling
   - `Info` - Status bar component

### Directory Structure
```
src/
├── client/
│   ├── annotation-image/          # Image annotation functionality
│   │   ├── properties-panel/      # Properties panel components
│   │   ├── renderer/              # Custom rendering logic
│   │   ├── status-bar/            # Status bar components
│   │   └── utils/                 # Utility functions
│   ├── annotation-markdown/       # Markdown annotation functionality
│   │   ├── properties-panel/      # Markdown toggle properties panel
│   │   └── renderer/              # Markdown HTML renderer
│   ├── resize-all-rules/          # Shape resizing rules
│   ├── annotation-combined-moddle-extension.json  # Combined schema extension
│   └── client.js                  # Main plugin entry point
├── index.js                       # Plugin descriptor
├── package.json                   # Dependencies and scripts
└── webpack.config.js              # Build configuration
```

## Plugin Installation Structure

The built plugin should be installed in Camunda Modeler's plugins directory with this structure:
```
camunda-modeler/plugins/
└── camunda-modeler-annotations-plugin/
    ├── index.js
    └── annotations-plugin.js
```

## Dependencies

- **Core**: `bpmn-js`, `diagram-js` (peer dependencies)
- **Build**: `webpack`, `@babel/core`, `camunda-modeler-webpack-plugin`
- **Helpers**: `camunda-modeler-plugin-helpers` for plugin registration APIs
- **Utils**: `inherits-browser`, `path-unified`, `tiny-svg`
- **Markdown**: `marked` for markdown parsing and HTML generation

## BPMN Extension Formats

### Image Annotations
Images are embedded in BPMN files using this extension format:
```xml
<bpmn:textAnnotation id="TextAnnotation_xxx">
  <bpmn:extensionElements>
    <annotationsPlugin:image path="./relative/path/to/image.png" />
  </bpmn:extensionElements>
</bpmn:textAnnotation>
```

### Markdown Annotations
Markdown rendering is enabled using this extension format:
```xml
<bpmn:textAnnotation id="TextAnnotation_xxx">
  <bpmn:text># Header 1
## Header 2
- List item 1
- List item 2</bpmn:text>
  <bpmn:extensionElements>
    <annotationsPlugin:markdown renderAsMarkdown="true" />
  </bpmn:extensionElements>
</bpmn:textAnnotation>
```

### Sticky Notes
Sticky note styling with color selection:
```xml
<bpmn:textAnnotation id="TextAnnotation_xxx">
  <bpmn:text># Important Note
This is displayed as a sticky note!</bpmn:text>
  <bpmn:extensionElements>
    <annotationsPlugin:markdown renderAsMarkdown="true" stickyNote="yes" stickyNoteColor="yellow" />
  </bpmn:extensionElements>
</bpmn:textAnnotation>
```

Available sticky note colors:
- `yellow` - Canary Yellow
- `blue` - Sky Blue
- `green` - Lime Green
- `pink` - Soft Pink
- `lavender` - Lavender / Lilac

### Combined Features
Both features can be used together on the same annotation:
```xml
<bpmn:textAnnotation id="TextAnnotation_xxx">
  <bpmn:text># Documentation
![Process Flow](./flow.png)</bpmn:text>
  <bpmn:extensionElements>
    <annotationsPlugin:image path="./diagram.png" />
    <annotationsPlugin:markdown renderAsMarkdown="true" />
  </bpmn:extensionElements>
</bpmn:textAnnotation>
```