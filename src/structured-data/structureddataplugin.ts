import { Plugin } from 'ckeditor5';
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
