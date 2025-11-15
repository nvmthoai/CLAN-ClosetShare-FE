import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Chia sẻ phong cách thời trang của bạn...",
  className,
  editable = true,
}: TipTapEditorProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }: { editor: any }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none min-h-[120px] px-4 py-2.5",
      },
    },
  });

  if (!editor) {
    return null;
  }

  // Function to compress and resize image
  const compressImage = (
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1920,
    quality: number = 0.8
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          // Draw image on canvas with new dimensions
          ctx.drawImage(img, 0, 0, width, height);

          // Determine output format - keep PNG for transparency, use JPEG for photos
          const isPNG = file.type === "image/png";
          const outputFormat = isPNG ? "image/png" : "image/jpeg";

          // Convert to base64 with compression
          // PNG doesn't support quality parameter, so we conditionally call toDataURL
          const compressedDataUrl = isPNG
            ? canvas.toDataURL(outputFormat)
            : canvas.toDataURL(outputFormat, quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB");
      return;
    }

    setIsUploading(true);
    try {
      // Helper function to calculate actual binary size from base64 string
      // Base64 encoding increases size by ~33%, so actual size ≈ length * 3/4
      const getBase64Size = (base64String: string): number => {
        // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.includes(",")
          ? base64String.split(",")[1]
          : base64String;
        // Calculate actual binary size: base64 length * 3/4 minus padding
        return Math.floor((base64Data.length * 3) / 4);
      };

      // Maximum allowed binary size (4MB)
      const maxBinarySize = 4 * 1024 * 1024; // 4MB

      // Try compression levels: [maxWidth, maxHeight, quality]
      const compressionLevels = [
        [1920, 1920, 0.8],
        [1280, 1280, 0.7],
        [1024, 1024, 0.6],
        [800, 800, 0.5],
      ];

      let compressedDataUrl: string | null = null;

      // Try each compression level until we get one under the size limit
      for (const [maxWidth, maxHeight, quality] of compressionLevels) {
        compressedDataUrl = await compressImage(
          file,
          maxWidth,
          maxHeight,
          quality
        );

        // Check if compressed size is acceptable
        const actualSize = getBase64Size(compressedDataUrl);
        if (actualSize <= maxBinarySize) {
          break; // Found acceptable compression level
        }
      }

      // If still too large after all compression attempts, use the last one anyway
      if (!compressedDataUrl) {
        throw new Error("Không thể nén ảnh");
      }

      // Insert base64 image directly into editor (no server upload)
      // TipTap Image extension supports base64 with allowBase64: true
      editor.chain().focus().setImage({ src: compressedDataUrl }).run();

      setShowImageModal(false);
      setImageUrl("");
    } catch (error: unknown) {
      console.error("Error processing image:", error);
      const errorMessage =
        (error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : null) || "Lỗi khi xử lý ảnh. Vui lòng thử lại.";
      alert(errorMessage);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const handleInsertImageUrl = () => {
    const trimmedUrl = imageUrl.trim();
    if (!trimmedUrl) return;

    // Basic URL validation
    try {
      new URL(trimmedUrl);
      editor.chain().focus().setImage({ src: trimmedUrl }).run();
      setShowImageModal(false);
      setImageUrl("");
    } catch {
      alert(
        "URL không hợp lệ. Vui lòng nhập URL đầy đủ (ví dụ: https://example.com/image.jpg)"
      );
    }
  };

  const toolbarButtons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
      label: "Heading",
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
      label: "Numbered List",
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
      label: "Quote",
    },
    {
      icon: ImageIcon,
      action: () => setShowImageModal(true),
      isActive: () => false,
      label: "Insert Image",
    },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      isActive: () => false,
      label: "Undo",
      disabled: () => !editor.can().undo(),
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      isActive: () => false,
      label: "Redo",
      disabled: () => !editor.can().redo(),
    },
  ];

  return (
    <div
      className={cn(
        "border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all",
        className
      )}
    >
      {/* Toolbar */}
      {editable && (
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50/50 rounded-t-xl">
          {toolbarButtons.map((button, index) => {
            const Icon = button.icon;
            const isActive = button.isActive();
            const isDisabled = button.disabled?.() ?? false;

            return (
              <button
                key={index}
                type="button"
                onClick={button.action}
                disabled={isDisabled}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  "hover:bg-gray-200",
                  isActive && "bg-blue-100 text-blue-600",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                title={button.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[120px]" />

      {/* Image Insert Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Chèn ảnh</h2>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl("");
                }}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Upload from file */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tải ảnh lên
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Hỗ trợ: JPG, PNG. Tối đa 5MB. Ảnh sẽ tự động được resize và
                  nén thành base64 để lưu trong content.
                </p>
                {isUploading && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý và nén ảnh...</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">hoặc</span>
                </div>
              </div>

              {/* Insert from URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Chèn từ URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && imageUrl.trim()) {
                      handleInsertImageUrl();
                    }
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl("");
                }}
                className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleInsertImageUrl}
                disabled={!imageUrl.trim()}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-200"
              >
                Chèn ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
