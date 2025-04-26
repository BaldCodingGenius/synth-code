import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const FileAnalyzer = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileContent, setFileContent] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Only accept one file at a time
    const file = acceptedFiles[0];
    setFiles([file]);
    
    // Read the file content
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
    
    toast({
      title: "File received",
      description: `Loaded ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt', '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rb', '.php', '.html', '.css', '.json'],
      'application/json': ['.json'],
      'text/javascript': ['.js', '.jsx', '.ts', '.tsx'],
      'text/html': ['.html'],
      'text/css': ['.css']
    },
    maxFiles: 1,
    maxSize: 1048576 // 1MB
  });

  const analyzeCode = async () => {
    if (!fileContent) {
      toast({
        title: "No file content",
        description: "Please drop a file first",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(10);
    
    try {
      setProgress(30);
      
      const response = await fetch('/api/analyze-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: fileContent, filename: files[0]?.name || 'unknown' }),
      });
      
      setProgress(70);
      
      if (!response.ok) {
        throw new Error('Failed to analyze code');
      }
      
      const data = await response.json();
      setAnalysis(data.analysis);
      setProgress(100);
      
      toast({
        title: "Analysis complete",
        description: "The code has been analyzed successfully",
      });
    } catch (error) {
      console.error('Error analyzing code:', error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setFileContent('');
    setAnalysis('');
    setProgress(0);
  };

  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-[#1E1E1E] border-[#2D3748]">
        <CardHeader>
          <CardTitle>Drop Your Code File</CardTitle>
          <CardDescription>Upload a file to analyze with our AI-powered code scanner</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            {...getRootProps()} 
            className={`p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 min-h-[200px] ${
              isDragActive 
                ? 'border-[#00FFFF] bg-[#1E2A38]' 
                : 'border-[#2D3748] hover:border-[#9A6AFF] hover:bg-[#1E2A38]/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              {isDragActive ? (
                <p className="text-[#00FFFF] text-lg font-medium">Drop the file here...</p>
              ) : files.length > 0 ? (
                <>
                  <p className="text-white text-lg font-medium">{files[0].name}</p>
                  <p className="text-gray-400 mt-2">{(files[0].size / 1024).toFixed(2)} KB</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 text-[#9A6AFF]">
                    <i className="fas fa-file-code text-4xl"></i>
                  </div>
                  <p className="text-white">Drag & drop a code file here, or click to select</p>
                  <p className="text-gray-400 mt-2">Supports common code files up to 1MB</p>
                </>
              )}
            </div>
          </div>
          
          {fileContent && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">File Preview</h3>
                <span className="text-xs text-gray-400">{files[0]?.name}</span>
              </div>
              <div className="bg-[#121212] rounded-md p-4 max-h-[200px] overflow-auto">
                <pre className="text-xs whitespace-pre-wrap">{fileContent.length > 2000 
                  ? fileContent.substring(0, 2000) + '... (content truncated)'
                  : fileContent}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={clearAll}
            disabled={isAnalyzing || files.length === 0}
          >
            Clear
          </Button>
          <Button 
            onClick={analyzeCode} 
            disabled={isAnalyzing || files.length === 0}
            className="bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-black hover:shadow-lg transition-all duration-200"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="bg-[#1E1E1E] border-[#2D3748]">
        <CardHeader>
          <CardTitle>AI Analysis Results</CardTitle>
          <CardDescription>Get insights and recommendations for your code</CardDescription>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto text-[#00FFFF] animate-pulse">
                  <i className="fas fa-robot text-4xl"></i>
                </div>
                <p className="mt-4 text-white">AI is analyzing your code...</p>
                <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
              </div>
              <Progress value={progress} className="w-3/4 h-2" />
              <p className="text-gray-400 text-xs">{progress}% complete</p>
            </div>
          ) : analysis ? (
            <div className="bg-[#121212] rounded-md p-4 h-[300px] overflow-auto">
              <div className="whitespace-pre-wrap text-sm">{analysis}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 text-[#2D3748]">
                <i className="fas fa-code text-4xl"></i>
              </div>
              <p>Upload and analyze a code file to see results here</p>
              <p className="text-sm mt-2">Our AI will help you understand, improve, and optimize your code</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {analysis && !isAnalyzing && (
            <Textarea 
              className="bg-[#121212] border-[#2D3748] min-h-[100px]"
              placeholder="Ask a follow-up question about the analysis..."
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FileAnalyzer;