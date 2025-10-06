import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg';
import { marked } from 'marked';

const HIGH_PRIORITY = 2000;

export default class MarkdownAnnotationRenderer {
  constructor(eventBus, bpmnRenderer, textRenderer) {
    this._eventBus = eventBus;
    this._bpmnRenderer = bpmnRenderer;
    this._textRenderer = textRenderer;

    // Register renderer with high priority to intercept markdown annotations
    eventBus.on('render.shape', HIGH_PRIORITY, (event) => {
      const { element, gfx } = event;

      if (element.type === 'bpmn:TextAnnotation') {
        console.log('Processing text annotation:', element.id, this._shouldRenderAsMarkdown(element));
        if (this._shouldRenderAsMarkdown(element)) {
          console.log('Rendering as markdown for element:', element.id);
          this._renderMarkdownAnnotation(element, gfx);
          // Stop the event to prevent default rendering
          return false;
        }
      }
    });
  }

  _shouldRenderAsMarkdown(element) {
    const bo = element.businessObject;
    const extensionElements = bo.extensionElements;

    console.log('Checking markdown for element:', element.id);
    console.log('Extension elements:', extensionElements);

    if (!extensionElements || !extensionElements.values) {
      console.log('No extension elements found');
      return false;
    }

    console.log('Extension values:', extensionElements.values);

    // Find the markdown extension element
    const markdownExtension = extensionElements.values.find(
      ext => ext.$type === 'annotationsPlugin:Markdown'
    );

    console.log('Found markdown extension:', markdownExtension);

    const result = markdownExtension && markdownExtension.renderAsMarkdown === true;
    console.log('Should render as markdown:', result);
    return result;
  }

  _renderMarkdownAnnotation(element, gfx) {
    let { width, height } = element;
    const text = element.businessObject.text || '';

    console.log('Rendering markdown annotation for:', element.id, { width, height, text });

    // Disable auto-resizing - let users control the size completely
    console.log('Using user-defined size:', { width, height });

    // Clear the graphics element completely
    while (gfx.firstChild) {
      gfx.removeChild(gfx.firstChild);
    }

    // Draw the comment-style bracket lines
    const bracketLength = 10; // Length of horizontal segments

    // Vertical line
    const verticalLine = svgCreate('line');
    svgAttr(verticalLine, {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: height,
      stroke: '#666',
      strokeWidth: 2
    });
    svgAppend(gfx, verticalLine);

    // Top horizontal line
    const topLine = svgCreate('line');
    svgAttr(topLine, {
      x1: 0,
      y1: 0,
      x2: bracketLength,
      y2: 0,
      stroke: '#666',
      strokeWidth: 2
    });
    svgAppend(gfx, topLine);

    // Bottom horizontal line
    const bottomLine = svgCreate('line');
    svgAttr(bottomLine, {
      x1: 0,
      y1: height,
      x2: bracketLength,
      y2: height,
      stroke: '#666',
      strokeWidth: 2
    });
    svgAppend(gfx, bottomLine);

    // Create foreignObject for HTML content
    const foreignObject = svgCreate('foreignObject');

    // Calculate content dimensions with padding (extra left padding for the line)
    const leftPadding = 15; // Space for the left line
    const topBottomPadding = 5;
    const rightPadding = 10;
    const contentWidth = width - leftPadding - rightPadding;
    const contentHeight = height - (topBottomPadding * 2);

    svgAttr(foreignObject, {
      x: leftPadding,
      y: topBottomPadding,
      width: contentWidth,
      height: contentHeight
    });

    // Create HTML div container
    const htmlDiv = document.createElement('div');
    htmlDiv.style.cssText = `
      width: 100%;
      height: 100%;
      overflow: auto;
      font-family: Arial, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #333;
      background: transparent;
      margin: 0;
      padding: 0;
    `;

    // Configure marked for safer rendering
    marked.setOptions({
      breaks: true,
      gfm: true,
      sanitize: false, // We'll do basic sanitization ourselves
      silent: true
    });

    try {
      // Convert markdown to HTML
      const htmlContent = marked.parse(text);

      // Basic sanitization - remove script tags and dangerous attributes
      const sanitizedHtml = this._sanitizeHtml(htmlContent);

      htmlDiv.innerHTML = sanitizedHtml;
    } catch (error) {
      // Fallback to plain text if markdown parsing fails
      htmlDiv.textContent = text;
    }

    // Apply additional styles to markdown elements
    this._applyMarkdownStyles(htmlDiv);

    // Append HTML div to foreignObject
    foreignObject.appendChild(htmlDiv);

    // Add foreignObject to the graphics element
    svgAppend(gfx, foreignObject);

    return verticalLine;
  }

  _sanitizeHtml(html) {
    // Basic sanitization - remove script tags and event handlers
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
      .replace(/javascript:/gi, '');
  }

  _applyMarkdownStyles(container) {
    // Apply styles to common markdown elements
    const styles = `
      h1 { font-size: 16px; font-weight: bold; margin: 8px 0 4px 0; }
      h2 { font-size: 14px; font-weight: bold; margin: 6px 0 3px 0; }
      h3 { font-size: 13px; font-weight: bold; margin: 4px 0 2px 0; }
      h4, h5, h6 { font-size: 12px; font-weight: bold; margin: 3px 0 2px 0; }
      p { margin: 4px 0; }
      ul, ol { margin: 4px 0; padding-left: 16px; }
      li { margin: 2px 0; }
      strong, b { font-weight: bold; }
      em, i { font-style: italic; }
      code { background: #f0f0f0; padding: 1px 3px; border-radius: 3px; font-family: monospace; }
      pre { background: #f0f0f0; padding: 4px; border-radius: 3px; font-family: monospace; overflow: auto; }
      blockquote { border-left: 3px solid #ccc; margin: 4px 0; padding-left: 8px; font-style: italic; }
      a { color: #0066cc; text-decoration: underline; }
      hr { border: none; border-top: 1px solid #ccc; margin: 8px 0; }
    `;

    // Create style element
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    container.appendChild(styleElement);
  }
}

MarkdownAnnotationRenderer.$inject = [
  'eventBus',
  'bpmnRenderer',
  'textRenderer'
];