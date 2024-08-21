/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";

const ContentSection = ({ content, contentPreviewLimit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isExpanded
        ? `${contentRef.current.scrollHeight}px`
        : `${contentPreviewLimit}px`;

      contentRef.current.style.transition = "max-height 0.5s ease-in-out"; // Add smooth transition

      // Restore scroll position when collapsing
      if (!isExpanded) {
        window.scrollTo(0, scrollPosition);
      }
    }
  }, [isExpanded]);

  const handleToggleExpand = () => {
    if (!isExpanded) {
      // Save the current scroll position before expanding
      setScrollPosition(window.scrollY);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <p
        className="mb-4 post-content overflow-hidden " // Add overflow-hidden to handle transition
        ref={contentRef}
      >
        {isExpanded || content.length <= contentPreviewLimit
          ? content
          : `${content.substring(0, contentPreviewLimit)}...`}
      </p>
      {content?.length > contentPreviewLimit && (
        <div
          onClick={handleToggleExpand}
          className="text-white hover:underline text-center cursor-pointer"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </div>
      )}
    </>
  );
};

export default ContentSection;
