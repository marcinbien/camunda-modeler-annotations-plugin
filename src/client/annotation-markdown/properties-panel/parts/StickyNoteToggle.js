import { html } from 'htm/preact';

import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'camunda-modeler-plugin-helpers/vendor/bpmn-js-properties-panel';

export default function(element) {

  return [
    {
      id: 'stickyNoteToggle',
      element,
      component: StickyNoteToggle,
      isEdited: isSelectEntryEdited
    }
  ];
}

function StickyNoteToggle(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const moddle = useService('moddle');

  const getValue = () => {
    const businessObject = element.businessObject;

    if (!businessObject.extensionElements) {
      return 'no';
    }

    const extensionValues = businessObject.extensionElements.get('values');
    const markdownElement = extensionValues.find(
      ext => ext.$type === 'annotationsPlugin:Markdown'
    );

    return markdownElement?.stickyNote === 'yes' ? 'yes' : 'no';
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

    // Update the stickyNote attribute
    if (value === 'yes') {
      markdownElement.stickyNote = 'yes';
      // Set default color if not already set
      if (!markdownElement.stickyNoteColor) {
        markdownElement.stickyNoteColor = 'yellow';
      }
    } else {
      markdownElement.stickyNote = 'no';
      // Don't remove the color, keep it for when they toggle back
    }

    // Trigger update
    return modeling.updateProperties(element, {});
  };

  const getOptions = () => {
    return [
      { value: 'no', label: translate('No') },
      { value: 'yes', label: translate('Yes') }
    ];
  };

  return html`<${SelectEntry}
    id=${ id }
    element=${ element }
    description=${ translate('Render annotation as a sticky note') }
    label=${ translate('Sticky Note Style') }
    getValue=${ getValue }
    setValue=${ setValue }
    getOptions=${ getOptions }
    tooltip=${ translate('When enabled, the annotation will be rendered as a colored sticky note') }
  />`;
}