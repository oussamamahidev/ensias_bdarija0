"use client";

import React, { useEffect } from "react";
import Prism from "prismjs";
import parse from "html-react-parser";

// Import Prism core styles
import "prismjs/themes/prism.css";
import "prismjs/themes/prism-dark.css";

// Import language support
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-json";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-r";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-go";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-mongodb";

// Import plugins
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

interface ParseHTMLProps {
  data: string;
  className?: string;
}

const ParseHTML = ({ data, className = "" }: ParseHTMLProps) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Prism.highlightAll();
    }
  }, [data]);

  if (!data) return null;

  try {
    return (
      <div 
        className={`markdown prose w-full min-w-full dark:prose-invert 
          prose-pre:bg-transparent prose-pre:p-0 
          ${className}`}
      >
        {parse(data)}
      </div>
    );
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return (
      <div className="text-dark200_light900">
        Failed to parse content
      </div>
    );
  }
};

export default ParseHTML;