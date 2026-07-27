import parse, {
  attributesToProps,
  HTMLReactParserOptions,
  Element,
} from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import Image from "next/image";
import CmsEnhancer from "../CmsEnhancer";
import ContactForm from "@/components/parser/ContactForm";

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "iframe",
    "span",
    "figure",
    "figcaption",
    "svg",
    "g",
    "path",
    "button"
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "width", "height", "style", "class", "loading"],
    a: ["href", "name", "target", "rel", "class"],
    "*": [
      "class",
      "src",
      "style",
      "id",
      "xmlns",
      "transform",
      "data-name",
      "d",
      "fill",
      "stroke",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-width",
      "width",
      "height",
      "viewBox",
    ],
    svg: ["viewBox"],
    iframe: [
      "data",
      "width",
      "height",
      "style",
      "allowfullscreen",
      "loading",
      "referrerpolicy",
      "frameborder",
      "allow",
    ],
  },
  allowedIframeHostnames: [
    "www.youtube.com",
    "youtube.com",
    "player.vimeo.com",
  ],
};

const options: HTMLReactParserOptions = {
  replace(domNode) {
    if (domNode instanceof Element && domNode.attribs) {
      if (domNode.name === "img") {
        const props = attributesToProps(domNode.attribs) as any;
        const resolvedSrc = (() => {
          const s = props.src || "";
          if (!s) return "";
          if (
            s.startsWith("http") ||
            s.startsWith("/") ||
            s.startsWith("data:")
          )
            return s;
          return "/" + s;
        })();

        if (!resolvedSrc) return <></>;

        const parsedWidth =
          props.width && !isNaN(parseInt(props.width as string, 10))
            ? parseInt(props.width as string, 10)
            : undefined;
        const parsedHeight =
          props.height && !isNaN(parseInt(props.height as string, 10))
            ? parseInt(props.height as string, 10)
            : undefined;

        if (!parsedWidth || !parsedHeight) {
          const { src: _src, width: _w, height: _h, ...rest } = props;
          return (
            <img
              {...rest}
              src={resolvedSrc}
              alt={props.alt || ""}
              loading="lazy"
              decoding="async"
              style={{ ...(props.style || {}) }}
            />
          );
        }

        return (
          <Image
            {...props}
            src={resolvedSrc}
            alt={props.alt || ""}
            width={parsedWidth}
            height={parsedHeight}
            loading="lazy"
            style={{ ...(props.style || {}) }}
          />
        );
      }

      if (domNode.name === "iframe" && domNode.attribs) {
        return (
          <iframe
            src={domNode.attribs.data}
            width={domNode.attribs.width}
            height={domNode.attribs.height}
            style={{ border: 0 }}
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        );
      }

      if (domNode.attribs.id === "contact_form") return <ContactForm />;
    }
  },
};

function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

export default function ReactParser({ html }: { html: string }) {
  const sanitizedHtml = sanitizeHtml(html, sanitizeOptions);
  const containerId = `cms-block-${hashString(sanitizedHtml)}`;

  return (
    <div id={containerId}>
      {parse(sanitizedHtml, options)}
      <CmsEnhancer containerId={containerId} />
    </div>
  );
}
