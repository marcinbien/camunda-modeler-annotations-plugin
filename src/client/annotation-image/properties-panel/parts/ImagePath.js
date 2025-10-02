import { html } from 'htm/preact';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'camunda-modeler-plugin-helpers/vendor/bpmn-js-properties-panel';

export default function(element) {

  return [
    {
      id: 'imagePath',
      element,
      component: ImagePath,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

function ImagePath(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const moddle = useService('moddle');

  const getValue = () => {
    const businessObject = element.businessObject;
    
    if (!businessObject.extensionElements) {
      return '';
    }
    
    const extensionValues = businessObject.extensionElements.get('values');
    const imageElement = extensionValues.find(
      ext => ext.$type === 'annotationsPlugin:Image'
    );
    
    return imageElement?.path || '';
  };

  const setValue = value => {
    const businessObject = element.businessObject;
    
    // Create extension elements if they don't exist
    if (!businessObject.extensionElements) {
      businessObject.extensionElements = moddle.create('bpmn:ExtensionElements');
    }


    const extensionValues = businessObject.extensionElements.get('values');
    
    // Find existing image element
    let imageElement = extensionValues.find(
      ext => ext.$type === 'annotationsPlugin:Image'
    );
    
    if (value) {
      // If value is provided, create or update
      if (!imageElement) {
        // Create new image element
        imageElement = moddle.create('annotationsPlugin:Image', {
          path: value
        });
        extensionValues.push(imageElement);
      } else {
        // Update existing
        imageElement.path = value;
      }
    } else {
      // If value is empty, remove the image element
      if (imageElement) {
        const index = extensionValues.indexOf(imageElement);
        if (index > -1) {
          extensionValues.splice(index, 1);
        }
      }
    }
    
    // Trigger update
    return modeling.updateProperties(element, {});
  };

  return html`<${TextFieldEntry}
    id=${ id }
    element=${ element }
    description=${ translate('Path to the image') }
    label=${ translate('Image path') }
    getValue=${ getValue }
    setValue=${ setValue }
    debounce=${ debounce }
    tooltip=${ translate('Path to the image. Relative  (./image.png) or absolute (/Users/Marcin/Documents/image.png)') }
  />`;
}