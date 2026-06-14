import type { ToolEntry } from "@/types/tools";

export const TOOLS: ToolEntry[] = [
  // Image tools
  {
    slug: "resize",
    category: "image",
    path: "/image/resize",
    title: "Resize Image Online Free",
    shortTitle: "Resize Image",
    description:
      "Resize any image to exact pixel dimensions for exam forms and applications. Free, fast, processed on your device - no upload.",
    keywords: ["resize image", "change image size", "photo resize online", "resize jpg png"],
    related: ["/image/compress", "/image/reduce-to-kb", "/image/crop"],
    icon: "Maximize2",
  },
  {
    slug: "compress",
    category: "image",
    path: "/image/compress",
    title: "Compress Image Online Free",
    shortTitle: "Compress Image",
    description:
      "Reduce image file size without losing quality. Compress JPG, PNG, WEBP for exam forms. Free, private, no upload.",
    keywords: ["compress image", "reduce image size", "image compression online free", "compress jpg"],
    related: ["/image/reduce-to-kb", "/image/resize", "/convert/png-to-jpg"],
    icon: "PackageCheck",
  },
  {
    slug: "reduce-to-kb",
    category: "image",
    path: "/image/reduce-to-kb",
    title: "Reduce Image to Exact KB Online Free",
    shortTitle: "Reduce to KB",
    description:
      "Reduce any photo to exactly 20 KB, 50 KB, 100 KB or any target size for SSC, UPSC, exam forms. Free, private, no upload.",
    keywords: [
      "reduce photo to 50kb",
      "reduce image size to kb",
      "compress image to 50kb",
      "photo size kam karo",
      "reduce jpg to 20kb",
    ],
    related: ["/image/compress", "/image/resize", "/image/signature-cropper"],
    icon: "Gauge",
  },
  {
    slug: "crop",
    category: "image",
    path: "/image/crop",
    title: "Crop Image Online Free",
    shortTitle: "Crop Image",
    description:
      "Crop photos with free or fixed aspect ratios. Touch-friendly crop tool for mobile. Free, private, no upload.",
    keywords: ["crop image online", "crop photo free", "image cropper", "cut photo online"],
    related: ["/image/resize", "/image/signature-cropper", "/image/passport-photo-maker"],
    icon: "Crop",
  },
  {
    slug: "signature-cropper",
    category: "image",
    path: "/image/signature-cropper",
    title: "Signature Cropper Online Free",
    shortTitle: "Signature Cropper",
    description:
      "Crop and clean your handwritten signature for exam forms. White or transparent background, exact KB target. Free, private, no upload.",
    keywords: [
      "signature cropper online",
      "crop signature for form",
      "signature size 10kb",
      "signature 20kb online",
      "signature white background",
    ],
    related: ["/image/reduce-to-kb", "/image/crop", "/image/background-color-changer"],
    icon: "PenLine",
  },
  {
    slug: "passport-photo-maker",
    category: "image",
    path: "/image/passport-photo-maker",
    title: "Passport Size Photo Maker Online Free",
    shortTitle: "Passport Photo",
    description:
      "Make passport size photos for SSC, UPSC, exam forms and applications. Standard dimensions, white or blue background. Free, private, no upload.",
    keywords: [
      "passport size photo maker",
      "passport photo online free",
      "photo for exam form",
      "ssc photo size online",
    ],
    related: ["/image/reduce-to-kb", "/image/background-color-changer", "/image/crop"],
    icon: "UserSquare",
  },
  {
    slug: "background-color-changer",
    category: "image",
    path: "/image/background-color-changer",
    title: "Change Photo Background Color Online Free",
    shortTitle: "Change Background",
    description:
      "Change photo background to white or blue for exam and job application forms. Free, private, processed on your device.",
    keywords: [
      "change photo background to white",
      "white background photo online free",
      "blue background photo",
      "remove background online",
    ],
    related: ["/image/passport-photo-maker", "/image/signature-cropper", "/image/reduce-to-kb"],
    icon: "PaintBucket",
  },

  // PDF tools
  {
    slug: "compress-pdf",
    category: "pdf",
    path: "/pdf/compress",
    title: "Compress PDF Online Free",
    shortTitle: "Compress PDF",
    description:
      "Reduce PDF file size for uploading to exam portals and college applications. Free, private, processed in your browser - no upload.",
    keywords: ["compress pdf", "reduce pdf size", "pdf compress online free", "pdf size kam karo"],
    related: ["/pdf/merge", "/pdf/split", "/image/reduce-to-kb"],
    icon: "FileDown",
  },
  {
    slug: "merge-pdf",
    category: "pdf",
    path: "/pdf/merge",
    title: "Merge PDF Files Online Free",
    shortTitle: "Merge PDF",
    description:
      "Combine multiple PDF files into one. Drag to reorder pages. Free, private, no upload required.",
    keywords: ["merge pdf online", "combine pdf files free", "pdf merger online", "join pdf"],
    related: ["/pdf/split", "/pdf/compress", "/pdf/image-to-pdf"],
    icon: "FilePlus",
  },
  {
    slug: "split-pdf",
    category: "pdf",
    path: "/pdf/split",
    title: "Split PDF Online Free",
    shortTitle: "Split PDF",
    description:
      "Split a PDF by page range or extract individual pages. Free, private, processed in your browser.",
    keywords: ["split pdf online", "extract pages from pdf free", "pdf splitter", "divide pdf"],
    related: ["/pdf/merge", "/pdf/compress", "/pdf/pdf-to-image"],
    icon: "FileMinus",
  },
  {
    slug: "image-to-pdf",
    category: "pdf",
    path: "/pdf/image-to-pdf",
    title: "Convert Image to PDF Online Free",
    shortTitle: "Image to PDF",
    description:
      "Convert JPG, PNG, WEBP images to PDF. Combine multiple images into one PDF document. Free, private, no upload.",
    keywords: ["image to pdf online free", "jpg to pdf", "png to pdf", "convert photo to pdf"],
    related: ["/pdf/merge", "/pdf/compress", "/pdf/pdf-to-image"],
    icon: "FileImage",
  },
  {
    slug: "pdf-to-image",
    category: "pdf",
    path: "/pdf/pdf-to-image",
    title: "Convert PDF to Image Online Free",
    shortTitle: "PDF to Image",
    description:
      "Convert PDF pages to JPG or PNG images. Choose resolution and page range. Free, private, no upload.",
    keywords: ["pdf to jpg online free", "pdf to image converter", "pdf to png online", "convert pdf to photo"],
    related: ["/pdf/image-to-pdf", "/pdf/split", "/image/compress"],
    icon: "FileOutput",
  },

  // Conversion tools
  {
    slug: "png-to-jpg",
    category: "convert",
    path: "/convert/png-to-jpg",
    title: "Convert PNG to JPG Online Free",
    shortTitle: "PNG to JPG",
    description:
      "Convert PNG to JPG quickly online. Smaller file size for exam portals that require JPG. Free, private, no upload.",
    keywords: ["png to jpg online free", "png to jpeg converter", "convert png to jpg", "png jpeg online"],
    related: ["/convert/jpg-to-png", "/convert/webp-to-jpg", "/image/compress"],
    icon: "ArrowLeftRight",
  },
  {
    slug: "jpg-to-png",
    category: "convert",
    path: "/convert/jpg-to-png",
    title: "Convert JPG to PNG Online Free",
    shortTitle: "JPG to PNG",
    description:
      "Convert JPG to PNG online. Lossless PNG format with transparency support. Free, private, no upload.",
    keywords: ["jpg to png online free", "jpeg to png converter", "convert jpg to png"],
    related: ["/convert/png-to-jpg", "/convert/webp-to-png", "/image/compress"],
    icon: "ArrowLeftRight",
  },
  {
    slug: "webp-to-jpg",
    category: "convert",
    path: "/convert/webp-to-jpg",
    title: "Convert WEBP to JPG Online Free",
    shortTitle: "WEBP to JPG",
    description:
      "Convert WEBP to JPG for exam portals that don't accept WEBP. Free, private, no upload required.",
    keywords: ["webp to jpg online free", "webp to jpeg converter", "convert webp to jpg"],
    related: ["/convert/webp-to-png", "/convert/png-to-jpg", "/image/compress"],
    icon: "ArrowLeftRight",
  },
  {
    slug: "webp-to-png",
    category: "convert",
    path: "/convert/webp-to-png",
    title: "Convert WEBP to PNG Online Free",
    shortTitle: "WEBP to PNG",
    description:
      "Convert WEBP to PNG with transparency preserved. Free, private, processed in your browser.",
    keywords: ["webp to png online free", "convert webp to png", "webp png converter"],
    related: ["/convert/webp-to-jpg", "/convert/jpg-to-png", "/image/compress"],
    icon: "ArrowLeftRight",
  },
];

export const IMAGE_TOOLS = TOOLS.filter((t) => t.category === "image");
export const PDF_TOOLS = TOOLS.filter((t) => t.category === "pdf");
export const CONVERT_TOOLS = TOOLS.filter((t) => t.category === "convert");

export function getToolByPath(path: string): ToolEntry | undefined {
  return TOOLS.find((t) => t.path === path);
}

export function getRelatedTools(paths: string[]): ToolEntry[] {
  return paths.flatMap((p) => {
    const tool = getToolByPath(p);
    return tool ? [tool] : [];
  });
}
