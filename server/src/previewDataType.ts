export type PreviewData = {
  url: string;
  mediaType: string;
  contentType: string;
  favicons: any[];
} | {
  url: string;
  title: any;
  siteName: any;
  description: any;
  mediaType: any;
  contentType: string | undefined;
  images: string[];
  videos: {
      url: any;
      secureUrl: any;
      type: any;
      width: any;
      height: any;
  }[];
  favicons: any[];
}