import path from 'path-browserify';
import { getActiveBpmnDiagramFilePath } from '../info/info';

/**
 * 
 * @param {string} annotationImagePath - path to the file (relateive or absolute). From <annotationsPlugin:image path="./assets/images/my-image.png" />
 */
export const getAnnotationImageFilePath = (annotationImagePath) => {
    if(!annotationImagePath) {
        return null;
    }

    if(path.isAbsolute(annotationImagePath)) {
        return annotationImagePath;
    }

    const activeBpmnDiagramFilePath = getActiveBpmnDiagramFilePath();
    const activeDir = path.dirname(activeFilePath);

    return path.resolve(activeDir, annotationImagePath);
}