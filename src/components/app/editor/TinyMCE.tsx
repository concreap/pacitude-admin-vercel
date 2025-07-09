import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, ForwardedRef } from "react"
import { Editor } from '@tinymce/tinymce-react';

interface ITinyMCE {
    height?: number,
    preview?: string,
    defaultValue?: string
}

const TinyMCE = forwardRef((props: ITinyMCE, ref: ForwardedRef<any>) => {

    const {
        height = 600,
        defaultValue,
        preview = 'Start typing here'
    } = props;

    const editorRef = useRef<any>(null);
    const [content, setContent] = useState<string>('');
    const [contentPreview, setContentPreview] = useState<string>('');

    useEffect(() => {

    }, [])

    const handleLog = () => {
        if (editorRef.current) {
            console.log('Editor Content:', editorRef.current.getContent());
            setContent(editorRef.current.getContent()); // Update state with content
        }
    };

    const handleClear = () => {
        if (editorRef.current) {
            editorRef.current.setContent('<p></p>');
            setContent('<p></p>');
        }
    };

    const handleContentUpdate = (newVal: any, editor: any) => {
        const hm = editor.getContent({ format: 'html' });
        setContentPreview(hm)
        setContent(newVal);
    }

    // expose child component functions to parent component
    useImperativeHandle(ref, () => ({
        clear: handleClear,
        log: handleLog,
        content: content,
        preview: contentPreview
    }))

    return (
        <>
            <Editor
                apiKey={import.meta.env.VITE_APP_TINYMCE_APIKEY}
                onInit={(_evt, editor) => editorRef.current = editor}
                // initialValue={defaultValue ? defaultValue : contentPreview}
                onEditorChange={handleContentUpdate}
                init={{
                    height: height,
                    directionality: 'ltr',
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'help', 'wordcount', 'codesample',
                        'nonbreaking', 'pagebreak', 'emoticons', 'hr', 'autosave', 'directionality',
                        'print', 'save', 'textcolor', 'colorpicker', 'textpattern', 'quickbars'
                    ],
                    toolbar:
                        'undo redo | styleselect | forecolor backcolor | bold italic underline strikethrough | ' +
                        'alignleft aligncenter alignright alignjustify | ' +
                        'bullist numlist outdent indent | link image media codesample | ' +
                        'print preview fullscreen | table | charmap emoticons hr | ' +
                        'insertdatetime nonbreaking pagebreak | visualblocks | ' +
                        'anchor | searchreplace | code help | ltr rtl',

                    // Additional options for a richer experience
                    image_advtab: true, // Enable advanced image tab
                    link_list: [ // Example of a link list
                        { title: 'My page 1', value: 'https://www.example.com' },
                        { title: 'My page 2', value: 'https://www.anotherexample.com' }
                    ],
                    image_list: [ // Example of an image list
                        { title: 'My image 1', value: 'https://www.tiny.cloud/images/tinymce/plugins/confluence.png' },
                        { title: 'My image 2', value: 'https://www.tiny.cloud/images/tinymce4/reference/html-elements-features.png' }
                    ],
                    image_class_list: [ // Example of custom image classes
                        { title: 'None', value: '' },
                        { title: 'Responsive', value: 'img-responsive' },
                        { title: 'Circle', value: 'img-circle' }
                    ],
                    importcss_append: true, // Append imported CSS classes to the editor
                    file_picker_callback: (cb: any, value: any, meta: any) => {
                        // A simple file picker callback for demo purposes.
                        // In a real app, this would open a file manager.

                        // Ensure the editor instance is available
                        if (!editorRef.current) {
                            console.error("TinyMCE editorRef.current is not initialized.");
                            return; // Exit if editor is not ready
                        }

                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*'); // Accept images
                        input.onchange = () => {
                            const file = input.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const id = 'blobid' + (new Date()).getTime();
                                    const blobCache = editorRef.current.editorUpload.blobCache;
                                    const base64 = (reader.result as string).split(',')[1];
                                    try {
                                        const blobInfo = blobCache.create(id, file, base64);
                                        blobCache.add(blobInfo);

                                        const imageUrl = blobInfo.uri(); // Get the URL from blobInfo

                                        if (typeof imageUrl === 'string') {
                                            cb(imageUrl, { title: file.name });
                                        } else {
                                            console.error("blobInfo.uri() did not return a string:", imageUrl);
                                            // Optionally, call cb with an empty string or handle error more gracefully
                                            cb('', { title: file.name });
                                        }
                                    } catch (e) {
                                        console.error("Error creating or adding blob to cache:", e);
                                        // Handle the error, perhaps by informing the user
                                        alert("Failed to process image. Please try again.");
                                    }

                                };
                                reader.readAsDataURL(file);
                            }
                        };
                        input.click();
                    },
                    font_formats:
                        'Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; ' +
                        'Georgia=georgia,palatino; Impact=impact,chicago; ' +
                        'Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; ' +
                        'Terminal=terminal,monaco; Times New Roman=times new roman,times; ' +
                        'Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; ' +
                        'Wingdings=wingdings,zapfdingbats',
                    fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
                    style_formats: [
                        {
                            title: 'Headers', items: [
                                { title: 'Heading 1', format: 'h1' },
                                { title: 'Heading 2', format: 'h2' },
                                { title: 'Heading 3', format: 'h3' },
                                { title: 'Heading 4', format: 'h4' },
                                { title: 'Heading 5', format: 'h5' },
                                { title: 'Heading 6', format: 'h6' }
                            ]
                        },
                        {
                            title: 'Inline', items: [
                                { title: 'Bold', icon: 'bold', format: 'bold' },
                                { title: 'Italic', icon: 'italic', format: 'italic' },
                                { title: 'Underline', icon: 'underline', format: 'underline' },
                                { title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough' },
                                { title: 'Superscript', icon: 'superscript', format: 'superscript' },
                                { title: 'Subscript', icon: 'subscript', format: 'subscript' },
                                { title: 'Code', icon: 'code', format: 'code' }
                            ]
                        },
                        {
                            title: 'Blocks', items: [
                                { title: 'Paragraph', format: 'p' },
                                { title: 'Blockquote', format: 'blockquote' },
                                { title: 'Div', format: 'div' },
                                { title: 'Pre', format: 'pre' }
                            ]
                        },
                        {
                            title: 'Alignment', items: [
                                { title: 'Left', icon: 'alignleft', format: 'alignleft' },
                                { title: 'Center', icon: 'aligncenter', format: 'aligncenter' },
                                { title: 'Right', icon: 'alignright', format: 'alignright' },
                                { title: 'Justify', icon: 'alignjustify', format: 'alignjustify' }
                            ]
                        }
                    ],
                    content_css: '/css/editor.css',
                    content_style: `body { font-size: 14px; }`
                }}
            />
        </>
    )
})

export default TinyMCE;
