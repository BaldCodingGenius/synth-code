import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CodeEditor from "@/components/code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileAnalyzer from "@/components/file-analyzer";
import { useAuth } from "@/hooks/use-auth";

const LANGUAGES = [
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
];

const Editor = () => {
  const [activeTab, setActiveTab] = useState<string>("html");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [countdown, setCountdown] = useState<string>('');
  const [editorMode, setEditorMode] = useState<"write" | "analyze">("write");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  
  // Use firebase user id if available, otherwise mock user ID
  const userId = currentUser?.uid || 1;

  // Timer simulation for the 3-day countdown
  const startCountdown = () => {
    // Set a simulated countdown for demo purposes (3 days from now)
    const days = 2;
    const hours = 14;
    const minutes = 22;
    setCountdown(`${days}d ${hours}h ${minutes}m`);
  };

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) {
        throw new Error("Please provide a title for your snippet");
      }
      
      const response = await apiRequest('POST', '/api/snippets', {
        title,
        description,
        code,
        language: activeTab,
        userId: userId,
        // Draft snippets aren't published yet
        publishedAt: null
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/snippets'] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/snippets`] });
      toast({
        title: "Success",
        description: "Draft saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) {
        throw new Error("Please provide a title for your snippet");
      }
      
      const response = await apiRequest('POST', '/api/snippets', {
        title,
        description,
        code,
        language: activeTab,
        userId: userId,
        // Published snippets have a publishedAt date
        publishedAt: new Date().toISOString()
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/snippets'] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/snippets`] });
      toast({
        title: "Success",
        description: "Snippet published successfully. It will be automatically converted to a downloadable file in 3 days.",
      });
      startCountdown();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSaveDraft = () => {
    saveDraftMutation.mutate();
  };

  const handlePublish = () => {
    publishMutation.mutate();
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  // Function to render preview based on language
  const renderPreview = () => {
    if (!code) {
      return (
        <div className="w-full max-w-sm p-6 mx-auto text-center text-gray-800">
          <div className="p-4 rounded-lg shadow-md border border-gray-200">
            <p className="text-sm">Preview will appear here</p>
          </div>
        </div>
      );
    }

    if (activeTab === "html") {
      return (
        <div 
          className="w-full h-full p-4 bg-white"
          dangerouslySetInnerHTML={{ __html: code }}
        />
      );
    }

    // For other languages just show code
    return (
      <div className="w-full p-4 flex items-center justify-center text-gray-800">
        <p>Preview not available for {activeTab}</p>
      </div>
    );
  };

  return (
    <section id="editor" className="py-12 px-4 sm:px-6 lg:px-8 bg-[#121212]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Powerful Code Editor</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Write, test, and publish your code with our feature-rich editor. Support for multiple languages with syntax highlighting and live preview.
          </p>
        </div>
        
        {/* Mode switch */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#121212] rounded-lg p-1 flex">
            <button
              onClick={() => setEditorMode("write")}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                editorMode === "write"
                  ? "bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-black"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-edit mr-2"></i> Write Code
            </button>
            <button
              onClick={() => setEditorMode("analyze")}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                editorMode === "analyze"
                  ? "bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-black"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-microscope mr-2"></i> Analyze Files
            </button>
          </div>
        </div>
        
        {editorMode === "write" ? (
          <>
            <div className="mb-6 flex gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Snippet title..."
                className="bg-[#1E1E1E] border border-[#2D3748] rounded-md px-4 py-2 text-white flex-grow focus:outline-none focus:ring-2 focus:ring-[#9A6AFF]"
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                className="bg-[#1E1E1E] border border-[#2D3748] rounded-md px-4 py-2 text-white flex-grow focus:outline-none focus:ring-2 focus:ring-[#9A6AFF]"
              />
            </div>
            
            <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-xl">
              <div className="border-b border-[#2D3748] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Tabs defaultValue="html" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-[#121212]">
                      {LANGUAGES.map((lang) => (
                        <TabsTrigger 
                          key={lang.id} 
                          value={lang.id}
                          className={activeTab === lang.id ? "text-[#00FFFF]" : "text-gray-400"}
                        >
                          {lang.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2D3748]">
                {/* Editor Panel */}
                <div className="h-96 overflow-auto">
                  <CodeEditor
                    value={code}
                    onChange={handleCodeChange}
                    language={activeTab}
                  />
                </div>
                
                {/* Preview Panel */}
                <div className="p-4 bg-white h-96 overflow-auto">
                  {renderPreview()}
                </div>
              </div>
              
              <div className="p-4 border-t border-[#2D3748] flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <button 
                    className="px-6 py-2 rounded-md bg-[#38A169] hover:bg-[#38A169]/80 text-white font-medium"
                    onClick={() => console.log("Run code")}
                  >
                    <i className="fas fa-play mr-2"></i> Run
                  </button>
                  <button 
                    className="px-6 py-2 rounded-md bg-[#2D3748] hover:bg-[#1E2A38] text-white font-medium"
                    onClick={handleSaveDraft}
                    disabled={saveDraftMutation.isPending}
                  >
                    <i className="fas fa-save mr-2"></i> Save Draft
                  </button>
                </div>
                
                <div className="flex items-center">
                  {countdown && (
                    <div className="text-sm text-gray-400 mr-4">
                      <i className="fas fa-clock mr-1"></i> Auto-publish in: <span className="text-[#00FFFF]">{countdown}</span>
                    </div>
                  )}
                  <button 
                    className="bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 px-6 py-2 rounded-md text-black font-medium"
                    onClick={handlePublish}
                    disabled={publishMutation.isPending}
                  >
                    <i className="fas fa-cloud-upload-alt mr-2"></i> Save & Publish
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-xl p-6">
            <h3 className="text-xl font-bold mb-6 text-center">AI-Powered Code Analysis</h3>
            <p className="text-gray-400 text-center mb-8">
              Drop your code files or paste code snippets to get AI-based insights, recommendations, and improvements.
            </p>
            
            <FileAnalyzer />
          </div>
        )}
      </div>
    </section>
  );
};

export default Editor;
