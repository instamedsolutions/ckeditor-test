import { Plugin } from '@ckeditor/ckeditor5-core';
import StructuredDataEditing from './structureddataediting';
import StructuredDataUI from './structureddataui';

export default class StructuredDataPlugin extends Plugin {
  static get requires() {
    return [ StructuredDataEditing, StructuredDataUI ];
  }

  static get pluginName() {
    return 'StructuredDataPlugin';
  }
}
