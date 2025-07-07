import { Plugin } from 'ckeditor5';

import { uploadedDataUrls } from '../UploadAdapter';


export default class ImageDataUrl extends Plugin {
  init() {
    const editor = this.editor;

    // Extend schema to allow dataUrl on imageBlock elements
    editor.model.schema.extend('imageBlock', {
      allowAttributes: ['dataUrl']
    });

    editor.model.document.registerPostFixer(writer => {
      let wasFixed = false;

      for (const change of editor.model.document.differ.getChanges()) {

        if (change.type === 'attribute' && change.attributeKey === 'src') {

          const src = change.attributeNewValue;

          const imageElement = change.range.end.parent;

          const dataUrl = uploadedDataUrls.get(src);

          if (!imageElement.is('element', 'imageBlock')) continue;

          if (dataUrl && imageElement) {
            writer.setAttribute('dataUrl', dataUrl, imageElement);
            uploadedDataUrls.delete(src); // Clean up
            wasFixed = true;
          }
        }
      }

      return wasFixed;
    });

    // Manual upcast from <img data-url="..."> → model attribute
    editor.conversion.for('upcast').add(dispatcher => {
      dispatcher.on('element:img', (evt, data, conversionApi) => {
        const dataUrl = data.viewItem.getAttribute('data-url');
        if (!dataUrl) return;

        const imageModelElement = data.modelRange?.start.nodeAfter;
        if (!imageModelElement) return;

        conversionApi.writer.setAttribute('dataUrl', dataUrl, imageModelElement);
      });
    });

    // Downcast from model → <img data-url="...">
    editor.conversion.for('downcast').add(dispatcher => {
      dispatcher.on('attribute:dataUrl:imageBlock', (evt, data, conversionApi) => {
        const { item, attributeNewValue } = data;

        const viewElement = conversionApi.mapper.toViewElement(item);
        if (!viewElement) return;

        if (attributeNewValue) {

          conversionApi.writer.setAttribute('data-url', attributeNewValue, viewElement.getChild(0));
        } else {
          conversionApi.writer.removeAttribute('data-url', viewElement);
        }
      });
    });
  }
}
