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


const transformImages = (html: string): string => {
    const result = html.replace(/<span[^>]+data-mention="([^"]+)"[^>]*>([^<]+)<\/span>/g, (match, dataMention, content) => {
        if (dataMention.endsWith('|img}}')) {
            return `<figure class="image"><img src="${dataMention}" alt="${content}" /></figure>`;
        }
        return match;
    });
    return result;
};


import './EditorView.scss';

import {
    CaseChange,
    SlashCommand,
    PasteFromOfficeEnhanced,
    Pagination,
    MultiLevelList,
    MergeFields,
} from 'ckeditor5-premium-features';

import StructuredDataPlugin from './structured-data/structureddataplugin';
import UploadAdapter from "./UploadAdapter";
import ImageDataUrl from "./images/imagedataurl";
import MergedFieldsPlugin from "./merged-fields/MergedFieldsPlugin";

// Get it from the env var VITE_CKEDITOR_LICENSE_KEY
const LICENSE_KEY = import.meta.env.VITE_CKEDITOR_LICENSE_KEY ?? 'GPL';

const defaultFields = [{
        id : 'user.firstName',
        label: 'First Name',
        defaultValue: 'Bastien'
    },{
        id : 'user.lastName',
        label: 'lastName',
        defaultValue: ''
    },
        /*   {
               type: 'image',
               width: 150,
               height: 50,
           id : 'authorProfile.businessStamp..img',
           label: 'Business stamp',
           defaultValue: 'http://localhost:4566/instamed-new/tmp/68410b61d73b2-signat.png?response-cache-control=max-age%3D3600&response-content-type=image%2Fpng&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=key%2F20250605%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Date=20250605T032137Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=3790a2d583a23f62c70fbd1eef240866dc56e45baad3a99022280f66ece92890'
           }*/
    ];

