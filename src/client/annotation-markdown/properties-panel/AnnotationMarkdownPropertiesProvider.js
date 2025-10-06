import markdownToggle from './parts/MarkdownToggle';
import stickyNoteToggle from './parts/StickyNoteToggle';
import stickyNoteColor from './parts/StickyNoteColor';
import { is } from 'bpmn-js/lib/util/ModelUtil';

const LOW_PRIORITY = 500;

export default class AnnotationMarkdownPropertiesProvider {
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
            // Add the "markdown" group
            if (is(element, 'bpmn:TextAnnotation')) {
                groups.push(createMarkdownGroup(element, this._translate));
            }

            return groups;
        };
    }
}

/**
 * Create the custom markdown group
 */
const createMarkdownGroup = (element, translate) => {
    // create a group called "Markdown".
    const markdownGroup = {
        id: 'markdown',
        label: translate('Markdown'),
        entries: [
            ...markdownToggle(element),
            ...stickyNoteToggle(element),
            ...stickyNoteColor(element)
        ],
        tooltip: translate('Configure markdown rendering for this annotation'),
    };

    return markdownGroup;
};