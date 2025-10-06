import { html } from 'htm/preact';

import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'camunda-modeler-plugin-helpers/vendor/bpmn-js-properties-panel';

export default function(element) {

  return [
    {
      id: 'stickyNoteColor',
      element,
      component: StickyNoteColor,
      isEdited: isSelectEntryEdited
    }
  ];
}

function StickyNoteColor(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const moddle = useService('moddle');

  const getValue = () => {
    const businessObject = element.businessObject;

    if (!businessObject.extensionElements) {
      return 'yellow';
    }

    const extensionValues = businessObject.extensionElements.get('values');
    const markdownElement = extensionValues.find(
      ext => ext.$type === 'annotationsPlugin:Markdown'
    );

    return markdownElement?.stickyNoteColor || 'yellow';
  };

  const setValue = value => {
    const businessObject = element.businessObject;

    // Create extension elements if they don't exist
    if (!businessObject.extensionElements) {
      businessObject.extensionElements = moddle.create('bpmn:ExtensionElements');
    }

    const extensionValues = businessObject.extensionElements.get('values');

    // Find existing markdown element
    let markdownElement = extensionValues.find(
      ext => ext.$type === 'annotationsPlugin:Markdown'
    );

    if (!markdownElement) {
      // Create new markdown element
      markdownElement = moddle.create('annotationsPlugin:Markdown');
      extensionValues.push(markdownElement);
    }

    // Update the color
    markdownElement.stickyNoteColor = value;

    // Trigger update
    return modeling.updateProperties(element, {});
  };

  const getOptions = () => {
    return [
      { value: 'yellow', label: translate('Canary Yellow') },
      { value: 'blue', label: translate('Sky Blue') },
      { value: 'green', label: translate('Lime Green') },
      { value: 'pink', label: translate('Soft Pink') },
      { value: 'lavender', label: translate('Lavender / Lilac') }
    ];
  };

  // Check if sticky note is enabled
  const isStickyNoteEnabled = () => {
    const businessObject = element.businessObject;

    if (!businessObject.extensionElements) {
      return false;
    }

    const extensionValues = businessObject.extensionElements.get('values');
    const markdownElement = extensionValues.find(
      ext => ext.$type === 'annotationsPlugin:Markdown'
    );

    return markdownElement?.stickyNote === 'yes';
  };

  // Only show color selector if sticky note is enabled
  if (!isStickyNoteEnabled()) {
    return html``;
  }

  return html`<${SelectEntry}
    id=${ id }
    element=${ element }
    description=${ translate('Choose the color of the sticky note') }
    label=${ translate('Sticky Note Color') }
    getValue=${ getValue }
    setValue=${ setValue }
    getOptions=${ getOptions }
    tooltip=${ translate('Select the background color for the sticky note') }
  />`;
}