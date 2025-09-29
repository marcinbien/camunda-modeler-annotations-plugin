import imagePath from './parts/ImagePath';
import { is } from 'bpmn-js/lib/util/ModelUtil';

const LOW_PRIORITY = 500;


export default class AnnotationImagePropertiesProvider {
    static get $inject() {
        return ['propertiesPanel', 'translate'];
    }


    constructor(propertiesPanel, translate) {
        this._translate = translate;

        // Register our properties provider.
        // Use a lower priority to ensure it is loaded after
        // the basic BPMN properties.
        propertiesPanel.registerProvider(LOW_PRIORITY, this);
    }

    /**
     * Return the groups provided for the given element.
     *
     * @param {DiagramElement} element
     *
     * @return {(Object[]) => (Object[])} groups middleware
     */
    getGroups(element) {
        /**
         * We return a middleware that modifies
         * the existing groups.
         *
         * @param {Object[]} groups
         *
         * @return {Object[]} modified groups
         */
        return (groups) => {
            // Add the "image" group
            if (is(element, 'bpmn:TextAnnotation')) {
                groups.push(createImageGroup(element, this._translate));
            }

            return groups;
        };
    }
}

/**
 * Create the custom image group
 */
const createImageGroup = (element, translate) => {
    // create a group called "Image".
    const imageGroup = {
        id: 'image',
        label: translate('Image'),
        entries: imagePath(element),
        tooltip: translate('Make sure you know what you are doing!')
    };

    return imageGroup;
};