import { BaseEvent, GetCallback, Plugin } from 'ckeditor5';
import { GroupDefinition, MergeFieldDefinition } from '@ckeditor/ckeditor5-merge-fields/src/mergefieldsconfig';


const onDataDowncast: GetCallback<BaseEvent> = (_evt, data, conversionApi) => {
    const { item, attributeNewValue } = data;

    const viewElement = conversionApi.mapper.toViewElement(item);

    if (!viewElement) {return;}

    // Manage inline and block
    const imgElement = viewElement.is('element','img') ? viewElement : viewElement.getChild(0);

    if (!imgElement || !imgElement.is('element', 'img')) {return;}

    if (attributeNewValue) {
        const newSrc = attributeNewValue.replace('..', '|');
        conversionApi.writer.setAttribute('src', newSrc, imgElement);
    }
};

const getDefaultValueFromId =
    (id: string, values: Array<GroupDefinition | MergeFieldDefinition>): MergeFieldDefinition | undefined => {
        let value: MergeFieldDefinition | undefined;

        values.forEach(item => {
            if ('groupId' in item) {
                // Handle GroupDefinition
                value = getDefaultValueFromId(id, item.definitions);
            } else {
                if (item.id === id) {
                    value = item;
                }
            }
        });

        return value;
    };

export default class MergedFieldsPlugin extends Plugin {
    init() {
        const editor = this.editor;

        if (editor.locale.translations) {
            editor.locale.translations.fr.dictionary['Insert merge field'] = 'Ajouter une variable';
            editor.locale.translations.fr.dictionary['Merge field'] = 'Variables';
            editor.locale.translations.fr.dictionary['Merge fields preview'] = 'Aperçu des variables';
            editor.locale.translations.fr.dictionary['No merge fields available'] = 'Aucune variable disponible';
            editor.locale.translations.fr.dictionary['No merge fields found'] = 'Aucune variable trouvée';
            editor.locale.translations.fr.dictionary['Search merge field'] = 'Rechercher une variable';
        }

        editor.model.schema.extend('mergeField', {
            allowAttributes: ['data-mention', 'data-value', 'title']
        });

        // Upcast model → view
        editor.conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: 'mention'
            },
            model: (viewElement, { writer: modelWriter }) => {
                const attributes = viewElement.getAttributes();

                const id = (new Map(attributes).get('data-mention')?.replace(/[{}]/g, '') || '').replace('|','..');

                return modelWriter.createElement('mergeField', {
                    ...attributes,
                    id
                });
            }
        });

        // Downcast model → export
        editor.conversion.for('dataDowncast').elementToElement({
            model: 'mergeField',
            view: (modelItem, { writer }) => {

                const id = (modelItem.getAttribute('id') as string).replace('..','|');

                const mention = `{{${id}}}`;

                const values = this.editor.config.get('mergeFields.definitions') || [];

                const value = getDefaultValueFromId(id,values);

                const defaultValue = typeof value?.defaultValue === 'string' ? value.defaultValue : '';

                return writer.createContainerElement('span', {
                        class: 'mention',
                        'data-mention': mention,
                        'data-value': defaultValue,
                        'title': value?.label || '',
                    },writer.createText(defaultValue)
                );
            },
            converterPriority: 'highest'
        });

        editor.conversion.for('upcast').add(dispatcher => {
            dispatcher.on('element:img', (_evt, data) => {
                const src = data.viewItem.getAttribute('src');
                if (!src || !src.includes('|')) {return;}

                const fixedSrc = src.replace('|', '..');

                data.viewItem._setAttribute('src', fixedSrc); // override before standard mapping
            }, { priority: 'high' });
        });

        // Downcast model → export
        editor.conversion.for('dataDowncast').add(dispatcher => {
            dispatcher.on('attribute:src:imageBlock',onDataDowncast, { priority: 'lowest' });

            dispatcher.on('attribute:src:imageInline',onDataDowncast, { priority: 'lowest' });
        });

    }

}
