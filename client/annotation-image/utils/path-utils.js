import path from 'path-browserify';
import { getActiveBpmnDiagramFilePath } from '../status-bar/info';

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
    console.log("Active BPMN diagram file path:", activeBpmnDiagramFilePath);
    const activeDir = path.dirname(activeBpmnDiagramFilePath);
    console.log("Active BPMN diagram directory:", activeDir);
    const imagePath = path.resolve(activeDir, annotationImagePath);
    console.log("Resolved image path:", imagePath);
    return imagePath;
}