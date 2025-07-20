'use client';

import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles

// Define the ref type for the RichTextEditor component
export type RichTextEditorHandle = {
  getContent: () => string;
  setContent: (content: string) => void;
};

const RichTextEditor = forwardRef<RichTextEditorHandle>((_, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (editorRef.current && !isInitialized.current) {
      // Clear any existing content in the container
      editorRef.current.innerHTML = '';
      
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        },
        placeholder: 'Write something...',
      });

      isInitialized.current = true;
    }

    return () => {
      // Cleanup function
      if (quillRef.current) {
        const toolbar = document.querySelector('.ql-toolbar');
        if (toolbar) {
          toolbar.remove();
        }
        quillRef.current = null;
      }
      isInitialized.current = false;
    };
  }, []);

  // Expose the getContent and setContent functions to the parent component
  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (quillRef.current) {
        return quillRef.current.root.innerHTML; // Return the HTML content
      }
      return '';
    },
    setContent: (content: string) => {
      if (quillRef.current) {
        quillRef.current.root.innerHTML = content;
      }
    },
  }));

  return (
    <div 
      ref={editorRef} 
      style={{ height: '300px' }}
      className="quill-editor-container"
    />
  );
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;