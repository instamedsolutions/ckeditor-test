import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { LineHeight } from '@rickx/ckeditor5-line-height';
import {
    DecoupledEditor,
    Alignment,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    BalloonToolbar,
    BlockToolbar,
    Bold,
    Code,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Heading,
    HorizontalLine,
    ImageBlock,
    ImageCaption,
    ImageEditing,
    ImageInline,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    ImageUtils,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Mention,
    PageBreak,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TodoList,
    Underline
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

import './EditorView.scss';
import { Editor } from "@tinymce/tinymce-react";

import {
    CaseChange,
    SlashCommand,
    PasteFromOfficeEnhanced,
    Pagination,
    MultiLevelList,
    MergeFields,
} from 'ckeditor5-premium-features';

import StructuredDataPlugin from './structured-data/structureddataplugin';

// Get it from the env var VITE_LICENSE_KEY
const LICENSE_KEY = import.meta.env.VITE_LICENSE_KEY ?? 'GPL';

const EditorView = () => {
    const editorContainerRef = useRef(null);
    const editorMenuBarRef = useRef(null);
    const editorToolbarRef = useRef(null);
    const editorHtmlRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
    }, []);

    const { editorConfig } = useMemo(() => {
        if (!isLayoutReady) {
            return {};
        }

        return {
            editorConfig: {
                toolbar: {
                    items: [
                        'previousPage',
                        'nextPage',
                        '|',
                        'insertMergeField',
                        'previewMergeFields',
                        '|',
                        'heading',
                        '|',
                        'fontSize',
                        'fontFamily',
                        'fontColor',
                        'fontBackgroundColor',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'lineHeight',
                        '|',
                        'link',
                        'insertTable',
                        '|',
                        'alignment',
                        '|',
                        'bulletedList',
                        'numberedList',
                        'multiLevelList',
                        'todoList',
                        'outdent',
                        'indent'
                    ],
                    shouldNotGroupWhenFull: false
                },
                plugins: [
                    Alignment,
                    Autoformat,
                    AutoImage,
                    AutoLink,
                    Autosave,
                    LineHeight,
                    BalloonToolbar,
                    BlockToolbar,
                    Bold,
                    Code,
                    Essentials,
                    FindAndReplace,
                    StructuredDataPlugin,
                    FontBackgroundColor,
                    FontColor,
                    FontFamily,
                    FontSize,
                    Heading,
                    HorizontalLine,
                    ImageBlock,
                    ImageCaption,
                    ImageEditing,
                    ImageInline,
                    ImageInsertViaUrl,
                    ImageResize,
                    ImageStyle,
                    ImageTextAlternative,
                    ImageToolbar,
                    ImageUpload,
                    ImageUtils,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    LinkImage,
                    List,
                    ListProperties,
                    Mention,
                    PageBreak,
                    Paragraph,
                    PasteFromOffice,
                    MergeFields,
                    MultiLevelList,
                    Pagination,
                    CaseChange,
                    PasteFromOfficeEnhanced,
                    SlashCommand,
                    RemoveFormat,
                    SpecialCharacters,
                    SpecialCharactersArrows,
                    SpecialCharactersCurrency,
                    SpecialCharactersEssentials,
                    SpecialCharactersLatin,
                    SpecialCharactersMathematical,
                    SpecialCharactersText,
                    Strikethrough,
                    Subscript,
                    Superscript,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    TodoList,
                    Underline
                ],

                balloonToolbar: ['bold', 'italic', '|', 'link', '|', 'bulletedList', 'numberedList'],
                blockToolbar: [
                    'fontSize',
                    'fontColor',
                    'fontBackgroundColor',
                    '|',
                    'bold',
                    'italic',
                    'lineHeight',
                    '|',
                    'link',
                    'insertTable',
                    '|',
                    'bulletedList',
                    'numberedList',
                    'outdent',
                    'indent'
                ],
                fontFamily: {
                    supportAllValues: true
                },
                fontSize: {
                    options: [10, 12, 14, 'default', 18, 20, 22],
                    supportAllValues: true
                },
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph'
                        },
                        {
                            model: 'heading1',
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1'
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2'
                        },
                        {
                            model: 'heading3',
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3'
                        },
                        {
                            model: 'heading4',
                            view: 'h4',
                            title: 'Heading 4',
                            class: 'ck-heading_heading4'
                        },
                        {
                            model: 'heading5',
                            view: 'h5',
                            title: 'Heading 5',
                            class: 'ck-heading_heading5'
                        },
                        {
                            model: 'heading6',
                            view: 'h6',
                            title: 'Heading 6',
                            class: 'ck-heading_heading6'
                        }
                    ]
                },
                image: {
                    toolbar: [
                        'toggleImageCaption',
                        'imageTextAlternative',
                        '|',
                        'imageStyle:inline',
                        'imageStyle:wrapText',
                        'imageStyle:breakText',
                        '|',
                        'resizeImage'
                    ]
                },
                initialData: '',
                licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDQ2NzUxOTksImp0aSI6IjlkMzRhOGNkLWJiNDQtNGE2Yy05MjJkLWFjZDNkODA1ODM1YyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImRkZTBmYzU3In0.Xh5HxJoyLK_i3Q-ZHtoDRuBni9Jlfxx3oFlSn_Eyai6-mtD6AmfzhIQu1znUcrZjQaW60OHdheD0zOcbiM51ng',
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    decorators: {
                        toggleDownloadable: {
                            mode: 'manual',
                            label: 'Downloadable',
                            attributes: {
                                download: 'file'
                            }
                        }
                    }
                },
                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true
                    }
                },
                mention: {
                    feeds: [
                        {
                            marker: '@',
                            feed: [
                                /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
                            ]
                        }
                    ]
                },
                menuBar: {
                    isVisible: true
                },
                mergeFields: {
                    /* Read more: https://ckeditor.com/docs/ckeditor5/latest/features/merge-fields.html#configuration */
                },
                pagination: {
                    pageWidth: '21cm',
                    pageHeight: '29.7cm',
                    pageMargins: {
                        top: '20mm',
                        bottom: '20mm',
                        right: '12mm',
                        left: '12mm'
                    }
                },
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
                }
            }
        };
    }, [isLayoutReady]);

    return (
        <div className='main-container'>
            <div className='editor-container editor-container_document-editor editor-container_include-pagination'
                 ref={editorContainerRef}>
                <div className='editor-container__menu-bar' ref={editorMenuBarRef}></div>
                <div className='editor-container__toolbar' ref={editorToolbarRef}></div>
                <div className='editor-container__editor-wrapper'>
                    <div className='editor-container__editor'>
                        <div ref={editorHtmlRef}>
                            {editorConfig && (
                                <CKEditor
                                    onReady={editor => {
                                        editorRef.current = editor;
                                        editorToolbarRef?.current?.appendChild(editor.ui.view.toolbar.element as Node);
                                        editorMenuBarRef?.current?.appendChild(editor.ui.view.menuBarView.element as Node);
                                    }}
                                    onAfterDestroy={() => {
                                        if (!editorToolbarRef.current || !editorMenuBarRef.current) {
                                            return;
                                        }
                                        Array.from(editorToolbarRef.current.children).forEach(child => child.remove());
                                        Array.from(editorMenuBarRef.current.children).forEach(child => child.remove());
                                    }}
                                    editor={DecoupledEditor}
                                    config={editorConfig}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorView;
