import * as React from "react";
import Markdown from "react-markdown";

export type ModuleProps = {
  type: "Image" | "Markdown" | "Video";
};

export type Image = ModuleProps & {
  type: "Image";
  source: {
    url: string;
  };
};
export type MarkdownProps = ModuleProps & {
  type: "Markdown";
  body: string;
};
export type Video = ModuleProps & {
  type: "Video";
  youTubeVideoId: string;
};

export type Modules = Image | Video | MarkdownProps;

export const Module: React.FC<Modules> = (props) => {
  switch (props.type) {
    case "Markdown":
      return <Markdown className="content">{props.body}</Markdown>;
    case "Image":
      if (props.source?.url) {
        return <img src={props.source.url} />;
      }
      return null;
    case "Video":
      if (props.youTubeVideoId) {
        return (
          <div className="content">
            <div className="module-video__container">
              <iframe
                src={`https://www.youtube.com/embed/${props.youTubeVideoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        );
      }
      return null;
  }
};
