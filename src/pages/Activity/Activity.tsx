import { Heart, MessageCircle, UserPlus } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function Activity() {
  const activities = [
    {
      id: "1",
      type: "like",
      user: {
        username: "fashionista",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b35d4e36?w=100",
      },
      action: "liked your photo",
      time: "2h",
      postImage:
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=100",
    },
    {
      id: "2",
      type: "comment",
      user: {
        username: "styleicon",
        avatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
      },
      action: 'commented: "This is gorgeous! Where did you find it? 😍"',
      time: "4h",
      postImage:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100",
    },
    {
      id: "3",
      type: "follow",
      user: {
        username: "vintagelover",
        avatar:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100",
      },
      action: "started following you",
      time: "1d",
      isFollowingBack: false,
    },
    {
      id: "4",
      type: "like",
      user: {
        username: "trendsetter",
        avatar:
          "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=100",
      },
      action: "liked your photo",
      time: "1d",
      postImage:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100",
    },
    {
      id: "5",
      type: "follow",
      user: {
        username: "fashionweek",
        avatar:
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=100",
      },
      action: "started following you",
      time: "2d",
      isFollowingBack: true,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="bg-white border rounded-lg">
          <div className="p-4 border-b">
            <h1 className="font-semibold text-lg">Activity</h1>
          </div>

          <div className="divide-y">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-semibold">
                      {activity.user.username}
                    </span>
                    <span className="text-gray-600 ml-1">
                      {activity.action}
                    </span>
                    <span className="text-gray-400 ml-2">{activity.time}</span>
                  </div>
                </div>

                {activity.postImage ? (
                  <img
                    src={activity.postImage}
                    alt="Post"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : activity.type === "follow" ? (
                  <button
                    className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
                      activity.isFollowingBack
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {activity.isFollowingBack ? "Following" : "Follow"}
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {/* Load more */}
          <div className="p-4 text-center">
            <button className="text-sm text-blue-500 hover:text-blue-700">
              See all activity
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white border rounded-lg mt-6">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-sm text-gray-600">
              Suggested for you
            </h2>
          </div>

          <div className="divide-y">
            {[
              {
                username: "newuser1",
                avatar:
                  "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=100",
                mutual: "2 mutual friends",
              },
              {
                username: "newuser2",
                avatar:
                  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100",
                mutual: "5 mutual friends",
              },
            ].map((user) => (
              <div key={user.username} className="p-4 flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{user.username}</div>
                  <div className="text-xs text-gray-500">{user.mutual}</div>
                </div>
                <button className="px-4 py-1.5 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
