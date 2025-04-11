import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

export default class StructuredDataUI extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('structuredData', locale => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Structured Data',
        withText: true,
        tooltip: true
      });

      view.on('execute', () => {
        editor.execute('insertStructuredData');
      });

      return view;
    });
  }
}
