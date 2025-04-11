import { Command } from '@ckeditor/ckeditor5-core';

export default class StructuredDataCommand extends Command {
  execute() {
    const editor = this.editor;
    const model = editor.model;

    model.change(writer => {
      const structuredData = writer.createElement('structuredData', {
        title: 'Médecins correspondants - Liste',
        key: 'medecins_correspondants_liste',
        type: 'medical_team',
        required: 'false',
        override: 'false'
      });

      model.insertContent(structuredData);
    });
  }
}
