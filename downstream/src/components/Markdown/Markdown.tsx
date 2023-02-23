import ReactMarkdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import { MarkdownCodeTheme } from "../../hooks/useTheme";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import { useState } from "react";
import "./Markdown.scss";
import { FaClipboard, FaClipboardCheck } from "react-icons/fa";

const CopyIconMap = new Map([
  [true, <FaClipboardCheck size={15} />],
  [false, <FaClipboard size={15} />],
]);

function MarkdownCode({
  node,
  inline,
  className,
  children,
  ...props
}: CodeProps) {
  const match = /language-(\w+)/.exec(className || "");
  const [copySuccess, setCopySuccess] = useState(false);

  if (inline || !match) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  const codeString = String(children).replace(/\n$/, "");
  async function copyToClipboard() {
    await navigator.clipboard.writeText(codeString);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  }

  return (
    <div className="code-snippet">
      <Prism
        children={codeString}
        language={match[1]}
        style={MarkdownCodeTheme}
        PreTag="div"
        className="code-snippet__code"
      />
      <div className="copy-button" onClick={copyToClipboard}>
        {CopyIconMap.get(copySuccess)}
      </div>
    </div>
  );
}

function MarkdownAnchor({ node, ...props }: CodeProps) {
  return <a target="_blank" className="anchor" {...props}></a>;
}

function MarkdownIframe({ node, ...props }: CodeProps) {
  return <div>Ligma</div>;
}

export interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      skipHtml={false}
      className="markdown"
      children={content}
      components={{
        code: MarkdownCode,
        a: MarkdownAnchor,
        iframe: MarkdownIframe,
      }}
    ></ReactMarkdown>
  );
}
