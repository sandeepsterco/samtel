import parse, { attributesToProps, Element } from "html-react-parser";
import type { DOMNode, HTMLReactParserOptions } from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import Image from "next/image";
import CmsEnhancer from "../CmsEnhancer";
import ContactForm from "@/components/parser/ContactForm";
import LeadershipGrid from "@/components/parser/LeadershipGrid";
import MediaCoverageGrid from "@/components/parser/mediaCoverageGrid/MediaCoverageGrid";
import PressCollection from "@/components/parser/pressCollection/PressCollection";
import MediaPDFGrid from "@/components/parser/mediaPDFGrid/MediaPDFGrid";
import MediaGallery from "@/components/parser/mediaGallery/MediaGallery";
import PressGallery from "@/components/parser/pressGallery/PressGallery";
import PressOnScreen from "@/components/parser/pressOnScreen/PressOnScreen";
import MediaFeatured from "@/components/parser/mediaFeatured/MediaFeatured";


export type PressCoverage = unknown;

interface ReactParserProps {
  html: string;
  pressCoverage?: PressCoverage;
  searchParams?:Promise<{page?:string}>
}

const ALLOWED_IFRAME_HOSTS = ["www.youtube.com", "youtube.com", "player.vimeo.com"];

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
    "button",
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
  allowedIframeHostnames: ALLOWED_IFRAME_HOSTS,
};

const ABSOLUTE_SRC = /^(https?:|data:|\/)/i;

const resolveSrc = (src?: string): string =>
  !src ? "" : ABSOLUTE_SRC.test(src) ? src : `/${src}`;

const toInt = (value?: string | number): number | undefined => {
  const n = parseInt(String(value), 10);
  return Number.isNaN(n) ? undefined : n;
};


const isAllowedIframeSrc = (src?: string): src is string => {
  if (!src) return false;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && ALLOWED_IFRAME_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
};

function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

function renderImage(attribs: Element["attribs"]) {
  const props = attributesToProps(attribs) as Record<string, any>;

  const src = resolveSrc(props.src);
  if (!src) return <></>; // returning an empty fragment removes the node

  const width = toInt(props.width);
  const height = toInt(props.height);
  const alt = props.alt ?? "";

  if (!width || !height) {
    const { src: _src, width: _w, height: _h, ...rest } = props;
    return (
      <img {...rest} src={src} alt={alt} loading="lazy" decoding="async" />
    );
  }

  return (
    <Image
      {...(props as any)}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}

function renderIframe(attribs: Element["attribs"]) {
  const src = attribs.data ?? attribs.src;
  if (!isAllowedIframeSrc(src)) return <></>;

  return (
    <iframe
      src={src}
      width={attribs.width}
      height={attribs.height}
      style={{ border: 0 }}
      title="Embedded video"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

function createParserOptions(pressCoverage?: PressCoverage, searchParams?:Promise<{page?:string}>): HTMLReactParserOptions {
  return {
    replace(domNode: DOMNode) {
      if (!(domNode instanceof Element)) return undefined;

      const { name, attribs } = domNode;

      if (name === "img") return renderImage(attribs);
      if (name === "iframe") return renderIframe(attribs);

      switch (attribs.id) {
        case "contact_form":
          return <ContactForm  />;
        case "leadership_grid":
          return <LeadershipGrid />;
        case "media_coverage_grid":
          return <MediaCoverageGrid data={pressCoverage} />;
        case "press_collection":
          return <PressCollection searchParams={searchParams} />;
        case "media_pdf":
          return <MediaPDFGrid data={pressCoverage} />;
        case "media_gallery":
          return <MediaGallery data={pressCoverage} />;
        case "press_gallery":
          return <PressGallery searchParams={searchParams} />;
        case "press_on_screen":
          return <PressOnScreen searchParams={searchParams} />;
        case "media_featured":
          return <MediaFeatured data={pressCoverage} />;
        default:
          return undefined;
      }
    },
  };
}

export default function ReactParser({ html, pressCoverage, searchParams }: ReactParserProps) {
  if (!html) return null;

  const sanitizedHtml = sanitizeHtml(html, sanitizeOptions);
  const containerId = `cms-block-${hashString(sanitizedHtml)}`;

  return (
    <div id={containerId}>
      {parse(sanitizedHtml, createParserOptions(pressCoverage, searchParams))}
      <CmsEnhancer containerId={containerId} />
    </div>
  );
}