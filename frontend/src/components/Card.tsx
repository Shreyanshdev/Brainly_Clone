import { Share2, Youtube, Twitter } from "lucide-react";
import { MdDelete } from "react-icons/md";

interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
}

export function Card({ title, link, type }: CardProps) {
  const embedLink =
    type === "youtube" ? link.replace("/watch?v=", "/embed/") : link;

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
          {type === "youtube" ? <Youtube size={20} /> : <Twitter size={20} />}
          <span className="line-clamp-1">{title}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          <a href={link} target="_blank" rel="noopener noreferrer" title="Open">
            <Share2 className="hover:text-blue-600 transition" size={18} />
          </a>
          <button title="Delete">
            <MdDelete className="hover:text-red-500 hover:scale-75 transition rounded-2xl" size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-lg overflow-hidden">
        {type === "youtube" && (
          <iframe
            className="w-full aspect-video rounded-md"
            src={embedLink}
            title="YouTube video player"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}

        {type === "twitter" && (
          <div className="rounded-md  w-full">
            <blockquote
              className="twitter-tweet"
              data-theme="light"
              
            >
              <a href={link.replace("x.com" , "twitter.com")}></a>
            </blockquote>
          </div>
        )}
      </div>
    </div>
  );
}