const EditorView = () => {
    const editorContainerRef = useRef(null);
    const editorMenuBarRef = useRef(null);
    const editorToolbarRef = useRef(null);
    const editorHtmlRef = useRef(null);
    const editorRef = useRef<DecoupledEditor | null>(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const [ready, setReady] = useState(false);


    useEffect(() => {

        if(!ready) {
            return;
        }

        setTimeout(() => {

            if (editorRef.current) {
                // Update the merge fields definitions in the editor's configuration
                editorRef.current.config.set('mergeFields.definitions', [
                    {
                        id : 'user.firstName',
                        label: 'First Name',
                        defaultValue: 'Bastien'
                    },{
                        id : 'user.lastName',
                        label: 'Last Name',
                        defaultValue: 'My last Name'
                    },
                    {
                    id : 'user.email',
                    label: 'Email',
                    defaultValue: 'email@instamed.fr'
                }]);

                // Refresh the merge fields to reflect the new definitions
                const mergeFieldsEditing = editorRef.current.plugins.get('MergeFieldsEditing');
                mergeFieldsEditing.refreshMergeFields();

            }
        },3000);

    }, [ready]);


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
                        'indent',
                        'imageUpload'
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
                    ImageDataUrl,
                    List,
                    ListProperties,
                    Mention,
                    PageBreak,
                    Paragraph,
                    PasteFromOffice,
                    MergeFields,
                    MergedFieldsPlugin,
                    /* MultiLevelList,
                     Pagination,
                     CaseChange,
                     PasteFromOfficeEnhanced,
                     SlashCommand,*/
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
           //     initialData: transformImages('<p><span class=\"mention\" data-mention=\"{{authorProfile.businessStamp|img}}\" title=\"Signature\" data-value=\"Signature\">Signature</span><br> </p>'),
               // initialData: '<figure class="image"><img style="aspect-ratio:150/50;" src="{{authorProfile.signature|img}}" width="150" height="50" ></figure>',
               // initialData: '<figure class="image"><img style="aspect-ratio:150/50;" src="{{authorProfile.businessStamp|img}}" width="150" height="50"></figure>',
//                initialData: transformImages("<div class=\"page-box\"><p style=\"text-align:right;\"> </p><p style=\"text-align:right;\"><span class=\"mention\" data-mention=\"{{user.title}}\" title=\"Civilité\" data-value=\"Civilité\">Civilité</span> <span class=\"mention\" data-mention=\"{{user.fullName}}\" title=\"Nom complet\" data-value=\"Nom complet\">Nom complet</span></p><p style=\"text-align:right;\"><span class=\"mention\" data-mention=\"{{user.personalAddress}}\" title=\"Adresse\" data-value=\"Adresse\">Adresse</span></p><p style=\"text-align:right;\"><span class=\"mention\" data-mention=\"{{user.email}}\" title=\"E-mail\" data-value=\"E-mail\">E-mail</span> - <span class=\"mention\" data-mention=\"{{user.phone}}\" title=\"Téléphone\" data-value=\"Téléphone\">Téléphone</span></p><p style=\"text-align:right;\"> </p><p style=\"text-align:right;\"> </p><p style=\"text-align:right;\"><span class=\"mention\" data-mention=\"{{consultation.createdDate}}\" title=\"Date de la consultation\" data-value=\"Date de la consultation\">Date de la consultation</span></p><p><br><br> </p><p> </p><p> </p><p>Merci de m'avoir adressé <span class=\"mention\" data-mention=\"{{user.title}}\" title=\"Civilité\" data-value=\"Civilité\">Civilité</span> <span class=\"mention\" data-mention=\"{{user.fullName}}\" title=\"Nom complet\" data-value=\"Nom complet\">Nom complet</span>, [né/née] <span class=\"mention\" data-mention=\"{{user.lastName}}\" title=\"Nom de naissance\" data-value=\"Nom de naissance\">Nom de naissance</span><i><strong>  </strong></i>le <span class=\"mention\" data-mention=\"{{user.dateOfBirth}}\" title=\"17/05/1981\" data-value=\"17/05/1981\">17/05/1981</span>, [âgé/âgée] de <span class=\"mention\" data-mention=\"{{user.age}}\" title=\"Âge\" data-value=\"Âge\">Âge</span></p><p> </p><p> </p><p> </p><p style=\"text-align:right;\"><span class=\"mention\" data-mention=\"{{author.fullName}}\" title=\"Nom complet\" data-value=\"Nom complet\">Nom complet</span></p><p style=\"text-align:right;\"><span class=\"mention\" data-mention=\"{{authorProfile.businessStamp|img}}\" title=\"Signature\" data-value=\"Signature\">Signature</span><br> </p><p style=\"text-align:right;\"> </p><p>Courrier dicté en présence [du patient/de la patiente] et signé électroniquement.<br><br><br> </p><p> </p></div><div class=\"page-box\"><p>Annexes</p></div>"),
   //             initialData: '<html><head></head><body><p>Ceci est le contenu de mon modèle :&nbsp;</p><p>&nbsp;</p><p>Nom de la maladie :&nbsp;<span class=\\"mention\\" data-mention=\\"{{field.1ee42f93-34ba-6762-b71e-fdb406c36691}}\\" data-value=\\"\\" title=\\"\\"></span></p><p>Vaccins :&nbsp;<span class=\\"mention\\" data-mention=\\"{{field.1edd84da-44b3-61ba-940b-215fb421accc}}\\" data-value=\\"\\" title=\\"\\"></span></p><p>&nbsp;</p><section class=\\"structured-data\\" title=\\"Conclusion\\" type=\\"wysiwyg\\" key=\\"conclusion\\" override=\\"false\\" required=\\"false\\"><p>Poids de forme :&nbsp;<span class=\\"mention\\" data-mention=\\"{{field.1ee42f93-341d-69da-84ce-fdb406c36691}}\\" data-value=\\"\\" title=\\"\\"></span></p><p>&nbsp;</p><p>Test champ référent :&nbsp;</p><p>&nbsp;</p></section><p>&nbsp;</p><p>Et ici il y a les données après la conclusion :&nbsp;</p><p>&nbsp;</p><p>Instamed :&nbsp;</p><p>Type de cancer :&nbsp;&nbsp;/&nbsp;<span class=\\"mention\\" data-mention=\\"{{field.1ee42f93-342a-6d88-83ff-fdb406c36691}}\\" data-value=\\"\\" title=\\"\\"></span></p><p>&nbsp;</p><p><span class=\\"mention\\" data-mention=\\"{{author.lastName}}\\" data-value=\\"\\" title=\\"\\"></span></p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>Test admin :&nbsp;</p><p>Test autre :&nbsp;&nbsp;<span class=\\"mention\\" data-mention=\\"{{field.1edd38e2-98f2-6896-bc32-fdb6f0c5773b}}\\" data-value=\\"\\" title=\\"\\"></span>&nbsp;/&nbsp;<span class=\\"mention\\" data-mention=\\"{{profile.sex}}\\" data-value=\\"\\" title=\\"\\"></span></p><p>&nbsp;</p><p>Test :&nbsp;<span class=\\"mention\\" data-mention=\\"{{author.name}}\\" data-value=\\"\\" title=\\"\\"></span></p><p>&nbsp;</p><section class=\\"structured-data\\" title=\\"Conseils - Simple\\" type=\\"text\\" key=\\"conseils_simple\\" override=\\"false\\" required=\\"false\\">Contenu</section><p>&nbsp;</p><p>Test 2 :&nbsp;<span class=\\"mention\\" data-mention=\\"{{field.1ef391dd-66d4-6f16-a893-b56088201f69}}\\" data-value=\\"\\" title=\\"\\"></span></p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><figure class=\\"table\\" style=\\"width:100%;\\"><table><tbody><tr><td><img class=\\"image_resized\\" style=\\"aspect-ratio:300/150;width:63.49%;\\" src=\\"{{authorProfile.businessStamp|img}}\\" width=\\"300\\" height=\\"150\\"></td><td><figure class=\\"image image_resized image-style-align-right\\" style=\\"width:72.98%;\\"><img style=\\"aspect-ratio:300/150;\\" src=\\"{{authorProfile.signature|img}}\\" width=\\"300\\" height=\\"150\\"><figcaption>Dr Jean DUPONT</figcaption></figure></td></tr></tbody></table></figure><p>&nbsp;</p><p>&nbsp;</p></body></html>"\n',
                initialData: '<p><span class="mention" data-mention="{{user.firstName}}" title="user.firstName" data-value="Bastien">Bastien</span><span class="mention" data-mention="{{user.lastName}}" title="user.lastName" data-value="lastName">lastName</span></p>\n',
                licenseKey: LICENSE_KEY,
                mergeFields: {
                    definitions: defaultFields,
                    initialPreviewMode: '$defaultValues'
                },
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

                                        setReady(true);

                                        window.ckEditor = editor;

                                        editor.plugins.get( 'FileRepository' ).createUploadAdapter = function( loader ) {
                                            return new UploadAdapter( loader );
                                        };

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
