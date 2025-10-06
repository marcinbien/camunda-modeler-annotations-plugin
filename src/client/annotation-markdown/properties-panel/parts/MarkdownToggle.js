import { html } from 'htm/preact';

import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'camunda-modeler-plugin-helpers/vendor/bpmn-js-properties-panel';

export default function(element) {

  return [
    {
      id: 'markdownToggle',
      element,
      component: MarkdownToggle,
      isEdited: isSelectEntryEdited
    }
  ];
}

function MarkdownToggle(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const moddle = useService('moddle');

  const getValue = () => {
    const businessObject = element.businessObject;

    if (!businessObject.extensionElements) {
      return 'false';
    }

    const extensionValues = businessObject.extensionElements.get('values');
    const markdownElement = extensionValues.find(
      ext => ext.$type === 'annotationsPlugin:Markdown'
    );

    return markdownElement?.renderAsMarkdown ? 'true' : 'false';
  };

  const setValue = value => {
    const businessObject = element.businessObject;
    const boolValue = value === 'true';

    // Create extension elements if they don't exist
    if (!businessObject.extensionElements) {
      businessObject.extensionElements = moddle.create('bpmn:ExtensionElements');
    }

    const extensionValues = businessObject.extensionElements.get('values');

    // Find existing markdown element
    let markdownElement = extensionValues.find(
      ext => ext.$type === 'annotationsPlugin:Markdown'
    );

    if (boolValue) {
      // If value is true, create or update
      if (!markdownElement) {
        // Create new markdown element
        markdownElement = moddle.create('annotationsPlugin:Markdown', {
          renderAsMarkdown: true
        });
        extensionValues.push(markdownElement);
      } else {
        // Update existing
        markdownElement.renderAsMarkdown = true;
      }
    } else {
      // If value is false, remove the markdown element or set to false
      if (markdownElement) {
        const index = extensionValues.indexOf(markdownElement);
        if (index > -1) {
          extensionValues.splice(index, 1);
        }
      }
    }

    // Trigger update
    return modeling.updateProperties(element, {});
  };

  const getOptions = () => {
    return [
      { value: 'false', label: translate('No') },
      { value: 'true', label: translate('Yes') }
    ];
  };

  return html`<${SelectEntry}
    id=${ id }
    element=${ element }
    description=${ translate('Enable markdown rendering for this annotation') }
    label=${ translate('Render as Markdown') }
    getValue=${ getValue }
    setValue=${ setValue }
    getOptions=${ getOptions }
    tooltip=${ translate('When enabled, the annotation text will be rendered as markdown with formatting support') }
  />`;
}