import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Story } from "@/models/Social";

interface StoriesProps {
  stories: Story[];
  onViewStory: (storyId: string) => void;
  /** Optional class to customize the outer container */
  containerClassName?: string;
}

export function Stories({
  stories,
  onViewStory,
  containerClassName,
}: StoriesProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    onViewStory(story.id);
  };

  return (
    <>
      {/* Stories Bar */}
      <div
        className={cn(
          "bg-white border rounded-lg p-4 mb-6",
          containerClassName
        )}
      >
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {/* Your story (add story) */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
              <span className="text-2xl text-gray-400">+</span>
            </div>
            <span className="text-xs text-gray-600">Your story</span>
          </div>

          {/* Other stories */}
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
              onClick={() => handleStoryClick(story)}
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-full p-0.5",
                  story.isViewed
                    ? "bg-gray-300"
                    : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
                )}
              >
                <img
                  src={
                    story.user.avatar ||
                    `https://ui-avatars.com/api/?name=${story.user.username}`
                  }
                  alt={story.user.username}
                  className="w-full h-full rounded-full object-cover bg-white p-0.5"
                />
              </div>
              <span className="text-xs text-gray-600 truncate max-w-16">
                {story.user.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-sm w-full h-full max-h-screen">
            {/* Progress bar */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="h-0.5 bg-white bg-opacity-30 rounded-full">
                <div className="h-full bg-white rounded-full w-full transition-all duration-3000"></div>
              </div>
            </div>

            {/* User info */}
            <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={
                    selectedStory.user.avatar ||
                    `https://ui-avatars.com/api/?name=${selectedStory.user.username}`
                  }
                  alt={selectedStory.user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-white font-semibold text-sm">
                  {selectedStory.user.username}
                </span>
                <span className="text-white text-opacity-60 text-xs">2h</span>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="text-white text-2xl font-light"
              >
                ×
              </button>
            </div>

            {/* Story image */}
            <img
              src={selectedStory.image}
              alt="Story"
              className="w-full h-full object-cover rounded-lg"
            />

            {/* Navigation areas */}
            <div className="absolute inset-0 flex">
              <button
                className="w-1/2 h-full"
                onClick={() => {
                  // Previous story logic
                  setSelectedStory(null);
                }}
              />
              <button
                className="w-1/2 h-full"
                onClick={() => {
                  // Next story logic
                  setSelectedStory(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
