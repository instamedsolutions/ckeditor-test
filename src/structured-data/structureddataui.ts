import { Plugin, ButtonView } from 'ckeditor5';


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
