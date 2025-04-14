import { Plugin, Widget, toWidget } from 'ckeditor5';
import StructuredDataCommand from './structureddatacommand';

export default class StructuredDataEditing extends Plugin {
  static get requires() {
    return [ Widget ];
  }

  init() {
    const editor = this.editor;

    editor.model.schema.register('structuredData', {
      allowWhere: '$block',
      isObject: true,
      allowAttributes: [ 'title', 'key', 'type', 'required', 'override' ]
    });

    editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'section',
        classes: 'structured-data'
      },
      model: (viewElement, { writer }) => {
        return writer.createElement('structuredData', {
          title: viewElement.getAttribute('title'),
          key: viewElement.getAttribute('key'),
          type: viewElement.getAttribute('type'),
          required: viewElement.getAttribute('required'),
          override: viewElement.getAttribute('override')
        });
      }
    });

    editor.conversion.for('dataDowncast').elementToElement({
      model: 'structuredData',
      view: (modelElement, { writer }) => {
        return writer.createContainerElement('section', {
          class: 'structured-data',
          title: modelElement.getAttribute('title'),
          key: modelElement.getAttribute('key'),
          type: modelElement.getAttribute('type'),
          required: modelElement.getAttribute('required'),
          override: modelElement.getAttribute('override')
        });
      }
    });

    editor.conversion.for('editingDowncast').elementToElement({
      model: 'structuredData',
      view: (modelElement, { writer }) => {
        const section = writer.createContainerElement('section', {
          class: 'structured-data',
          title: modelElement.getAttribute('title'),
          key: modelElement.getAttribute('key'),
          type: modelElement.getAttribute('type'),
          required: modelElement.getAttribute('required'),
          override: modelElement.getAttribute('override')
        });

        return toWidget(section, writer);
      }
    });

    editor.commands.add('insertStructuredData', new StructuredDataCommand(editor));
  }
}
